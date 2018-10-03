import { ICommand } from '@nestjs/cqrs';

export class DeleteDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly demandeFinancementId: string,
  ) {}
}