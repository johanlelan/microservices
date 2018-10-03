import {
  Controller,
  Logger,
  UseInterceptors} from '@nestjs/common';

import { DemandeFinancementService } from './demande-financement.service';

import { TimeExcutionInterceptor } from '../time-execution.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { DemandeFinancement } from './models/demande-financement.model';
import { SearchDemandeFinancementDto } from './interfaces/search-demande-financement.dto';
import { Observable } from 'rxjs';

@UseInterceptors(TimeExcutionInterceptor)
@Controller('demandes-financement')
export class DemandeFinancementController {
  constructor(
    private readonly demandeFinancementService: DemandeFinancementService,
  ) {
  }

  @MessagePattern({ cmd: 'indexDemandeFinancement' })
  async index(data: DemandeFinancement): Promise<DemandeFinancement> {
    // index data into elasticsearch
    Logger.log(`index data ${data.id} into elasticsearch`);
    const indexData = await this.demandeFinancementService.index(data);
    Logger.log(`${data.id} have been indexed`);
    return indexData;
  }

  @MessagePattern({ cmd: 'searchDemandeFinancement' })
  async search(data: SearchDemandeFinancementDto): Promise<DemandeFinancement[]> {
    return [];
  }
}
