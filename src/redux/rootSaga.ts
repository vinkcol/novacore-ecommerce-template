import { all, fork } from "redux-saga/effects";
import { watchCheckout } from "@/features/checkout/redux/checkoutSaga";
import { watchAdminProducts } from "@/features/products/redux/adminProductsSaga";
import { watchProducts } from "@/features/products/redux/productsSaga";
import { watchCategories } from "@/features/categories/redux/categoriesSaga";
import { watchCollections } from "@/features/collections/redux/collectionsSaga";
import { watchAdminCollections } from "@/features/collections/redux/adminCollectionsSaga";
import { configurationSaga } from "@/features/configuration/redux/configurationSaga";
import { shippingSaga } from "@/features/shipping/redux/shippingSaga";

export default function* rootSaga() {
    yield all([
        fork(watchCheckout),
        fork(watchAdminProducts),
        fork(watchProducts),
        fork(watchCategories),
        fork(watchCollections),
        fork(watchAdminCollections),
        fork(configurationSaga),
        fork(shippingSaga),
    ]);
}
