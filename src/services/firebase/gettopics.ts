import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getResearchTopicsSuccessAction } from "../../store/reducers/slice/getTopic";


const fetchResearchTopics = async () => {
    try {
        const ResearchTopicsCollectionRef = collection(db, "research_topics");
        const querySnapshot: any = await getDocs(ResearchTopicsCollectionRef);
        const fetchedResearchTopics: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc.data();
            const _id = doc._document.key.path.segments[6] || null;
            fetchedResearchTopics.push({ _id, ...data });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getResearchTopicsSuccessAction(fetchedResearchTopics));
    } catch (error) {
        console.error("Error fetching ResearchTopics:", error);
    }

};


async function deleteResearchTopics(ResearchTopicsId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (ResearchTopicsId === null) { alert("Invalid ResearchTopics ID"); return; }
    try {
        const ResearchTopicsDocRef = doc(db, "research_topics", ResearchTopicsId);
        await deleteDoc(ResearchTopicsDocRef);
        alert("ResearchTopics item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting ResearchTopics!");
    }
}



export { fetchResearchTopics, deleteResearchTopics };