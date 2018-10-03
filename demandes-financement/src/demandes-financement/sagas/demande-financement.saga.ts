import * as clc from 'cli-color';
import { Logger, Injectable } from '@nestjs/common';
import { EventObservable, ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { DemandeFinancementCreatedEvent } from '../events/impl/demande-financement-created.event';
import { map } from 'rxjs/operators';
import { IndexDemandeFinancementCommand } from '../commands/impl/index-demande-financement.command';

@Injectable()
export class DemandeFinancementSagas {
  // We declared a rule that when a new DemandeFinancement is created
  // Then the index Command will be dispatched and processed by the appropriate microservice.
  indexNewDemandeFinancement = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$.ofType(DemandeFinancementCreatedEvent)
    .pipe(
      map(event => {
        Logger.log(clc.redBright('Inside [IndexNewDemandeFinancement] Saga'));
        return new IndexDemandeFinancementCommand(event.content);
      }),
    );
  }
}