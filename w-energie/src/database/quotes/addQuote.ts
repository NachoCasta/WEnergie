import {
  setDoc,
  doc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import quoteCollection, { QuoteData } from "./quoteCollection";

export default async function addQuote(quote: QuoteData): Promise<string> {
  const year = quote.date.toDate().getFullYear().toString().slice(2, 4);
  const snapshot = await getDocs(
    query(quoteCollection, orderBy("date", "desc"), limit(1))
  );

  const prevQuote = snapshot.docs[0];
  let prevQuoteNumber = 0;
  if (prevQuote != null) {
    const prevQuoteId = prevQuote.id;
    const prevQuoteYear = prevQuoteId.slice(0, 2);
    if (prevQuoteYear === year) {
      prevQuoteNumber = Number.parseInt(prevQuoteId.slice(2, 6));
    }
  }
  const quoteNumber = prevQuoteNumber + 1;
  const quoteNumberString = quoteNumber.toString().padStart(4, "0");
  const id = `${year}${quoteNumberString}`;
  await setDoc(doc(quoteCollection, id), quote);
  return id;
}
