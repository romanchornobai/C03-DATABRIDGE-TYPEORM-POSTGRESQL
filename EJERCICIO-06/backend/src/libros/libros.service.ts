import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';

@Injectable()
export class LibrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Libro)
    private readonly repository: Repository<Libro>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          titulo: '1984',
          autor: 'George Orwell',
          genero: 'Ciencia ficción / Distopía',
          leido: false,
        }),
        this.repository.create({
          titulo: 'Dune',
          autor: 'Frank Herbert',
          genero: 'Ciencia ficción',
          leido: true,
        }),
        this.repository.create({
          titulo: 'Cien años de soledad',
          autor: 'Gabriel García Márquez',
          genero: 'Realismo mágico',
          leido: false,
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  findAll(): Promise<Libro[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.repository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`Libro con id ${id} no encontrado`);
    }
    return libro;
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const libro = await this.findOne(id);
    await this.repository.remove(libro);
    return { mensaje: `Libro con id ${id} eliminado correctamente` };
  }

  async marcarLeido(id: number, leido: boolean = true): Promise<Libro> {
    const libro = await this.findOne(id);
    libro.leido = leido;
    return this.repository.save(libro);
  }
}
