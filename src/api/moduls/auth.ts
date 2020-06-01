import config from '../config'
import { commonRequest, axios } from './../common';

export default {
  /**
   * 登录
   * @param loginData 
   */
  login(loginData) {
    return commonRequest(axios.post(config.getApiPath() + '/auth', loginData));
  },
  /**
   * 退出登录
   */
  logout() {
    return commonRequest(axios.get(config.getApiPath() + '/auth/end'));
  },
  /**
   * 获取当前用户登录信息
   */
  getAuthInfo() {
    return commonRequest(axios.get(config.getApiPath() + '/auth'));
  },
  /**
   * 获取用户信息
   * @param userId 
   */
  getUserInfo(userId : number) {
    return commonRequest(
      axios.get(config.getApiPath() + `/user/${userId}`), 
    );
  },
}