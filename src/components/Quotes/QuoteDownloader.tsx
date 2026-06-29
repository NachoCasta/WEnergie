import { useEffect, useRef } from "react";
import useQuotePdf from "hooks/useQuotePdf";
import { Quote } from "database/quotes/quoteCollection";

type Props = {
  quote: Quote;
  onComplete: () => void;
};

export default function QuoteDownloader({ quote, onComplete }: Props) {
  const [download, loading] = useQuotePdf(quote);
  const didDownloadRef = useRef(false);
  useEffect(() => {
    if (!loading && !didDownloadRef.current) {
      download();
      didDownloadRef.current = true;
      onComplete();
    }
  });
  return null;
}
