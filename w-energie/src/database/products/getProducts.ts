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
  const constraints = [];
  if (filter) {
    constraints.push(
      orderBy(documentId()),
      startAt(filter),
      endAt(filter + "~")
    );
  }
  return getData(productCollection, constraints, opts);
}
