import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getNewsSuccessAction } from "../../store/reducers/slice/news";
const fetchNews = async () => {
    try {
        const newsCollectionRef = collection(db, "news");
        const querySnapshot: any = await getDocs(newsCollectionRef);
        const fetchedNews: any = [];
        const fetchPromises = querySnapshot.docs.map(async (doc: any) => {
            const data = doc._document.data.value.mapValue.fields;
            const _id = doc._document.key.path.segments[6] || null;
            const description = data.description.stringValue;
            const datetime1 = data.timestamp.stringValue;
            const title = data.title.stringValue;
            fetchedNews.push({ _id, title, datetime1, description });
        });
        await Promise.all(fetchPromises);
        AppReduxStore.dispatch(getNewsSuccessAction(fetchedNews));
    } catch (error) {
        console.error("Error fetching news:", error);
    }

};


async function deleteNews(newsItemId: string) {
    if (!confirm("Are you sure want to delete this item?")) return;
    if (newsItemId === null) { alert("Invalid News ID"); return; }
    try {
        const newsDocRef = doc(db, "news", newsItemId);
        await deleteDoc(newsDocRef);
        alert("News item and image deleted successfully!");
        location.reload();
    } catch (error) {
        ;
        alert("Error deleting News!");
    }
}

async function editNewsItem(newsItemId: string, newData: any) {
    try {
        const newsDocRef = doc(db, "news", newsItemId);
        const newsDocSnapshot = await getDoc(newsDocRef);
        const existingData = newsDocSnapshot.data();
        const updatedData = { ...existingData, ...newData };
        await setDoc(newsDocRef, updatedData, { merge: true });

        alert("News item edited successfully.");
    } catch (error) {
        ;
        alert("Error editing news!");
    }
}


export { fetchNews, deleteNews, editNewsItem };