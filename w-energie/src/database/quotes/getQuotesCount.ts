import { getCountFromServer } from "firebase/firestore";
import quoteCollection from "./quoteCollection";

export default async function getQuotesCount(): Promise<number> {
  const snapshot = await getCountFromServer(quoteCollection);
  return snapshot.data().count
}
