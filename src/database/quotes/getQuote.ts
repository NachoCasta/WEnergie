import { getDoc, doc } from "firebase/firestore";
import quoteCollection, { Quote } from "./quoteCollection";

export default async function getQuote(id: string): Promise<Quote> {
  const snapshot = await getDoc(doc(quoteCollection, id));
  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    throw new Error("Document not found");
  }
}
