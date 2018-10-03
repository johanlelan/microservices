import { ICommand } from '@nestjs/cqrs';
import { DemandeFinancement } from '../../models/demande-financement.model';

export class IndexDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly demandeFinancement: DemandeFinancement,
  ) {}
}