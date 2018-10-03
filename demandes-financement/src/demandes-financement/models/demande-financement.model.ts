import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { generate } from 'shortid';

import { CreateDemandeFinancementDto } from '../interfaces/create-demande-financement.dto';
import { DemandeFinancementCreatedEvent } from '../events/impl/demande-financement-created.event';
import { StatusChangedEvent } from '../events/impl/status-changed.event';
import { DemandeFinancementDeletedEvent } from '../events/impl/demande-financement-deleted.event';
import { DemandeFinancementIsIndexedEvent } from '../events/impl/demande-financement-isIndexed.event';

export class DemandeFinancement extends AggregateRoot {
  id: string;
  title: string;
  status: string;
  active: boolean = true;
  isIndexed: boolean;

  constructor(id?: string) {
    super();
    if (!id) {
      this.id = generate();
    } else {
      this.id = id;
    }
  }

  /**
   * create a new DemandeFinancement from CreateDemandeFinancementDto
   * @returns DemandeFinancement new demandeFinancement
   */
  public createFrom(createDemandeFinancementDto: CreateDemandeFinancementDto) {
    this.title = createDemandeFinancementDto.title;
    this.status = createDemandeFinancementDto.status;
    if (!this.status) {
      this.status = 'REQUESTED';
    }
    this.apply(new DemandeFinancementCreatedEvent(this.id,
      {
        id: this.id,
        title: this.title,
        status: this.status,
        active: this.active,
      }));
  }

  /**
   * Set DemandeFinancement status
   * @param status new status to set
   * @emits StatusChangedEvent this command should emit a new status changed event
   */
  setStatus(status: string) {
    const oldStatus = this.status;
    this.status = status;
    this.apply(new StatusChangedEvent(this.id, status, oldStatus));
  }

  delete() {
    this.active = false;
    this.apply(new DemandeFinancementDeletedEvent(this.id));
  }

  setIsIndexed(isIndexed: boolean) {
    this.isIndexed = isIndexed;
    this.apply(new DemandeFinancementIsIndexedEvent(this.id));
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

  static loadFromHistory(events) {
    const reducer = (current, event) => {
      if (event.constructor.name === 'DemandeFinancementCreatedEvent') {
        current.id = event.getAggregateId();
        current.title = event.content.title;
        current.status = event.content.status;
        current.active = event.content.active;
      }
      return current;
    };
    // start from empty demande-financement
    const demandeFinancement = events.reduce(reducer, new DemandeFinancement());
    return demandeFinancement;
  }
}