import { Module, CacheModule } from '@nestjs/common';
import { DemandeFinancementModule } from './demandes-financement/demande-financement.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // seconds
    }),
    DemandeFinancementModule],
})
export class AppModule {}
