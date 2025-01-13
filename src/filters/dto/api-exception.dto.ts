import { HttpStatus } from '@nestjs/common';

export default class APIException {
  constructor(
    status: HttpStatus,
    message: string,
    data?: any,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
  public status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  public message: string = 'Internal Server Error';

  public data: any;


}