export class JsonPatchOperationDto {
  readonly op: string;
  readonly path: string;
  readonly value: any;
}