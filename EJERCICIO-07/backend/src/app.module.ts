import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SneakersModule } from './sneakers/sneakers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chro0517',
      database: 'databridge_e07',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SneakersModule,
  ],
})
export class AppModule {}
