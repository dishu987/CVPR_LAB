import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
};

export const SiteSettingsSlice = createSlice({
    name: "SiteSettings",
    initialState,
    reducers: {
        getSiteSettingsSuccessAction: (state, action: PayloadAction<any>) => {
            return {
                ...state,
                data: action.payload
            };
        },
        getSiteSettingsErrorAction: (state: any) => {
            return { ...state, initialState };
        },
    },
});

export const {
    getSiteSettingsSuccessAction,
    getSiteSettingsErrorAction
} = SiteSettingsSlice.actions;

export default SiteSettingsSlice; 
