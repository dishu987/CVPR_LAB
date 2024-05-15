import { arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getProjectsItemsSuccessAction } from "../../store/reducers/slice/project.items";


const fetchProjectsItems = async () => {
    try {
        const ProjectsItemsCollectionRef = collection(db, "projects_items");
        const querySnapshot: any = await getDocs(ProjectsItemsCollectionRef);
        const fetchedProjectsItems: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc.data();
            const _id = doc._document.key.path.segments[6] || null;
            const title = data?.title;
            const bannerURL = title ? await getBannerURL(title) : null;
            fetchedProjectsItems.push({ _id, bannerURL, ...data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getProjectsItemsSuccessAction(fetchedProjectsItems));
    } catch (error) {
        console.error("Error fetching ProjectsItems:", error);
    }

};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `project_items_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteProjectsItems(ProjectsItemsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (!ProjectsItemsItemId) {
        alert("Invalid ProjectsItems ID");
        return;
    }
    try {
        const ProjectsItemsDocRef = doc(db, "projects_items", ProjectsItemsItemId);
        const ProjectsItemsDocSnapshot = await getDoc(ProjectsItemsDocRef);
        const data: any = ProjectsItemsDocSnapshot.data();
        const imageUrl = data?.title;
        await deleteDoc(ProjectsItemsDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `project_items_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        const x = collection(db, "research_subitems");
        const querySnapshot: any = await getDocs(x);
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const docRef = doc.ref; // Get the document reference
            await updateDoc(docRef, { // Use the document reference
                projects: arrayRemove(ProjectsItemsItemId)
            });
        });
        await Promise.all(fetchPromises);
        alert("ProjectsItems item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error)
        alert("Error deleting ProjectsItems!");
    }
}



async function editProjectsItemsItem(ProjectsItemsItemId: string, newData: any) {
    try {
        const ProjectsItemsDocRef = doc(db, "projects_items", ProjectsItemsItemId);
        const ProjectsItemsDocSnapshot = await getDoc(ProjectsItemsDocRef);
        const existingData = ProjectsItemsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(ProjectsItemsDocRef, updatedData, { merge: true });

        alert("ProjectsItems item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing ProjectsItems!");
    }
}


export { fetchProjectsItems, deleteProjectsItems, editProjectsItemsItem };