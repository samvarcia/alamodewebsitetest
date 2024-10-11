'use client';

import { useCart } from '../context/CartContext';
import shopifyClient from '../../lib/shopify';
import { useState } from 'react';
import styles from './Cart.module.css'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const createCheckout = async () => {
    const lineItems = cart.map(item => ({
      variantId: item.id,
      quantity: item.quantity,
    }));

    const mutation = `
      mutation createCheckout($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            webUrl
          }
          checkoutUserErrors {
            message
            field
          }
        }
      }
    `;

    const variables = {
      input: {
        lineItems,
      },
    };

    try {
      const response = await shopifyClient.request(mutation, variables);
      const checkoutUrl = response.checkoutCreate.checkout.webUrl;
      setCheckoutUrl(checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };
  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <button onClick={toggleCart} className={styles.cartToggle}>
          Cart
        </button>
      )}
      <div className={`${styles.cartContainer} ${isOpen ? styles.cartOpen : ''}`}>
        <div className={styles.cartHeader}>
          <h2>My Cart</h2>
          <button onClick={toggleCart} className={styles.closeButton}>
            ×
          </button>
        </div>
        <div className={styles.cartContent}>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.title} className={styles.cartItemImage} />
                  <div className={styles.cartItemDetails}>
                    <h3>{item.title}</h3>
                    <p>${item.price} USD</p>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.quantityButton}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className={styles.quantityInput}
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className={styles.closeButton}>
                    ×
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
        <div className={styles.cartFooter}>
          <p>Total: ${totalPrice.toFixed(2)} USD</p>
          <button onClick={createCheckout} className={styles.checkoutButton}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}