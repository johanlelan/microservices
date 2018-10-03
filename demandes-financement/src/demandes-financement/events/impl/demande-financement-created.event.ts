import { IEvent } from '@nestjs/cqrs';
import { DemandeFinancementEvent } from './demande-financement.event';

export class DemandeFinancementCreatedEvent extends DemandeFinancementEvent {
  constructor(
    public readonly demandeFinancementId: string,
    public readonly content: any) {
      super();
    }
  getAggregateId(): string {
    return this.demandeFinancementId;
  }
}