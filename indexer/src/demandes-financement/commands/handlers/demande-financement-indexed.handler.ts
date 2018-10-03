import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { DemandeFinancement } from '../../models/demande-financement.model';
import { DemandeFinancementIndexedCommand } from '../impl/demande-financement-indexed.command';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMQClient } from '../../../transport/rabbitmq-client';
import { Logger } from '@nestjs/common';

@CommandHandler(DemandeFinancementIndexedCommand)
export class DemandeFinancementIndexedCommandHandler implements ICommandHandler<DemandeFinancementIndexedCommand> {
  private client: RabbitMQClient;
  constructor() {
    this.client = new RabbitMQClient(process.env.AMQP_URL || 'amqp://localhost', 'demandes-financement');
  }

  async execute(command: DemandeFinancementIndexedCommand, resolve: (value?) => void) {
    const pattern = { cmd: 'demandeFinancementIndexed' };
    await this.client.connect();
    await this.client.sendSingleMessage({
      pattern,
      data: command.demandeFinancementId,
    }, (err, response, isDisposed) => {
      if (err) {
        Logger.error(err);
      }
      if (isDisposed) {
        Logger.log('Send indexedDemandeFinancement to demandes-financement microservice', command.demandeFinancementId);
      }
      return resolve(response);
     });
  }
}