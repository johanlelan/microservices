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

import { JsonPatchOperationDto } from '../common/interfaces/json-patch.dto';
import { TimeExcutionInterceptor } from '../time-execution.interceptor';
import { JsonValidationPipe } from '../validation/json-validation.pipe';
import * as jsonPatchSchema from '../common/models/json-patch.schema.json';

const demandeFinancementValidator = new JsonValidationPipe('CreateDemandeFinancement', createDemandeFinancementSchema);
const JsonPatchValidator = new JsonValidationPipe('JsonPatch', jsonPatchSchema);

@UseInterceptors(TimeExcutionInterceptor)
@Controller('demandes-financement')
export class DemandeFinancementController {

  constructor(private readonly demandeFinancementService: DemandeFinancementService) {}
  @Post()
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  async create(
    @Body(demandeFinancementValidator) createDemandeFinancementDto: CreateDemandeFinancementDto,
    ): Promise<any> {
    Logger.log('This action adds a new demandeFinancement');
    return await this.demandeFinancementService.create(createDemandeFinancementDto);
  }
  @Get()
  async findAll(
    @Query() query,
    ): Promise<DemandeFinancement[]> {
    const findDemandeFinancementDto = new FindDemandeFinancementDto();
    Logger.log(`This action returns all demandes-financement (limit: ${query.limit} items)`);
    return await this.demandeFinancementService.findAll(findDemandeFinancementDto);
  }
  @Get(':demandeFinancementId')
  async findOne(
    @Param('demandeFinancementId') demandeFinancementId,
    @Res() res,
    ): Promise<DemandeFinancement> {
    Logger.log(`This action returns the demandeFinancement if "${demandeFinancementId}" identifier exists`);
    const demandeFinancement = await this.demandeFinancementService.findOneById(demandeFinancementId);
    if (!demandeFinancement) {
      return res.status(HttpStatus.NOT_FOUND).json({
        code: 400.1,
        text: `DemandeFinancement ${demandeFinancementId} not found.`,
      });
    } else if (!demandeFinancement.active) {
      return res.status(HttpStatus.GONE).json({
        code: 410.1,
        text: `DemandeFinancement ${demandeFinancementId} is disabled.`,
      });
    } else {
      return res.status(HttpStatus.OK).json(demandeFinancement);
    }
  }
  @Delete(':demandeFinancementId')
  @HttpCode(204)
  async remove(
    @Param('demandeFinancementId') demandeFinancementId,
    ): Promise<any> {
    Logger.log(`This action disables the given demandeFinancement "${demandeFinancementId}"`);
    await this.demandeFinancementService.removeOneById(demandeFinancementId);
    return;
  }

  @Patch(':demandeFinancementId')
  async patch(
    @Param('demandeFinancementId') demandeFinancementId,
    @Body(JsonPatchValidator) operations: JsonPatchOperationDto[],
    ): Promise<JsonPatchOperationDto[]> {
    Logger.log(`This action patches the given demandeFinancement "${demandeFinancementId}"`);
    await this.demandeFinancementService.updateOneById(demandeFinancementId, operations);
    return operations;
  }
}
