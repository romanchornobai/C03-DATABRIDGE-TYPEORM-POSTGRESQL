import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ciudad: string;

  @Column()
  pais: string;

  @Column({ default: '' })
  descripcion: string;

  // Mejora 1: Prioridad de viaje (ALTA, MEDIA, BAJA)
  @Column({ default: 'ALTA' })
  prioridad: string;

  // Mejora 2: Estado de visita persistente (true = Visitado, false = Pendiente)
  @Column({ default: false })
  visitado: boolean;
}
