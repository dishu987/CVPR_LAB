import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getGallerySuccessAction } from "../../store/reducers/slice/gallery";


const fetchGallery = async () => {
    try {
        const GalleryCollectionRef = collection(db, "gallery_images");
        const querySnapshot: any = await getDocs(GalleryCollectionRef);
        const fetchedGallery: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const id = data.id.stringValue;
            console.log(data);
            const datetime = data.timestamp.timestampValue;
            const bannerURL = id ? await getBannerURL(id) : null;
            fetchedGallery.push({ _id, datetime, bannerURL });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getGallerySuccessAction(fetchedGallery));
    } catch (error) {
        console.error("Error fetching Gallery:", error);
    }

};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `gallery_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteGallery(GalleryItemId: string, ref_: boolean) {
    if (!ref_) {
        if (!confirm("Are you sure want to delete this item?")) return;
        if (GalleryItemId === null) { alert("Invalid Gallery ID"); return; }
    }
    if (GalleryItemId === null) return;
    try {
        const GalleryDocRef = doc(db, "gallery_images", GalleryItemId);
        const GalleryDocSnapshot = await getDoc(GalleryDocRef);
        const data: any = GalleryDocSnapshot.data();
        const imageUrl = data.banner;
        await deleteDoc(GalleryDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `gallery_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        if (!ref_) {
            alert("Gallery item and image deleted successfully!");
            location.reload();
        }

    } catch (error) {
        console.log(error);
        if (!ref_) alert("Error deleting Gallery!");
    }
}

async function deleteMultiple(arr: string[]) {
    for (let i = 0; i < arr.length; i++) {
        await deleteGallery(arr[i], true);
    }
    alert("Gallery Images deleted successfully!");
    location.reload();
}


export { fetchGallery, deleteGallery, deleteMultiple };