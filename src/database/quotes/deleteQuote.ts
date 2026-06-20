import { doc, deleteDoc } from "firebase/firestore";
import quoteCollection from "./quoteCollection";

export default async function deleteQuote(id: string): Promise<void> {
  await deleteDoc(doc(quoteCollection, id));
}
