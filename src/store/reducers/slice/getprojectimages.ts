import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const ProjectsImagesSlice = createSlice({
    name: "ProjectsImages",
    initialState,
    reducers: {
        getProjectsImagesSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getProjectsImagesFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getProjectsImagesSuccessAction,
    getProjectsImagesFailedAction,
} = ProjectsImagesSlice.actions;

export default ProjectsImagesSlice;
