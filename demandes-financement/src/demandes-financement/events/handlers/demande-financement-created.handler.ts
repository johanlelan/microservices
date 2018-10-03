import * as clc from 'cli-color';
import { IEventHandler, EventsHandler, IEvent } from '@nestjs/cqrs';
import { DemandeFinancementCreatedEvent } from '../impl/demande-financement-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(DemandeFinancementCreatedEvent)
export class DemandeFinancementCreatedEventHandler implements IEventHandler<DemandeFinancementCreatedEvent> {
  async handle(event: DemandeFinancementCreatedEvent) {
    Logger.log(clc.yellowBright('Handle DemandeFinancementCreatedEvent...'));
  }
}