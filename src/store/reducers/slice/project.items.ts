import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    data: [],
};

export const ProjectsItemsSlice = createSlice({
    name: "ProjectsItems",
    initialState,
    reducers: {
        getProjectsItemsSuccessAction: (state: any, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
        getProjectsItemsFailedAction: (state: any) => {
            state.data = initialState.data;
        },
    },
});

export const {
    getProjectsItemsSuccessAction,
    getProjectsItemsFailedAction,
} = ProjectsItemsSlice.actions;

export default ProjectsItemsSlice;
