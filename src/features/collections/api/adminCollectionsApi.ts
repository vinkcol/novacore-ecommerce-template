import { db } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Collection } from "../types/collection.types";

const COLLECTIONS_COLLECTION = "collections";

export async function fetchCollectionsApi(): Promise<Collection[]> {
    const collectionsCollection = collection(db, COLLECTIONS_COLLECTION);
    const snapshot = await getDocs(collectionsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Collection[];
}

export async function createCollectionApi(data: Partial<Collection>): Promise<Collection> {
    const collectionsCollection = collection(db, COLLECTIONS_COLLECTION);
    const docData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collectionsCollection, docData);
    return {
        id: docRef.id,
        ...docData
    } as Collection;
}

export async function updateCollectionApi(id: string, data: Partial<Collection>): Promise<Collection> {
    const collectionDoc = doc(db, COLLECTIONS_COLLECTION, id);
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
    };
    await updateDoc(collectionDoc, updateData);
    return {
        id,
        ...updateData
    } as Collection;
}

export async function deleteCollectionApi(id: string): Promise<string> {
    const collectionDoc = doc(db, COLLECTIONS_COLLECTION, id);
    await deleteDoc(collectionDoc);
    return id;
}
