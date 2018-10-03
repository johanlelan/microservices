import { ArgumentMetadata, Pipe, PipeTransform, Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as AJV from 'ajv';

const ajvOptions = { allErrors: true };

@Injectable()
export class JsonValidationPipe implements PipeTransform {
  private ajv: any;
  constructor(private readonly keyRef, private readonly schema) {
    this.ajv = new AJV(ajvOptions);
    this.ajv.addSchema(schema, keyRef);
  }
  async transform(value: any, metadata: ArgumentMetadata) {
    const isValid = this.ajv.validate(this.keyRef, value);
    if (!isValid) {
      Logger.error(`JSON Validation is failed : "${this.ajv.errorsText()}"`);
      throw new BadRequestException(this.ajv.errors);
    }
    else {
      Logger.log('JSON Validation is Successful');
      return value;
    }
  }
}
