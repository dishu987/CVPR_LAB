import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const VisitorsAndInternsSlice = createSlice({
    name: "VisitorsAndInterns",
    initialState,
    reducers: {
        getVisitorsAndInternsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getVisitorsAndInternsFailedAction: (state: any, action: PayloadAction<any>) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getVisitorsAndInternsSuccessAction,
    getVisitorsAndInternsFailedAction,
} = VisitorsAndInternsSlice.actions;

export default VisitorsAndInternsSlice;
