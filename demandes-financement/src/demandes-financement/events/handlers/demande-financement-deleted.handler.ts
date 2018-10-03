import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DemandeFinancementDeletedEvent } from '../impl/demande-financement-deleted.event';
import { Client, ClientProxy } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';

@EventsHandler(DemandeFinancementDeletedEvent)
export class DemandeFinancementDeletedEventHandler implements IEventHandler<DemandeFinancementDeletedEvent> {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retryDelay: 1000,
    },
  })
  client: ClientProxy;

  async handle(event: DemandeFinancementDeletedEvent) {
    Logger.log(clc.yellowBright('Async DemandeFinancementDeletedEvent...'));
    return await this.client.send<DemandeFinancementDeletedEvent>({cmd: 'demandeFinancementDeletedEvent'}, event);
  }
}