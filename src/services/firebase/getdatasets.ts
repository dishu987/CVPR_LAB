import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getDatasetsSuccessAction } from "../../store/reducers/slice/datasets";
import { addAlert } from "../../ui/components/alert/push.alert";
const fetchDatasets = async () => {
    try {
        const DatasetsCollectionRef = collection(db, "datasets");
        const querySnapshot: any = await getDocs(DatasetsCollectionRef);
        const fetchedDatasets: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const title = data?.title.stringValue;
            const images = data?.images.arrayValue.values || [];
            let images_: any = [];
            const res = images.map(async (name_: any) => {
                const temp_: string = await getBannerURL(name_.stringValue) || "";
                images_.push({ name: name_?.stringValue, url: temp_ });
            })
            await Promise.all(res);
            const description = data?.description.stringValue;
            fetchedDatasets.push({ _id, title, description, images: images_ });
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
        const images = data.images;
        await deleteDoc(DatasetsDocRef);
        const res = images.map(async (item_: any) => {
            const storageRef = ref(storage, `dataset_images/${item_}`);
            await deleteObject(storageRef);
        })
        await Promise.all(res);
        alert("Datasets item and images deleted successfully!");
        location.reload();
    } catch (error) {
        alert("Error deleting Datasets!");
    }
}
async function deleteDatasetsImage(DatasetsItemId: any, file_name: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (DatasetsItemId === null || !file_name || file_name == null) { alert("Invalid Parameters"); return; }
    try {
        const storageRef = ref(storage, `dataset_images/${file_name}`);
        await deleteObject(storageRef);
        const docRef = doc(db, "datasets", DatasetsItemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const currentImages = data.images || [];
            const updatedImages = currentImages.filter((item_: any) => item_ != file_name);
            await updateDoc(docRef, {
                images: updatedImages,
            });
            addAlert("success", "Datasets item and images deleted successfully!");
        } else {
            addAlert("danger", "Something went wrong!");
        }
        location.reload();
    } catch (error) {
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
        alert("Error editing Datasets!");
    }
}


export { fetchDatasets, deleteDatasets, editDatasetsItem, deleteDatasetsImage };