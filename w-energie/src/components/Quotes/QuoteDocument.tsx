import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { Quote as QuoteType } from "database/quotes/quoteCollection";
import { useQuoteFromParams } from "hooks/useQuote";
import kwbLogo from "assets/kwb_logo.png";
import wEnergieLogo from "assets/w_energie_logo.png";
import { formatClp, formatEuro } from "utils/formatCurrency";
import {
  getSubtotalPrice,
  getTotalDiscount,
  getTotalPrice,
  getTotalTax,
} from "utils/quoteUtils";

const GREEN = "#3b5430";
const YELLOW = "#f9b129";
const LIGHT_GRAY = "#eeeeee";
const GRAY = "#dddddd";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "50px 70px",
    fontSize: 14,
    color: "#555555",
    background: "#ffffff",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #aaaaaa",
    paddingBottom: 10,
  },
  logos: { display: "flex", flexDirection: "row" },
  wEnergieLogo: { height: 90, marginRight: 20 },
  kwbLogo: {
    height: 90,
    marginRight: 10,
    padding: 10,
    backgroundColor: YELLOW,
  },
  companyInfo: { display: "flex", alignItems: "flex-end" },
  companyName: { fontSize: 17 },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  clientInfo: {
    borderLeft: `6px solid ${YELLOW}`,
    paddingLeft: 5,
    fontSize: 12,
    lineHeight: 1.2,
  },
  clientName: { fontSize: 18 },
  clientAddress: { fontSize: 14 },
  quoteInfo: {
    display: "flex",
    alignItems: "flex-end",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.3,
  },
  quoteNumber: { fontSize: 22, paddingBottom: 5, color: GREEN },
  table: {
    display: "flex",
    direction: "row",
    alignItems: "flex-end",
    paddingTop: 40,
    fontSize: 10,
  },
  tableRow: { display: "flex", flexDirection: "row", marginBottom: 1 },
  tableCell: {
    padding: "20px 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellId: { width: "10%", backgroundColor: GREEN, color: "white" },
  tableCellDescription: {
    width: "50%",
    backgroundColor: LIGHT_GRAY,
    alignItems: "flex-start",
  },
  tableCellQuantity: { width: "10%", backgroundColor: GRAY },
  tableCellPrice: { width: "10%", backgroundColor: LIGHT_GRAY },
  tableCellPriceText: { width: "50%", textAlign: "right" },
  tableCellTotal: {
    width: "20%",
    backgroundColor: GREEN,
    color: "white",
    display: "flex",
    flexDirection: "row",
  },
  tableFooterRow: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #aaaaaa",
    width: "40%",
  },
  tableFooterCell: {
    padding: "10px 15px",
    textAlign: "right",
  },
  mail: { color: YELLOW, textDecoration: "none" },
});

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

type InfoProps = {
  quote: QuoteType;
};

function Info({ quote }: InfoProps) {
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

type TableProps = {
  quote: QuoteType;
};

function Table({ quote }: TableProps) {
  const { products, euroToClp, discount } = quote;
  const rows = [
    ...products,
    {
      id: null,
      name: "Transporte e internación",
      description: null,
      quantity: 1,
      price: quote.deliveryCost,
    },
    {
      id: null,
      name: "Montaje, puesta en marcha y garantía",
      description: null,
      quantity: 1,
      price: quote.installationCost,
    },
  ];
  const subtotal = getSubtotalPrice(quote);
  const totalDiscount = getTotalDiscount(quote);
  const tax = getTotalTax(quote);
  const total = getTotalPrice(quote);
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
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
      <TableFooterRow price={subtotal} euroToClp={euroToClp} first>
        TOTAL NETO
      </TableFooterRow>
      {totalDiscount > 0 && (
        <TableFooterRow price={-totalDiscount} euroToClp={euroToClp}>
          DESCUENTO {discount}%
        </TableFooterRow>
      )}
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
    extraTextStyles = { fontFamily: "Helvetica-Bold" };
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
    <View style={[styles.clientInfo, { fontSize: 12 }]}>
      <Text>Datos de transferencia:</Text>
      <Text>W Energie SpA:</Text>
      <Text>Rut: 76.610.987-K</Text>
      <Text>Chequera electrónica Banco Estado</Text>
      <Text>N° 33470365418</Text>
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
