import { db } from "@/lib/firebase/config";
import { collection, getDocs, addDoc, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Order, OrderStatus } from "../types";

const ORDERS_COLLECTION = "orders";

export async function fetchOrdersApi(): Promise<Order[]> {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Order[];
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

export async function createOrderApi(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
    try {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const now = new Date().toISOString();

        const newOrderData = {
            ...orderData,
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await addDoc(ordersRef, newOrderData);

        return {
            id: docRef.id,
            ...newOrderData
        } as Order;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

export async function updateOrderStatusApi(orderId: string, status: OrderStatus): Promise<void> {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}

export async function deleteOrderApi(orderId: string): Promise<void> {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await deleteDoc(orderRef);
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}
