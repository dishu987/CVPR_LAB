import { combineReducers } from "redux";
import UserAuthSlice from "./slice/auth";
import NewsSlice from "./slice/news";
import SliderSlice from "./slice/slider";
import PublicationsSlice from "./slice/publication";
import SupervisorsSlice from "./slice/supervisors";
import PhdSlice from "./slice/phd.students";
import PHUGSlice from "./slice/pgug.students";
import VisitorsAndInternsSlice from "./slice/visintern";
import DatasetsSlice from "./slice/datasets";
import ResearchAreaSlice from "./slice/reseacrh.area";
import SubAreasSlice from "./slice/getsubareas";
import ProjectsItemsSlice from "./slice/project.items";

const rootReducer = combineReducers({
  getauth: UserAuthSlice.reducer,
  getnews: NewsSlice.reducer,
  getslider: SliderSlice.reducer,
  getpublications: PublicationsSlice.reducer,
  getsupervisors: SupervisorsSlice.reducer,
  getphdStudents: PhdSlice.reducer,
  getpgugStudents: PHUGSlice.reducer,
  getvisitorsandinterns: VisitorsAndInternsSlice.reducer,
  getdatasets: DatasetsSlice.reducer,
  getresearcharea: ResearchAreaSlice.reducer,
  getsubareas: SubAreasSlice.reducer,
  getprojectitems: ProjectsItemsSlice.reducer,
});

export default rootReducer;
