import {
  Controller,
  Res,
  Get, Post, Delete, Patch,
  Param, Header, HttpCode, Body, Query,
  Logger,
  UseInterceptors,
  HttpStatus} from '@nestjs/common';

import { CreateDemandeFinancementDto } from './interfaces/create-demande-financement.dto';
import { DemandeFinancementService } from './demande-financement.service';
import { DemandeFinancement } from './models/demande-financement.model';
import { FindDemandeFinancementDto } from './interfaces/find-demande-financement.dto';
import * as createDemandeFinancementSchema from './models/create-demande-financement.schema.json';

import { JsonPatchOperationDto } from 'common/interfaces/json-patch.dto';
import { TimeExcutionInterceptor } from '../time-execution.interceptor';
import { JsonValidationPipe } from '../validation/json-validation.pipe';
import * as jsonPatchSchema from '../common/models/json-patch.schema.json';
import { MessagePattern } from '@nestjs/microservices';

const demandeFinancementValidator = new JsonValidationPipe('CreateDemandeFinancement', createDemandeFinancementSchema);
const JsonPatchValidator = new JsonValidationPipe('JsonPatch', jsonPatchSchema);

@UseInterceptors(TimeExcutionInterceptor)
@Controller('demandes-financement')
export class DemandeFinancementController {
  constructor(
    private readonly demandeFinancementService: DemandeFinancementService,
  ) {}

  @MessagePattern({ cmd: 'createDemandeFinancement' })
  async create(data: CreateDemandeFinancementDto): Promise<DemandeFinancement> {
    const newDemandeFinancement = await this.demandeFinancementService.create(data);
    Logger.log('New demandeFinancement created', newDemandeFinancement.id);
    return newDemandeFinancement;
  }

  @MessagePattern({ cmd: 'deleteDemandeFinancement' })
  delete(demandeFinancementId: string): Promise<void> {
    return this.demandeFinancementService.removeOneById(demandeFinancementId);
  }

  @MessagePattern({ cmd: 'changeStatusDemandeFinancement' })
  changeStatus(demandeFinancementId: string, status: string): Promise<void> {
    return this.demandeFinancementService.changeStatus(demandeFinancementId, status);
  }

  @MessagePattern({ cmd: 'demandeFinancementIndexed' })
  setIsIndexed(demandeFinancementId: string): Promise<void> {
    const demandeFinancementIndexed = this.demandeFinancementService.setIsIndexed(demandeFinancementId);
    Logger.log('DemandeFinancement have been indexed', demandeFinancementId);
    return demandeFinancementIndexed;
  }
}
