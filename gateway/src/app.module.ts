import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemandeFinancementController } from './demandes-financement/demande-financement.controller';
import { DemandeFinancementService } from './demandes-financement/demande-financement.service';

@Module({
  imports: [],
  controllers: [AppController, DemandeFinancementController],
  providers: [AppService, DemandeFinancementService],
})
export class AppModule {}
