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
import ProjectsMainSlice from "./slice/projects.main";
import GallerySlice from "./slice/gallery";
import AlertsSlice from "./slice/getalerts";
import ProjectsImagesSlice from "./slice/getprojectimages";
import SiteSettingsSlice from "./slice/getsettings";
import ResearchTopicsSlice from "./slice/getTopic";

const rootReducer = combineReducers({
  getsettings: SiteSettingsSlice.reducer,
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
  getprojectsmain: ProjectsMainSlice.reducer,
  getgallery: GallerySlice.reducer,
  getalerts: AlertsSlice.reducer,
  getprojectsimages: ProjectsImagesSlice.reducer,
  getResearchTopics: ResearchTopicsSlice.reducer,
});

export default rootReducer;
