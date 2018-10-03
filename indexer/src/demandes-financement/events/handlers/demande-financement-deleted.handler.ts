import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { DemandeFinancementDeletedEvent } from '../impl/demande-financement-deleted.event';

@EventsHandler(DemandeFinancementDeletedEvent)
export class DemandeFinancementDeletedEventHandler implements IEventHandler<DemandeFinancementDeletedEvent> {
  async handle(event: DemandeFinancementDeletedEvent) {
    Logger.log(clc.yellowBright('Async DemandeFinancementDeletedEvent...'));
  }
}