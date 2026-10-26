import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinoDto } from './create-destino.dto';
import { Destino } from './destino.entity';
import { UpdateDestinoDto } from './update-destino.dto';

@Injectable()
export class DestinosService implements OnModuleInit {
  constructor(
    @InjectRepository(Destino)
    private readonly repository: Repository<Destino>,
  ) {}

  async onModuleInit(): Promise<void> {
    const total = await this.repository.count();

    if (total === 0) {
      const iniciales = [
        this.repository.create({
          ciudad: 'Reikiavik',
          pais: 'Islandia',
          descripcion: 'Auroras boreales y termas',
          prioridad: 'ALTA',
          visitado: false,
        }),
        this.repository.create({
          ciudad: 'Lisboa',
          pais: 'Portugal',
          descripcion: 'Tranvías históricos y gastronomía',
          prioridad: 'MEDIA',
          visitado: true,
        }),
        this.repository.create({
          ciudad: 'Kioto',
          pais: 'Japón',
          descripcion: 'Templos y jardines tradicionales',
          prioridad: 'ALTA',
          visitado: false,
        }),
      ];

      await this.repository.save(iniciales);
    }
  }

  findAll(): Promise<Destino[]> {
    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Destino> {
    const destino = await this.repository.findOneBy({ id });
    if (!destino) {
      throw new NotFoundException(`Destino con id ${id} no encontrado`);
    }
    return destino;
  }

  create(dto: CreateDestinoDto): Promise<Destino> {
    const destino = this.repository.create({
      ...dto,
      descripcion: dto.descripcion ?? '',
      prioridad: dto.prioridad ?? 'MEDIA',
      visitado: dto.visitado ?? false,
    });
    return this.repository.save(destino);
  }

  async update(id: number, dto: UpdateDestinoDto): Promise<Destino> {
    const destino = await this.findOne(id);
    this.repository.merge(destino, dto);
    return this.repository.save(destino);
  }

  async toggleVisita(id: number): Promise<Destino> {
    const destino = await this.findOne(id);
    destino.visitado = !destino.visitado;
    return this.repository.save(destino);
  }

  async remove(id: number): Promise<{ mensaje: string }> {
    const destino = await this.findOne(id);
    await this.repository.remove(destino);
    return { mensaje: `Destino con id ${id} eliminado correctamente` };
  }
}
