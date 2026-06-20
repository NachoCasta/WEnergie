import { Product, ProductData } from "database/products/productCollection";

export function getProductName(product: ProductData): string {
  return product.name || product.nameEnglish || product.nameGerman;
}

export function getProductDescription(product: ProductData): string {
  return (
    product.description ||
    product.descriptionEnglish ||
    product.descriptionGerman ||
    ""
  );
}

export function getFilteredProducts(
  products: Product[],
  filter: string | null
): Product[] {
  if (!filter) {
    return products;
  }
  const lowerCaseFilter = filter.toLowerCase();
  return products.filter(
    (product) =>
      getProductName(product).toLowerCase().includes(lowerCaseFilter) ||
      getProductDescription(product)?.toLowerCase().includes(lowerCaseFilter)
  );
}
