import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {

  constructor(private http: HttpClient) { }

  // Method to fetch geolocation data based on address
  getGeolocation(address: string): Observable<any> {

    // Construct the request URL
    const url = `${environment.geolocationApiBaseUrl}?address=${encodeURIComponent(address)}&key=${environment.geolocationAPIKey}`;

    // Make the HTTP GET request and return the observable
    return this.http.get(url);
  
  }
}
