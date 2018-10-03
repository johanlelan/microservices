import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DemandeFinancementDeletedEvent } from '../impl/demande-financement-deleted.event';
import { Client, ClientProxy } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { DemandeFinancementIsIndexedEvent } from '../impl/demande-financement-isIndexed.event';

@EventsHandler(DemandeFinancementIsIndexedEvent)
export class DemandeFinancementIsIndexedEventHandler implements IEventHandler<DemandeFinancementIsIndexedEvent> {
  async handle(event: DemandeFinancementIsIndexedEvent) {
    Logger.log(clc.yellowBright('Async DemandeFinancementIsIndexedEvent...'));
  }
}