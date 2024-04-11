import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { AppReduxStore } from "../../store";
import { getUserAuthLogoutAction, getUserAuthSuccessAction } from "../../store/reducers/slice/auth";

const getUserAuth = async () => {
    console.log("Started!");
    try {
        auth.onAuthStateChanged(async (user: any) => {
            if (user) {
                const q = query(
                    collection(db, "users"),
                    where("email", "==", user.email)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0]; // Access the first (and only) document
                    const data = doc.data();
                    const { email, userType } = data;
                    const isVarified: boolean = user?.emailVerified;
                    console.log({ email, userType, isVarified });
                    AppReduxStore.dispatch(getUserAuthSuccessAction({ email, userType, isVarified }));
                } else {
                    console.log("failed!");
                    AppReduxStore.dispatch(getUserAuthLogoutAction());
                    // location.href = "#/login"
                }
            }
        });
    } catch (error) {
        console.error("Error in getUserAuth:", error);
        AppReduxStore.dispatch(getUserAuthLogoutAction());
    }
};

export { getUserAuth };


