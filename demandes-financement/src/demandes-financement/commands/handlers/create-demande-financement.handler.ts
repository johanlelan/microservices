import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateDemandeFinancementCommand } from '../impl/create-demande-financement.command';
import { DemandeFinancement } from '../../models/demande-financement.model';
import { EventRepository } from '../../repository/event.repository';

@CommandHandler(CreateDemandeFinancementCommand)
export class CreateDemandeFinancementHandler implements ICommandHandler<CreateDemandeFinancementCommand> {
  constructor(
    private readonly repository: EventRepository,
    private readonly publisher: EventPublisher,
    ) {}

  async execute(command: CreateDemandeFinancementCommand, resolve: (value?) => void) {
    const DemandeFinancementModel = this.publisher.mergeClassContext(DemandeFinancement);
    const newDemandeFinancement = new DemandeFinancementModel();
    newDemandeFinancement.createFrom(command.createDemandeFinancementDto);
    newDemandeFinancement.getUncommittedEvents().forEach(event => {
      this.repository.save(event);
    });
    newDemandeFinancement.commit();
    return resolve(newDemandeFinancement);
  }
}