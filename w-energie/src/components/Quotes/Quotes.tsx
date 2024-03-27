import {
  Button,
  IconButton,
  Skeleton,
  TableContainer,
  TablePagination,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "components/Common/Title";
import { useAsync } from "react-use";
import AddIcon from "@mui/icons-material/Add";
import getQuotes from "database/quotes/getQuotes";
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatClp } from "utils/formatCurrency";
import { getMainProductName, getTotalPrice } from "utils/quoteUtils";
import { Quote } from "database/quotes/quoteCollection";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import useQuotePdf from "hooks/useQuotePdf";
import { useEffect, useRef, useState } from "react";
import getQuotesCount from "database/quotes/getQuotesCount";

export default function Quotes() {
  const { value: count } = useAsync(getQuotesCount, []);
  const navigate = useNavigate();
  const handleNew = () => navigate("nueva");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [after, setAfter] = useState<string | null>(null);
  const [at, setAt] = useState<string | null>(null);
  const { value: quotes = [], loading } = useAsync(
    () =>
      getQuotes({
        after,
        at,
        pageSize: rowsPerPage,
      }),
    [after, at, rowsPerPage]
  );
  const pageCursorsRef = useRef<{ [page: number]: string }>({});
  useEffect(() => {
    if (!loading && quotes.length > 0) {
      const cursorId = quotes[0].id;
      pageCursorsRef.current[page] = cursorId;
    }
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    if (newPage > page) {
      setAfter(quotes[quotes.length - 1].id);
      setAt(null);
    } else {
      setAt(pageCursorsRef.current[newPage]);
      setAfter(null);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Title>Cotizaciones</Title>
          <Grid item sx={{ alignSelf: "flex-end", pb: 1 }}>
            <Button
              color="primary"
              variant="contained"
              sx={{ mr: 1 }}
              onClick={handleNew}
            >
              <AddIcon /> Agregar
            </Button>
          </Grid>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Precio Total</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <RowSkeleton count={rowsPerPage} />
                ) : (
                  quotes.map((quote) => (
                    <QuoteRow key={quote.id} quote={quote} />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={count ?? -1}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

type QuoteRowProps = {
  quote: Quote;
};

function QuoteRow({ quote }: QuoteRowProps) {
  const navigate = useNavigate();
  const [handlePdf, loading] = useQuotePdf(quote);
  return (
    <TableRow>
      <TableCell>{quote.id}</TableCell>
      <TableCell>{quote.client.name}</TableCell>
      <TableCell>{getMainProductName(quote)}</TableCell>
      <TableCell align="right">
        {formatClp(getTotalPrice(quote) * quote.euroToClp)}
      </TableCell>
      <TableCell align="center">
        <IconButton onClick={() => navigate(quote.id)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={handlePdf} disabled={loading}>
          <PictureAsPdfIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

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
