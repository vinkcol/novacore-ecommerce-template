import { db } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Category } from "../types/category.types";

const CATEGORIES_COLLECTION = "categories";

export async function fetchCategoriesApi(): Promise<Category[]> {
    const categoriesCollection = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
}

export async function createCategoryApi(data: Partial<Category>): Promise<Category> {
    const categoriesCollection = collection(db, CATEGORIES_COLLECTION);
    const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(categoriesCollection, docData);
    return {
        id: docRef.id,
        ...docData
    } as Category;
}

export async function updateCategoryApi(id: string, data: Partial<Category>): Promise<Category> {
    const categoryDoc = doc(db, CATEGORIES_COLLECTION, id);
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
    };
    await updateDoc(categoryDoc, updateData);
    return {
        id,
        ...updateData
    } as Category;
}

export async function deleteCategoryApi(id: string): Promise<string> {
    const categoryDoc = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(categoryDoc);
    return id;
}
