import { API } from "../api-client";
import { ApiConstants } from "../../utils/api.constants";

export default class UserAuthService {
    static getauth = (data: any) => {
        console.log(data);
        return API.post(ApiConstants.getauth, data);
    };
}
