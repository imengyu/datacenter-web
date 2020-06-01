import Const from '../../const/Const'
import { commonRequest, axios } from './../common';

export default {
  /**
   * 登录
   * @param loginData 
   */
  login(loginData) {
    return commonRequest(axios.post(Const.API_ROOT + '/auth', loginData));
  },
  /**
   * 退出登录
   */
  logout() {
    return commonRequest(axios.post(Const.API_ROOT + '/auth-end'));
  },
  /**
   * 获取当前用户登录信息
   */
  getAuthInfo() {
    return commonRequest(axios.get(Const.API_ROOT + '/auth'));
  },
  /**
   * 获取用户信息
   * @param userId 
   */
  getUserInfo(userId : number) {
    return commonRequest(
      axios.get(Const.API_ROOT + `/user/${userId}`), 
    );
  },
}