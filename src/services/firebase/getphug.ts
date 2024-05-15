import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getPHUGSuccessAction } from "../../store/reducers/slice/pgug.students";

const fetchpgug = async () => {
    try {
        const pgugCollectionRef = collection(db, "pgusStudents");
        const querySnapshot: any = await getDocs(pgugCollectionRef);
        const fetchedpgug: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            fetchedpgug.push({ _id, data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getPHUGSuccessAction(fetchedpgug));
    } catch (error) {
        console.error("Error fetching pgug:", error);
    }

};


async function deletepgug(pgugItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (pgugItemId === null) { alert("Invalid pgug ID"); return; }
    try {
        const pgugDocRef = doc(db, "pgusStudents", pgugItemId);
        await deleteDoc(pgugDocRef);
        alert("pgug item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting pgug!");
    }
}



async function editpgugItem(pgugItemId: string, newData: any) {
    try {
        const pgugDocRef = doc(db, "pgug", pgugItemId);
        const pgugDocSnapshot = await getDoc(pgugDocRef);
        const existingData = pgugDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(pgugDocRef, updatedData, { merge: true });

        alert("pgug item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing pgug!");
    }
}


export { fetchpgug, deletepgug, editpgugItem };