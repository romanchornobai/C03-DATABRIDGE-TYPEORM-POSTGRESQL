import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinosModule } from './destinos/destinos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chro0517',
      database: 'databridge_e10',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DestinosModule,
  ],
})
export class AppModule {}
