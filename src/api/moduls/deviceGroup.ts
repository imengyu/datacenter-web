import { CommonRestfulRequest } from "../CommonRestfulRequest";
import { commonRequest, axios } from "../common";

class DeviceGroupApi extends CommonRestfulRequest {
  constructor() {
    super('device-group');
  }

  getPageByParentId(parentId : number, pageIndex : number, pageSize : number, querys = {}) {
    return commonRequest(axios.get(this.getApiPath() + `/device-group/${parentId}/group/${pageIndex}/${pageSize}/` + 
      this.buildSearchKeyPars(querys)));
  }
  addByParentId(parentId : number, data : any, querys = {}) {
    return commonRequest(axios.post(this.getApiPath() + `/${this.subResKey}/${parentId}` + this.buildSearchKeyPars(querys), data));
  }

  getTreeDataCurrentUserId() {
    return commonRequest(axios.get(this.getApiPath() + `/${this.subResKey}-tree`));
  }
  getTreeDataCurrentByParentId(parentId : number) {
    return commonRequest(axios.get(this.getApiPath() + `/${this.subResKey}-tree/${parentId}`));
  }
}

export default new DeviceGroupApi();