import { IndexDemandeFinancementCommandHandler } from './index-demande-financement.handler';
import { DemandeFinancementIndexedCommandHandler } from './demande-financement-indexed.handler';

export const CommandHandlers = [
  IndexDemandeFinancementCommandHandler,
  DemandeFinancementIndexedCommandHandler,
];