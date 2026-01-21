import { RootState } from "@/redux/store";

export const selectAdminProductsState = (state: RootState) => state.adminProducts;

export const selectAdminProducts = (state: RootState) => state.adminProducts.items;
export const selectAdminProductsLoading = (state: RootState) => state.adminProducts.loading;
export const selectAdminProductsError = (state: RootState) => state.adminProducts.error;
export const selectAdminProductsCreating = (state: RootState) => state.adminProducts.creating;
export const selectAdminProductsCreateSuccess = (state: RootState) => state.adminProducts.createSuccess;
export const selectAdminProductsCreateError = (state: RootState) => state.adminProducts.createError;
export const selectAdminProductsLastUpdated = (state: RootState) => state.adminProducts.lastUpdated;

export const selectAdminProductsUpdating = (state: RootState) => state.adminProducts.updating;
export const selectAdminProductsUpdateSuccess = (state: RootState) => state.adminProducts.updateSuccess;
export const selectAdminProductsUpdateError = (state: RootState) => state.adminProducts.updateError;

export const selectAdminProductsDeleting = (state: RootState) => state.adminProducts.deleting;
export const selectAdminProductsDeleteSuccess = (state: RootState) => state.adminProducts.deleteSuccess;
export const selectAdminProductsDeleteError = (state: RootState) => state.adminProducts.deleteError;

export const selectAdminSelectedProduct = (state: RootState) => state.adminProducts.selectedProduct;

export const selectAdminProductsBulkCreating = (state: RootState) => state.adminProducts.bulkCreating;
export const selectAdminProductsBulkCreateSuccess = (state: RootState) => state.adminProducts.bulkCreateSuccess;
export const selectAdminProductsBulkCreateError = (state: RootState) => state.adminProducts.bulkCreateError;
