export class Product {
  id : number;
  name : string;
  productKey : string;
  createAt : Date;
  userId : number;
  type : string;

  public constructor() {
    this.id = null;
    this.name = "";
    this.productKey = "";
    this.type = "";
    this.userId = 0;
    this.createAt = new Date()
  }
}