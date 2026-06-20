import { StyleSheet } from "@react-pdf/renderer";

export const GREEN = "#3b5430";
export const YELLOW = "#f9b129";
const LIGHT_GRAY = "#eeeeee";
const GRAY = "#dddddd";

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
  wEnergieLogo: { height: 100, marginRight: 20 },
  kwbLogo: {
    height: 100,
    width: 100,
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
    fontSize: 13,
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
    fontSize: 12,
  },
  tableRow: { display: "flex", flexDirection: "row", marginBottom: 1 },
  tableCell: {
    padding: "20px 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellId: {
    width: "10%",
    padding: "20px 10px",
    backgroundColor: GREEN,
    color: "white",
  },
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
  tableHeaderRow: {
    fontSize: 10,
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

export default styles;
