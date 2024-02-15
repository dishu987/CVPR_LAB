import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const DatasetsSlice = createSlice({
    name: "Datasets",
    initialState,
    reducers: {
        getDatasetsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getDatasetsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getDatasetsSuccessAction,
    getDatasetsFailedAction,
} = DatasetsSlice.actions;

export default DatasetsSlice;
