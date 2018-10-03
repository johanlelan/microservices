import { ICommand } from '@nestjs/cqrs';

export class DemandeFinancementIndexedCommand implements ICommand {
  constructor(
    public readonly demandeFinancementId: string,
  ) {}
}