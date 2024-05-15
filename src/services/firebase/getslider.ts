import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getSliderSuccessAction } from "../../store/reducers/slice/slider";
const fetchSlider = async () => {
    try {
        const SliderCollectionRef = collection(db, "slider_images");
        const querySnapshot: any = await getDocs(SliderCollectionRef);
        const fetchedSlider: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const banner = data.bannerURL.stringValue;
            const title = data.title.stringValue;
            const bannerURL = banner ? await getBannerURL(banner) : null;
            fetchedSlider.push({ _id, title, bannerURL });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getSliderSuccessAction(fetchedSlider));
    } catch (error) {
        console.error("Error fetching Slider:", error);
    }

};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `slider_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteSlider(SliderItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (SliderItemId === null) { alert("Invalid Slider ID"); return; }
    try {
        const SliderDocRef = doc(db, "slider_images", SliderItemId);
        const SliderDocSnapshot = await getDoc(SliderDocRef);
        const data: any = SliderDocSnapshot.data();
        const imageUrl = data.banner;
        await deleteDoc(SliderDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `slider_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        alert("Slider item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting Slider!");
    }
}

async function editSliderItem(SliderItemId: string, newData: any) {
    try {
        const SliderDocRef = doc(db, "slider_imager", SliderItemId);
        const SliderDocSnapshot = await getDoc(SliderDocRef);
        const existingData = SliderDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(SliderDocRef, updatedData, { merge: true });

        alert("Slider item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing Slider!");
    }
}


export { fetchSlider, deleteSlider, editSliderItem };