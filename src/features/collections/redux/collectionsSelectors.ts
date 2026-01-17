import { RootState } from "@/redux/store";

export const selectCollections = (state: RootState) => state.collections.items;
export const selectCollectionsLoading = (state: RootState) => state.collections.loading;
export const selectCollectionsError = (state: RootState) => state.collections.error;
