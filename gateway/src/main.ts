import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as Debug from 'debug';
import { Transport } from '@nestjs/microservices';
import { RabbitMQServer } from './transport/rabbitmq-server';

const debug = Debug('main');
const error = Debug('main:error');

async function bootstrap() {
  const port = 3000;
  const options = {
    url: process.env.AMQP_URL || 'amqp://localhost',
    retryDelay: 1000,
  };
  const app = await NestFactory.create(AppModule, {
    strategy: new RabbitMQServer(options.url, 'gateway'),
  });
  await app.listen(port);
  debug('Application started on %d', port);
}
bootstrap().catch((err) => {
  error('stacktrace %j', err.stack);
  Logger.error(`Can not start application ${JSON.stringify(err)}`);
});
