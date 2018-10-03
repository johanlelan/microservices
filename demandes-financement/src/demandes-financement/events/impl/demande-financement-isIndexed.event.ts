import { IEvent } from '@nestjs/cqrs';
import { DemandeFinancementEvent } from './demande-financement.event';

export class DemandeFinancementIsIndexedEvent extends DemandeFinancementEvent {
  constructor(
      public readonly demandeFinancementId: string,
    ) {
      super();
    }

    getAggregateId(): string {
      return this.demandeFinancementId;
    }
}