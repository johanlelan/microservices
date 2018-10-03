import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { IndexDemandeFinancementCommand } from '../impl/index-demande-financement.command';
import { DemandeFinancement } from '../../models/demande-financement.model';
import { SearchService } from '../../../search/search.service';

@CommandHandler(IndexDemandeFinancementCommand)
export class IndexDemandeFinancementCommandHandler implements ICommandHandler<IndexDemandeFinancementCommand> {
  constructor(
    private readonly searchService: SearchService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: IndexDemandeFinancementCommand, resolve: (value?) => void) {
    const DemandeFinancementModel = this.publisher.mergeClassContext(DemandeFinancement);
    const newDemandeFinancement = new DemandeFinancementModel(this.searchService);
    await newDemandeFinancement.createFrom(command.demandeFinancement);
    await newDemandeFinancement.index();
    await newDemandeFinancement.commit();
    return resolve(newDemandeFinancement.wrap());
  }
}