import { RootState } from "@/redux/store";

export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategoriesError = (state: RootState) => state.categories.error;
export const selectCategoriesCreating = (state: RootState) => state.categories.creating;
export const selectCategoriesCreateSuccess = (state: RootState) => state.categories.createSuccess;
export const selectCategoriesUpdating = (state: RootState) => state.categories.updating;
export const selectCategoriesUpdateSuccess = (state: RootState) => state.categories.updateSuccess;
export const selectCategoriesDeleting = (state: RootState) => state.categories.deleting;
export const selectCategoriesDeleteSuccess = (state: RootState) => state.categories.deleteSuccess;
export const selectCategoriesLastUpdated = (state: RootState) => state.categories.lastUpdated;
