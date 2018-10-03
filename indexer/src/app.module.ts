import { Module } from '@nestjs/common';
import { DemandeFinancementModule } from './demandes-financement/demande-financement.module';

@Module({
  imports: [DemandeFinancementModule],
})
export class AppModule {}
