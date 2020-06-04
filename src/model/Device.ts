export class Device {
  id : number;
  name : string;
  remarks : string;
  productId : number;
  groupId : number;
  userId : number;
  enableState : number;
  nowState : number;
  lastUpTime : Date;
  createAt : Date
  authType : number;
  activated : boolean;
  uploadLog : boolean;
  activateTime : Date;
  currentConnectIp : string;

  public constructor() {
    this.id = null;
    this.name = "";
    this.remarks = "";
    this.productId = null;
    this.groupId = null;
    this.userId = null;
    this.enableState = 1;
    this.nowState = 0;
    this.lastUpTime = null;
    this.createAt = new Date()
    this.authType = 0;
    this.activated = false;
    this.currentConnectIp = "";
    this.activateTime = null;
    this.uploadLog = false;
    
  }
}