<?php declare(strict_types=1);

namespace Myfav\Buylist\Subscriber;

use Exception;
use Shopware\Core\Checkout\Cart\Event\CheckoutOrderPlacedEvent;
use Shopware\Core\Checkout\Cart\Order\CartConvertedEvent;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\Session;

class OrderPlacedSubscriber implements EventSubscriberInterface {
    private EntityRepository $orderRepository;
    private EntityRepository $productRepository;
    private Session $session;
    private RequestStack $requestStack;

    public function __construct(
        EntityRepository $orderRepository,
        EntityRepository $productRepository,
        RequestStack $requestStack,)
    {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->requestStack = $requestStack;
        $this->session = $this->requestStack->getSession();
    }

    public static function getSubscribedEvents(): array
    {
        return[
            CheckoutOrderPlacedEvent::class => 'onOrderPlaced',
        ];
    }

    /**
     * Event für alle Seiten
     *
     * @param CheckoutOrderPlacedEvent $event
     * @throws Exception
     */
    public function onOrderPlaced(CheckoutOrderPlacedEvent $event)
    {
        $order = $event->getOrder();
        $orderId = $order->getId();
        $context = $event->getContext();
        $order = $event->getOrder();
        $lineItems = $order->getLineItems();

        foreach($lineItems as $lineItem) {
            if($lineItem->getType() === 'product') {
                $payload = $lineItem->getPayload();

                if(isset($payload['childEntries'])) {
                    $childEntries = $payload['childEntries'];
                    $splittedChildEntries = explode(';', $childEntries);

                    if(is_array($splittedChildEntries)) {
                        foreach($splittedChildEntries as $tmpChild) {
                            $tmpChildParts = explode(':', $tmpChild);
                            $productId = $tmpChildParts[0];
                            $quantity = (int)($tmpChildParts[1] * $lineItem->getQuantity());

                            if(count($tmpChildParts) == 2) {
                                $this->reduceProductQuantityForOrder($context, $productId, $quantity);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * reduceProductQuantityForOrder
     *
     * @param  mixed $context
     * @param  mixed $productNumber
     * @param  mixed $quantity
     * @return void
     */
    private function reduceProductQuantityForOrder($context, $productId, $quantity): void
    {
        $criteria = new Criteria([$productId]);

        $product = $this->productRepository->search($criteria, $context)->first();

        if($product !== null) {
            $productStock = (int)$product->getStock();
            $productStock = (int)$productStock - (int)$quantity;

            $this->productRepository->update([
                [
                    'id' => $productId,
                    'stock' => (int)$productStock
                ]
            ], $context);
        }
    }
}