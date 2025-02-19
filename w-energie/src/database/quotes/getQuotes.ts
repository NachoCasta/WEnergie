import {
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getDoc,
  doc,
  startAt,
} from "firebase/firestore";
import quoteCollection, { Quote } from "./quoteCollection";

import type { QueryConstraint } from "firebase/firestore";
import { GetDataOpts } from "hooks/usePagination";

export default async function getQuotes(
  opts: GetDataOpts
): Promise<Array<Quote>> {
  const { after, at, pageSize } = opts;
  const queryConstraints: QueryConstraint[] = [orderBy("date", "desc")];
  if (after != null) {
    const afterSnap = await getDoc(doc(quoteCollection, after));
    queryConstraints.push(startAfter(afterSnap));
  }
  if (at != null) {
    const atSnap = await getDoc(doc(quoteCollection, at));
    queryConstraints.push(startAt(atSnap));
  }
  if (pageSize != null) {
    queryConstraints.push(limit(pageSize));
  }
  const snapshot = await getDocs(query(quoteCollection, ...queryConstraints));
  try {
    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}
