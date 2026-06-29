import { getDocs, query, orderBy, where, Timestamp } from "firebase/firestore";
import quoteCollection, { Quote } from "./quoteCollection";

export default async function getQuotesByYear(year: number): Promise<Quote[]> {
  const start = Timestamp.fromDate(new Date(year, 0, 1));
  const end = Timestamp.fromDate(new Date(year + 1, 0, 1));
  const q = query(
    quoteCollection,
    where("date", ">=", start),
    where("date", "<", end),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}
