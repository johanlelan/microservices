import { ICommand } from '@nestjs/cqrs';
import { CreateDemandeFinancementDto } from '../../interfaces/create-demande-financement.dto';

export class CreateDemandeFinancementCommand implements ICommand {
  constructor(
    public readonly createDemandeFinancementDto: CreateDemandeFinancementDto,
  ) {}
}