import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteDemandeFinancementCommand } from '../impl/delete-demande-financement.command';
import { EventRepository } from '../../repository/event.repository';
import { DemandeFinancement } from '../../models/demande-financement.model';
import { IsIndexedDemandeFinancementCommand } from '../impl/isIndexed-demande-financement.command';

@CommandHandler(IsIndexedDemandeFinancementCommand)
export class IsIndexedDemandeFinancementHandler implements ICommandHandler<IsIndexedDemandeFinancementCommand> {
  constructor(
    private readonly repository: EventRepository,
    private readonly publisher: EventPublisher,
    ) {}

  async execute(command: IsIndexedDemandeFinancementCommand, resolve: (value?) => void) {
    const history = await this.repository.findByAggregateId(command.demandeFinancementId);
    const demandeFinancement = this.publisher.mergeObjectContext(
      DemandeFinancement.loadFromHistory(history),
    );
    demandeFinancement.setIsIndexed(true);
    demandeFinancement.getUncommittedEvents().forEach(event => {
      this.repository.save(event);
    });
    demandeFinancement.commit();
    return resolve(demandeFinancement);
  }
}