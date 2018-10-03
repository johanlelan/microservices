import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { DemandeFinancementController } from './demande-financement.controller';
import { DemandeFinancementService } from './demande-financement.service';
import { OnModuleInit, Module, CacheModule } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DemandeFinancementSagas } from './sagas/demande-financement.saga';
import { EventRepository } from './repository/event.repository';

@Module({
  imports: [CQRSModule, CacheModule.register()],
  providers: [
    DemandeFinancementService,
    DemandeFinancementSagas,
    EventRepository,
    ...CommandHandlers,
    ...EventHandlers,
  ],
  controllers: [DemandeFinancementController],
})
export class DemandeFinancementModule implements OnModuleInit {
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
      this.demandeFinancementSagas.indexNewDemandeFinancement,
    ]);
  }
}