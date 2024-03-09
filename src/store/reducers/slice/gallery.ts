import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const GallerySlice = createSlice({
    name: "Gallery",
    initialState,
    reducers: {
        getGallerySuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getGalleryFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getGallerySuccessAction,
    getGalleryFailedAction,
} = GallerySlice.actions;

export default GallerySlice;
