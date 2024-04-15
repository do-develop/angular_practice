import { WeatherService } from './services/weather.service';
import { GeolocationService } from './services/geolocation.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Angular's data binding
  weatherDescription: string | null = null;
  weatherImageUrl: string | null = null;
  currentTemperature: number | null = null;
  currentWind: string | null = null;
  currentWindDirection: string | null = null;
  currentCloudCover: string | null = null;
  cityName?:string;
  selectedCityName?: string;
  cityResults: any[] = [];

  constructor(private weatherService: WeatherService, private geolocationService: GeolocationService){}

  ngOnInit(): void {
    // By default, the app will show the weather for Tromsø
    this.selectedCityName = 'Tromsø';
    const latitude = '69.6489';
    const longitude = '18.9551';
    this.get_weather_details(latitude, longitude);
  }

  onSubmit() {
    if(this.cityName){
      this.get_geolocation_data(this.cityName);
    }
    
  }


  private convert_time_to_hour_position(current_time: string): number {
    var hour_pos = current_time.split('T')[1].split(':')[0];
    return parseInt(hour_pos);
  }

  private get_weather_details(latitude: string, longitude: string){
    this.weatherService.getWeatherData(latitude, longitude)
      .subscribe(
        (response) => {
          console.log("response: ", response);
          const currentWeatherCode = response.current.weather_code;
          this.currentTemperature = response.current.temperature_2m;
          this.currentWind = response.current.wind_speed_10m;
          this.currentWindDirection = response.current.wind_direction_10m;
          this.weatherService.getDescriptionByCode(currentWeatherCode).subscribe(
            (description) => {
              this.weatherDescription = description.description;
              this.weatherImageUrl = description.image;
            }
          );
          const current_time = response.current.time;
          var position = this.convert_time_to_hour_position(current_time);
          this.currentCloudCover = response.hourly.cloud_cover[position];
        },
        (error) => {
          console.error('Error fetching weather data:', error);
        }
      );
  }


  private get_geolocation_data(address: string){
    this.geolocationService.getGeolocation(address).subscribe(data => {
      // console.log("Result of rest call: ", data);
      data.results.forEach((result: any) => {
        //console.log("formatted_address: ", result.geometry.location.lat, result.geometry.location.lng);
        this.cityResults.push({"name": result.formatted_address, "latitude": result.geometry.location.lat, "longitude": result.geometry.location.lng});
      })
    });
    return this.cityResults;
  }


  selectCity(city: {name: string, latitude: string, longitude: string}) {
    this.selectedCityName = city.name;
    this.get_weather_details(city.latitude, city.longitude);
  }

}// END OF AppComponent OnInit
