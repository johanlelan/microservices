import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DeleteDemandeFinancementCommand } from '../impl/delete-demande-financement.command';
import { EventRepository } from '../../repository/event.repository';
import { DemandeFinancement } from '../../models/demande-financement.model';

@CommandHandler(DeleteDemandeFinancementCommand)
export class DeleteDemandeFinancementHandler implements ICommandHandler<DeleteDemandeFinancementCommand> {
  constructor(
    private readonly repository: EventRepository,
    private readonly publisher: EventPublisher,
    ) {}

  async execute(command: DeleteDemandeFinancementCommand, resolve: (value?) => void) {
    const history = await this.repository.findByAggregateId(command.demandeFinancementId);
    const demandeFinancement = this.publisher.mergeObjectContext(
      DemandeFinancement.loadFromHistory(history),
    );
    demandeFinancement.delete();
    const persistDemandeFinancement = await this.repository.save(demandeFinancement);
    demandeFinancement.commit();
    return resolve(persistDemandeFinancement);
  }
}