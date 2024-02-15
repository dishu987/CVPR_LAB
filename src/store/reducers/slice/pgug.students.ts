import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const PHUGSlice = createSlice({
    name: "PHUG",
    initialState,
    reducers: {
        getPHUGSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getPHUGFailedAction: (state: any, action: PayloadAction<any>) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getPHUGSuccessAction,
    getPHUGFailedAction,
} = PHUGSlice.actions;

export default PHUGSlice;
