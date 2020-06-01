import config from './config'
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

  config
}

export type LoadStatus = 'notload'|'success'|'failed'|'loading' ;
export * from './common';
export default api;
