
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase";
import { addAlert } from "../../ui/components/alert/push.alert";



const getResumeURL = async (email: any) => {
    if (!email) {
        addAlert("danger", "Invalid parameters!");
        return;
    }
    try {
        const bannerRef = ref(storage, `users_resume/${email}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};
const getVideoURL = async (id: string) => {
    if (!id) {
        addAlert("danger", "Invalid parameters!");
        return;
    }
    console.log("getting..")
    try {
        const bannerRef = ref(storage, `project_videos/video_${id}`);
        const bannerURL = await getDownloadURL(bannerRef);
        return bannerURL;
    } catch (error) {
        return null;
    }
};

export { getResumeURL, getVideoURL };