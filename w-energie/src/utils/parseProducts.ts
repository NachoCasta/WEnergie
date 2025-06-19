import { ProductType } from "./../database/products/productCollection";
import { Product } from "database/products/productCollection";
import parseExcel from "./parseExcel";

type RawProduct = {
  // ID
  Article?: string;
  Artikel?: string;
  "Produktnr."?: string;
  // Price
  Netto?: number | string;
  "VK-Preis"?: number | string;
  "VK-Preis in €"?: number | string;
  // Name
  "Name DE"?: string;
  "Name EN"?: string;
  "Name ES"?: string;
  "Beschreibung DEA"?: string;
  "Beschreibung ENG"?: string;
  // Description
  "Text DE"?: string;
  "Text EN"?: string;
  "Text ES"?: string;
  "VK-Text DEA"?: string;
  "VK-Text ENG"?: string;
  // Weight
  Gewicht?: number;
};

class ProductParser {
  private type: ProductType;

  public pricesFound: boolean = false;
  public descriptionsFound: boolean = false;

  constructor(type: ProductType) {
    this.type = type;
  }

  parse(rawProduct: RawProduct): Product {
    const id =
      rawProduct.Article || rawProduct.Artikel || rawProduct["Produktnr."];
    if (id == null) {
      throw new Error("Product ID is missing");
    }
    if (typeof id !== "string") {
      throw new Error(`Product ID is not a string: ID=${id}`);
    }
    const rawPrice =
      rawProduct.Netto ??
      rawProduct["VK-Preis"] ??
      rawProduct["VK-Preis in €"] ??
      0;
    const price =
      typeof rawPrice === "string" ? parseFloat(rawPrice) : rawPrice;
    if (isNaN(price)) {
      throw new Error(`Product price is not a number: ID=${id}`);
    }
    if (price > 0) {
      this.pricesFound = true;
    }
    const weight = rawProduct.Gewicht;
    const name = rawProduct["Name ES"] || undefined;
    const nameEnglish =
      rawProduct["Name EN"] || rawProduct["Beschreibung ENG"] || undefined;
    const nameGerman =
      rawProduct["Name DE"] || rawProduct["Beschreibung DEA"] || undefined;
    const description = rawProduct["Text ES"] || undefined;
    const descriptionEnglish =
      rawProduct["Text EN"] || rawProduct["VK-Text ENG"] || undefined;
    const descriptionGerman =
      rawProduct["Text DE"] || rawProduct["VK-Text DEA"] || undefined;

    if (
      description != null ||
      descriptionEnglish != null ||
      descriptionGerman != null
    ) {
      this.descriptionsFound = true;
    }

    if (name == null && nameEnglish == null && nameGerman == null) {
      throw new Error(`Product name is missing: ID=${id}`);
    }
    if (nameGerman == null) {
      throw new Error(`Product nameGerman is missing: ID=${id}`);
    }

    const product: Product = {
      id,
      price,
      nameGerman,
      type: this.type,
    };
    if (name != null) {
      product.name = name;
    }
    if (nameEnglish != null) {
      product.nameEnglish = nameEnglish;
    }
    if (description != null) {
      product.description = description;
    }
    if (descriptionEnglish != null) {
      product.descriptionEnglish = descriptionEnglish;
    }
    if (descriptionGerman != null) {
      product.descriptionGerman = descriptionGerman;
    }
    if (weight != null) {
      product.weight = weight;
    }
    return product;
  }
}

export default async function parseProducts(
  file: File,
  type: ProductType
): Promise<Array<Product>> {
  const productPraser = new ProductParser(type);

  const parsedProducts = await parseExcel(file, (data: RawProduct) =>
    productPraser.parse(data)
  );

  if (!productPraser.pricesFound) {
    throw new Error("No prices found in the file");
  }
  if (type == ProductType.Product && !productPraser.descriptionsFound) {
    throw new Error("No descriptions found in the file");
  }

  return parsedProducts;
}
