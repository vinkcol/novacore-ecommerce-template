import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import type { Collection } from "../types/collection.types";
import type { Product } from "../../products/types/product.types";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface StorefrontCollection extends Collection {
    products: Product[];
}

export async function getStorefrontCollections(): Promise<StorefrontCollection[]> {
    try {
        // 1. Fetch active collections
        const collectionsRef = collection(db, "collections");
        const collectionsQuery = query(collectionsRef, where("isActive", "==", true));
        const collectionsSnap = await getDocs(collectionsQuery);

        const collectionsData = collectionsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Collection[];

        // 2. Fetch all active products to hydrate collections
        // (This is more efficient than fetching per collection if we have many shared products)
        const productsRef = collection(db, "products");
        const productsSnap = await getDocs(productsRef);
        const allProducts = productsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];

        // 3. Map products to collections
        const storefrontCollections: StorefrontCollection[] = collectionsData.map(col => {
            const collectionProducts = allProducts.filter(p => {
                const isInStock = (p.inStock as any) === true || (p.inStock as any) === "true";
                return col.productIds?.includes(p.id) && isInStock;
            });
            return {
                ...col,
                products: collectionProducts
            };
        });

        // Filter out empty collections if needed, or keep them
        return storefrontCollections.filter(c => c.products.length > 0);
    } catch (error) {
        console.error("Server: Error fetching storefront collections", error);
        return [];
    }
}
