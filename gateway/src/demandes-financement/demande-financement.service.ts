import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, ClientProxy, Client } from '@nestjs/microservices';
import { CreateDemandeFinancementDto } from './interfaces/create-demande-financement.dto';
import { CreateDemandeFinancementCommand } from './commands/impl/create-demande-financement.command';
import { ChangeStatusDemandeFinancementCommand } from './commands/impl/change-status-demande-financement.command';
import { FindDemandeFinancementDto } from './interfaces/find-demande-financement.dto';
import { DemandeFinancement } from './models/demande-financement.model';
import { JsonPatchOperationDto } from 'common/interfaces/json-patch.dto';
import { DeleteDemandeFinancementCommand } from './commands/impl/delete-demande-financement.command';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { Observable } from 'rxjs';
import { RabbitMQClient } from '../transport/rabbitmq-client';

import * as request from 'request';
import * as rp from 'request-promise';

@Injectable()
export class DemandeFinancementService {
  private client: ClientProxy;

  constructor() {
    this.client = new RabbitMQClient(process.env.AMQP_URL || 'amqp://localhost', 'demandes-financement');
  }

  async findOneById(demandeFinancementId: string): Promise<DemandeFinancement> {
    const response = await rp.get({
      url: (process.env.ES_URL || 'http://localhost:9200') + `/indexer/demandes-financement/${demandeFinancementId}`,
      json: true,
    });
    return response._source;
  }

  async findAll(findDemandeFinancementDto: FindDemandeFinancementDto): Promise<DemandeFinancement[]> {
    const response = await rp.get({
      url: (process.env.ES_URL || 'http://localhost:9200') + '/indexer/demandes-financement/_search',
      json: true,
    });
    return response.hits.hits.map(hit => hit._source);
  }

  create(createDemandeFinancementDto: CreateDemandeFinancementDto): Observable<DemandeFinancement> {
    const pattern = { cmd: 'createDemandeFinancement' };
    return this.client.send<DemandeFinancement>(pattern, createDemandeFinancementDto);
  }

  async removeOneById(demandeFinancementId: string) {
    const pattern = { cmd: 'deleteDemandeFinancement' };
    this.client.send(pattern, new DeleteDemandeFinancementCommand(demandeFinancementId));
  }

  async updateOneById(demandeFinancementId: string, operations: JsonPatchOperationDto[]) {
    operations.forEach(async operation => {
      switch (operation.path) {
        case '/status':
          const pattern = { cmd: 'changeStatusDemandeFinancement' };
          this.client.send(pattern, new ChangeStatusDemandeFinancementCommand(demandeFinancementId, operation.value));
          break;
        default:
          break;
      }
    });
  }
}
