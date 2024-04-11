import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { UserAuthInterface } from "../../../interface/auth.interface";

const initialState: UserAuthInterface = {
    email: "",
    userType: "",
    isVarified: false
};

export const UserAuthSlice = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        getUserAuthSuccessAction: (state, action: PayloadAction<UserAuthInterface>) => {
            return {
                ...state,
                email: action.payload.email,
                userType: action.payload.userType,
                isVarified: action.payload.isVarified
            };
        },
        getUserAuthLogoutAction: (state: any) => {
            return { ...state, initialState };
        },
    },
});

export const {
    getUserAuthSuccessAction,
    getUserAuthLogoutAction,
} = UserAuthSlice.actions;

export default UserAuthSlice; 
