import Const from '../const/Const'
import { commonRequest, getAxios, init  } from './common';

import auth from './moduls/auth'

/**
 * 中央 API 封装
 */
const api = {

  getAxios,
  init,

  /* Moduls */
  
  auth,
  
  /* Un moduled api */

  getApiRoot() {
    return commonRequest(getAxios().get(Const.API_ROOT));
  },
}

export type LoadStatus = 'notload'|'success'|'failed'|'loading' ;
export * from './common';
export default api;
