import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getVisitorsAndInternsSuccessAction } from "../../store/reducers/slice/visintern";

const fetchvisinterns = async () => {
    try {
        const visinternsCollectionRef = collection(db, "visitorsAndInterns");
        const querySnapshot: any = await getDocs(visinternsCollectionRef);
        const fetchedvisinterns: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            fetchedvisinterns.push({ _id, data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getVisitorsAndInternsSuccessAction(fetchedvisinterns));
    } catch (error) {
        console.error("Error fetching Visitor/Intern:", error);
    }

};


async function deletevisinterns(visinternsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (visinternsItemId === null) { alert("Invalid Visitor/Intern ID"); return; }
    try {
        const visinternsDocRef = doc(db, "visitorsAndInterns", visinternsItemId);
        await deleteDoc(visinternsDocRef);
        alert("Visitor/Intern item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting Visitor/Intern!");
    }
}



async function editvisinternsItem(visinternsItemId: string, newData: any) {
    try {
        const visinternsDocRef = doc(db, "visinterns", visinternsItemId);
        const visinternsDocSnapshot = await getDoc(visinternsDocRef);
        const existingData = visinternsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(visinternsDocRef, updatedData, { merge: true });

        alert("visinterns item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing visinterns!");
    }
}


export { fetchvisinterns, deletevisinterns, editvisinternsItem };