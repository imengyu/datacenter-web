import config from './config'
import { commonRequest, axios } from './common';
import CommonUtils from '../utils/CommonUtils';

export function buildParams(params : Array<string>) {
  var rs = '';
  if(params && params.length > 0) {
    for(let i = 0; i < params.length; i++) {
      if(i == 0) rs = params[i];
      else rs += '/' + params[i];
    }
  }
  return rs
}
export function buildSearchKeyPars(querys : object) {
  var rs = '';
  if(querys) {
    var keys = Object.keys(querys), j = 0;
    for(let i = 0; i < keys.length; i++) {
      if(!CommonUtils.isNullOrEmpty(querys[keys[i]])){
        if(j == 0) rs = '?' + keys[i] + '=' + querys[keys[i]];
        else rs += '&' + keys[i] + '=' + querys[keys[i]];
        j++;
      }
    }
  }
  return rs
}
/**
 * 通用资源请求类
 */
export class CommonRestfulRequest {

  /**
   * api 子路径
   */
  public subResKey : string;

  /**
   * 创建 通用资源请求类
   * @param subResKey api 子路径
   */
  public constructor(subResKey : string) {
    this.subResKey = subResKey;
  }

  protected buildSearchKeyPars(querys : object) {
    return buildSearchKeyPars(querys);
  }

  protected buildParams(params : Array<string>) {
    return buildParams(params);
  }

  protected getApiPath() { return config.getApiPath() }

  /**
   * 请求分页
   * @param page 页码 0 开始
   * @param pageSize 页大小
   * @param searchKeys 搜索筛选键值
   */
  public getPage(page : number, pageSize : number, querys = {}, appendParams = [], prependParams = []) {
    return commonRequest(axios.get(config.getApiPath() + `/${this.subResKey}` +
      buildParams(prependParams) + 
      `/${page}/${pageSize}/` + 
      buildParams(appendParams) + 
      buildSearchKeyPars(querys)));
  }

  /**
   * 请求资源
   * @param id 资源ID
   */
  public get(id : number, querys = {}, appendParams = [], prependParams = []) {
    return commonRequest(
      axios.get(config.getApiPath() + `/${this.subResKey}` + 
        buildParams(prependParams) + `/${id}` + buildParams(appendParams) + 
        buildSearchKeyPars(querys)));
  }
  /**
   * 添加资源
   * @param data 资源数据
   */
  public add(data : any, querys = {}, appendParams = []) {
    return commonRequest(axios.post(config.getApiPath() + `/${this.subResKey}` + buildParams(appendParams) + 
      buildSearchKeyPars(querys), data));
  }
  /**
   * 更新资源
   * @param id 资源ID
   * @param data 资源数据
   */
  public update(id : number, data : any, querys = {}, appendParams = [], prependParams = []) {
    return commonRequest(axios.put(config.getApiPath() + `/${this.subResKey}` + 
      buildParams(prependParams) + `/${id}` + buildParams(appendParams) + 
      buildSearchKeyPars(querys), data));
  }
  /**
   * 删除资源
   * @param id 资源ID
   */
  public delete(id : number, querys = {}, appendParams = [], prependParams = []) {
    return commonRequest(axios.delete(config.getApiPath() + `/${this.subResKey}` + 
      buildParams(prependParams) + `/${id}` + buildParams(appendParams) + 
      buildSearchKeyPars(querys)));
  }
}