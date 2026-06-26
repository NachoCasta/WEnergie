import { Quote } from "database/quotes/quoteCollection";
import _ from "lodash";
import { getProductName, getProductDescription } from "./productUtils";

export type QuoteRow = {
  id: string | null;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
};

export function getQuoteRows(quote: Quote): QuoteRow[] {
  const rows: QuoteRow[] = quote.products.map((p) => ({
    id: p.id,
    name: getProductName(p),
    description: getProductDescription(p) || null,
    quantity: p.quantity,
    price: p.price,
  }));
  if (quote.deliveryCost !== 0) {
    rows.push({
      id: null,
      name: "Transporte e internación",
      description: null,
      quantity: 1,
      price: quote.deliveryCost,
    });
  }
  if (quote.installationCost !== 0) {
    rows.push({
      id: null,
      name: "Montaje, puesta en marcha y garantía",
      description: null,
      quantity: 1,
      price: quote.installationCost,
    });
  }
  return rows;
}

export function getSubtotalPrice(
  quote: Quote,
  discount: boolean = true
): number {
  const productsTotal = quote.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const subtotal = productsTotal + quote.deliveryCost + quote.installationCost;
  if (!discount) return subtotal;
  return (subtotal * (100 - quote.discount)) / 100;
}

export function getTotalDiscount(quote: Quote): number {
  return getSubtotalPrice(quote, false) - getSubtotalPrice(quote, true);
}

export function getTotalTax(quote: Quote): number {
  const subtotal = getSubtotalPrice(quote);
  const tax = subtotal * 0.19;
  return tax;
}

export function getTotalPrice(quote: Quote): number {
  const subtotal = getSubtotalPrice(quote);
  const tax = getTotalTax(quote);
  const total = subtotal + tax;
  return total;
}

export function getMainProductName(quote: Quote): string {
  const mainProduct = _.maxBy(quote.products, (p) => p.price * p.quantity);
  if (!mainProduct) return "";
  return getProductName(mainProduct);
}

export function getFilteredQuotes(quotes: Quote[], filter: string | null): Quote[] {
  if (!filter) {
    return quotes;
  }
  const lower = filter.toLowerCase();
  return quotes.filter(
    (quote) =>
      quote.client.name.toLowerCase().includes(lower) ||
      quote.concept?.toLowerCase().includes(lower)
  );
}
