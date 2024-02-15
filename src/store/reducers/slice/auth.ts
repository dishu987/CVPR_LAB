import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { UserAuthInterface } from "../../../interface/auth.interface";

const initialState: UserAuthInterface = {
    data: {
        name: "",
        email: "",
        designation: "",
        token: "",
        message: "",
    },
    isLoading: false,
    isSuccessful: false,
    isExpired: false,
    error: {},
};

export const UserAuthSlice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        getUserAuthRequestAction: (state: any, action: PayloadAction<{}>) => {
            console.log(action);
            state.isLoading = true;
        },
        getTokenExpiredAction: (state: any, action: PayloadAction<{}>) => {
            console.log(action);
            state.isExpired = true;
            state.isLoading = true;
        },
        getUserAuthExpiredTokenAction: (state: any, action: PayloadAction<[]>) => {
            state.data.token.access = action.payload;
            state.isLoading = false;
            state.result = {};
            state.isSuccessful = false;
            state.isExpired = false;
        },
        getUserAuthSuccessAction: (state: any, action: PayloadAction<[]>) => {
            state.data = action.payload;
            state.isLoading = false;
            state.result = {};
            state.isSuccessful = true;
            state.isExpired = false;
        },
        getUserAuthFailedAction: (state: any, action: PayloadAction<{}>) => {
            state.isSuccessful = false;
            state.isLoading = false;
            state.result = action.payload;
            state.isExpired = false;
            state.data = initialState.data;
        },
        getUserAuthLogoutAction: (state: any) => {
            state.isSuccessful = false;
            state.isLoading = false;
            state.data = initialState.data;
            state.error = {};
            state.isExpired = false;
        },
    },
});

export const {
    getTokenExpiredAction,
    getUserAuthLogoutAction,
    getUserAuthRequestAction,
    getUserAuthSuccessAction,
    getUserAuthFailedAction,
    getUserAuthExpiredTokenAction,
} = UserAuthSlice.actions;

export default UserAuthSlice;
