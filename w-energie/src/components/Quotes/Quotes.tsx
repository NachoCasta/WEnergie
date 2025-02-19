import {
  Button,
  IconButton,
  Skeleton,
  TableContainer,
  TablePagination,
  TextField,
} from "@mui/material";
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
import { useNavigate } from "react-router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatClp } from "utils/formatCurrency";
import {
  getFilteredQuotes,
  getMainProductName,
  getTotalPrice,
} from "utils/quoteUtils";
import { Quote } from "database/quotes/quoteCollection";
import { useMemo, useState } from "react";
import getQuotesCount from "database/quotes/getQuotesCount";
import QuoteDownloadButton from "./QuoteDownloadButton";
import usePagination from "hooks/usePagination";

export default function Quotes() {
  const [search, setSearch] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleNew = () => navigate("nueva");
  const [quotes, loading, paginationProps, rowsPerPage] = usePagination(
    getQuotes,
    getQuotesCount
  );
  const filteredQuotes = useMemo(
    () => getFilteredQuotes(quotes, search),
    [quotes, search]
  );
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
                  {loading ? (
                    <RowSkeleton count={rowsPerPage} />
                  ) : (
                    filteredQuotes.map((quote) => (
                      <QuoteRow key={quote.id} quote={quote} />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              {...paginationProps}
            />
          </Grid>
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
          <IconButton onClick={() => navigate(quote.id)}>
            <VisibilityIcon />
          </IconButton>
          <QuoteDownloadButton quote={quote} />
        </Grid>
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
