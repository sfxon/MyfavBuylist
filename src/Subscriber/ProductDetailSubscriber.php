<?php declare(strict_types=1);

namespace Myfav\Buylist\Subscriber;

use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\Content\Product\SalesChannel\CrossSelling\AbstractProductCrossSellingRoute;
use Shopware\Core\Content\Product\SalesChannel\Detail\AbstractProductDetailRoute;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\NotFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\OrFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter;
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

class ProductDetailSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly AbstractProductCrossSellingRoute $crossSellingLoader,
        private readonly CartService $cartService,
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
            ProductPageLoadedEvent::class => 'productPageLoaded'
        ];
    }
    
    /**
     * productPageLoaded
     *
     * @param  ProductPageLoadedEvent $event
     * @return void
     */
    public function productPageLoaded(ProductPageLoadedEvent $event): void
    {
        $salesChannelId = null;
        $buylistConfig = $this->systemConfigService->get('MyfavBuylist.config', $salesChannelId);

        if(
            !isset($buylistConfig['articleDetailCustomFieldForArticles']) ||
            !isset($buylistConfig['articleDetailCustomFieldForArticleCountToChoose']) ||
            !is_string($buylistConfig['articleDetailCustomFieldForArticles']) ||
            !is_string($buylistConfig['articleDetailCustomFieldForArticleCountToChoose'])
        ) {
            return;
        }

        $fieldForArticles = trim($buylistConfig['articleDetailCustomFieldForArticles']);
        $fieldForCountToChoose = trim($buylistConfig['articleDetailCustomFieldForArticleCountToChoose']);

        if(
            strlen($fieldForArticles) === 0 ||
            strlen($fieldForCountToChoose) === 0
        ) {
            return;
        }

        $salesChannelContext = $event->getSalesChannelContext();
        $page = $event->getPage();
        $product = $page->getProduct();
        $customFields = $product->getCustomFields();

        if(
            !isset($customFields[$fieldForArticles]) ||
            !isset($customFields[$fieldForCountToChoose])) {
            return;
        }

        $selectableArticles = trim($customFields[$fieldForArticles]);
        $selectableArticles = explode('|', $selectableArticles);
        $childNrs = [];

        foreach($selectableArticles as $childNr) {
            $childNr = trim($childNr);

            if(strlen($childNr) === 0) {
                continue;
            }

            $childNrs[]= $childNr;
        }

        if(count($childNrs) === 0) {
            return;
        }

        $count = (int)$customFields[$fieldForCountToChoose];

        if(0 === $count) {
            return;
        }

        // Get products by numbers.
        $buylistProducts = $this->mvLoadProducts($childNrs, $salesChannelContext);

        // Check availability of items against buyable quantity and items in cart.
        $buylistProducts = $this->getAvailability($salesChannelContext, $buylistProducts, $count);

        $page->addExtension('buylistProducts', $buylistProducts);
        $page->addExtension('buylistProductCount', new ArrayStruct(['count' => $count]));
    }

    /**
     * Check availability of items against buyable quantity and items in cart.
     */
    private function getAvailability($salesChannelContext, $buylistProducts, $count)
    {
        $count = (int)$count;

        // Hole den aktuellen Warenkorb
        $cart = $this->cartService->getCart($salesChannelContext->getToken(), $salesChannelContext);
        $lineItems = $cart->getLineItems();

        foreach($buylistProducts as $product) {
            $realStock = $product->getAvailableStock();

            // Count items in cart with this productId;
            $tmpProductId = $product->getId();

            foreach($lineItems as $lineItem) {
                if($lineItem->getType() === 'product') {
                    // Check, if this is the lineItem we are looking for, or one of the special line items which contains this line item.
                    //$productNumber = $lineItem->getProductNumber();
                    $productId = $lineItem->getReferencedId();
                    $cartQuantity = $lineItem->getQuantity();
                    $payload = $lineItem->getPayload();

                    if($productId === $tmpProductId) {
                        $realStock -= (int)$cartQuantity;
                    }

                    // Handle children from the buylist..
                    if(isset($payload['childEntries'])) {
                        $childEntries = $payload['childEntries'];
                        $splittedChildEntries = explode(';', $childEntries);

                        if(is_array($splittedChildEntries)) {
                            foreach($splittedChildEntries as $tmpChild) {
                                $tmpChildParts = explode(':', $tmpChild);

                                if(count($tmpChildParts) == 2) {
                                    if($tmpChildParts[0] === $tmpProductId) {
                                        $realStock -= (int)$tmpChildParts[1] * $lineItem->getQuantity();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if($realStock > $count) {
                $realStock = $count;
            }

            $product->addExtension('buylist', new ArrayStruct(['stock' => $realStock]));
        }

        return $buylistProducts;
    }

    /**
     * loadVariants
     *
     * @return mixed
     */
    private function mvLoadProducts(
        array $productNumbers,
        SalesChannelContext $salesChannelContext): mixed
    {
        // Load configurator data.
        $criteria = (new Criteria())
            ->addAssociation('manufacturer.media')
            ->addAssociation('options.group')
            ->addAssociation('properties.group')
            ->addAssociation('mainCategories.category')
            ->addAssociation('media');

        // Load product data.
        $criteria = new Criteria();
        $criteria->addAssociation('variation');

        $orFilters = [];

        foreach($productNumbers as $number) {
            //$orFilters[] = new EqualsFilter('productNumber', $number);

            $orFilters[] = new MultiFilter(
                MultiFilter::CONNECTION_AND,
                [
                    new EqualsFilter('productNumber', $number),
                    new RangeFilter('availableStock', [ RangeFilter::GTE => 0 ]),
                    new EqualsFilter('active', true)
                ]
                );
        }

        /*
        $criteria->addFilter(new EqualsFilter('product.parentId', $parentProductId));
        */
        $criteria->addFilter(new OrFilter($orFilters));

        $criteria->addSorting(new FieldSorting('name', FieldSorting::ASCENDING));

        $productResult = $this->productRepository->search($criteria, $salesChannelContext);

        if($productResult->getTotal() === 0) {
            return null;
        }

        return $productResult;
    }
}
