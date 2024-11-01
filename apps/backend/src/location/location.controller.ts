import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
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
import { WeatherDateRangeDto } from './dto/date-range.dto';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('')
  @ApiOperation({
    summary:
      'Get All Location Ids, optionally a query can be provided to only get matching Location Ids.',
  })
  @ApiQuery({
    name: 'search',
    description: 'The search query to filter location ids with',
    required: false,
  })
  @ApiOkResponse({ isArray: true })
  getLocations(@Query('search') search?: string): Promise<string[]> {
    return this.locationService.getLocationIds(search);
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
  getLocationWeather(
    @Param('locationId') locationId: string,
    @Query() weatherDateRangeDto: WeatherDateRangeDto,
  ): Promise<Location> {
    if (weatherDateRangeDto.startTime > weatherDateRangeDto.endTime) {
      throw new BadRequestException(
        'Start Time should be less than or equal to End Time',
      );
    }
    return this.locationService.getLocationWeather(
      locationId,
      weatherDateRangeDto.startTime,
      weatherDateRangeDto.endTime,
    );
  }
}
