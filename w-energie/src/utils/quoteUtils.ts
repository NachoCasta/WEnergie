import { Quote } from "database/quotes/quoteCollection";
import _ from "lodash";

export function getSubtotalPrice(quote: Quote): number {
  const productsTotal = quote.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const subtotal = productsTotal + quote.deliveryCost + quote.installationCost;
  return subtotal;
}

export function getTotalDiscount(quote: Quote): number {
  const subtotal = getSubtotalPrice(quote);
  const totalDiscount = (subtotal * quote.discount) / 100;
  return totalDiscount;
}

export function getTotalTax(quote: Quote): number {
  const subtotal = getSubtotalPrice(quote);
  const totalDiscount = getTotalDiscount(quote);
  const tax = (subtotal - totalDiscount) * 0.19;
  return tax;
}

export function getTotalPrice(quote: Quote): number {
  const subtotal = getSubtotalPrice(quote);
  const discount = getTotalDiscount(quote);
  const tax = getTotalTax(quote);
  const total = subtotal - discount + tax;
  console.log(total, subtotal * (1 - quote.discount / 100) * 1.19);
  return total;
}

export function getMainProductName(quote: Quote): string {
  const mainProduct = _.maxBy(quote.products, (p) => p.price * p.quantity);
  if (!mainProduct) return "";
  return mainProduct.name;
}
