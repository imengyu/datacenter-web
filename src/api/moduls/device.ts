import { CommonRestfulRequest } from "../CommonRestfulRequest";
import { commonRequest, axios } from "../common";

class DeviceApi extends CommonRestfulRequest {
  constructor() {
    super('device');
  }

  updateDeviceEnableState(id: number, enable : boolean) {
    return commonRequest(axios.put(this.getApiPath() + `/${this.subResKey}/${id}/state?enable=${enable}`));
  }
  getDeviceState(id: number) {
    return commonRequest(axios.get(this.getApiPath() + `/${this.subResKey}/${id}/state`));
  }
  getAllDeviceOverview() {
    return commonRequest(axios.get(this.getApiPath() + `/${this.subResKey}/overview`));
  }
}

export default new DeviceApi();