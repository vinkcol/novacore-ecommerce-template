import { RootState } from "@/redux/store";

export const selectCollections = (state: RootState) => state.adminCollections.items;
export const selectCollectionsLoading = (state: RootState) => state.adminCollections.loading;
export const selectCollectionsError = (state: RootState) => state.adminCollections.error;
export const selectCollectionsCreating = (state: RootState) => state.adminCollections.creating;
export const selectCollectionsCreateSuccess = (state: RootState) => state.adminCollections.createSuccess;
export const selectCollectionsUpdating = (state: RootState) => state.adminCollections.updating;
export const selectCollectionsUpdateSuccess = (state: RootState) => state.adminCollections.updateSuccess;
export const selectCollectionsDeleting = (state: RootState) => state.adminCollections.deleting;
export const selectCollectionsDeleteSuccess = (state: RootState) => state.adminCollections.deleteSuccess;
export const selectCollectionsLastUpdated = (state: RootState) => state.adminCollections.lastUpdated;
