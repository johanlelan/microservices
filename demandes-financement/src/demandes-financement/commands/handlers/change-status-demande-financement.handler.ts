import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ChangeStatusDemandeFinancementCommand } from '../impl/change-status-demande-financement.command';
import { EventRepository } from '../../repository/event.repository';
import { DemandeFinancement } from '../../models/demande-financement.model';

@CommandHandler(ChangeStatusDemandeFinancementCommand)
export class ChangeStatusDemandeFinancementHandler implements ICommandHandler<ChangeStatusDemandeFinancementCommand> {
  constructor(
    private readonly repository: EventRepository,
    private readonly publisher: EventPublisher,
    ) {}

  async execute(command: ChangeStatusDemandeFinancementCommand, resolve: (value?) => void) {
    const { id, status } = command;
    const history = await this.repository.findByAggregateId(id);
    const demandeFinancement = this.publisher.mergeObjectContext(
      DemandeFinancement.loadFromHistory(history),
    );
    demandeFinancement.setStatus(status);
    demandeFinancement.getUncommittedEvents().forEach(event => {
      this.repository.save(event);
    });
    await this.repository.save(demandeFinancement);
    demandeFinancement.commit();
    resolve();
  }
}