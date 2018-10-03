import { DemandeFinancementController } from './demande-financement.controller';
import { DemandeFinancementService } from './demande-financement.service';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { DemandeFinancementSagas } from './sagas/demande-financement.saga';

@Module({
  imports: [CQRSModule, ElasticsearchModule.register({
    host: process.env.ES_URL || 'http://localhost:9200',
    // log: 'trace',
  })],
  controllers: [DemandeFinancementController],
  providers: [
    SearchService,
    DemandeFinancementService,
    DemandeFinancementSagas,
    ...CommandHandlers,
    ...EventHandlers,
  ],
})
export class DemandeFinancementModule implements OnModuleInit{
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly demandeFinancementSagas: DemandeFinancementSagas,
  ) {}

  onModuleInit() {
    this.command$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
    this.event$.combineSagas([
      this.demandeFinancementSagas.demandeFinancementIsIndexed,
    ]);
  }
}