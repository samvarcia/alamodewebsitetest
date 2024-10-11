import Image from 'next/image';
import Link from 'next/link';
import shopifyClient from '../../lib/shopify';
import styles from './page.module.css'

async function getProducts() {
  const query = `
    {
      products(first: 3) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyClient.request(query);
  return response.products.edges;
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className={styles.container}>
      <div className={styles.productTriangle}>
        {products.map(({ node: product }, index) => (
          <Link href={`/shop/${product.handle}`} key={product.id} className={styles[`product${index + 1}`]}>
            <div className={styles.productCard}>
              <Image
                src={product.images.edges[0]?.node.originalSrc}
                alt={product.images.edges[0]?.node.altText || product.title}
                // layout="fill"
                width="200"
                height="200"
                objectFit="contain"
              />
            </div>
          </Link>
        ))}
      </div>
        <div className={styles.logoContainer}>
          <Image src="/alamodered.png" alt="a la mode" width={200} height={100} className={styles.logo}/>
        </div>
    </div>
  );
}

export const revalidate = 60; // revalidate this page every 60 seconds