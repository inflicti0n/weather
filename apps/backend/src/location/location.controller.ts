import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { LocationService } from './location.service';
import { Location } from './models/location.entity';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('location')
  @ApiOperation({
    summary:
      'Get All Locations, optionally a query can be provided to only get matching Locations.',
  })
  getLocations(@Query('search') search?: string): Promise<Location[]> {
    return this.locationService.getLocations(search);
  }
}
