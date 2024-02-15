import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getPhdSuccessAction } from "../../store/reducers/slice/phd.students";
import { getDownloadURL, ref } from "firebase/storage";

const fetchphd = async () => {
    try {
        const phdCollectionRef = collection(db, "phdStudents");
        const querySnapshot: any = await getDocs(phdCollectionRef);
        const fetchedphd: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const banner = data.profileImage.stringValue;
            const profileImage = banner ? await getBannerURL(banner) : null;
            fetchedphd.push({ _id, data, profileImage });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getPhdSuccessAction(fetchedphd));
    } catch (error) {
        console.error("Error fetching phd:", error);
    }
};


async function deletephd(phdItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (phdItemId === null) { alert("Invalid phd ID"); return; }
    try {
        const phdDocRef = doc(db, "phdStudents", phdItemId);
        await deleteDoc(phdDocRef);
        alert("phd item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting phd!");
    }
}
const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `/peoples/phd_profile_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function editphdItem(phdItemId: string, newData: any) {
    try {
        const phdDocRef = doc(db, "phd", phdItemId);
        const phdDocSnapshot = await getDoc(phdDocRef);
        const existingData = phdDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(phdDocRef, updatedData, { merge: true });

        alert("phd item edited successfully.");
    } catch (error) {
        console.log(error);
        alert("Error editing phd!");
    }
}


export { fetchphd, deletephd, editphdItem };