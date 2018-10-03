import { DemandeFinancementDeletedEventHandler } from './demande-financement-deleted.handler';
import { DemandeFinancementIndexedEventHandler } from './demande-financement-indexed.handler';

export const EventHandlers = [
  DemandeFinancementDeletedEventHandler,
  DemandeFinancementIndexedEventHandler,
];