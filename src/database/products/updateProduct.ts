import { doc, updateDoc } from "firebase/firestore";
import productCollection, { Product } from "./productCollection";

export default async function updateProduct(product: Product): Promise<void> {
  const { id, ...productData } = product;
  await updateDoc(doc(productCollection, product.id), productData);
}
