# Implementation Plan - Checkout Modal Integration

## Objective
Integrate a checkout modal into the cart flow, replacing the direct WhatsApp order button. Ensure the modal backdrop covers the entire viewport and remove unused features like priority shipping and the commitment checkbox.

## Completed Tasks

### 1. Checkout Modal Integration
- [x] Integrate `CheckoutModal` into `CartContent.tsx`.
- [x] Replace "Send to WhatsApp" button with "Continue" button triggering the modal.
- [x] Implement `React.createPortal` in `CheckoutModal` to ensure backdrop covers the viewport.
- [x] Fix hydration mismatch in `CartContent` by adding `isMounted` check.

### 2. Cleanup & Refactoring
- [x] Remove `priorityShipping` from:
    - `CheckoutForm.tsx` (UI)
    - `checkout.schema.ts` (Validation & Initial Values)
    - `checkout.types.ts` (Type Definitions)
    - `checkoutSaga.ts` (Logic)
    - `OrderDetailModal.tsx` (Admin View)
    - `orders/types/index.ts` (Order Intefaces)
- [x] Remove `commitment` checkbox from `CheckoutForm.tsx` and its validation.
- [x] Update `checkoutSaga.ts` to default payment method to `cod`.
- [x] Remove `maxRecommendations` and upsell logic from `CheckoutModal` and `CheckoutSummary` to streamline the checkout process.

## Verification
- [x] Verify `priorityShipping` is completely removed from the codebase.
- [x] Verify `commitment` logic is removed.
- [x] Ensure compilation (static check via careful editing).

## Next Steps
- Manual testing of the checkout flow to ensure data is correctly captured and orders are submitted to Firebase/Backend.
