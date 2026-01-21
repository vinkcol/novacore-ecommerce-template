import { db } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface WhatsAppTemplate {
    id: string;
    name: string;
    content: string;
}

const COLLECTION_NAME = "whatsapp_templates";

export async function fetchTemplatesApi(): Promise<WhatsAppTemplate[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as WhatsAppTemplate[];
}

export async function createTemplateApi(template: Omit<WhatsAppTemplate, "id">): Promise<WhatsAppTemplate> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), template);
    return {
        id: docRef.id,
        ...template
    };
}

export async function updateTemplateApi(id: string, updates: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, updates);
    return {
        id,
        name: "", // These will be merged in reducer usually, but return minimalist or full object if known
        content: "",
        ...updates
    } as WhatsAppTemplate; // Type casting for simplicity in saga
}

export async function deleteTemplateApi(id: string): Promise<string> {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
}
