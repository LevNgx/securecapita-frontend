import { DataState } from "../enum/DataState.enum";
import { Events } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMFA?: boolean;
    phone?: string;
}

export interface CustomHttpResponse<T> {
    timeStamp: Date;
    statusCode: number;
    status: string;
    message: string;
    reason?: string;
    developerMessage?: string;
    data?: T;
}

export interface Profile {
    user?: User;
    events?: Events[];
    roles?: Role[];
    access_token: string;
    refresh_token: string;
}