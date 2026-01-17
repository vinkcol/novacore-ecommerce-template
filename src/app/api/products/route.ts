import { NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

// Helper to check if a value is truthy for inStock
function isInStock(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

export async function GET(request: Request) {
  console.log("=== API /api/products START ===");
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    console.log("[API] Query params - featured:", featured);

    const productsRef = collection(db, "products");
    console.log("[API] Firebase collection ref created");

    // Fetch all products and filter in-memory to handle different inStock formats
    const querySnapshot = await getDocs(productsRef);
    console.log("[API] Firebase query completed, total docs:", querySnapshot.docs.length);

    // Log raw data from Firebase
    const rawProducts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("[API] Raw products from Firebase:");
    rawProducts.forEach((p: any, i: number) => {
      console.log(`  [${i}] id=${p.id}, name=${p.name}, inStock=${p.inStock} (type: ${typeof p.inStock}), isFeatured=${p.isFeatured} (type: ${typeof p.isFeatured})`);
    });

    let products = rawProducts.filter((product: any) => isInStock(product.inStock));
    console.log("[API] After inStock filter:", products.length, "products");

    // If featured=true, filter only featured products
    if (featured === "true") {
      products = products.filter(
        (product: any) =>
          product.isFeatured === true ||
          product.isFeatured === "true" ||
          product.isFeatured === 1
      );
      console.log("[API] After isFeatured filter:", products.length, "products");
    }

    console.log("[API] Returning", products.length, "products");
    console.log("=== API /api/products END ===");
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("=== API /api/products ERROR ===", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
