import { ICommand } from '@nestjs/cqrs';

export class IsIndexedDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly demandeFinancementId: string,
  ) {}
}