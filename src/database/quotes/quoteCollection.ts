import { db } from "database";
import { Product } from "database/products/productCollection";
import {
  collection,
  DocumentData,
  SnapshotOptions,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export interface QuoteProduct extends Product {
  quantity: number;
}

export interface QuoteData {
  concept?: string;
  client: {
    name: string;
    rut: string;
    address: string;
    phone: string;
    mail: string;
  };
  date: Timestamp;
  deliveryTerm: string;
  paymentForm: string;
  deliveryCost: number;
  installationCost: number;
  discount: number;
  weight: number;
  euroToClp: number;
  products: Array<QuoteProduct>;
}

export interface Quote extends QuoteData {
  id: string;
}

const firestoreConverter = {
  toFirestore: ({ id, ...data }: Quote): DocumentData => data,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<QuoteData>,
    options: SnapshotOptions
  ): Quote => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
    };
  },
};

const quoteCollection = collection(db, "quotes").withConverter(
  firestoreConverter
);

export default quoteCollection;
