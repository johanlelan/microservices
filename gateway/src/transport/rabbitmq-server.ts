import * as amqp from 'amqplib';
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Connection } from 'amqplib';
import { Logger } from '@nestjs/common';

export class RabbitMQServer extends Server implements CustomTransportStrategy {
    private server: amqp.Connection = null;
    private channel: amqp.Channel = null;

    constructor(
      private readonly host: string,
      private readonly queue: string) {
        super();
      }

  public async listen(callback: () => void) {
    await this.init();
    this.channel.consume(`${this.queue}_in`, this.handleMessage.bind(this), {
      noAck: true,
    });
  }

  public close() {
    Logger.log('[AMQP] close server');
    this.channel && this.channel.close();
    this.server && this.server.close();
  }

  private async handleMessage(message) {
    const { content } = message;
    const messageObj = JSON.parse(content.toString());

    const handlers = this.getHandlers();
    const pattern = JSON.stringify(messageObj.pattern);
    if (!this.messageHandlers[pattern]) {
        return;
    }

    const handler = this.messageHandlers[pattern];
    const response$ = this.transformToObservable(await handler(messageObj.data)) as Observable<any>;
    response$ && this.send(response$, (data) => this.sendMessage(data));
  }

  private sendMessage(message) {
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.sendToQueue(`${this.queue}_out`, buffer);
  }

  private async init() {
    try {
      this.server = await amqp.connect(this.host);
      this.channel = await this.server.createChannel();
      this.channel.assertQueue(`${this.queue}_in`, { durable: true, exclusive: false });
      this.channel.assertQueue(`${this.queue}_out`, { durable: true, exclusive: false });
    } catch (err) {
      return this.init();
    }
  }
}