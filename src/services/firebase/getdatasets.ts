import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getDatasetsSuccessAction } from "../../store/reducers/slice/datasets";
const fetchDatasets = async () => {
    try {
        const DatasetsCollectionRef = collection(db, "datasets");
        const querySnapshot: any = await getDocs(DatasetsCollectionRef);
        const fetchedDatasets: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const banner = data.bannerURL.stringValue;
            const title = data?.title.stringValue;
            const description = data?.description.stringValue;
            const bannerURL = banner ? await getBannerURL(banner) : null;
            fetchedDatasets.push({ _id, title, description, bannerURL });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getDatasetsSuccessAction(fetchedDatasets));
    } catch (error) {
        console.error("Error fetching Datasets:", error);
    }

};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `dataset_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteDatasets(DatasetsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (DatasetsItemId === null) { alert("Invalid Datasets ID"); return; }
    try {
        const DatasetsDocRef = doc(db, "datasets", DatasetsItemId);
        const DatasetsDocSnapshot = await getDoc(DatasetsDocRef);
        const data: any = DatasetsDocSnapshot.data();
        const imageUrl = data.banner;
        await deleteDoc(DatasetsDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `dataset_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        alert("Datasets item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting Datasets!");
    }
}

async function editDatasetsItem(DatasetsItemId: string, newData: any) {
    try {
        const DatasetsDocRef = doc(db, "Datasets_imager", DatasetsItemId);
        const DatasetsDocSnapshot = await getDoc(DatasetsDocRef);
        const existingData = DatasetsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(DatasetsDocRef, updatedData, { merge: true });

        alert("Datasets item edited successfully.");
    } catch (error) {
        console.log(error);
        alert("Error editing Datasets!");
    }
}


export { fetchDatasets, deleteDatasets, editDatasetsItem };