import { takeLatest, call, put, select } from "redux-saga/effects";
import { submitOrderApi } from "../api/checkoutApi";
import { setOrderStatus, setOrder, setError } from "./checkoutSlice";
import { clearCart } from "@/features/cart/redux/cartSlice";
import { selectCartItems, selectCartTotals } from "@/features/cart/redux/cartSelectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { CheckoutFormValues } from "../checkout.schema";
import { Order, OrderShippingInfo } from "@/features/orders/types";


// Action type for the saga to listen to
export const SUBMIT_ORDER_REQUEST = "checkout/submitOrderRequest";

// Action creator
export const submitOrderRequest = (payload: CheckoutFormValues) => ({
    type: SUBMIT_ORDER_REQUEST,
    payload,
});

function* handleCheckOutSaga(action: PayloadAction<CheckoutFormValues>): Generator<any, void, any> {
    try {
        yield put(setOrderStatus("submitting"));

        const items = yield select(selectCartItems);
        const totals = yield select(selectCartTotals);
        const { shippingCost, shippingLabel, shippingPromise } = yield select((state: any) => state.checkout);

        const formValues = action.payload;

        const shippingInfo: OrderShippingInfo = {
            firstName: formValues.firstName || "",
            lastName: formValues.lastName || "",
            email: formValues.email || "",
            phone: formValues.whatsapp || "",
            whatsapp: formValues.whatsapp || "",
            backupPhone: formValues.backupPhone || "",
            address: formValues.address || "",
            department: formValues.department || "",
            city: formValues.city || "",
            locality: formValues.locality || "",
            landmark: formValues.landmark || "",
            state: formValues.department || "",
            zipCode: "000000",
            country: "CO",
        };

        const mappedItems = items.map((item: any) => {
            const mappedItem: any = {
                productId: item.productId || "",
                name: item.name || "Producto sin nombre",
                price: typeof item.price === "string"
                    ? parseFloat((item.price as string).replace(/\./g, "").replace(",", ".")) || 0
                    : Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
            };

            // Only add optional fields if they are defined
            if (item.variantId) mappedItem.variantId = item.variantId;
            mappedItem.image = item.image || "/placeholder-product.png";
            if (item.notes) mappedItem.notes = item.notes;


            return mappedItem;
        });

        // Get configuration from state
        const config = yield select((state: any) => state.configuration.config);
        const orderCurrency = config?.currency || "COP";
        const orderTimezone = config?.timezone || "America/Bogota";

        const orderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
            items: mappedItems,
            shipping: shippingInfo,
            payment: JSON.parse(JSON.stringify({
                method: formValues.paymentMethod,
                cashAmount: formValues.cashAmount ? Number(formValues.cashAmount) : undefined
            })),


            shippingMethod: {
                id: "standard",
                name: shippingLabel || "Estándar",
                description: "",
                price: Number(shippingCost) || 0,
                estimatedDays: shippingPromise ? `${shippingPromise.min || '?'}-${shippingPromise.max || '?'}` : ""
            },
            subtotal: Number(totals.subtotal) || 0,
            tax: Number(totals.tax) || 0,
            shippingCost: Number(totals.shipping) || 0,
            total: Number(totals.total) || 0,
            status: "pending",
            currency: orderCurrency,
            timezone: orderTimezone
        };




        const response = yield call(submitOrderApi, orderData);

        if (response.success) {
            yield put(setOrder(response.data));
            yield put(setOrderStatus("success"));
            yield put(clearCart());
        } else {
            throw new Error(response.message || "Error al procesar el pedido");
        }
    } catch (error: any) {
        yield put(setError(error.message));
        yield put(setOrderStatus("error"));
    }
}

export function* watchCheckout() {
    yield takeLatest(SUBMIT_ORDER_REQUEST, handleCheckOutSaga);
}
