import { DataState } from "../enum/DataState.enum";

export interface State<T> {
    dataState: DataState;
    appData? : T;
    error?: string;
}