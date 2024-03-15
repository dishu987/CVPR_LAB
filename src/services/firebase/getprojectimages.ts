import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getProjectsImagesSuccessAction } from "../../store/reducers/slice/getprojectimages";


const fetchProjectsImages = async () => {
    try {
        const ProjectsImagesCollectionRef = collection(db, "project_main_images");
        const querySnapshot: any = await getDocs(ProjectsImagesCollectionRef);
        const fetchedProjectsImages: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const title = data?.title?.stringValue;
            const project = data?.project?.stringValue;
            const bannerURL = title ? await getBannerURL(project, title) : null;
            fetchedProjectsImages.push({ _id, title, bannerURL, project });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getProjectsImagesSuccessAction(fetchedProjectsImages));
    } catch (error) {
        console.error("Error fetching ProjectsImages:", error);
    }

};

const getBannerURL = async (imageName: any, id: any) => {
    try {
        const bannerRef = ref(storage, `project_main_images/${imageName + id}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteProjectsImages(ProjectsImagesId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (!ProjectsImagesId) {
        alert("Invalid Projects Items ID");
        return;
    }
    try {
        const ProjectsImagesDocRef = doc(db, "project_main_images", ProjectsImagesId);
        const ProjectsImagesDocSnapshot = await getDoc(ProjectsImagesDocRef);
        const data: any = ProjectsImagesDocSnapshot.data();
        const imageUrl = data.banner;
        await deleteDoc(ProjectsImagesDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `project_main_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        alert("ProjectsImages item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting ProjectsImages!");
    }
}





export { fetchProjectsImages, deleteProjectsImages };