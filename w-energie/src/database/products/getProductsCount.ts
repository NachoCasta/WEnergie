import { getCountFromServer } from "firebase/firestore";
import productCollection from "./productCollection";

export default async function getProductsCount(): Promise<number> {
  const snapshot = await getCountFromServer(productCollection);
  return snapshot.data().count;
}
