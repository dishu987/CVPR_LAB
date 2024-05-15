import { arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getSubAreasSuccessAction } from "../../store/reducers/slice/getsubareas";
const fetchSubAreas = async () => {
    try {
        const SubAreasCollectionRef = collection(db, "research_subitems");
        const querySnapshot: any = await getDocs(SubAreasCollectionRef);
        const fetchedSubAreas: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const description = data?.description.stringValue;
            const researchArea = data?.researchArea;
            const projects = data?.projects?.arrayValue?.values;
            const title = data?.title?.stringValue;
            fetchedSubAreas.push({ _id, title, description, researchArea, projects });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getSubAreasSuccessAction(fetchedSubAreas));
    } catch (error) {
        console.error("Error fetching SubAreas:", error);
    }

};


async function deleteSubAreas(SubAreasItemId: string, researchAreaId: string) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    if (!SubAreasItemId || !researchAreaId) {
        alert("Invalid SubAreas or ResearchArea ID");
        return;
    }

    try {
        const SubAreasDocRef = doc(db, "research_subitems", SubAreasItemId);
        await deleteDoc(SubAreasDocRef);
        const researchAreaRef = doc(db, "ResearchArea", researchAreaId);
        await updateDoc(researchAreaRef, {
            subareas: arrayRemove(SubAreasItemId)
        });
        alert("SubAreas item deleted successfully!");
        window.location.reload();
    } catch (error) {
        console.error("Error deleting SubAreas:", error);
        alert("Error deleting SubAreas!");
    }
}


async function editSubAreasItem(SubAreasItemId: string, newData: any) {
    try {
        const SubAreasDocRef = doc(db, "research_subitems", SubAreasItemId);
        const SubAreasDocSnapshot = await getDoc(SubAreasDocRef);
        const existingData = SubAreasDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(SubAreasDocRef, updatedData, { merge: true });

        alert("SubAreas item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing SubAreas!");
    }
}


export { fetchSubAreas, deleteSubAreas, editSubAreasItem };