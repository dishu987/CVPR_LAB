import { catchError, from, map, mergeMap, of } from "rxjs";
import { ofType } from "redux-observable";
import {
    getUserAuthFailedAction,
    getUserAuthRequestAction,
    getUserAuthSuccessAction,
} from "../reducers/slice/auth";
import UserAuthService from "../../services/auth/login";

export const getAuthEpic = (action$: any) => {
    return action$.pipe(
        ofType(getUserAuthRequestAction),
        mergeMap((action: any) =>
            from(UserAuthService.getauth(action.payload)).pipe(
                map((response: any) => {
                    if (response.data) {
                        if (response.data.success === 1) {
                            window.location.href = "/";
                        }
                        if (response.data.status === 422) {
                            alert(response.data.message)
                            return getUserAuthFailedAction(response.data)
                        }
                        return getUserAuthSuccessAction(response.data);
                    } else {
                        throw response;
                    }
                }),
                catchError(() => {
                    const result = {
                        message: "Email or Password Wrong",
                    };
                    return of(getUserAuthFailedAction(result));
                })
            )
        )
    );
};
