import { combineEpics } from "redux-observable";
import { getAuthEpic } from "./auth";

export const rootEpic = combineEpics(getAuthEpic);
