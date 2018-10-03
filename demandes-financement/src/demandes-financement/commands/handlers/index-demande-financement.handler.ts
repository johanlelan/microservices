import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RabbitMQClient } from '../../../transport/rabbitmq-client';
import { IndexDemandeFinancementCommand } from '../impl/index-demande-financement.command';
import { Logger } from '@nestjs/common';

@CommandHandler(IndexDemandeFinancementCommand)
export class IndexDemandeFinancementHandler implements ICommandHandler<IndexDemandeFinancementCommand> {
  private client: RabbitMQClient;
  constructor() {
      this.client = new RabbitMQClient(process.env.AMQP_URL || 'amqp://localhost', 'indexer');
  }

  async execute(command: IndexDemandeFinancementCommand, resolve: (value?) => void) {
    await this.client.connect();
    await this.client.sendSingleMessage({
      pattern: { cmd: 'indexDemandeFinancement' },
      data: command.demandeFinancement,
    }, (err, response, isDisposed) => {
      if (err) {
        Logger.error(err);
      }
      return resolve(response);
     });
  }
}