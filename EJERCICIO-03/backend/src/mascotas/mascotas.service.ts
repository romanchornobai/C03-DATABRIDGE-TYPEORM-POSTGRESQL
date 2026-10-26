import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './mascota.entity';

@Injectable()
export class MascotasService implements OnModuleInit {
  constructor(
    @InjectRepository(Mascota)
    private readonly repository: Repository<Mascota>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          nombre: 'Nala',
          raza: 'Golden Retriever',
          edad: 4,
          ciudad: 'Zaragoza',
          nivelEnergia: 'ALTO',
        }),
        this.repository.create({
          nombre: 'Thor',
          raza: 'Bulldog Francés',
          edad: 2,
          ciudad: 'Madrid',
          nivelEnergia: 'MEDIO',
        }),
        this.repository.create({
          nombre: 'Mimi',
          raza: 'Siamés',
          edad: 5,
          ciudad: 'Barcelona',
          nivelEnergia: 'BAJO',
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.repository.findOneBy({ id });

    if (!mascota) {
      throw new NotFoundException(`Mascota con id ${id} no encontrada`);
    }

    return mascota;
  }
}
