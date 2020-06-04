import config from './config'
import { getAxios, init  } from './common';

import auth from './moduls/auth'
import product from './moduls/product'
import deviceGroup from './moduls/deviceGroup'
import device from './moduls/device'

/**
 * API 封装
 */
const api = {

  getAxios,
  init,

  /* Moduls */
  
  auth,
  product,
  deviceGroup,
  device,
  
  /* Un moduled api */

  config
}

export type LoadStatus = 'notload'|'success'|'failed'|'loading' ;
export * from './common';
export default api;
