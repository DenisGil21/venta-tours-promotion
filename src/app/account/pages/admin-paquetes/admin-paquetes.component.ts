import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { PaqueteService } from '../../../services/paquete.service';
import { Paquete } from '../../../interfaces/paquete.interface';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-admin-paquetes',
  templateUrl: './admin-paquetes.component.html',
  styleUrls: ['./admin-paquetes.component.css']
})
export class AdminPaquetesComponent implements OnInit, AfterViewChecked {

  
  public cargando = true;
  public paquetes:Paquete[];
  public nextPage:string;
  public previousPage:string;

  constructor(private paqueteService: PaqueteService, private router:Router, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {      
      this.cargarPaquetes(params.busqueda)
    });
  }

  ngAfterViewChecked(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }

  editarPaquete(id:number){
    $('[data-toggle="tooltip"]').tooltip('dispose');
    this.router.navigateByUrl(`/account/paquete/${id}`);
  }

  irGaleria(id:number){
    $('[data-toggle="tooltip"]').tooltip('dispose');
    this.router.navigateByUrl(`/account/galeria/paquete/${id}`);
  }

  cargarPaquetes(busqueda?:string){
    this.cargando = true;
    this.paqueteService.cargarPaquetes(busqueda)
    .subscribe((paquetes) => {
      this.paquetes = paquetes.data;
      this.nextPage = paquetes.next_page_url;
      this.previousPage = paquetes.prev_page_url;
      this.cargando = false
    });
  }


  eliminarPaquete(paquete:Paquete){
    Swal.fire({
      title: '¿Eliminar paquete?',
      text: `Esta a punto de eliminar a ${paquete.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.paqueteService.eliminarPaquete(paquete.id)
        .subscribe(() => {
          Swal.fire(
            'Paquete eliminado',
            `${paquete.nombre} fue eliminado correctamente`,
            'success'
            );
            this.cargarPaquetes();
        });
      }
    })
  }

  cargaDataPaginacion(event:any) {
    this.paquetes=event;
  }

}
