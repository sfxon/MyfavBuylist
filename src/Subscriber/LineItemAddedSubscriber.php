<?php declare(strict_types=1);

namespace Myfav\Buylist\Subscriber;

use Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenEvent;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\Context;
use Shopware\Core\Checkout\Cart\Event\BeforeLineItemAddedEvent;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LineItemAddedSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            BeforeLineItemAddedEvent::class => 'onLineItemAdded',
        ];
    }

    public function onLineItemAdded(BeforeLineItemAddedEvent $event): void
    {
        $cart = $event->getCart();
        $cartLineItems = $cart->getLineItems();
        $lineItem = $event->getLineItem();
        $payload = $lineItem->getPayload();
        $lineItemId = $lineItem->getId();

        if(
            isset($_POST['lineItems'][$lineItemId]['childUniqueHash']) &&
            isset($_POST['lineItems'][$lineItemId]['childEntries']) &&
            isset($_POST['lineItems'][$lineItemId]['childNames'])
        ) {
            $idHash = $_POST['lineItems'][$lineItemId]['childUniqueHash'];

            // See, if the current lineItem is already added -> and if it is, update the values or add a new item..
            foreach($cartLineItems as $cartLineItem) {
                //if($cartLineItem->getId() === $idHash) {
                    
                //} else {
                    $newLineItem = new LineItem(
                        $idHash,
                        LineItem::PRODUCT_LINE_ITEM_TYPE,
                        $lineItem->getId()
                    );
                    $newLineItem->setStackable(true);
                    $newLineItem->setRemovable(true);
                    $newLineItem->setQuantity((int)$_POST['lineItems'][$lineItemId]['quantity']);
                    $newPayload = $lineItem->getPayload();
                    $newPayload['childUniqueHash'] = $_POST['lineItems'][$lineItemId]['childUniqueHash'];
                    $newPayload['childEntries'] = $_POST['lineItems'][$lineItemId]['childEntries'];
                    $newPayload['childNames'] = $_POST['lineItems'][$lineItemId]['childNames'];
                    $newLineItem->setPayload($newPayload);

                    $cart->add($newLineItem);
                //}
            }

            $cart->remove($lineItem->getReferencedId());
        }
    }
}