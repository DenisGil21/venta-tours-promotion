import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../interfaces/empresa.interface';
import { PaqueteService } from '../../../services/paquete.service';
import { CaracteristicaService } from '../../../services/caracteristica.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Paquete } from '../../../interfaces/paquete.interface';
import { Caracteristica } from '../../../interfaces/caracteristica.interface';

@Component({
  selector: 'app-admin-paquete',
  templateUrl: './admin-paquete.component.html',
  styleUrls: ['./admin-paquete.component.css']
})
export class AdminPaqueteComponent implements OnInit {

  public paqueteForm:FormGroup;
  public empresas:Empresa[];
  public portada:File;
  public imgTemp:any = null;
  public imgCarga:string;
  public paqueteSeleccionado:Paquete;
  public caracteristicasSeleccionado:Caracteristica[]=[];
  public caracteristicasEliminar:number[] = [];

  constructor(private fb: FormBuilder, private empresaService: EmpresaService, private paqueteService: PaqueteService, private caracteristicaService: CaracteristicaService,
    private router:Router, private activatedRoute: ActivatedRoute) { }

  get caracteristicas(){
    return this.paqueteForm.get('caracteristicas') as FormArray;
  }

  get informacion(){
    return this.paqueteForm.get('informacion') as FormArray;
  }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe(({id}) => this.cargarPaquete(id));
    this.formulario();
    this.cargarEmpresas();
  }

  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe(empresas => {
      console.log(empresas);
      
      this.empresas = empresas;
    });
  }

  campoNoValido(campo:string):boolean {
    return this.paqueteForm.get(campo).invalid  && this.paqueteForm.get(campo).touched
  }

  formulario(){
    this.paqueteForm = this.fb.group({
      nombre: ['', Validators.required],
      precio_adulto: ['', Validators.required],
      precio_nino: ['', Validators.required],
      empresa: ['', Validators.required],
      descripcion: ['', Validators.required],
      caracteristicas: this.fb.array([]),
      informacion: this.fb.array([])
    });
  }

  cargarPaquete(id:string){
    if (id == 'nuevo') {
      return;
    }
    this.paqueteService.cargarPaquete(Number(id))
    .subscribe(paquete => {
      console.log(paquete);
      this.paqueteSeleccionado = paquete;
      this.caracteristicasSeleccionado = paquete.caracteristicas;
      this.paqueteForm.reset({nombre:paquete.nombre, precio_adulto: paquete.precio_adulto, precio_nino: paquete.precio_nino,
      empresa:paquete.empresa.id, descripcion: paquete.descripcion});

      paquete.caracteristicas.forEach(valor => {
        this.caracteristicas.push(this.fb.control({value:valor.descripcion, disabled:true}));
      });
      paquete.informacion.forEach(valor => {
        this.informacion.push(this.fb.control({value:valor, disabled:true}))
      });

      this.imgCarga = paquete.portada;
    });
  }

  guardarPaquete(){
    if (this.paqueteForm.invalid) {
      return Object.values(this.paqueteForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    if(!this.paqueteSeleccionado){
      if(!this.portada){
        Swal.fire('Error', 'Debe seleccionar una portada', 'error');  
          return ;
      }
      const allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
      if(!allowedExtensions.exec(this.portada.name)){
        Swal.fire('Error', 'Debe ser una imagen con una de las siguientes extensiones (.jpeg/.jpg/.png/.gif)', 'error');  
          return ;
      }
    }
    if (this.paqueteSeleccionado) {
      this.paqueteService.actualizarPaquete(this.paqueteForm.value,this.paqueteSeleccionado.id)
      .subscribe(resp => {
        this.caracteristicasEliminar.forEach(valor => {
          this.caracteristicaService.eliminarCaracteristica(valor).subscribe();
        })
        this.caracteristicas.controls.forEach(valor => {
          let encontro = this.caracteristicasSeleccionado.find(value => value.descripcion == valor.value);
          if(!encontro){
            this.caracteristicaService.guardarCaracteristica(valor.value,resp.id).subscribe();
          }
        });
        this.paqueteService.subirPortada(this.portada, resp.id)
        .then(portada => {
          console.log(portada);
          
        }).catch(err => {
          console.log(err);
        });
        Swal.fire('Actualizado', 'Paquete actualizado correctamente', 'success');
        this.router.navigateByUrl('/account/paquetes')
      }),(err) => {
        Swal.fire('Error', err, 'error');
      };
    }else{
      const data = {
        ...this.paqueteForm.value
      }
      delete data.caracteristicas;
  
      this.paqueteService.guardarPaquete(data)
      .subscribe(resp => {
        this.caracteristicas.controls.forEach(valor => {
          this.caracteristicaService.guardarCaracteristica(valor.value,resp.id).subscribe();
        });
        this.paqueteService.subirPortada(this.portada, resp.id)
        .then(portada => {
          console.log(portada);
          
        }).catch(err => {
          console.log(err);
          
        });
        Swal.fire('Creado', 'Paquete creado correctamente', 'success');
        this.router.navigateByUrl(`/account/galeria/paquete/${resp.id}`)
      }),(err) => {
        Swal.fire('Error', err, 'error');
      };
    }
    
  }


  borrarCaracteristica(i:number,id:number){    
    if (this.paqueteSeleccionado) {      
      this.caracteristicasSeleccionado = this.caracteristicasSeleccionado.filter(value => value.id != id);
      this.caracteristicasEliminar.push(id);
    }
    this.caracteristicas.removeAt(i);
  }

  agregarCaracteristica(){
    this.caracteristicas.push(this.fb.control(''));
  }

  borrarInformacion(i:number){
    this.informacion.removeAt(i);
  }

  agregarInformacion(){
    this.informacion.push(this.fb.control(''));
  }

  cambiarPortada(file:File){
    this.portada = file;
    if (!file) {
      return this.imgTemp = null;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

}
