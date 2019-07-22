export class AlertModel {
  constructor(public type: string,
    public timeout: number,
    public msg: string
  ) { };
}
