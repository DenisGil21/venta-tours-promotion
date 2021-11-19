import { Component, OnInit } from '@angular/core';
import { DetalleVenta } from '../../../models/detalle-venta.model';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { PaqueteService } from '../../../services/paquete.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VentaService } from '../../../services/venta.service';
import { Paquete } from '../../../interfaces/paquete.interface';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  public detalleVenta = new DetalleVenta();

  public paquete:Paquete;
  public paquetes:Paquete[] = [];
  public cargando:boolean = true;

  public formPago = this.fb.group({
    cliente:['', Validators.required],
    telefono:['', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9,$]*$')]],
    fecha:['', [Validators.required, this.validaFecha]],
    paquete_id:['', Validators.required],
    cantidad_adultos:[0, Validators.min(1)],
    cantidad_ninos:[0, Validators.required],
  });

  constructor(private paqueteService:PaqueteService, private ventaService:VentaService, private fb:FormBuilder, 
    private router: Router, private usuarioService:UsuarioService) { }

  ngOnInit(): void {
    this.cargarPaquetes();
  }

  campoNoValido(campo:string):boolean {
    return this.formPago.get(campo).invalid  && this.formPago.get(campo).touched
  }

  validaFecha(control: FormControl){
    const valor:Date = control.value;
    const dateNow = new Date();
    const dateEntered = new Date(valor);
    if (dateEntered < dateNow) {      
      return {
        fechaInvalida:true
      };
    }    
    return null;
    
  }

  cargarPaquetes(){
    this.cargando = true;
    this.paqueteService.cargarPaquetesSinPaginar()
    .subscribe(paquetes => {
      this.paquetes = paquetes
      this.cargando=false;
    });
  }

  cargarPaquete(){
    let id = this.formPago.get('paquete_id').value;
    this.paqueteService.cargarPaquete(id)
    .subscribe(paquete => {
      this.paquete = paquete
      console.log(this.paquete);
    })
  }

  calcularTotal(adulto:any, nino?:any){
    if (adulto) {
      this.detalleVenta.adulto = this.paquete.precio_adulto * parseInt(adulto);
    }
    if(nino){
      this.detalleVenta.nino = this.paquete.precio_nino * parseInt(nino);
    }
    this.detalleVenta.total = this.detalleVenta.adulto + this.detalleVenta.nino;
  }


  realizarVenta(){    
    if(this.formPago.invalid) {      
      return Object.values(this.formPago.controls).forEach(control => {
        control.markAllAsTouched();
      });
    } 
    const data  = {
      ...this.formPago.value,
      total : this.detalleVenta.total,
      subtotal : this.detalleVenta.total,
      user_id: this.usuarioService.usuario.id
    }
    this.ventaService.crearVenta(data)
      .subscribe(result=>{
        console.log(result);
        Swal.fire('Completado', 'Se ha reservado el paquete', 'success');  
          this.router.navigateByUrl('/account/ventas');
      }, (err) => {
        console.log(err);
        
        Swal.fire('Error', 'Error al reservar el paquete', 'error');  
      });
  }

}
