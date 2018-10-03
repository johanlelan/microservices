import * as amqp from 'amqplib';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class RabbitMQClient extends ClientProxy {
  private server: amqp.Connection;
  constructor(
    private readonly host: string,
    private readonly queue: string) {
      super();
    }

  protected async sendSingleMessage(messageObj, callback: (err, result, isDisposed?: boolean) => void) {
    const queues = this.getQueues();
    const sub = queues.in;
    const pub = queues.out;

    const channel = await this.server.createChannel();
    channel.assertQueue(sub, { durable: true, exclusive: false });
    channel.assertQueue(pub, { durable: true, exclusive: false });

    channel.consume(pub, (message) => this.handleMessage(message, this.server, callback), { noAck: true });
    channel.sendToQueue(sub, Buffer.from(JSON.stringify(messageObj)));
  }

  private handleMessage(message, server, callback: (err, result, isDisposed?: boolean) => void) {
    const { content } = message;
    const { err, response, isDisposed } = JSON.parse(content.toString());
    if (isDisposed) {
      server.close();
    }
    callback(err, response, isDisposed);
  }

  private getQueues() {
    return { out: `${this.queue}_out`, in: `${this.queue}_in` };
  }

  async connect(): Promise<any> {
    this.server = await amqp.connect(this.host);
  }

  close(): any {
    Logger.log('[AMQP] close server');
    return this.server.close();
  }

  protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): void {
    this.server.createChannel().then(channel => {
      const queues = this.getQueues();
      const sub = queues.in;
      const pub = queues.out;
      channel.assertQueue(sub, { durable: true, exclusive: false });
      channel.sendToQueue(sub, Buffer.from(JSON.stringify({
        pattern: packet.pattern,
        data: packet.data,
      })));
      channel.consume(pub, (message) => this.handleMessage(message, this.server, (err, response, isDisposed) => {
        return callback({
          err, response, isDisposed,
        });
      }), { noAck: true });
    });
  }
}