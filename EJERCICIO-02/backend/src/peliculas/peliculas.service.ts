import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Injectable()
export class PeliculasService implements OnModuleInit {
  constructor(
    @InjectRepository(Pelicula)
    private readonly repository: Repository<Pelicula>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          titulo: 'Interstellar',
          genero: 'Ciencia ficción',
          anio: 2014,
          puntuacion: 9.2,
          favorita: true,
        }),
        this.repository.create({
          titulo: 'Coco',
          genero: 'Animación',
          anio: 2017,
          puntuacion: 8.8,
          favorita: false,
        }),
        this.repository.create({
          titulo: 'El Padrino',
          genero: 'Crimen / Drama',
          anio: 1972,
          puntuacion: 9.5,
          favorita: true,
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  findAll(): Promise<Pelicula[]> {
    return this.repository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}
