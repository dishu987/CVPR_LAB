import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const SupervisorsSlice = createSlice({
    name: "Supervisors",
    initialState,
    reducers: {
        getSupervisorsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getSupervisorsFailedAction: (state: any, action: PayloadAction<any>) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getSupervisorsSuccessAction,
    getSupervisorsFailedAction,
} = SupervisorsSlice.actions;

export default SupervisorsSlice;
