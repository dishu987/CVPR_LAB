import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const ProjectsMainSlice = createSlice({
    name: "ProjectsMain",
    initialState,
    reducers: {
        getProjectsMainSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getProjectsMainFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getProjectsMainSuccessAction,
    getProjectsMainFailedAction,
} = ProjectsMainSlice.actions;

export default ProjectsMainSlice;
