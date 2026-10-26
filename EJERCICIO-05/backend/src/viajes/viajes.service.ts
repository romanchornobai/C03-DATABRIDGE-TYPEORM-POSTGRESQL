import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateViajeDto } from './update-viaje.dto';
import { Viaje } from './viaje.entity';

@Injectable()
export class ViajesService implements OnModuleInit {
  constructor(
    @InjectRepository(Viaje)
    private readonly repository: Repository<Viaje>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const inicial = this.repository.create({
        destino: 'Tokio',
        pais: 'Japón',
        estado: 'RESERVADO',
        fecha: '2027-04-10',
      });

      await this.repository.save(inicial);
    }
  }

  async findOne(id: number): Promise<Viaje> {
    const viaje = await this.repository.findOneBy({ id });
    if (!viaje) {
      throw new NotFoundException(`Viaje con id ${id} no encontrado`);
    }
    return viaje;
  }

  async update(id: number, dto: UpdateViajeDto): Promise<Viaje> {
    const viaje = await this.findOne(id);
    this.repository.merge(viaje, dto);
    return this.repository.save(viaje);
  }
}
