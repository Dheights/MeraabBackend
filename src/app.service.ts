import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<html><h1>Meraab Backend</h1></html>';
  }
}
