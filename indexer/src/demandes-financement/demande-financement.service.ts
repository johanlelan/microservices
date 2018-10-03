import { Injectable, Logger } from '@nestjs/common';
import { SearchDemandeFinancementDto } from './interfaces/search-demande-financement.dto';
import { DemandeFinancement } from './models/demande-financement.model';
import { SearchService } from '../search/search.service';
import { Observable } from 'rxjs';
import { IndexDemandeFinancementCommand } from './commands/impl/index-demande-financement.command';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class DemandeFinancementService {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  async index(demandeFinancement: DemandeFinancement): Promise<DemandeFinancement> {
    const indexResult = await this.commandBus.execute(
      new IndexDemandeFinancementCommand(demandeFinancement),
    );
    return Promise.resolve(indexResult);
  }

  async removeOneById(demandeFinancementId: string) {

  }

  async changeStatus(demandeFinancementId: string, status: string) {

  }
}
