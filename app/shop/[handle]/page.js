import { notFound } from 'next/navigation';
import shopifyClient from '../../../lib/shopify';
import AddCartButton from '@/app/components/AddCartButton';
import Cart from '@/app/components/Cart';
import styles from './page.module.css'
import Link from 'next/link';
import Image from 'next/image';


async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              price {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle };
  const response = await shopifyClient.request(query, variables);
  return response.productByHandle;
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);
  return {
    title: product ? product.title : 'Product Not Found',
    description: product ? product.description : 'This product could not be found.',
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  return (

    <>
    <div className={styles.productPage}>
      <Link href="/shop">
        <Image src="/alamodered.png" alt="a la mode" width={200} height={100} className={styles.logo}/>
      </Link>
      <img
        src={product.images.edges[0]?.node.originalSrc}
        alt={product.images.edges[0]?.node.altText || product.title}
      />
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.variants.edges[0]?.node.price.amount}</p>
      <AddCartButton product={product} />
    </div>
      <Cart />
    </>
  );
}
export async function generateStaticParams() {
  const query = `
    {
      products(first: 250) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  const response = await shopifyClient.request(query);
  const products = response.products.edges;

  return products.map(({ node }) => ({
    handle: node.handle,
  }));
}