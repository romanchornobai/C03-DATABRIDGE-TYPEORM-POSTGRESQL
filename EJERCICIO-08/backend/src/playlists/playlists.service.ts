import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancion } from './cancion.entity';
import { CreateCancionDto } from './create-cancion.dto';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Cancion)
    private readonly cancionRepository: Repository<Cancion>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.playlistRepository.count();

    if (total === 0) {
      const playlist = this.playlistRepository.create({
        nombre: 'Entrenamiento',
      });
      await this.playlistRepository.save(playlist);

      const cancion1 = this.cancionRepository.create({
        titulo: 'Run Boy Run',
        artista: 'Woodkid',
        playlist,
      });

      const cancion2 = this.cancionRepository.create({
        titulo: 'Eye of the Tiger',
        artista: 'Survivor',
        playlist,
      });

      await this.cancionRepository.save([cancion1, cancion2]);
    }
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { canciones: true },
    });

    if (!playlist) {
      throw new NotFoundException(`Playlist con id ${id} no encontrada`);
    }

    return playlist;
  }

  async addCancion(id: number, dto: CreateCancionDto): Promise<Cancion> {
    const playlist = await this.findOne(id);

    const cancion = this.cancionRepository.create({
      ...dto,
      playlist,
    });

    return this.cancionRepository.save(cancion);
  }
}
