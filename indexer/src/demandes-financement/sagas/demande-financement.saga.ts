import * as clc from 'cli-color';
import { Logger, Injectable } from '@nestjs/common';
import { EventObservable, ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DemandeFinancementIndexedEvent } from '../events/impl/demande-financement-indexed.event';
import { DemandeFinancementIndexedCommand } from '../commands/impl/demande-financement-indexed.command';

@Injectable()
export class DemandeFinancementSagas {
  // We declared a rule that when a new DemandeFinancement is created
  // Then the index Command will be dispatched and processed by the appropriate microservice.
  demandeFinancementIsIndexed = (events$: EventObservable<any>): Observable<ICommand> => {
    return events$.ofType(DemandeFinancementIndexedEvent)
    .pipe(
      map(event => {
        Logger.log(clc.redBright('Inside [DemandeFinancementIndexed] Saga'));
        return new DemandeFinancementIndexedCommand(event.demandeFinancementId);
      }),
    );
  }
}