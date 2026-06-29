import { IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Quote } from "database/quotes/quoteCollection";
import { memo, Suspense, lazy, useState } from "react";

const LazyQuoteDownloader = lazy(() => import("./QuoteDownloader"));

type Props = {
  quote: Quote;
};

export default memo(function QuoteDownloadButton({ quote }: Props) {
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
        <Suspense fallback={null}>
          <LazyQuoteDownloader quote={quote} onComplete={handleComplete} />
        </Suspense>
      )}
      <PictureAsPdfIcon />
    </IconButton>
  );
});
