import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getPublicationsSuccessAction } from "../../store/reducers/slice/publication";



const fetchPublications = async () => {
    try {
        const PublicationsCollectionRef = collection(db, "publications");
        const querySnapshot: any = await getDocs(PublicationsCollectionRef);
        const fetchedPublications: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            fetchedPublications.push({ _id, data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getPublicationsSuccessAction(fetchedPublications));
    } catch (error) {
        console.error("Error fetching Publications:", error);
    }

};

async function deletePublications(PublicationsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (PublicationsItemId === null) { alert("Invalid Publications ID"); return; }
    try {
        const PublicationsDocRef = doc(db, "publications", PublicationsItemId);
        await deleteDoc(PublicationsDocRef);
        alert("Publications deleted successfully!");
        location.reload();
    } catch (error) {
        console.log(error);
        alert("Error deleting Publications!");
    }
}

async function editPublicationsItem(PublicationsItemId: string, newData: any) {
    try {
        const PublicationsDocRef = doc(db, "Publications", PublicationsItemId);
        const PublicationsDocSnapshot = await getDoc(PublicationsDocRef);
        const existingData = PublicationsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(PublicationsDocRef, updatedData, { merge: true });

        alert("Publications item edited successfully.");
    } catch (error) {
        console.log(error);
        alert("Error editing Publications!");
    }
}


export { fetchPublications, deletePublications, editPublicationsItem };