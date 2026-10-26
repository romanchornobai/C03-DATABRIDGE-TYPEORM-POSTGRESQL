import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventosService implements OnModuleInit {
  constructor(
    @InjectRepository(Evento)
    private readonly repository: Repository<Evento>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          nombre: 'Tech Meetup',
          ciudad: 'Zaragoza',
          categoria: 'Tecnología',
          fecha: '2027-03-12',
        }),
        this.repository.create({
          nombre: 'Design Summit',
          ciudad: 'Zaragoza',
          categoria: 'Diseño',
          fecha: '2027-04-05',
        }),
        this.repository.create({
          nombre: 'JS Congress',
          ciudad: 'Madrid',
          categoria: 'Tecnología',
          fecha: '2027-05-20',
        }),
        this.repository.create({
          nombre: 'Gastro Fest',
          ciudad: 'Zaragoza',
          categoria: 'Gastronomía',
          fecha: '2027-06-15',
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  findAll(ciudad?: string, categoria?: string): Promise<Evento[]> {
    const where: FindOptionsWhere<Evento> = {};

    if (ciudad && ciudad.trim() !== '') {
      where.ciudad = ciudad;
    }

    if (categoria && categoria.trim() !== '') {
      where.categoria = categoria;
    }

    return this.repository.find({
      where,
      order: { fecha: 'ASC' },
    });
  }
}
