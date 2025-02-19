
import { ProductData } from "database/products/productCollection";

export function getProductName(product: ProductData): string {
    return product.name || product.nameEnglish || product.nameGerman
}

export function getProductDescription(product: ProductData): string {
    return product.description || product.descriptionEnglish || product.descriptionGerman
}
