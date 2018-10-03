import { ICommand } from '@nestjs/cqrs';

export class PublishDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly demandeFinancementId: string,
  ) {}
}