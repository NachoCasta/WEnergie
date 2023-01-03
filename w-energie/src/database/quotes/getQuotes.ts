import { getDocs, query, orderBy } from "firebase/firestore";
import quoteCollection, { Quote } from "./quoteCollection";

export default async function getQuotes(): Promise<Array<Quote>> {
  const snapshot = await getDocs(
    query(quoteCollection, orderBy("date", "desc"))
  );
  try {
    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}
