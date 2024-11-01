import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  now,
  parseAbsolute,
  toCalendarDateTime,
} from '@internationalized/date';
import { TranslocoService } from '@ngneat/transloco';
import { colorSets } from '@swimlane/ngx-charts';
import { Chart, ChartArea } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as shape from 'd3-shape';
import { Subject, of, switchMap, takeUntil } from 'rxjs';

import { Location } from '../../../shared/models/location';
import { locationTimezoneMap } from '../../../shared/models/location-timezone-map';
import { Weather } from '../../../shared/models/weather';
import { LocationService } from '../../../shared/services/location.service';
import { SettingsService } from '../../../shared/services/settings.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { crossplugin } from '../../../utils/crosshair-plugin';

@Component({
  selector: 'weather-location-details-component',
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LocationDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('mainCanvas') canvas: ElementRef | null = null;

  // Line Chart Options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  curveShape = shape.curveMonotoneX;

  color = colorSets[4];

  currentIntervalId: number | null = null;
  time: Date = new Date(); // global variable for string interpolation on html
  centerSearchBar: boolean = true;

  currentlySelectedWeather: Weather[] = [];

  currentlySelectedSingularWeather: Weather | null = null;

  searchInputControl = new UntypedFormControl();

  location: Location | null = null;

  hourlyWeatherStyleToggle: 'list' | 'graph' = 'graph';

  currentMonthlyWeather: Record<string, Weather[]> = {};

  currentDayAveragedWeather: {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] = [];

  currentTimezone: string | null = null;

  dayAveragedWeather: {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] = [];

  hourlyWeatherChart: Chart | null = null;
  hourlyWeatherChart2: Chart | null = null;

  selectedGraphType: 'temperature' | 'precipitation' | 'wind' = 'temperature';

  currentFontColorClass: string = 'text-white';
  currentTemperatureUnits: string = 'celsius';
  currentSpeedUnits: string = 'kilometers';
  currentTimeFormat: number = 24;
  currentTheme: string = 'default';

  currentLocale: string = 'en-US';

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private translocoService: TranslocoService,
    private datePipe: DatePipe,
    private themeService: ThemeService,
    private changeDetectorRef: ChangeDetectorRef,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((params: ParamMap) => {
        // Access individual route parameters using params.get('parameterName')
        const id = params.get('location-id');
        if (id) {
          this.currentTimezone = locationTimezoneMap[id];
          this.getLocationMonthlyWeather(id);
        }
      });
    this.themeService.fontColorClass$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((fontColor: string) => {
        this.currentFontColorClass = fontColor;
      });

    this.settingsService.currentTemperatureUnits$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((units: string) => {
        this.currentTemperatureUnits = units;
      });

    this.settingsService.currentSpeedUnits$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((units: string) => {
        this.currentSpeedUnits = units;
      });
    this.settingsService.currentTimeFormat$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((format: number) => {
        this.currentTimeFormat = format;
      });
    this.settingsService.currentTheme$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((theme: string) => {
        this.currentTheme = theme;
      });

    this.currentLocale =
      this.translocoService.getActiveLang() === 'en' ? 'en-US' : 'el-GR';

    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        (newLanguage) =>
          (this.currentLocale =
            this.translocoService.getActiveLang() === 'en' ? 'en-US' : 'el-GR'),
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();

    this.hourlyWeatherChart?.destroy();
    this.hourlyWeatherChart2?.destroy();
  }

  getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea) {
    let width: number | null = null;
    let height: number | null = null;
    let gradient: CanvasGradient | null = null;

    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      // Create the gradient because this is either the first render
      // or the size of the chart has changed
      width = chartWidth;
      height = chartHeight;
      gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top,
      );

      switch (this.selectedGraphType) {
        case 'temperature':
          gradient.addColorStop(0, 'rgb(54, 162, 235)');
          gradient.addColorStop(0.5, 'rgb(255, 205, 86)');
          gradient.addColorStop(1, 'rgb(255, 99, 132)');
          break;
        case 'precipitation':
          gradient.addColorStop(0, 'rgb(34, 91, 181)');
          gradient.addColorStop(0.5, 'rgb(34, 91, 181)');
          gradient.addColorStop(1, 'rgb(34, 91, 181)');
          break;
        case 'wind':
          gradient.addColorStop(0, 'rgb(168, 195, 237)');
          gradient.addColorStop(0.5, 'rgb(168, 195, 237)');
          gradient.addColorStop(1, 'rgb(168, 195, 237)');
          break;
      }

      /**gradient.addColorStop(0, 'rgb(54, 162, 235)');
      gradient.addColorStop(0.5, 'rgb(255, 205, 86)');
      gradient.addColorStop(1, 'rgb(255, 99, 132)');*/
    }

    return gradient;
  }

  private initializeChart() {
    Chart.register(ChartDataLabels);

    setTimeout(() => {
      const element = <HTMLCanvasElement>document.getElementById('myChart');
      if (!element) {
        return;
      }
      const context = element?.getContext('2d');
      if (!context) {
        return;
      }

      const element2 = <HTMLCanvasElement>document.getElementById('myChart2');
      if (!element) {
        return;
      }
      const context2 = element2?.getContext('2d');
      if (!context2) {
        return;
      }

      const pointRadii: number[] = [];
      const labelsToDisplay: any = [];

      this.hourlyWeatherChart = new Chart(context, {
        plugins: [crossplugin],
        type: 'line',
        data: {
          labels: [
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
          ],
          datasets: [
            {
              label: 'My First Dataset',
              cubicInterpolationMode: 'monotone',
              data: [
                10, 10, 8, 8, 6, 5, 7, 3, 7, 10, 25, 30, 30, 40, 10, 10, -15,
                25, 30, 30, 40, 10, 10, -15, 14,
              ],
              fill: false,
              pointRadius: pointRadii,
              pointHoverRadius: pointRadii,
              pointBorderColor: () => {
                switch (this.currentFontColorClass) {
                  case 'text-white': {
                    return 'white';
                  }
                  case 'text-sky-950': {
                    return '#082f49';
                  }
                  default: {
                    return 'white';
                  }
                }
              },
              backgroundColor: () => {
                switch (this.currentFontColorClass) {
                  case 'text-white': {
                    return 'white';
                  }
                  case 'text-sky-950': {
                    return '#082f49';
                  }
                  default: {
                    return 'white';
                  }
                }
              },
              borderColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  // This case happens on initial chart load
                  return;
                }
                return this.getGradient(ctx, chartArea);
              },
              tension: 0.1,
              datalabels: {
                textStrokeColor: 'black',
                textStrokeWidth: 1.5,
                align: (context: any) => {
                  switch (context.dataIndex) {
                    case 0:
                      return this.selectedGraphType === 'temperature'
                        ? 'top'
                        : 'right';
                    case 24:
                      return this.selectedGraphType === 'temperature'
                        ? 'top'
                        : 'left';
                    default:
                      return 'top';
                  }
                },
                anchor: (context: any) => {
                  switch (context.dataIndex) {
                    case 0:
                      return this.selectedGraphType === 'temperature'
                        ? 'end'
                        : 'end';
                    case 24:
                      return 'end';
                    default:
                      return 'end';
                  }
                },
              },
            },
          ],
        },
        options: {
          layout: {
            padding: {
              left: 15,
              right: 15,
            },
          },
          onHover: (e: any, item: any) => {
            if (!this.currentlySelectedSingularWeather) {
              return;
            }

            this.selectGraphWeather(
              this.currentlySelectedWeather[item[0].index].id,
            );
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
          },
          hover: {
            mode: 'nearest',
            intersect: false,
          },
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: false,
            },
            datalabels: {
              /*backgroundColor: 'rgb(75, 192, 192)',
              borderRadius: 4,*/
              color: 'white',
              font: (context) => {
                switch (this.selectedGraphType) {
                  case 'temperature':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 20,
                    };
                  case 'precipitation':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 18,
                    };
                  case 'wind':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 14,
                    };
                }
              },
              formatter: (value: any) => {
                switch (this.selectedGraphType) {
                  case 'temperature': {
                    return this.getUnitAdjustedTemperature(value) + '°';
                  }
                  case 'precipitation':
                    return value + '%';
                  case 'wind':
                    return this.currentSpeedUnits === 'kilometers'
                      ? this.getUnitAdjustedSpeed(value) +
                          this.translocoService.translate(
                            'location.details.kmh',
                          )
                      : this.getUnitAdjustedSpeed(value) +
                          this.translocoService.translate(
                            'location.details.mph',
                          );
                }

                return Math.round;
              },
              //padding: 6,
              display: labelsToDisplay,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              min: -20,
              max: 50,
            },
          },
          maintainAspectRatio: false,
        },
      });
      this.hourlyWeatherChart2 = new Chart(context2, {
        plugins: [crossplugin],
        type: 'line',
        data: {
          labels: [
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
            'Mo',
            'Gu',
            'Gi',
            'Ma',
            'Ju',
            'Bo',
            'Lo',
          ],
          datasets: [
            {
              label: 'My First Dataset',
              cubicInterpolationMode: 'monotone',
              data: [
                10, 10, 8, 8, 6, 5, 7, 3, 7, 10, 25, 30, 30, 40, 10, 10, -15,
                25, 30, 30, 40, 10, 10, -15, 14,
              ],
              fill: false,
              pointRadius: pointRadii,
              pointHoverRadius: pointRadii,
              pointBorderColor: 'white',
              backgroundColor: 'white',
              borderColor: (context) => {
                const chart = context.chart;
                const { ctx, chartArea } = chart;

                if (!chartArea) {
                  // This case happens on initial chart load
                  return;
                }
                return this.getGradient(ctx, chartArea);
              },
              tension: 0.1,
              datalabels: {
                textStrokeColor: 'black',
                textStrokeWidth: 1.5,
                align: (context: any) => {
                  switch (context.dataIndex) {
                    case 0:
                      return this.selectedGraphType === 'temperature'
                        ? 'top'
                        : 'right';
                    case 24:
                      return this.selectedGraphType === 'temperature'
                        ? 'top'
                        : 'left';
                    default:
                      return 'top';
                  }
                },
                anchor: (context: any) => {
                  switch (context.dataIndex) {
                    case 0:
                      return this.selectedGraphType === 'temperature'
                        ? 'end'
                        : 'end';
                    case 24:
                      return 'end';
                    default:
                      return 'end';
                  }
                },
              },
            },
          ],
        },
        options: {
          layout: {
            padding: {
              left: 15,
              right: 15,
            },
          },
          onHover: (e: any, item: any) => {
            if (!this.currentlySelectedSingularWeather) {
              return;
            }

            this.selectGraphWeather(
              this.currentlySelectedWeather[item[0].index].id,
            );
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
          },
          hover: {
            mode: 'nearest',
            intersect: false,
          },
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: 'white',
              font: (context) => {
                switch (this.selectedGraphType) {
                  case 'temperature':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 16,
                    };
                  case 'precipitation':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 12,
                    };
                  case 'wind':
                    return {
                      family:
                        this.settingsService.currentFont$.value ===
                        'atkinson-hyperlegible'
                          ? 'Atkinson Hyperlegible'
                          : this.settingsService.currentFont$.value,
                      weight: 'bold',
                      size: 12,
                    };
                }
              },
              formatter: (value: any) => {
                switch (this.selectedGraphType) {
                  case 'temperature':
                    return Math.round(value) + '°';
                  case 'precipitation':
                    return value + '%';
                  case 'wind':
                    return value + 'km/h';
                }

                return Math.round;
              },
              //padding: 6,
              display: labelsToDisplay,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
              min: -20,
              max: 50,
            },
          },
          maintainAspectRatio: false,
        },
      });

      for (
        let i = 0;
        i < this.hourlyWeatherChart.data.datasets[0].data.length;
        i++
      ) {
        if (i % 4 === 0) {
          labelsToDisplay.push(true);
          pointRadii.push(8);
        } else {
          labelsToDisplay.push(false);
          pointRadii.push(2);
        }
      }
      for (
        let i = 0;
        i < this.hourlyWeatherChart2.data.datasets[0].data.length;
        i++
      ) {
        if (i % 4 === 0) {
          labelsToDisplay.push(true);
          pointRadii.push(8);
        } else {
          labelsToDisplay.push(false);
          pointRadii.push(2);
        }
      }
      this.updateChartData();
      this.hourlyWeatherChart.update();
      this.hourlyWeatherChart2.update();
    }, 300);
  }

  selectGraphWeather(id: string) {
    const weatherToShow = this.currentlySelectedWeather.find(
      (weather: Weather) => weather.id === id,
    );

    if (!weatherToShow) {
      return;
    }

    this.currentlySelectedSingularWeather = weatherToShow;
  }

  updateChartData() {
    if (!this.hourlyWeatherChart) {
      return;
    }
    if (!this.hourlyWeatherChart2) {
      return;
    }

    const weatherData = this.currentlySelectedWeather.map(
      (weather: Weather) => {
        switch (this.selectedGraphType) {
          case 'temperature':
            return weather.temperatureCelsius;
          case 'precipitation':
            return weather.precipitationProbabilityPercent;
          case 'wind':
            return weather.windSpeedKmh;
        }
      },
    );

    this.hourlyWeatherChart.data.datasets[0].data = weatherData;
    this.hourlyWeatherChart2.data.datasets[0].data = weatherData;

    switch (this.selectedGraphType) {
      case 'temperature':
        const temperatureScales = {
          x: {
            display: false,
          },
          y: {
            display: false,
            min: -20,
            max: 50,
          },
        };
        this.hourlyWeatherChart.options.scales = temperatureScales;
        this.hourlyWeatherChart2.options.scales = temperatureScales;

        break;
      case 'precipitation':
        const precipitationScales = {
          x: {
            display: false,
          },
          y: {
            display: false,
            min: -5,
            max: 125,
          },
        };

        //this.hourlyWeatherChart.data.datasets.
        this.hourlyWeatherChart.options.scales = precipitationScales;
        this.hourlyWeatherChart2.options.scales = precipitationScales;
        break;
      case 'wind':
        const windScales = {
          x: {
            display: false,
          },
          y: {
            display: false,
            min: -5,
            max: 50,
          },
        };
        this.hourlyWeatherChart.options.scales = windScales;
        this.hourlyWeatherChart2.options.scales = windScales;
        break;
    }

    this.hourlyWeatherChart.update();
    this.hourlyWeatherChart2.update();
  }

  private getLocationMonthlyWeather(locationId: string) {
    if (!this.currentTimezone) {
      return;
    }
    const localTime = now(this.currentTimezone);
    localTime.set({ hour: 0 });
    this.locationService
      .getLocationWeather(
        locationId,
        localTime.subtract({ days: 1 }).toAbsoluteString(),
        localTime.add({ days: 30 }).set({ hour: 1 }).toAbsoluteString(),
      )
      .pipe(
        switchMap((location: Location) => {
          location.weather = [
            ...location.weather.map((weather: Weather) => {
              if (this.currentTimezone) {
                const convertedo = parseAbsolute(
                  new Date(weather.dateTime).toISOString(),
                  this.currentTimezone,
                );

                const heh = toCalendarDateTime(convertedo);

                weather.dateTime = new Date(heh.toString());
              }
              return weather;
            }),
          ];

          return of(location);
        }),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.location = result;
        if (this.currentTimezone) {
          this.initializeClock(this.currentTimezone);
        }
        this.currentMonthlyWeather = this.getMonthlyWeather(result.weather);

        this.selectDayWeather(
          this.currentMonthlyWeather[
            Object.keys(this.currentMonthlyWeather)[1]
          ][0].dateTime,
        );

        this.selectHourWeather(
          this.currentMonthlyWeather[
            Object.keys(this.currentMonthlyWeather)[1]
          ][this.time.getHours()].dateTime,
        );

        this.dayAveragedWeather = this.getDayAveragedWeather();

        this.initializeChart();
      });
  }

  initializeClock(timezone: string) {
    const convertedo = parseAbsolute(new Date().toISOString(), timezone);
    const heh = toCalendarDateTime(convertedo);

    this.time = new Date(heh.toString());

    if (this.currentIntervalId) {
      clearInterval(this.currentIntervalId);
    }

    this.currentIntervalId = window.setInterval(() => {
      const zonedDateTime = parseAbsolute(new Date().toISOString(), timezone);
      const calendarDateTime = toCalendarDateTime(zonedDateTime);

      this.time = new Date(calendarDateTime.toString());
    }, 1000);
  }

  getHighestLocationTemperature() {
    const temperatures = this.currentlySelectedWeather.map(
      (weather: Weather) => weather.temperatureCelsius,
    );

    if (temperatures && temperatures.length > 0) {
      return this.getUnitAdjustedTemperature(Math.max(...temperatures));
    }
    return 0;
  }

  getLowestLocationTemperature() {
    const temperatures = this.currentlySelectedWeather.map(
      (weather: Weather) => weather.temperatureCelsius,
    );

    if (temperatures && temperatures.length > 0) {
      return this.getUnitAdjustedTemperature(Math.min(...temperatures));
    }
    return 0;
  }

  getLocalTime(dateTime: Date) {
    if (this.currentTimezone) {
      const date = new Date(dateTime);

      const convertedo = parseAbsolute(
        date.toISOString(),
        this.currentTimezone,
      );
      const heh = toCalendarDateTime(convertedo);
      return new Date(heh.toString());
    }

    return;
  }

  getWeatherForecast() {
    const disruptiveConditions = [
      'thunderstorm',
      'showers',
      'heavy-rain',
      'snowy',
      'sleet',
    ];

    if (this.location) {
      const weather = [...this.location.weather];

      const disruptiveWeather = weather.find((weather: Weather) =>
        disruptiveConditions.includes(weather.weatherCondition),
      );

      if (!this.currentTimezone) {
        return;
      }

      if (disruptiveWeather) {
        const date = new Date(disruptiveWeather.dateTime);

        const zonedDateTime = parseAbsolute(
          date.toISOString(),
          this.currentTimezone,
        );
        const calendarDateTime = toCalendarDateTime(zonedDateTime);

        return `${this.translocoService.translate(
          'location.forecast.' + disruptiveWeather?.weatherCondition,
        )} ${this.datePipe.transform(new Date(calendarDateTime.toString()), 'h:mm a')}`;
      }

      const conditionOccurences = [
        { condition: 'clear', occurences: 0 },
        { condition: 'partly-cloudy', occurences: 0 },
        { condition: 'overcast', occurences: 0 },
        { condition: 'fog', occurences: 0 },
      ];

      weather.forEach((weather: Weather) => {
        const occurence = conditionOccurences.find(
          (conditionOccurence) =>
            conditionOccurence.condition === weather.weatherCondition,
        );
        if (occurence) {
          occurence.occurences++;
        }
      });

      const prevalentCondition = conditionOccurences.reduce((prev, current) => {
        return prev.occurences > current.occurences ? prev : current;
      });

      return `${this.translocoService.translate(
        'location.forecast.' + prevalentCondition.condition,
      )}`;
    }
    return;
  }

  getTimeAdjustedWeatherIconName(condition: string, dateTime: Date) {
    const hour = dateTime.getHours();

    if (
      hour &&
      hour > 5 &&
      hour < 21 &&
      ['clear', 'partly-cloudy'].includes(condition)
    ) {
      return condition === 'clear' ? 'sunny' : 'partly-sunny';
    }

    return condition;
  }

  getCompassArrowRotationClass(windDirection: string) {
    switch (windDirection) {
      case 'north':
        return 'rotate-180';
      case 'south':
        return 'rotate-0';
      case 'west':
        return 'rotate-90';
      case 'east':
        return '-rotate-90';
      case 'north-west':
        return 'rotate-[135deg]';
      case 'north-east':
        return 'rotate-[225deg]';
      case 'south-west':
        return 'rotate-45';
      case 'south-east':
        return '-rotate-45';
      default:
        return 'rotate-180';
    }
  }

  getDayAveragedWeather(): {
    dateTime: Date;
    temperatureCelsius: number;
    weatherCondition: string;
  }[] {
    const averagedDayWeather = Object.keys(this.currentMonthlyWeather).map(
      (key) => {
        const dayWeather = this.currentMonthlyWeather[key];

        const average = (array: number[]) =>
          array.reduce((p: number, c: number) => p + c, 0) / array.length;

        const averageTemperature = Math.ceil(
          average(
            dayWeather.map((weather: Weather) => weather.temperatureCelsius),
          ),
        );

        const prevalentCondition = this.getDayForecast(dayWeather);

        const adjustedHourDate = new Date(key);
        adjustedHourDate.setHours(6);
        return {
          dateTime: adjustedHourDate,
          temperatureCelsius: averageTemperature,
          weatherCondition: prevalentCondition ? prevalentCondition : '',
        };
      },
    );

    return averagedDayWeather;
  }

  getDayForecast(dayWeather: Weather[]) {
    const disruptiveConditions = [
      'thunderstorm',
      'showers',
      'heavy-rain',
      'snowy',
      'sleet',
    ];

    if (dayWeather) {
      const weather = [...dayWeather];

      const disruptiveWeather = weather.find((weather: Weather) =>
        disruptiveConditions.includes(weather.weatherCondition),
      );

      if (!this.currentTimezone) {
        return;
      }

      if (disruptiveWeather) {
        return disruptiveWeather?.weatherCondition;
      }

      const conditionOccurences = [
        { condition: 'clear', occurences: 0 },
        { condition: 'partly-cloudy', occurences: 0 },
        { condition: 'overcast', occurences: 0 },
        { condition: 'fog', occurences: 0 },
      ];

      weather.forEach((weather: Weather) => {
        const occurence = conditionOccurences.find(
          (conditionOccurence) =>
            conditionOccurence.condition === weather.weatherCondition,
        );
        if (occurence) {
          occurence.occurences++;
        }
      });

      const prevalentCondition = conditionOccurences.reduce((prev, current) => {
        return prev.occurences > current.occurences ? prev : current;
      });

      return prevalentCondition.condition;
    }
    return;
  }

  selectDayWeather(dateTime: Date) {
    const dayDate = this.datePipe.transform(dateTime, 'M-d-y');

    if (!dayDate) {
      return;
    }

    const laterDayDate = new Date(dateTime.toString());
    laterDayDate.setDate(laterDayDate.getDate() + 1);

    const nextDayDate = this.datePipe.transform(laterDayDate, 'M-d-y');

    if (!nextDayDate) {
      return;
    }

    this.currentlySelectedWeather = this.currentMonthlyWeather[dayDate];
    this.currentlySelectedWeather.push(
      this.currentMonthlyWeather[nextDayDate][0],
    );

    if (!this.currentlySelectedSingularWeather?.dateTime) {
      return;
    }

    this.selectHourWeather(this.currentlySelectedWeather[0].dateTime);

    this.updateChartData();
  }

  selectHourWeather(dateTime: Date) {
    const dayDate = this.datePipe.transform(
      new Date(dateTime.toString()),
      'M-d-y',
    );

    if (!dayDate) {
      return;
    }

    // this.currentlySelectedWeather = this.currentMonthlyWeather[dayDate];

    const hourWeather = this.currentMonthlyWeather[dayDate].find(
      (weather: Weather) => {
        const dayAndHour = this.datePipe.transform(
          new Date(dateTime.toString()),
          'short',
        );

        if (
          dayAndHour ===
          this.datePipe.transform(
            new Date(weather.dateTime.toString()),
            'short',
          )
        ) {
          return true;
        }
        return false;
      },
    );

    if (!hourWeather) return;

    this.currentlySelectedSingularWeather = hourWeather;
  }

  getMonthlyWeather(weather: Weather[]) {
    const daysWithWeather: Record<string, Weather[]> = {};

    const dates = weather.map((weather: Weather) =>
      this.datePipe.transform(new Date(weather.dateTime.toString()), 'M-d-y'),
    );

    if (!dates) {
      return daysWithWeather;
    }

    const uniqueDates = new Set(dates);
    uniqueDates.forEach((date) => {
      if (!date) {
        return;
      }
      daysWithWeather[date] = [];
    });

    weather.forEach((weather: Weather) => {
      const dateKey = this.datePipe.transform(
        new Date(weather.dateTime.toString()),
        'M-d-y',
      );

      if (!dateKey || dateKey === null) {
        return;
      }

      daysWithWeather[dateKey].push(weather);
    });

    return daysWithWeather;
  }

  getUvIndexSliderClass(uvi: number): string {
    if (!uvi) {
      return '';
    }

    const uvIndexSlideAmount = (Math.min(Math.max(uvi, 1), 10) / 10) * 9;

    return uvIndexSlideAmount.toString() + 'rem';
  }

  getUvIndexClassification(uvi: number): string {
    if (!uvi) {
      return '';
    }

    switch (true) {
      case uvi > 0 && uvi < 3:
        return this.translocoService.translate('location.details.uvi-low');
      case uvi > 2 && uvi < 6:
        return this.translocoService.translate('location.details.uvi-moderate');
      case uvi > 5 && uvi < 8:
        return this.translocoService.translate('location.details.uvi-high');
      case uvi > 7 && uvi < 11:
        return this.translocoService.translate(
          'location.details.uvi-very-high',
        );
      case uvi > 10:
        return this.translocoService.translate('location.details.uvi-extreme');
      default:
        return '';
    }
  }

  getAirQualityIndexSliderClass(aqi: number): string {
    if (!aqi) {
      return '';
    }

    const airQualityIndexSlideAmount = (aqi / 500) * 13;

    return airQualityIndexSlideAmount.toString() + 'rem';
  }

  getAirQualityIndexClassification(aqi: number): string {
    if (!aqi) {
      return '';
    }

    switch (true) {
      case aqi > 0 && aqi < 51:
        return this.translocoService.translate('location.details.aqi-good');
      case aqi > 50 && aqi < 101:
        return this.translocoService.translate('location.details.aqi-moderate');
      case aqi > 100 && aqi < 151:
        return this.translocoService.translate('location.details.aqi-poor');
      case aqi > 150 && aqi < 201:
        return this.translocoService.translate(
          'location.details.aqi-unhealthy',
        );
      case aqi > 200 && aqi < 301:
        return this.translocoService.translate(
          'location.details.aqi-very-unhealthy',
        );
      case aqi > 300 && aqi < 501:
        return this.translocoService.translate('location.details.hazardous');
      default:
        return '';
    }
  }

  onWheel(event: WheelEvent): void {
    const container = document.getElementById('day-weather-container');

    if (!container) {
      return;
    }

    container.scrollLeft += event.deltaY * 2;
  }

  onChangeHourlyWeatherStyle(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;

    this.hourlyWeatherStyleToggle = isChecked === true ? 'graph' : 'list';
  }

  selectGraphType(type: 'temperature' | 'precipitation' | 'wind') {
    this.selectedGraphType = type;
    this.updateChartData();
  }

  getCurrentFont() {
    return this.settingsService.currentFont$;
  }

  getUnitAdjustedTemperature(temperature: number) {
    return this.currentTemperatureUnits === 'celsius'
      ? Math.round(temperature)
      : Math.round((temperature * 9) / 5 + 32);
  }

  getUnitAdjustedSpeed(speed: number) {
    return this.currentSpeedUnits === 'kilometers'
      ? speed
      : Math.round(speed * 0.621371);
  }
}
