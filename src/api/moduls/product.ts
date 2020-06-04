import { CommonRestfulRequest } from "../CommonRestfulRequest";
import { commonRequest, axios } from "../common";

class ProductApi extends CommonRestfulRequest {
  constructor() {
    super('product');
  }

  getListDataCurrentUserId() {
    return commonRequest(axios.get(this.getApiPath() + `/${this.subResKey}-list`));
  }
  
}

export default new ProductApi();