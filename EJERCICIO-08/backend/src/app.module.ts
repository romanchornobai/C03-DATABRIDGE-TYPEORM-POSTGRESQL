import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistsModule } from './playlists/playlists.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chro0517',
      database: 'databridge_e08',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlaylistsModule,
  ],
})
export class AppModule {}
