import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const PhdSlice = createSlice({
    name: "Phd",
    initialState,
    reducers: {
        getPhdSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getPhdFailedAction: (state: any, action: PayloadAction<any>) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getPhdSuccessAction,
    getPhdFailedAction,
} = PhdSlice.actions;

export default PhdSlice;
