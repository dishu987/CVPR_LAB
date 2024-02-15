export interface UserAuthInterface {
    data: {
        name: string;
        email: string;
        designation: string;
        token: string;
        message?: string | null;
    };
    isLoading: false;
    isSuccessful: false;
    isExpired: false;
    error: {};
}