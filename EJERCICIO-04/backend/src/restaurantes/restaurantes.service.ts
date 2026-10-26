import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestauranteDto } from './create-restaurante.dto';
import { Restaurante } from './restaurante.entity';

@Injectable()
export class RestaurantesService implements OnModuleInit {
  constructor(
    @InjectRepository(Restaurante)
    private readonly repository: Repository<Restaurante>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const inicial = this.repository.create({
        nombre: 'La Trattoria',
        tipo: 'Italiano',
        ciudad: 'Zaragoza',
        puntuacion: 9.0,
        precioMedio: 25.0,
      });

      await this.repository.save(inicial);
    }
  }

  create(dto: CreateRestauranteDto): Promise<Restaurante> {
    const restaurante = this.repository.create({
      ...dto,
      puntuacion: dto.puntuacion ?? 9.0,
    });
    return this.repository.save(restaurante);
  }

  findAll(): Promise<Restaurante[]> {
    return this.repository.find({
      order: { id: 'DESC' },
    });
  }
}
