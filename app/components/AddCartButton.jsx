'use client';

import { useCart } from '../context/CartContext';
import styles from './AddCartButton.module.css'

export default function AddCartButton({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.variants.edges[0].node.id,
      title: product.title,
      price: product.variants.edges[0].node.price.amount,
      image: product.images.edges[0]?.node.originalSrc,
    });
  };

  return (
    <button className={styles.button} onClick={handleAddToCart}>Add to Cart</button>
  );
}