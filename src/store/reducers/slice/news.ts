import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const NewsSlice = createSlice({
    name: "News",
    initialState,
    reducers: {
        getNewsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getNewsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getNewsSuccessAction,
    getNewsFailedAction,
} = NewsSlice.actions;

export default NewsSlice;
