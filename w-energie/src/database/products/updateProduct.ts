import { doc, updateDoc } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";

export default async function addProduct(product: Product): Promise<void> {
  await updateDoc(doc(productCollection, product.id), product);
}
