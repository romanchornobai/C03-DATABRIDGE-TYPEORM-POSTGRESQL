import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sneakers')
export class Sneaker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column('decimal', { precision: 7, scale: 2 })
  precio: number;

  @Column('int')
  talla: number;

  @Column('int', { default: 0 })
  stock: number;
}
