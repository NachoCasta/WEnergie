import { Quote } from "database/quotes/quoteCollection";
import _ from "lodash";

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
  return mainProduct.name;
}
