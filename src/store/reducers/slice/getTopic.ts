import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const ResearchTopicsSlice = createSlice({
    name: "ResearchTopics",
    initialState,
    reducers: {
        getResearchTopicsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getResearchTopicsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getResearchTopicsSuccessAction,
    getResearchTopicsFailedAction,
} = ResearchTopicsSlice.actions;

export default ResearchTopicsSlice;
