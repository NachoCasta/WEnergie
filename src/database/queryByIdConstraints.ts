import {
  documentId,
  endAt,
  orderBy,
  OrderByDirection,
  startAt,
} from "firebase/firestore";

export function queryByIdConstraints(
  filter?: string,
  direction?: OrderByDirection
) {
  return filter
    ? [orderBy(documentId(), direction), startAt(filter), endAt(filter + "~")]
    : [];
}
