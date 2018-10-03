import { CreateDemandeFinancementHandler } from './create-demande-financement.handler';
import { ChangeStatusDemandeFinancementHandler } from './change-status-demande-financement.handler';
import { DeleteDemandeFinancementHandler } from './delete-demande-financement.handler';
import { IndexDemandeFinancementHandler } from './index-demande-financement.handler';
import { IsIndexedDemandeFinancementHandler } from './isIndexed-demande-financement.handler';

export const CommandHandlers = [
  CreateDemandeFinancementHandler,
  ChangeStatusDemandeFinancementHandler,
  DeleteDemandeFinancementHandler,
  IndexDemandeFinancementHandler,
  IsIndexedDemandeFinancementHandler,
];