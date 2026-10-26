import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDestinoDto } from './create-destino.dto';
import { Destino } from './destino.entity';
import { DestinosService } from './destinos.service';
import { UpdateDestinoDto } from './update-destino.dto';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Get()
  findAll(): Promise<Destino[]> {
    return this.destinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.destinosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDestinoDto): Promise<Destino> {
    return this.destinosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinoDto,
  ): Promise<Destino> {
    return this.destinosService.update(id, dto);
  }

  // Mejora: Endpoint dedicado para alternar el estado de visita
  @Patch(':id/visitar')
  toggleVisita(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.destinosService.toggleVisita(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return this.destinosService.remove(id);
  }
}
