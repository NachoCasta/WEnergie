import QuoteDocument from "components/Quotes/QuoteDocument";
import { Quote } from "database/quotes/quoteCollection";
import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";

export default function useQuotePdf(quote?: Quote): [() => void, boolean] {
  const [instance, updateInstance] = usePDF({
    document: <QuoteDocument quote={quote} />,
  });
  useEffect(() => {
    updateInstance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);
  const { url, loading } = instance;
  const handleDownload = () => {
    const a = document.createElement("a");
    if (!url || !quote) return;
    a.href = url;
    a.download = getPdfName(quote);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return [handleDownload, loading || !url];
}

function getPdfName(quote: Quote): string {
  const month = new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(
    quote.date.toDate()
  );
  return `${quote.id}-${month} PRESUPUESTO ${quote.client.name}`;
}
