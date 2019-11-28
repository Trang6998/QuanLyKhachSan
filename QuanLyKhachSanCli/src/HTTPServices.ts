import axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    AxiosInstance,
    AxiosAdapter,
    Cancel,
    CancelToken,
    CancelTokenSource,
    Canceler
} from 'axios';
import APIS from '@/apisServer'
const config: AxiosRequestConfig = {
    baseURL: APIS.BASE_API,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    timeout: 10000,
    responseType: 'json',
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    onUploadProgress: (progressEvent: any) => { },
    onDownloadProgress: (progressEvent: any) => { },
    cancelToken: new axios.CancelToken((cancel: Canceler) => { })
};

export const HTTP: AxiosInstance = axios.create(config);