import { Box, Button, TableContainer, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Title from "components/Common/Title";
import { useNavigate } from "react-router";
import { Quote } from "database/quotes/quoteCollection";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useQuoteFromParams } from "hooks/useQuote";
import {
  getSubtotalPrice,
  getTotalDiscount,
  getTotalPrice,
  getTotalTax,
} from "utils/quoteUtils";
import { formatClp, formatEuro } from "utils/formatCurrency";
import useQuotePdf from "hooks/useQuotePdf";

export default function QuoteView() {
  const [quote] = useQuoteFromParams();
  return (
    <Grid container spacing={3}>
      <Grid item xs={8}>
        <Info quote={quote} />
      </Grid>
      <Grid item xs={4}>
        <Actions quote={quote} />
      </Grid>
      <Grid item xs={12}>
        <Products quote={quote} />
      </Grid>
    </Grid>
  );
}

type InfoProps = {
  quote?: Quote;
};

function Info({ quote }: InfoProps) {
  if (!quote) return null;
  const { client } = quote;
  const items = [
    { text: quote.id, icon: <NumbersIcon /> },
    {
      text: quote.date.toDate().toLocaleDateString("es-CL"),
      icon: <CalendarTodayIcon />,
    },
    { text: client.name, icon: <PersonIcon /> },
    { text: client.rut, icon: <AccountBoxIcon /> },
    { text: client.phone, icon: <PhoneIcon /> },
    { text: client.mail, icon: <AlternateEmailIcon /> },
    { text: client.address, icon: <BusinessIcon /> },
    { text: quote.deliveryTerm, icon: <LocalShippingIcon /> },
  ];
  return (
    <Paper sx={{ p: 2 }}>
      <Title>Cotización</Title>
      <Grid container>
        {items.map((item, index) => (
          <Grid
            key={`${item.text}-${index}`}
            item
            xs={6}
            sx={{ display: "flex" }}
          >
            <Box sx={{ pr: 1 }}>{item.icon}</Box>
            <Typography gutterBottom>{item.text}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

type ActionsProps = {
  quote?: Quote;
};

function Actions({ quote }: ActionsProps) {
  const navigate = useNavigate();
  const [handlePdf, loading] = useQuotePdf(quote);
  if (!quote) return null;
  const handleTemplate = () => {
    const { client } = quote;
    const params = new URLSearchParams({
      name: client.name,
      rut: client.rut,
      phone: client.phone,
      mail: client.mail,
      address: client.address,
      paymentForm: quote.paymentForm,
      deliveryTerm: quote.deliveryTerm,
      products: quote.products
        .flatMap((p) => Array(p.quantity).fill(p.id))
        .toString(),
      weight: quote.weight.toString(),
      deliveryCost: quote.deliveryCost.toString(),
      installationCost: quote.installationCost.toString(),
      euroToClp: quote.euroToClp.toString(),
      discount: quote.discount.toString(),
    });
    navigate(`/cotizaciones/nueva?${params.toString()}`);
  };
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Title>Acciones</Title>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            startIcon={<CopyAllIcon />}
            fullWidth
            onClick={handleTemplate}
          >
            Plantilla
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            fullWidth
            onClick={handlePdf}
            disabled={loading}
          >
            PDF
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

type ProductsProps = {
  quote?: Quote;
};

function Products({ quote }: ProductsProps) {
  if (!quote) return null;
  const { products, discount, euroToClp } = quote;
  const rows = [
    ...products,
    { id: null, name: "Transporte", quantity: 1, price: quote.deliveryCost },
    {
      id: null,
      name: "Instalación",
      quantity: 1,
      price: quote.installationCost,
    },
  ];
  const subtotal = getSubtotalPrice(quote);
  const totalDiscount = getTotalDiscount(quote);
  const tax = getTotalTax(quote);
  const total = getTotalPrice(quote);
  return (
    <Paper sx={{ p: 2 }}>
      <Title>Productos</Title>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell align="right">Precio (EUR)</TableCell>
              <TableCell align="right">Precio (CLP)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`${row.id}-${index}`}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{formatEuro(row.price)}</TableCell>
                <TableCell align="right">
                  {formatClp(row.price * euroToClp)}
                </TableCell>
              </TableRow>
            ))}
            <FooterRow price={subtotal} euroToClp={euroToClp} first>
              Total Neto
            </FooterRow>
            {totalDiscount > 0 && (
              <FooterRow price={-totalDiscount} euroToClp={euroToClp}>
                Descuento {discount}%
              </FooterRow>
            )}
            <FooterRow price={tax} euroToClp={euroToClp}>
              IVA
            </FooterRow>
            <FooterRow price={total} euroToClp={euroToClp}>
              Total
            </FooterRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

type FooterRowProps = {
  children: React.ReactNode;
  price: number;
  euroToClp: number;
  first?: boolean;
};

function FooterRow({
  children,
  price,
  euroToClp,
  first = false,
}: FooterRowProps) {
  return (
    <TableRow>
      {first && <TableCell colSpan={2} rowSpan={4} />}
      <TableCell>
        <Typography variant="subtitle2">{children}</Typography>
      </TableCell>
      <TableCell align="right">{formatEuro(price)}</TableCell>
      <TableCell align="right">{formatClp(price * euroToClp)}</TableCell>
    </TableRow>
  );
}
