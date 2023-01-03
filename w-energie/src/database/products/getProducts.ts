import { getDocs, query, limit } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";

export default async function getProducts(): Promise<Array<Product>> {
  const snapshot = await getDocs(query(productCollection, limit(50)));
  try {
    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}
