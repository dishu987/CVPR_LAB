import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getResearchAreaSuccessAction } from "../../store/reducers/slice/reseacrh.area";


const fetchResearchArea = async () => {
    try {
        const ResearchAreaCollectionRef = collection(db, "ResearchArea");
        const querySnapshot: any = await getDocs(ResearchAreaCollectionRef);
        const fetchedResearchArea: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const title = data?.title.stringValue;
            const subareas = data?.subareas?.arrayValue?.values || [];
            const bannerURL = title ? await getBannerURL(title) : null;
            fetchedResearchArea.push({ _id, title, subareas, bannerURL });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getResearchAreaSuccessAction(fetchedResearchArea));
    } catch (error) {
        console.error("Error fetching ResearchArea:", error);
    }

};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `research_areas_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteResearchArea(ResearchAreaItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (ResearchAreaItemId === null) { alert("Invalid ResearchArea ID"); return; }
    try {
        const ResearchAreaDocRef = doc(db, "ResearchArea", ResearchAreaItemId);
        const ResearchAreaDocSnapshot = await getDoc(ResearchAreaDocRef);
        const data: any = ResearchAreaDocSnapshot.data();
        const imageUrl = data.banner;
        await deleteDoc(ResearchAreaDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `research_areas_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        alert("ResearchArea item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting ResearchArea!");
    }
}

async function editResearchAreaItem(ResearchAreaItemId: string, newData: any) {
    try {
        const ResearchAreaDocRef = doc(db, "ResearchArea_imager", ResearchAreaItemId);
        const ResearchAreaDocSnapshot = await getDoc(ResearchAreaDocRef);
        const existingData = ResearchAreaDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(ResearchAreaDocRef, updatedData, { merge: true });

        alert("ResearchArea item edited successfully.");
    } catch (error) {
        console.log(error);
        alert("Error editing ResearchArea!");
    }
}


export { fetchResearchArea, deleteResearchArea, editResearchAreaItem };