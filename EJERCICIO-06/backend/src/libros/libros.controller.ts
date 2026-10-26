import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Libro } from './libro.entity';
import { LibrosService } from './libros.service';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.librosService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
    return this.librosService.remove(id);
  }

  @Patch(':id/leido')
  marcarLeido(
    @Param('id', ParseIntPipe) id: number,
    @Body('leido') leido?: boolean,
  ): Promise<Libro> {
    return this.librosService.marcarLeido(id, leido ?? true);
  }
}
