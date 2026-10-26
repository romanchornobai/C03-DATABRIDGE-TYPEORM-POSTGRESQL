import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSneakerDto } from './create-sneaker.dto';
import { Sneaker } from './sneaker.entity';
import { UpdateSneakerDto } from './update-sneaker.dto';

@Injectable()
export class SneakersService implements OnModuleInit {
  constructor(
    @InjectRepository(Sneaker)
    private readonly repository: Repository<Sneaker>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          marca: 'Nike',
          modelo: 'Air Max 1',
          precio: 149.99,
          talla: 42,
          stock: 4,
        }),
        this.repository.create({
          marca: 'Adidas',
          modelo: 'Forum Low',
          precio: 110.0,
          talla: 43,
          stock: 0,
        }),
        this.repository.create({
          marca: 'New Balance',
          modelo: '550',
          precio: 130.0,
          talla: 41,
          stock: 2,
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  findAll(): Promise<Sneaker[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Sneaker> {
    const sneaker = await this.repository.findOneBy({ id });
    if (!sneaker) {
      throw new NotFoundException(`Sneaker con id ${id} no encontrada`);
    }
    return sneaker;
  }

  create(dto: CreateSneakerDto): Promise<Sneaker> {
    const sneaker = this.repository.create({
      ...dto,
      stock: dto.stock ?? 0,
    });
    return this.repository.save(sneaker);
  }

  async update(id: number, dto: UpdateSneakerDto): Promise<Sneaker> {
    const sneaker = await this.findOne(id);
    this.repository.merge(sneaker, dto);
    return this.repository.save(sneaker);
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const sneaker = await this.findOne(id);
    await this.repository.remove(sneaker);
    return { mensaje: `Sneaker con id ${id} eliminada correctamente` };
  }
}
