import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const PublicationsSlice = createSlice({
    name: "Publications",
    initialState,
    reducers: {
        getPublicationsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getPublicationsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getPublicationsSuccessAction,
    getPublicationsFailedAction,
} = PublicationsSlice.actions;

export default PublicationsSlice;
