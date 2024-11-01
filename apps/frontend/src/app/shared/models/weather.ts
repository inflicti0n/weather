export interface Weather {
  id: string;
  dateTime: Date;
  airQualityIndex: number;
  humidityPercent: number;
  precipitationProbabilityPercent: number;
  temperatureCelsius: number;
  uvIndex: number;
  weatherCondition: string;
  windDirection: string;
  windGustsKmh: number;
  windSpeedKmh: number;
}
