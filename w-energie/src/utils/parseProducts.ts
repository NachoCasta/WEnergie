import { ProductType } from "./../database/products/productCollection";
import { Product } from "database/products/productCollection";
import parseExcel from "./parseExcel";

type RawProduct = {
  Article: string;
  Netto: number;
  "Name DE": string;
  "Name EN"?: string;
  "Name ES"?: string;
  "Text DE"?: string;
  "Text EN"?: string;
  "Text ES"?: string;
};

type RawPart = {
  Artikel: string;
  Netto: number;
  "Name DE": string;
  "Name EN"?: string;
  "Name ES"?: string;
  "Text DE"?: string;
  "Text EN"?: string;
  "Text ES"?: string;
  Gewicht?: number;
};

function parseProduct(product: RawProduct | RawPart): Product {
  let id;
  let weight;
  let type;
  if ("Article" in product) {
    id = product.Article;
    weight = 0;
    type = ProductType.Product;
  } else {
    id = product.Artikel;
    weight = product.Gewicht ?? 0;
    type = ProductType.Part;
  }
  return {
    id,
    price: product.Netto,
    name: product["Name ES"] ?? product["Name EN"] ?? product["Name DE"],
    description:
      product["Text ES"] ?? product["Text EN"] ?? product["Text DE"] ?? "",
    weight,
    type,
  };
}

export default async function parseProducts(
  file: File
): Promise<Array<Product>> {
  return parseExcel(file, parseProduct);
}
