import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const SliderSlice = createSlice({
    name: "Slider",
    initialState,
    reducers: {
        getSliderSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getSliderFailedAction: (state: any, action: PayloadAction<any>) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getSliderSuccessAction,
    getSliderFailedAction,
} = SliderSlice.actions;

export default SliderSlice;
