import {  } from 'ts-jest';
import { EventRepository } from './event.repository';
import { IEvent } from '@nestjs/cqrs';
import { DemandeFinancementEvent } from '../events/impl/demande-financement.event';

class TestEvent implements DemandeFinancementEvent {
  constructor(readonly id, readonly aggregateId) {

  }
  getId(): string {
    return this.id;
  }
  getAggregateId(): string {
    return this.aggregateId;
  }
}
describe('Event repository', () => {
  let repository: EventRepository;
  beforeAll(() => {
    repository = new EventRepository();
  });
  test('Should save an event', async () => {
    const event = new TestEvent('1', 'A1');
    return await repository.save(event)
    .then(result => expect(result).toMatchObject(event));
  });

  test('Should find by aggregateId', async () => {
    return await repository.findByAggregateId('A1')
    .then(results => expect(results).toHaveLength(1));
  });

  test('Should return empty events when aggregateId does not exists', async () => {
    return await repository.findByAggregateId('A2')
    .then(results => expect(results).toHaveLength(0));
  });
});