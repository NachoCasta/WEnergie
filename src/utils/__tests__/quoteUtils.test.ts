import { Quote } from "database/quotes/quoteCollection";
import {
  getMainProductName,
  getSubtotalPrice,
  getTotalDiscount,
  getTotalPrice,
  getTotalTax,
} from "utils/quoteUtils";

const quote = {
  products: [
    { name: "Product A", price: 1, quantity: 2 },
    { name: "Product B", price: 2, quantity: 3 },
    { name: "Product C", price: 6, quantity: 4 },
    { name: "Product D", price: 4, quantity: 5 },
  ],
  deliveryCost: 10,
  installationCost: 20,
  discount: 30,
} as Quote;

test("getSubtotalPrice should return the correct product total without discount", () => {
  const actual = getSubtotalPrice(quote, false);
  expect(actual).toBe(82);
});

test("getSubtotalPrice should return the correct product total with discount", () => {
  const actual = getSubtotalPrice(quote, true);
  expect(actual).toBe(57.4);
});

test("getTotalDiscount should return the correct discount amount", () => {
  const actual = getTotalDiscount(quote);
  expect(actual).toBe(24.6);
});

test("getTotalTax should return the correct tax amount", () => {
  const actual = getTotalTax(quote);
  expect(actual).toBe(10.906);
});

test("getTotalPrice should return the correct total amount", () => {
  const actual = getTotalPrice(quote);
  expect(actual).toBe(68.306);
});

test("getMainProductName should return the correct main product name", () => {
  const actual = getMainProductName(quote);
  expect(actual).toBe("Product C");
});
