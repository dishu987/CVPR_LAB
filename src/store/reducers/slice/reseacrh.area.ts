import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const ResearchAreaSlice = createSlice({
    name: "ResearchArea",
    initialState,
    reducers: {
        getResearchAreaSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getResearchAreaFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getResearchAreaSuccessAction,
    getResearchAreaFailedAction,
} = ResearchAreaSlice.actions;

export default ResearchAreaSlice;
