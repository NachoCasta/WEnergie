import { getCountFromServer, query } from "firebase/firestore";
import productCollection from "./productCollection";
import { queryByIdConstraints } from "./getProducts";

export default async function getProductsCount(
  filter?: string
): Promise<number> {
  const snapshot = await getCountFromServer(
    query(productCollection, ...queryByIdConstraints(filter))
  );
  return snapshot.data().count;
}
