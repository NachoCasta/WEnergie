import { IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Quote } from "database/quotes/quoteCollection";
import { useEffect, useRef, useState } from "react";
import useQuotePdf from "hooks/useQuotePdf";

type Props = {
  quote: Quote;
};

export default function QuoteDownloadButton({ quote }: Props) {
  const [renderDownloader, setRenderDownloader] = useState(false);
  const handleDownload = () => {
    setRenderDownloader(true);
  };
  const handleComplete = () => {
    setRenderDownloader(false);
  };
  return (
    <IconButton onClick={handleDownload} disabled={renderDownloader}>
      {renderDownloader && (
        <QuoteDownloader quote={quote} onComplete={handleComplete} />
      )}
      <PictureAsPdfIcon />
    </IconButton>
  );
}

type QuoteDownloaderProps = {
  quote: Quote;
  onComplete: () => void;
};

function QuoteDownloader({ quote, onComplete }: QuoteDownloaderProps) {
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
