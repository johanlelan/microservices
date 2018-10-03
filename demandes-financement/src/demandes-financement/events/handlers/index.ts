import { DemandeFinancementCreatedEventHandler } from './demande-financement-created.handler';
import { StatusChangedEventHandler } from './status-changed.handler';
import { DemandeFinancementDeletedEventHandler } from './demande-financement-deleted.handler';
import { DemandeFinancementIsIndexedEventHandler } from './demande-financement-isIndexed.handler';

export const EventHandlers = [
  DemandeFinancementCreatedEventHandler,
  StatusChangedEventHandler,
  DemandeFinancementDeletedEventHandler,
  DemandeFinancementIsIndexedEventHandler,
];