import { documentId, endAt, orderBy, startAt } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";

import getData, { GetDataOpts } from "database/getData";

interface GetProductOpts extends GetDataOpts {
  filter?: string;
}

export default async function getProducts(
  opts: GetProductOpts
): Promise<Array<Product>> {
  const { filter } = opts;
  return getData(productCollection, queryByIdConstraints(filter), opts);
}

export function queryByIdConstraints(filter?: string) {
  return filter
    ? [orderBy(documentId()), startAt(filter), endAt(filter + "~")]
    : [];
}
