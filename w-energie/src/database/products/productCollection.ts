import { db } from "database";
import {
  collection,
  DocumentData,
  SnapshotOptions,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export enum ProductType {
  Product,
  Part,
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  weight: number;
  type: ProductType;
}

export interface Product extends ProductData {
  id: string;
}

const firestoreConverter = {
  toFirestore: ({ id, ...data }: Product): DocumentData => data,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ProductData>,
    options: SnapshotOptions
  ): Product => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    };
  },
};

const productCollection = collection(db, "products").withConverter(
  firestoreConverter
);

export default productCollection;
