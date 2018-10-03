import { IEvent } from '@nestjs/cqrs';
import { DemandeFinancementEvent } from './demande-financement.event';

export class StatusChangedEvent extends DemandeFinancementEvent {
  constructor(
      public readonly demandeFinancementId: string,
      public readonly status: string,
      public readonly oldStatus: string) {
        super();
      }

  getAggregateId(): string {
    return this.demandeFinancementId;
  }
}