
import { AppReduxStore } from "../../store";
import { getUserAuthLogoutAction } from "../../store/reducers/slice/auth";
import handleError from "./httpErrorHandler";

export default function useHttpInterceptors(httpService: any) {
  httpService.interceptors.request.use((request: any) => {
    return request;
  });

  httpService.interceptors.response.use(
    (res: any) => {
      if (res?.data?.success === 0 && res?.data?.message === "Token not found in request") {
        alert("Session has been Expired. Login again to get back to your account.")
        AppReduxStore.dispatch(getUserAuthLogoutAction());
        location.href = "/login"
      }
      else {
        return res;
      }
    },
    (error: any) => {
      if (error.response) {
        // if (isTokenExpired(error.response)) {
        //   const refresh = "";
        //   AppReduxStore.dispatch(getTokenExpiredAction(refresh));
        // } else {
        //   handleError(error.response.status);
        // }
      }
      handleError(error.response.status);
      return Promise.reject(error);
    }
  );
}

