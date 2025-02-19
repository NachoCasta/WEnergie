import productCollection, { Product } from "./productCollection";

import getData, { GetDataOpts } from "database/getData";

export default async function getProducts(
  opts: GetDataOpts
): Promise<Array<Product>> {
  return getData(productCollection, [], opts);
}
