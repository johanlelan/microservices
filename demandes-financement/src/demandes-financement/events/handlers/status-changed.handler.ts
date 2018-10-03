import * as clc from 'cli-color';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { StatusChangedEvent } from '../impl/status-changed.event';
import { Logger } from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { Transport } from '@nestjs/common/enums/transport.enum';

@EventsHandler(StatusChangedEvent)
export class StatusChangedEventHandler implements IEventHandler<StatusChangedEvent> {
  @Client({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retryDelay: 1000,
    },
  })
  client: ClientProxy;

  async handle(event: StatusChangedEvent) {
    Logger.log(clc.yellowBright('Async StatusChangedEvent...'));
    return await this.client.send<StatusChangedEvent>({cmd: 'statusChangedEvent'}, event);
  }
}