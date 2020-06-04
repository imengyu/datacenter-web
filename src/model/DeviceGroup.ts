export class DeviceGroup {
  public id : number;
  public name : string;
  public identifier : string;
  public createAt: Date;
  public userId: number;
  public parentId: number; 
  public remarks : string;

  public constructor() {
    this.id = null;
    this.name = "";
    this.remarks = "";
    this.identifier = "";
    this.userId = 0;
    this.createAt = new Date()
  }
}