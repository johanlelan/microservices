import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RabbitMQServer } from './transport/rabbitmq-server';

async function bootstrap() {
  const options = {
    url: process.env.AMQP_URL || 'amqp://localhost',
    retryDelay: 1000,
  };
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new RabbitMQServer(options.url, 'demandes-financement'),
  });
  await app.listenAsync().then(() => {
    Logger.log(`demande-financement microservice listening on ${options.url}`);
  });
}
bootstrap().catch(err => {
  Logger.error(err);
});