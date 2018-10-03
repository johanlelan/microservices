import { IEvent } from '@nestjs/cqrs';
import { generate } from 'shortid';

export abstract class DemandeFinancementEvent implements IEvent {
  id: string = generate();

  public getId(): string{
    return this.id;
  }
  abstract getAggregateId(): string;
}