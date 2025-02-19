import {
  getDocs,
  query,
  limit,
  startAfter,
  getDoc,
  doc,
  startAt,
} from "firebase/firestore";

import type { CollectionReference, QueryConstraint } from "firebase/firestore";

export interface GetDataOpts {
  after?: string | null;
  at?: string | null;
  pageSize?: number;
}

export default async function getData<D, O extends GetDataOpts>(
  collection: CollectionReference<D>,
  constraints: QueryConstraint[],
  opts: O
): Promise<D[]> {
  const { after, at, pageSize } = opts;
  const queryConstraints: QueryConstraint[] = [...constraints];
  if (after != null) {
    const afterSnap = await getDoc(doc(collection, after));
    queryConstraints.push(startAfter(afterSnap));
  }
  if (at != null) {
    const atSnap = await getDoc(doc(collection, at));
    queryConstraints.push(startAt(atSnap));
  }
  if (pageSize != null) {
    queryConstraints.push(limit(pageSize));
  }
  const snapshot = await getDocs(query(collection, ...queryConstraints));
  try {
    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}
