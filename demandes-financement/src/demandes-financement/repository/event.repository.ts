import { Injectable } from '@nestjs/common';
import { DemandeFinancement } from '../models/demande-financement.model';
import { FindDemandeFinancementDto } from '../interfaces/find-demande-financement.dto';
import { IEvent } from '@nestjs/cqrs';
import { DemandeFinancementEvent } from '../events/impl/demande-financement.event';

const events = {};

@Injectable()
export class EventRepository {

  constructor() {}

  /**
   * Find all events of an aggregate
   * @param aggregateId
   */
  async findByAggregateId(aggregateId: string): Promise<DemandeFinancementEvent[]> {
    const history = Object.keys(events)
      .map(key => events[key])
      .filter(event => {
        if (event.getAggregateId() === aggregateId) {
          return event;
        }
      });
    return Promise.resolve(history);
  }

  /**
   * Save an event into persistence
   * @param eventToSave event to save
   */
  async save(eventToSave: IEvent): Promise<any> {
    events[(eventToSave as DemandeFinancementEvent).getId()] = eventToSave;
  }
}