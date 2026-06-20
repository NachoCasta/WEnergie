import nullthrows from "nullthrows";
import { useParams } from "react-router";
import { Quote } from "database/quotes/quoteCollection";
import getQuote from "database/quotes/getQuote";
import { useAsync } from "react-use";

export default function useQuote(
  id: string
): [Quote | undefined, boolean, Error | undefined] {
  const { value, loading, error } = useAsync(() => getQuote(id), [id]);
  return [value, loading, error];
}

export function useQuoteFromParams(): [
  Quote | undefined,
  boolean,
  Error | undefined
] {
  const { quoteId } = useParams();
  return useQuote(nullthrows(quoteId));
}
