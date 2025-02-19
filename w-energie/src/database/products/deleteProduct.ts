import { doc, deleteDoc } from "firebase/firestore";
import productCollection from "./productCollection";

export default async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(productCollection, id));
}
