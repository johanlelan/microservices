import { ICommand } from '@nestjs/cqrs';
import { ChangeStatusDemandeFinancementDto } from '../../interfaces/change-status-demande-financement.dto';

export class ChangeStatusDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly status: string,
  ) {}
}