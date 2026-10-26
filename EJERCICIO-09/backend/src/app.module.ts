import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosModule } from './eventos/eventos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chro0517',
      database: 'databridge_e09',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventosModule,
  ],
})
export class AppModule {}
