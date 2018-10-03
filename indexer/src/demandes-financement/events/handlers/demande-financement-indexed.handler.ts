import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { DemandeFinancementIndexedEvent } from '../impl/demande-financement-indexed.event';

@EventsHandler(DemandeFinancementIndexedEvent)
export class DemandeFinancementIndexedEventHandler implements IEventHandler<DemandeFinancementIndexedEvent> {
  async handle(event: DemandeFinancementIndexedEvent) {
    Logger.log(clc.yellowBright('Async DemandeFinancementIndexedEvent...'));
  }
}