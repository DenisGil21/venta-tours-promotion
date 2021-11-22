import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Venta } from '../interfaces/venta.interface';

const base_url = environment.base_url;
const url = `${base_url}/api/ventas`;
const urlUser = `${base_url}/api/usuarios`;

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor(private http: HttpClient) { }

  get headers(){
    return {
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  crearVenta(venta:any){    
    return this.http.post(url,venta,this.headers);
  }

  obtenerVentas(busqueda?:string){    
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    let params = new HttpParams();

    const options = busqueda ? 
    { headers, params: params.set('cliente', busqueda) } :
    { headers};
    return this.http.get(url, options)
    .pipe(
      map((resp:{results:{next_page_url:string, prev_page_url:string, data:Venta[]}}) => resp.results)
    )
  }


  editarVenta(id:number,status:number){
    return this.http.put(`${url}/${id}`,{'status':status},this.headers)
  }

  eliminarVenta(id:number){
    return this.http.delete(`${url}/${id}`,this.headers);
  }

}
