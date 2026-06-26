import {
  Document,
  Page,
  Text,
  View,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { Quote as QuoteType } from "database/quotes/quoteCollection";
import { useQuoteFromParams } from "hooks/useQuote";
import kwbLogo from "assets/kwb_logo.png";
import wEnergieLogo from "assets/w_energie_logo.png";
import { formatClp, formatEuro } from "utils/formatCurrency";
import {
  getQuoteRows,
  getSubtotalPrice,
  getTotalDiscount,
  getTotalPrice,
  getTotalTax,
} from "utils/quoteUtils";
import styles, { GREEN } from "./quoteDocumentStyles";

type QuoteDocumentProps = {
  quote?: QuoteType;
};

export default function QuoteDocument({ quote }: QuoteDocumentProps) {
  if (!quote) return <Document />;
  return (
    <Document>
      <Page size="A4" style={styles.page} dpi={120}>
        <Header />
        <Info quote={quote} />
        <Table quote={quote} />
        <Footer />
      </Page>
    </Document>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logos}>
        <Image src={wEnergieLogo} style={styles.wEnergieLogo} />
        <Image src={kwbLogo} style={styles.kwbLogo} />
      </View>
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>W Energie SpA</Text>
        <Text>Rut: 76.610.987-K</Text>
        <Text>Punta de Águilas Norte 9300, Casa 12</Text>
        <Text>Lo Barnechea, Santiago</Text>
        <Text>+56 9 5608 8840</Text>
        <Text style={styles.mail}>sonia.worner@wenergie.cl</Text>
      </View>
    </View>
  );
}

type QuoteProps = {
  quote: QuoteType;
};

function Info({ quote }: QuoteProps) {
  const { client } = quote;
  return (
    <View style={styles.info}>
      <View style={styles.clientInfo}>
        <Text>Cotización para:</Text>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text>Dirección de despacho:</Text>
        <Text style={styles.clientAddress}>{client.address}</Text>
        <Text>{client.phone}</Text>
        <Text style={styles.mail}>{client.mail}</Text>
      </View>
      <View style={styles.quoteInfo}>
        <Text style={styles.quoteNumber}>COTIZACIÓN N° {quote.id}</Text>
        <Text>
          Fecha de emisión: {quote.date.toDate().toLocaleDateString("es-CL")}
        </Text>
        <Text>Fecha de entrega: {quote.deliveryTerm}</Text>
        <Text>Forma de pago: {quote.paymentForm}</Text>
      </View>
    </View>
  );
}

function Table({ quote }: QuoteProps) {
  const { euroToClp, discount } = quote;
  const rows = getQuoteRows(quote);
  const subtotalPreDiscount = getSubtotalPrice(quote, false);
  const totalDiscount = getTotalDiscount(quote);
  const subtotal = getSubtotalPrice(quote);
  const tax = getTotalTax(quote);
  const total = getTotalPrice(quote);
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        <View style={[styles.tableCell, styles.tableCellId]}>
          <Text>ARTÍCULO</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellDescription]}>
          <Text>DESCRIPCIÓN</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellQuantity]}>
          <Text>CANTIDAD</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellPrice]}>
          <Text>PRECIO</Text>
        </View>
        <View style={[styles.tableCell, styles.tableCellTotal]}>
          <Text>TOTAL</Text>
        </View>
      </View>
      {rows.map((row, index) => (
        <View key={`${row.id}-${index}`} style={styles.tableRow}>
          <View style={[styles.tableCell, styles.tableCellId]}>
            <Text>{row.id}</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellDescription]}>
            <Text style={{ color: GREEN }}>{row.name}</Text>
            {Boolean(row.description) && (
              <Text style={{ paddingTop: 5 }}>{row.description}</Text>
            )}
          </View>
          <View
            style={[
              styles.tableCell,
              styles.tableCellQuantity,
              { alignItems: "flex-end" },
            ]}
          >
            <Text>{row.quantity}</Text>
          </View>
          <View
            style={[
              styles.tableCell,
              styles.tableCellPrice,
              { alignItems: "flex-end" },
            ]}
          >
            <Text>{formatEuro(row.price)}</Text>
          </View>
          <View style={[styles.tableCell, styles.tableCellTotal]}>
            <Text style={[styles.tableCellPriceText, { paddingRight: 15 }]}>
              {formatEuro(row.price * row.quantity)}
            </Text>
            <Text style={styles.tableCellPriceText}>
              {formatClp(row.price * row.quantity * euroToClp)}
            </Text>
          </View>
        </View>
      ))}
      {discount > 0 && (
        <>
          <TableFooterRow
            price={subtotalPreDiscount}
            euroToClp={euroToClp}
            first
          >
            SUBTOTAL NETO
          </TableFooterRow>
          <TableFooterRow price={-totalDiscount} euroToClp={euroToClp}>
            DESCUENTO {discount}%
          </TableFooterRow>
        </>
      )}
      <TableFooterRow
        price={subtotal}
        euroToClp={euroToClp}
        first={discount === 0}
      >
        TOTAL NETO
      </TableFooterRow>
      <TableFooterRow price={tax} euroToClp={euroToClp}>
        IVA 19%
      </TableFooterRow>
      <TableFooterRow price={total} euroToClp={euroToClp} last>
        TOTAL
      </TableFooterRow>
    </View>
  );
}

type TableFooterRowProps = {
  children: React.ReactNode;
  price: number;
  euroToClp: number;
  first?: boolean;
  last?: boolean;
};

function TableFooterRow({
  children,
  price,
  euroToClp,
  first = false,
  last = false,
}: TableFooterRowProps) {
  let extraRowStyles = {};
  let extraTextStyles = {};
  if (first) {
    extraRowStyles = { borderTop: "none" };
  } else if (last) {
    extraRowStyles = { borderTop: `1px solid ${GREEN}` };
    extraTextStyles = {
      color: GREEN,
      fontSize: 12,
    };
  }
  return (
    <View style={[styles.tableFooterRow, extraRowStyles]}>
      <View style={[styles.tableFooterCell, { width: "50%" }]}>
        <Text style={extraTextStyles}>{children}</Text>
      </View>
      <View style={[styles.tableFooterCell, { width: "25%" }]}>
        <Text style={extraTextStyles}>{formatEuro(price)}</Text>
      </View>
      <View style={[styles.tableFooterCell, { width: "25%" }]}>
        <Text style={extraTextStyles}>{formatClp(price * euroToClp)}</Text>
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={[styles.clientInfo, { fontSize: 13 }]}>
      <Text>Datos de transferencia:</Text>
      <Text>W Energie SpA:</Text>
      <Text>Rut: 76.610.987-K</Text>
      <Text>Cuenta Corriente BCI</Text>
      <Text>N° 79838450</Text>
      <Text style={styles.mail}>sonia.worner@wenergie.cl</Text>
    </View>
  );
}

export function QuoteDocumentViewer() {
  const [quote] = useQuoteFromParams();
  return (
    <PDFViewer
      style={{ width: "100%", height: "calc(100vh - 4px)", border: "none" }}
    >
      <QuoteDocument quote={quote} />
    </PDFViewer>
  );
}
