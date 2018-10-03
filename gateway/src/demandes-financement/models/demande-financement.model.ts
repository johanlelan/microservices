import { AggregateRoot } from '@nestjs/cqrs';

export class DemandeFinancement extends AggregateRoot {
  readonly id: string;
  status: string;
  title: string;
  active: boolean = false;

  constructor(id?: string) {
    super();
    if (id) {
      this.id = id;
    }
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