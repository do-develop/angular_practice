import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { fetchWeatherApi } from 'openmeteo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherDescription } from '../models/weather-description'; 
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private weatherUrl = environment.weatherApiBaseUrl;
  private weatherDescriptionPath = './assets/weather_description.json';

  constructor(private http: HttpClient, private geolocationService: GeolocationService) { }

  getWeatherData(latitude: string, longitude: string): Observable<any> {

    const params = new HttpParams()
      .set('latitude', latitude)
      .set('longitude', longitude)
      .set('current', 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day,rain,cloud_cover')
      .set('hourly', 'temperature_2m,precipitation,cloud_cover')
      .set("daily", "weather_code,sunrise,sunset,daylight_duration,uv_index_max")

    return this.http.post<any>(this.weatherUrl, params)
  }

  getWeatherDescription(): Observable<WeatherDescription> {
    return this.http.get<WeatherDescription>(this.weatherDescriptionPath);
  }

  getDescriptionByCode(code: string): Observable<{ description: string | null, image: string | null }> {
    return this.getWeatherDescription().pipe(
      map((data: WeatherDescription) => {
        // Check if the code exists in the JSON data
        if (data[code]) {
          // Return the description for the code
          return {
            description: data[code].day.description,
            image: data[code].day.image
          };
        } else {
          return { description: null, image: null }; // Return null if code not found
        }
      })
    );
  }


}

