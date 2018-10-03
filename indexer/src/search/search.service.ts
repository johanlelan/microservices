import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { DemandeFinancement } from 'demandes-financement/models/demande-financement.model';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async create(demandeFinancement: DemandeFinancement): Promise<DemandeFinancement> {
    const createDocumentParams = {
      index: 'indexer',
      type: 'demandes-financement',
      id: demandeFinancement.id,
      body: demandeFinancement.wrap(),
    };
    return await this.elasticsearchService.index<DemandeFinancement>(createDocumentParams).toPromise();
  }
}