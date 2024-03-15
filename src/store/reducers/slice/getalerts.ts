import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AlertInterface {
    id: string;
    type: string;
    content: string;
}
interface AlertInterface1 {
    data: AlertInterface[];
}


const initialState: AlertInterface1 = {
    data: [],
};

export const AlertsSlice = createSlice({
    name: "Datasets",
    initialState,
    reducers: {
        getAlertsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getAlertsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getAlertsSuccessAction,
    getAlertsFailedAction,
} = AlertsSlice.actions;

export default AlertsSlice;
