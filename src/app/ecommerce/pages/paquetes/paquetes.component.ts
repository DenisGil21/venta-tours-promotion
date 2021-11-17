import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { PaqueteService } from '../../../services/paquete.service';
import { Paquete } from '../../../interfaces/paquete.interface';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../interfaces/empresa.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css']
})
export class PaquetesComponent implements OnInit {
  
  public cargando:boolean;
  public paquetes:Paquete[]=[];
  public empresas:Empresa[]=[];
  public empresaFiltro:string;
  public precioFiltro:string;
  public previousPage:string;
  public nextPage:string;

  constructor(private paqueteService:PaqueteService, private empresaService:EmpresaService, private activatedRoute: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    // este es para el efecto de scroll
    AOS.init();
    this.activatedRoute.queryParams.subscribe(params => {  
      console.log(params);
      
      this.empresaFiltro = params.empresa;
      this.precioFiltro = params.precio;  
      this.cargarPaquetes(params.nombre,params.empresa,params.precio)
    });
    this.cargarEmpresas();
    
  }

  // Cargar los paquetes de acuerdo a la busqueda
  // ngOnChanges(): void {
  //   this.cargarPaquetes();    
  // }

  cargarPaquetes(nombre?:string, empresa?:string, precio?:string){    
    this.cargando = true;
    this.paqueteService.cargarPaquetes(nombre, empresa, precio)
    .subscribe((paquetes) => {
      this.cargando = false;
      this.paquetes = paquetes.data;
      this.previousPage = paquetes.prev_page_url;
      this.nextPage = paquetes.next_page_url;
    });
  }

  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe(empresa => {
      this.empresas = empresa;
    });
  }

  filtroEmpresa(nombre:string){ 
    this.router.navigate(['/home'], {queryParams:{empresa:nombre},queryParamsHandling: 'merge'});
  }

  filtroPrecio(mayor:boolean){
    if (mayor) {
      this.router.navigate(['/home'], {queryParams:{precio:'mayor'},queryParamsHandling: 'merge'});
    }else{
      this.router.navigate(['/home'], {queryParams:{precio:'menor'},queryParamsHandling: 'merge'});
    }
  }

  removerFiltroPrecio(){
    this.router.navigate(['/home'], {queryParams:{precio:null},queryParamsHandling: 'merge'});
  }

  removerFiltroEmpresa(){
    this.router.navigate(['/home'], {queryParams:{empresa:null},queryParamsHandling: 'merge'});
  }

  cargaDataPaginacion(event:any) {
    this.paquetes=event;
  }

}
