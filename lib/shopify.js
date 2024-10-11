
import { GraphQLClient } from 'graphql-request';

const shopifyClient = new GraphQLClient(
  `https://631fa5-81.myshopify.com/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': '2369d7f1637367ded2f8592f89421d80',
    },
  }
);

export default shopifyClient;