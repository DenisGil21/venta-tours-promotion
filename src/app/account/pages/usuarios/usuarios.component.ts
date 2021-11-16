import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, AfterViewChecked {

  public cargando = false;

  public usuarios:Usuario[] = [];
  public nextPage:string;
  public previousPage:string;

  constructor(private usuarioService: UsuarioService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {      
      this.cargarUsuarios(params.busqueda)
    });
  }

  ngAfterViewChecked(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }


  cargarUsuarios(busqueda?:string){
    this.cargando = true;
    this.usuarioService.obtenerUsusarios(busqueda)
    .subscribe(resp => {      
      this.cargando = false;
      this.nextPage = resp.next_page_url;
      this.previousPage = resp.prev_page_url;
      this.usuarios = resp.data;
    })
  }

  eliminarUsuario(usuario:Usuario){
    console.log(usuario);
    
    Swal.fire({
      title: 'Eliminar usuario?',
      text: `Esta a punto de eliminar al usuario ${usuario.first_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario.id)
        .subscribe(() => {
          Swal.fire(
            'Usuario eliminado',
            `${usuario.first_name} fue eliminado correctamente`,
            'success'
            );
            this.cargarUsuarios();
        });
      }
    })
  }

  cargaDataPaginacion(event:any) {
    this.usuarios=event;
  }
}
