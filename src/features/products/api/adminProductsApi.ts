import { db } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Product } from "../types/product.types";

export async function fetchAdminProductsApi(): Promise<Product[]> {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as unknown as Product[];
}

export async function fetchAdminProductByIdApi(id: string): Promise<Product | null> {
    const productDoc = doc(db, "products", id);
    const docSnap = await getDoc(productDoc);

    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Product;
    }
    return null;
}

export async function createAdminProductApi(data: Partial<Product>): Promise<Product> {
    console.log("API: Beginning createAdminProductApi execution", data);

    const productsCollection = collection(db, "products");

    // Create a 15s timeout to avoid infinite "Saving" state
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("La conexión con Firebase ha expirado. Por favor verifica tu internet.")), 15000)
    );

    try {
        console.log("API: Calling Firestore addDoc...");

        // Generate slug from name
        const slug = data.slug || data.name?.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || `product-${Date.now()}`;

        const docData = {
            ...data,
            // Ensure required fields have default values
            slug,
            brand: data.brand || "Vink",
            categories: data.categories || [data.category || "General"],
            tags: data.tags || [],
            variants: data.variants || [],
            hasVariants: data.hasVariants ?? false,
            type: data.hasVariants ? "variable" : "simple",
            isNew: data.isNew ?? true,
            isFeatured: data.isFeatured ?? false,
            isSale: data.isSale ?? false,
            // Ensure inStock is a proper boolean
            inStock: data.inStock === true || (data.inStock as any) === "true" || (data.inStock as any) === 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const createPromise = addDoc(productsCollection, docData);

        // Race between the creation and the timeout
        const docRef = (await Promise.race([createPromise, timeoutPromise])) as any;

        console.log("API: addDoc resolved successfully with ID:", docRef.id);

        return {
            id: docRef.id,
            ...data
        } as Product;
    } catch (error: any) {
        console.error("API: Exception caught in createAdminProductApi:", error);
        throw error;
    }
}

export async function updateAdminProductApi(id: string, data: Partial<Product>): Promise<Product> {
    console.log(`API: Updating product ${id}`, data);
    const productDoc = doc(db, "products", id);

    // Ensure inStock is a proper boolean if it's being updated
    const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date().toISOString(),
    };

    if (data.inStock !== undefined) {
        updateData.inStock = data.inStock === true || (data.inStock as any) === "true" || (data.inStock as any) === 1;
    }

    if (data.hasVariants !== undefined) {
        updateData.hasVariants = data.hasVariants;
        updateData.type = data.hasVariants ? "variable" : "simple";
    }

    await updateDoc(productDoc, updateData);

    return {
        id,
        ...data
    } as Product;
}

export async function deleteAdminProductApi(id: string): Promise<string> {
    console.log(`API: Deleting product ${id}`);
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
    return id;
}
