import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import type { Product } from "../types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase for server-side
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to check if a value is truthy for inStock (handles different data types)
function isInStock(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

// Helper to check if a value is truthy for isFeatured
function isFeatured(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

/**
 * Fetches all active products from Firestore (Server-side)
 * Use this in Server Components for SSR/SSG
 * Handles different data types for inStock field (boolean, string, number)
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    // Filter in-memory to handle different inStock data types
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((product: any) => isInStock(product.inStock)) as Product[];
  } catch (error) {
    console.error("Server: Error fetching products from Firestore", error);
    return [];
  }
}

/**
 * Fetches a single product by ID from Firestore (Server-side)
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Server: Error fetching product by ID", error);
    return null;
  }
}

/**
 * Fetches featured products from Firestore (Server-side)
 * Handles different data types for inStock and isFeatured fields
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    // Filter in-memory to handle different data types
    return querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter(
        (product: any) => isInStock(product.inStock) && isFeatured(product.isFeatured)
      ) as Product[];
  } catch (error) {
    console.error("Server: Error fetching featured products", error);
    return [];
  }
}
