import { Weather } from './weather';

export interface Location {
  id: string;
  weather: Weather[];
}
