export interface Weather {
  dateTime: Date;
  airQualityIndex: number;
  humidityPercent: number;
  precipitationProbabilityPercent: number;
  temperatureCelsius: number;
  uvIndex: number;
  weatherCondition: string;
  windGustsKmh: number;
  windSpeedKmh: number;
}
