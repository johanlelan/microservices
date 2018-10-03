import { AggregateRoot } from '@nestjs/cqrs';
import { DemandeFinancementIndexedEvent } from '../events/impl/demande-financement-Indexed.event';
import { Logger } from '@nestjs/common';
import { SearchService } from 'search/search.service';
import { Observable } from 'rxjs';

export class DemandeFinancement extends AggregateRoot {
  id: string;
  status: string;
  title: string;
  active: boolean;
  isIndexed: boolean = false;

  constructor(
    private readonly searchService: SearchService,
    id?: string,
  ) {
    super();
    if (id) {
      this.id = id;
    }
  }

  public createFrom(demandeFinancement: DemandeFinancement) {
    this.id = demandeFinancement.id;
    this.title = demandeFinancement.title;
    this.status = demandeFinancement.status;
    this.active = demandeFinancement.active;
    if (!this.status) {
      this.status = 'REQUESTED';
    }
  }

  setIsIndexed(isIndexed: boolean) {
    this.isIndexed = isIndexed;
  }

  async index(): Promise<DemandeFinancement> {
    // call easticsearchClient to add a demandeFinancement
    Logger.log('Index new demande-financement into Elasticsearch');
    const result = await this.searchService.create(this);
    this.apply(new DemandeFinancementIndexedEvent(this.id));
    Logger.log(`Demande-financement ${this.id} indexed into Elasticsearch`);
    return result;
  }

  /**
   * Return a plain JSON from DemandeFinancement instance
   */
  wrap(): any {
    return {
      id: this.id,
      title: this.title,
      status: this.status,
      active: this.active,
    };
  }
}