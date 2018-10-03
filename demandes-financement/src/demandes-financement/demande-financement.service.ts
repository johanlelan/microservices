import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateDemandeFinancementDto } from './interfaces/create-demande-financement.dto';
import { CreateDemandeFinancementCommand } from './commands/impl/create-demande-financement.command';
import { ChangeStatusDemandeFinancementCommand } from './commands/impl/change-status-demande-financement.command';
import { FindDemandeFinancementDto } from './interfaces/find-demande-financement.dto';
import { DemandeFinancement } from './models/demande-financement.model';
import { DeleteDemandeFinancementCommand } from './commands/impl/delete-demande-financement.command';
import { EventRepository } from './repository/event.repository';
import { IsIndexedDemandeFinancementCommand } from './commands/impl/isIndexed-demande-financement.command';

@Injectable()
export class DemandeFinancementService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async create(createDemandeFinancementDto: CreateDemandeFinancementDto): Promise<DemandeFinancement> {
    const demandeFinancement = await this.commandBus.execute(
      new CreateDemandeFinancementCommand(createDemandeFinancementDto),
    );
    return Promise.resolve(demandeFinancement.wrap());
  }

  async removeOneById(demandeFinancementId: string) {
    await this.commandBus.execute(
      new DeleteDemandeFinancementCommand(demandeFinancementId),
    );
  }

  async changeStatus(demandeFinancementId: string, status: string) {
    await this.commandBus.execute(
      new ChangeStatusDemandeFinancementCommand(demandeFinancementId, status),
    );
  }

  async setIsIndexed(demandeFinancementId: string) {
    await this.commandBus.execute(
      new IsIndexedDemandeFinancementCommand(demandeFinancementId),
    );
  }
}
