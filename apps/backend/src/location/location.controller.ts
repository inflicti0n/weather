import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { LocationService } from './location.service';
import { Location } from './models/location.entity';
import { Weather } from './models/weather.entity';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('')
  @ApiOperation({
    summary:
      'Get All Locations, optionally a query can be provided to only get matching Locations.',
  })
  @ApiQuery({
    name: 'search',
    description: 'The search query to filter locations based on name',
    required: false,
  })
  @ApiOkResponse({ type: Location, isArray: true })
  getLocations(@Query('search') search?: string): Promise<Location[]> {
    return this.locationService.getLocations(search);
  }

  @Get(':locationId/weather')
  @ApiOperation({
    summary:
      'Get the weather for the specified location id, a startTime query is required while optionally, an endTime query can be provided to set a time range for the weather',
  })
  @ApiParam({
    name: 'locationId',
    description: 'The location id to get the weather for',
    required: true,
  })
  @ApiQuery({
    name: 'startTime',
    description: 'The beginning datetime for the weather data',
    required: true,
  })
  @ApiQuery({
    name: 'endTime',
    description: 'The datetime limit for the weather data',
    required: false,
  })
  @ApiOkResponse({ type: Weather, isArray: true })
  getWeather(
    @Param() locationId: string,
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime?: Date
  ): Promise<Weather[]> {
    return this.locationService.getLocationWeather(
      locationId,
      startTime,
      endTime
    );
  }
}
