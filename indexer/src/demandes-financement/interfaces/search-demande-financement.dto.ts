export class SearchDemandeFinancementDto {
  readonly limit: number;
  readonly skip: number;
  readonly filter: string;
  readonly sort: string;
  readonly select: string;
}