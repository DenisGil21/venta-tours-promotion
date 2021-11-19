import { Component, OnInit, AfterViewChecked, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../interfaces/venta.interface';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit, AfterViewChecked {

  public cargando = false;
  public ventas:Venta[]=[];
  public venta:Venta;
  public nextPage:string;
  public previousPage:string;
  public usuario:Usuario;

  constructor(private ventaService:VentaService, private router:Router, private activatedRoute:ActivatedRoute, private cdRef:ChangeDetectorRef) {
  }

  ngOnInit(): void {    
    this.activatedRoute.queryParams.subscribe(params => {            
      this.cargarVentas(params.busqueda)
    });

  }

  ngAfterViewChecked(): void {
    $('[data-toggle="tooltip"]').tooltip();
    
  }

  cargarVentas(busqueda?:string){
    this.cargando = true;
    this.ventaService.obtenerVentas(busqueda)
    .subscribe(ventas => {
      this.ventas = ventas.data;
      this.previousPage = ventas.prev_page_url;
      this.nextPage = ventas.next_page_url;  
      this.cargando = false;    
    });
  }

  detalleVenta(venta:Venta){
    this.venta = venta
  }

  eliminarVenta(venta:Venta){
    Swal.fire({
      title: '¿Eliminar venta?',
      text: `Esta a punto de eliminar la venta del paquete ${venta.paquete.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ventaService.eliminarVenta(venta.id)
        .subscribe(() => {
          Swal.fire(
            'Empresa eliminada',
            `La venta del paquete ${venta.paquete.nombre} fue eliminado correctamente`,
            'success'
            );
            this.cargarVentas();
        });
      }
    })
  }


  cargaDataPaginacion(event:any) {
    this.ventas=event;
  }

}
