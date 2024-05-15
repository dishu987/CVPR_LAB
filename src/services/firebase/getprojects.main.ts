import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getProjectsMainSuccessAction } from "../../store/reducers/slice/projects.main";


const fetchProjectsMain = async () => {
    try {
        const ProjectsMainCollectionRef = collection(db, "projects_main");
        const querySnapshot: any = await getDocs(ProjectsMainCollectionRef);
        const fetchedProjectsMain: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            fetchedProjectsMain.push({ _id, ...data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getProjectsMainSuccessAction(fetchedProjectsMain));
    } catch (error) {
        console.error("Error fetching ProjectsMain:", error);
    }

};


async function deleteProjectsMain(ProjectsMainItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (ProjectsMainItemId === null) { alert("Invalid ProjectsMain ID"); return; }
    try {
        const ProjectsMainDocRef = doc(db, "projects_main", ProjectsMainItemId);
        await deleteDoc(ProjectsMainDocRef);
        alert("Projects Main item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting ProjectsMain!");
    }
}

async function editProjectsMainItem(ProjectsMainItemId: string, newData: any) {
    try {
        const ProjectsMainDocRef = doc(db, "ProjectsMain_imager", ProjectsMainItemId);
        const ProjectsMainDocSnapshot = await getDoc(ProjectsMainDocRef);
        const existingData = ProjectsMainDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(ProjectsMainDocRef, updatedData, { merge: true });

        alert("ProjectsMain item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing ProjectsMain!");
    }
}


export { fetchProjectsMain, deleteProjectsMain, editProjectsMainItem };