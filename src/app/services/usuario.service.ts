import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Login } from '../interfaces/login.interface';
import { of, Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Registro } from '../interfaces/registro.interface';


const base_url = environment.base_url;
const url = `${base_url}/api/users`;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario:Usuario;

  constructor(private http:HttpClient) { }

  get headers(){
    return {
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  }
  
  login(credenciales:Login){
    return this.http.post(`${base_url}/api/auth/login`, credenciales)
    .pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  }

  validarToken():Observable<boolean>{
    return this.http.get(`${base_url}/api/auth/refresh`,this.headers)
    .pipe(
      map((resp:any)=>{                
        const {email, first_name, last_name, role,  id} = resp.usuario;
        this.usuario = new Usuario(email, first_name, last_name, role, id);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('email',email)
        return true
      }),
      catchError(error => of(false))
    );
  }

  registroUsuario(data:Registro){
    return this.http.post(url,data)
    .pipe(
      tap((resp:any)=>{
        localStorage.setItem('token', resp.token)
      })
    )
  }

  actualizarPerfil(id:number,data:any){
    return this.http.put(`${url}/${id}`,data, this.headers)
    .pipe(
      tap((resp:any)=> {
        const {email, first_name, last_name, role,  id} = resp.usuario;
        this.usuario = new Usuario(email, first_name, last_name, role, id);
      })
    );
  }

  obtenerUsusarios(filtro?:string){
    const options = filtro ?
    { headers:new HttpHeaders().set('Authorization',`Bearer ${localStorage.getItem('token')}`), params: new HttpParams().set('nombre', filtro) } : 
    {headers:new HttpHeaders().set('Authorization',`Bearer ${localStorage.getItem('token')}`)};
    return this.http.get(url,options).pipe(
      map((resp:{next:string, previous:string, results:Usuario[]}) => resp) 
    )
  }

  // desactivarUsuario(id:number){
  //   return this.http.delete(`${url}/${id}`,this.headers)
  // }

  eliminarUsuario(id:number){
    return this.http.delete(`${url}/${id}`,this.headers)
  }

}
