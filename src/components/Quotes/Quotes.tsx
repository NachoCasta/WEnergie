import {
  Button,
  IconButton,
  Skeleton,
  TableContainer,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "components/Common/Title";
import AddIcon from "@mui/icons-material/Add";
import getQuotes from "database/quotes/getQuotes";
import getQuotesByYear from "database/quotes/getQuotesByYear";
import { useNavigate, useLocation } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatClp } from "utils/formatCurrency";
import {
  getFilteredQuotes,
  getMainProductName,
  getTotalPrice,
} from "utils/quoteUtils";
import { Quote } from "database/quotes/quoteCollection";
import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import getQuotesCount from "database/quotes/getQuotesCount";
import QuoteDownloadButton from "./QuoteDownloadButton";
import usePagination from "hooks/usePagination";
import useClientPagination from "hooks/useClientPagination";
import { useSearchParams } from "react-router-dom";

export default function Quotes() {
  const [search, setSearch] = useState("");
  const currentYear = new Date().getFullYear();
  const [searchYear, setSearchYear] = useState(currentYear);
  const navigate = useNavigate();
  const location = useLocation();
  const handleNew = () => navigate("nueva");
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSize = Number(searchParams.get("size")) || 10;

  const savedPosition = useRef<{ page: number; at: string } | null>(null);
  if (savedPosition.current === null) {
    try {
      const raw = sessionStorage.getItem("quotes-position");
      savedPosition.current = raw ? JSON.parse(raw) : undefined;
    } catch { /* ignore */ }
  }

  const [quotes, loading, paginationProps, rowsPerPage, resetPagination] =
    usePagination(getQuotes, getQuotesCount, [], urlSize, {
      page: savedPosition.current?.page,
      at: savedPosition.current?.at,
    });

  const prevUrlSize = useRef(urlSize);
  useEffect(() => {
    if (prevUrlSize.current === urlSize) return;
    prevUrlSize.current = urlSize;
    sessionStorage.removeItem("quotes-position");
    resetPagination(urlSize);
  }, [urlSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawerNav = (location.state as any)?.drawerNav;
  useEffect(() => {
    if (!drawerNav) return;
    sessionStorage.removeItem("quotes-position");
    resetPagination(urlSize);
  }, [drawerNav]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenQuote = useCallback((quoteId: string) => {
    sessionStorage.setItem("quotes-position", JSON.stringify({
      page: paginationProps.page,
      at: quotes[0]?.id ?? null,
    }));
    navigate(quoteId);
  }, [paginationProps.page, quotes, navigate]);

  const handleRowsPerPageChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = Number(e.target.value);
    setSearchParams(newSize === 10 ? {} : { size: String(newSize) }, {
      replace: true,
    });
    paginationProps.onRowsPerPageChange!(e);
  }, [paginationProps.onRowsPerPageChange, setSearchParams]);

  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const searchActive = search.length > 0;
  useEffect(() => {
    if (!searchActive) {
      setAllQuotes([]);
      setAllLoaded(false);
      return;
    }
    let cancelled = false;
    setAllLoaded(false);
    getQuotesByYear(searchYear).then((yearQuotes) => {
      if (!cancelled) {
        setAllQuotes(yearQuotes);
        setAllLoaded(true);
      }
    });
    return () => { cancelled = true; };
  }, [searchActive, searchYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredQuotes = useMemo(
    () => searchActive ? getFilteredQuotes(allQuotes, search) : quotes,
    [allQuotes, quotes, search, searchActive]
  );
  const [searchPageItems, searchPaginationProps, setSearchPage] =
    useClientPagination(filteredQuotes);
  const isLoading = searchActive ? !allLoaded : loading;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Grid container direction="column">
            <Title>Cotizaciones</Title>
            <Grid container spacing={1} sx={{ pb: 1, alignItems: "center" }}>
              <Grid item sx={{ flexGrow: "1" }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Buscar"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchPage(0);
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleNew}
                  size="medium"
                >
                  <AddIcon /> Agregar
                </Button>
              </Grid>
            </Grid>
            {searchActive && (
              <Grid container justifyContent="center" alignItems="center" sx={{ py: 0.5 }}>
                <IconButton size="small" disabled={searchYear >= currentYear} onClick={() => { setSearchYear((y) => y + 1); setSearchPage(0); }}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1, minWidth: 40, textAlign: "center" }}>
                  {searchYear}
                </Typography>
                <IconButton size="small" onClick={() => { setSearchYear((y) => y - 1); setSearchPage(0); }}>
                  <ChevronRightIcon />
                </IconButton>
              </Grid>
            )}
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Concepto</TableCell>
                    <TableCell align="right">Precio Total</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <RowSkeleton count={rowsPerPage} />
                  ) : searchActive ? (
                    searchPageItems.map((quote) => (
                      <QuoteRow key={quote.id} quote={quote} onOpen={handleOpenQuote} />
                    ))
                  ) : (
                    quotes.map((quote) => (
                      <QuoteRow key={quote.id} quote={quote} onOpen={handleOpenQuote} />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {searchActive ? (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                {...searchPaginationProps}
              />
            ) : (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                {...paginationProps}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

type QuoteRowProps = {
  quote: Quote;
  onOpen: (id: string) => void;
};

const QuoteRow = memo(function QuoteRow({ quote, onOpen }: QuoteRowProps) {
  return (
    <TableRow>
      <TableCell>{quote.id}</TableCell>
      <TableCell>{quote.client.name}</TableCell>
      <TableCell>{quote.concept ?? getMainProductName(quote)}</TableCell>
      <TableCell align="right">
        {formatClp(getTotalPrice(quote) * quote.euroToClp)}
      </TableCell>
      <TableCell align="center">
        <Grid container wrap="nowrap">
          <IconButton onClick={() => onOpen(quote.id)}>
            <VisibilityIcon />
          </IconButton>
          <QuoteDownloadButton quote={quote} />
        </Grid>
      </TableCell>
    </TableRow>
  );
});

function RowSkeleton(props: { count: number }) {
  return (
    <>
      {[...Array(props.count)].map((row, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            <Skeleton animation="wave" variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" variant="text" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
