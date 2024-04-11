import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getSupervisorsSuccessAction } from "../../store/reducers/slice/supervisors";


const fetchSupervisors = async () => {
    try {
        const SupervisorsCollectionRef = collection(db, "supervisors");
        const querySnapshot: any = await getDocs(SupervisorsCollectionRef);
        const fetchedSupervisors: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc.data();
            const _id = doc._document.key.path.segments[6] || null;
            const banner = data.profileImage;
            const profileImage = banner ? await getBannerURL(banner) : null;
            fetchedSupervisors.push({ _id, data, profileImage });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getSupervisorsSuccessAction(fetchedSupervisors));
    } catch (error) {
        console.error("Error fetching Supervisors:", error);
    }
};

const getBannerURL = async (imageName: any) => {
    try {
        const bannerRef = ref(storage, `/peoples/supervisor_profile_images/${imageName}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

async function deleteSupervisors(SupervisorsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (SupervisorsItemId === null) { alert("Invalid Supervisors ID"); return; }
    try {
        const SupervisorsDocRef = doc(db, "supervisors", SupervisorsItemId);
        const SupervisorsDocSnapshot = await getDoc(SupervisorsDocRef);
        const data: any = SupervisorsDocSnapshot.data();
        const imageUrl = data.profileImage;
        await deleteDoc(SupervisorsDocRef);
        if (imageUrl) {
            const storageRef = ref(storage, `/peoples/supervisor_profile_images/${imageUrl}`);
            await deleteObject(storageRef);
        }
        alert("Supervisors item and image deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting Supervisors!");
    }
}

async function editSupervisorsItem(SupervisorsItemId: string, newData: any) {
    try {
        const SupervisorsDocRef = doc(db, "Supervisors_imager", SupervisorsItemId);
        const SupervisorsDocSnapshot = await getDoc(SupervisorsDocRef);
        const existingData = SupervisorsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(SupervisorsDocRef, updatedData, { merge: true });

        alert("Supervisors item edited successfully.");
    } catch (error) {
        console.log(error);
        alert("Error editing Supervisors!");
    }
}


export { fetchSupervisors, deleteSupervisors, editSupervisorsItem };