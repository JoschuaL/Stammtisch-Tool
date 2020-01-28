
export interface AuthResponse {
    status: string;
    error: string;
    user_data: UserData;
}

export interface UserData {
    name: string;
    access_token: string;
    locations: Array<string>;
}
