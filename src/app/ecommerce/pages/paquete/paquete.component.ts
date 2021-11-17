import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaqueteService } from '../../../services/paquete.service';
import { Paquete } from '../../../interfaces/paquete.interface';
import { Galeria } from '../../../interfaces/galeria.iterface';

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.css']
})
export class PaqueteComponent implements OnInit {

  public paquete:Paquete;
  public galerias: Galeria[];
  public cargando:boolean = true;
  public caracteristicas:string[]=[];
  public informacion:string[]=[];
  public urlWhatsApp:string='';

  constructor(private paqueteService:PaqueteService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(({id}) => this.cargarPaquete(id));
  }


  cargarPaquete(id:number){
    this.cargando = true;
    this.paqueteService.cargarPaquete(id)
    .subscribe(paquete => {
      this.paquete = paquete;
      this.galerias = paquete.galerias;
      this.caracteristicas = JSON.parse(paquete.caracteristicas);
      this.informacion = JSON.parse(paquete.informacion);
      this.urlWhatsApp = `https://api.whatsapp.com/send?phone=529321186344&text=Quiero reservar el tour: ${paquete.nombre}`
      this.cargando=false;
      console.log(this.paquete);
    })
  }


}
