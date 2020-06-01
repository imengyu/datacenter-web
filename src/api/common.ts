import { AxiosInstance, AxiosResponse } from "axios";

export class CommonApiResult {

  public success = false;
  public code = 0;
  public message = '';
  public data : any;

  public constructor(success = false, code? : number, message? : string, data?) {
    this.success = success;
    if(typeof code !== 'undefined') this.code = code;
    if(typeof message !== 'undefined') this.message = message;
    if(typeof data !== 'undefined') this.data = data;
  }
}
export class CommonApiError {

  public networkError = false;
  public errorMessage : string;
  public errorApiData : CommonApiResult;

  public constructor(networkError = false, errorMessage : string = '', errorApiData ?: CommonApiResult) {
    this.networkError = networkError;
    this.errorMessage = errorMessage;
    if(errorApiData) this.errorApiData = errorApiData;
  }

  public toString() : string {
    return this.errorMessage; 
  }

}

export var axios : AxiosInstance;

export function getAxios() { return axios; };

/**
 * 初始化
 */
export function init(instance : AxiosInstance) {
  axios = instance;
}
/**
 * 
 * @param data 
 */
export function getCommonApiResult(data) {
  return new CommonApiResult(data.success, data.status, data.msg, data.data);
}
/**
 * 通用请求
 * @param promise axios 请求返回的 promise
 */
export function commonRequest(promise : Promise<AxiosResponse>) {
  return new Promise<CommonApiResult>((resolve, reject) => commonResponse(promise, resolve, reject));
}
/**
 * 通用请求返回处理
 * @param promise axios 请求返回的 promise
 * @param resolve promise resolve
 * @param reject promise reject
 */
export function commonResponse(promise : Promise<AxiosResponse>, 
  resolve: (value?: CommonApiResult) => void, reject: (reason?: CommonApiError) => void) {
  promise.then((response) => {
    if(!response){
      reject(new CommonApiError(true, '网络错误'))
    } else if(response.data.success) {
      try{
        if(process.env.NODE_ENV == 'development') {
          console.log('[API Debugger] Request ' + response.config.url + ' success (' + response.status + '), data : ');
          console.dir(response.data.data);
        }
        resolve(getCommonApiResult(response.data));
      }catch(e) {
        if(process.env.NODE_ENV == 'development') 
          console.error('[API Debugger] Catch error in promise : ' + e);
        reject(new CommonApiError(true, '代码错误：' + e))
      }
    }
    else {
      if(process.env.NODE_ENV == 'development') 
        console.error('[API Debugger] Request ' + response.config.url + ' got error from server : ' + response.data.msg + ' (' + response.data.status + ')');
      reject(new CommonApiError(false, response.data.msg, getCommonApiResult(response.data)));
    }
  }).catch((e) => {
    if(process.env.NODE_ENV == 'development') 
      console.error('[API Debugger] Network error : ' + e);
    reject(new CommonApiError(true, '网络错误：' + e))
  });
}