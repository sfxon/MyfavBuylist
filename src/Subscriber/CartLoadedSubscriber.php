<?php declare(strict_types=1);

namespace Myfav\Buylist\Subscriber;

use Shopware\Core\Content\Product\SalesChannel\CrossSelling\AbstractProductCrossSellingRoute;
use Shopware\Core\Content\Product\SalesChannel\Detail\AbstractProductDetailRoute;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\OrFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting;
use Shopware\Core\Framework\Struct\ArrayStruct;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepository;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Storefront\Page\Product\ProductPageCriteriaEvent;
use Shopware\Storefront\Page\Product\ProductPageLoadedEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Shopware\Core\Checkout\Cart\Event\CartLoadedEvent;

class CartLoadedSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly AbstractProductCrossSellingRoute $crossSellingLoader,
        private readonly EventDispatcherInterface $eventDispatcher,
        private readonly AbstractProductDetailRoute $productDetailRoute,
        private readonly SalesChannelRepository $productRepository,
        private readonly SystemConfigService $systemConfigService,)
    {
    }

    /**
     * getSubscribedEvents
     *
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            CartLoadedEvent::class => ['cartLoaded', 101]
        ];
    }
    
    /**
     * productPageLoaded
     *
     * @param  ProductPageLoadedEvent $event
     * @return void
     */
    public function cartLoaded(CartLoadedEvent $event): void
    {
        $cart = $event->getCart();
        $lineItems = $cart->getLineItems();
        $hasFrostfutter = false;
        $totalFrostfutterWeight = 0;
        $salesChannelContext = $event->getSalesChannelContext();

        $realItemCount = [];

        foreach($lineItems as $lineItem) {
            if($lineItem->getType() === 'product') {
                // We only need to check the quantity for buylist items.
                $payload = $lineItem->getPayload();

                if(!isset($payload['childEntries'])) {
                    // Handle default items.
                    if(isset($realItemCount[$lineItem->getReferencedId()])) {
                        $realItemCount[$lineItem->getReferencedId()] += (int)$lineItem->getQuantity();
                    } else {
                        $realItemCount[$lineItem->getReferencedId()] = (int)$lineItem->getQuantity();
                    }
                } else {
                    // Handle children from the buylist..
                    $childEntries = $payload['childEntries'];
                    $splittedChildEntries = explode(';', $childEntries);

                    if(is_array($splittedChildEntries)) {
                        foreach($splittedChildEntries as $tmpChild) {
                            $tmpChildParts = explode(':', $tmpChild);

                            if(count($tmpChildParts) == 2) {
                                if(isset($realItemCount[$tmpChildParts[0]])) {
                                    $realItemCount[$tmpChildParts[0]] += (int)($tmpChildParts[1] * $lineItem->getQuantity());
                                } else {
                                    $realItemCount[$tmpChildParts[0]] = (int)($tmpChildParts[1] * $lineItem->getQuantity());
                                }
                            }
                        }
                    }
                }
            }
        }

        $results = [];
        $hasQuantityErrors = false;
        $hasOverbookedErrors = false;

        foreach($realItemCount as $productId => $realCount) {
            $criteria = (new Criteria([$productId]));

            $productResult = $this->productRepository->search($criteria, $salesChannelContext);

            // Check if product exists.
            if($productResult->getTotal() === 0) {
                $results[$productId] = [
                    'productId' => $productId,
                    'realCount' => $realCount,
                    'error' => 'productNotFound'
                ];
                $hasQuantityErrors = true;
                continue;
            }

            $product = $productResult->first();

            // Check if product is active.
            if($product->getActive() === false) {
                $results[$productId] = [
                    'productId' => $productId,
                    'realCount' => $realCount,
                    'error' => 'productNotFound'
                ];
                $hasQuantityErrors = true;
                continue;
            }

            // Check stock.
            $availableStock = (int)$product->getAvailableStock();

            if($product->getIsCloseout() === false) {
                $results[$productId] = [
                    'productId' => $productId,
                    'realCount' => 999999,
                    'error' => null
                ];
            } else {
                if($availableStock < $realCount) {
                    $results[$productId] = [
                        'productId' => $productId,
                        'realCount' => $realCount,
                        'availableStock' => $availableStock,
                        'error' => 'overbooked',
                        'productName' => $product->getTranslated()['name']
                    ];
                    $hasOverbookedErrors = true;
                } else {
                    $results[$productId] = [
                        'productId' => $productId,
                        'realCount' => $realCount,
                        'error' => null
                    ];
                }
            }
        }

        $cart->addExtension(
            'myfavBuylist',
            new ArrayStruct([
                'quantityValidation' => $results,
                'hasQuantityErrors' => $hasQuantityErrors,
                'hasOverbookedErrors' => $hasOverbookedErrors
            ])
        );
    }
}
