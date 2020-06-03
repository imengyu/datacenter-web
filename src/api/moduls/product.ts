import { CommonRestfulRequest } from "../CommonRestfulRequest";

class ProductApi extends CommonRestfulRequest {
  constructor() {
    super('product');
  }
}

export default new ProductApi();