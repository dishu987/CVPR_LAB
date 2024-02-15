import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const SubAreasSlice = createSlice({
    name: "SubAreas",
    initialState,
    reducers: {
        getSubAreasSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getSubAreasFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getSubAreasSuccessAction,
    getSubAreasFailedAction,
} = SubAreasSlice.actions;

export default SubAreasSlice;
