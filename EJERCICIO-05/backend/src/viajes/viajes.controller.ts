import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { UpdateViajeDto } from './update-viaje.dto';
import { Viaje } from './viaje.entity';
import { ViajesService } from './viajes.service';

@Controller('viajes')
export class ViajesController {
  constructor(private readonly viajesService: ViajesService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Viaje> {
    return this.viajesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateViajeDto,
  ): Promise<Viaje> {
    return this.viajesService.update(id, dto);
  }
}
