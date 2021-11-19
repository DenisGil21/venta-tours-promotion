import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Paquete } from '../interfaces/paquete.interface';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;
const url = `${base_url}/api/paquetes`;

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {

  constructor(private http: HttpClient) { }

  get headers(){
    return {
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  cargarPaquetes(nombre?:string, empresa?:string, precio?:string){
    console.log(empresa,'desde service');
    
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (empresa) {
      params = params.set('empresa', empresa);
    }
    if(precio){
      params = params.set('precio', precio);
    }
    const options = nombre || empresa || precio ?
    { params } :{};    

    return this.http.get(url,options).pipe(
      map((resp:{paquetes:{next_page_url:string, prev_page_url:string, data:Paquete[]}}) => resp.paquetes)
    );
  }

  cargarPaquetesSinPaginar(){
    let params = new HttpParams().set('all','');
    return this.http.get(url,{params}).pipe(
      map((resp:{ paquetes:Paquete[]}) => resp.paquetes)
    );
  }

  cargarPaquete(id:number){
    return this.http.get(`${url}/${id}`).pipe(
      map((resp:{paquete:Paquete})=>resp.paquete)
    );
  }

  eliminarPaquete(id:number){
    return this.http.delete(`${url}/${id}`,this.headers);
  }


  guardarPaquete(paquete:any){
    return this.http.post(url,paquete,this.headers).pipe(
      map((resp:{paquete:Paquete}) => resp.paquete)
    )
  }

  actualizarPaquete(paquete:any, id:number){
    return this.http.put(`${url}/${id}`,paquete,this.headers)
    .pipe(
      map((resp:{paquete:Paquete}) => resp.paquete)
    );
  }

  async subirPortada(portada: File, id: number){    
    try {
      const formData = new FormData();
      formData.append('portada', portada);
      formData.append('_method', 'put');
      const resp = await fetch(`${url}/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        body: formData
      });
      
      const data = await resp.json();            
      if(data.portada){
        return true;
      }

    } catch (error) {
      return false;
    }
  }
}
