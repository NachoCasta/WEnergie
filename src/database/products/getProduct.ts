import { getDoc, doc } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";

export default async function getProduct(id: string): Promise<Product> {
  const snapshot = await getDoc(doc(productCollection, id));
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    throw new Error("Document not found");
  }
}
