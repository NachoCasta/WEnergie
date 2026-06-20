import productCollection, { Product } from "./productCollection";

import getData, { GetDataOpts } from "database/getData";
import { queryByIdConstraints } from "database/queryByIdConstraints";

interface GetProductOpts extends GetDataOpts {
  filter?: string;
}

export default async function getProducts(
  opts: GetProductOpts
): Promise<Array<Product>> {
  const { filter } = opts;
  return getData(productCollection, queryByIdConstraints(filter), opts);
}
