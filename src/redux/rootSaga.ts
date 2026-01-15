import { all, fork } from "redux-saga/effects";
import { watchCheckout } from "@/features/checkout/redux/checkoutSaga";

export default function* rootSaga() {
    yield all([
        fork(watchCheckout),
    ]);
}
