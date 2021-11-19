import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {

  constructor(private http:HttpClient) { }


  paginacionData(url:string,urlPrivate=true){
    const options = urlPrivate ? {headers:new HttpHeaders().set('Authorization',`Bearer ${localStorage.getItem('token')}`)}: {};
    return this.http.get(url, options).pipe(
      map((resp:{results:{next_page_url:string, prev_page_url:string, data:any[]}}) => resp.results)
    );
  }
}
