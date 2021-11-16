import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  
  public usuario:Usuario;
  public perfilForm:FormGroup;

  public passwordForm = this.fb.group({
    old_password: ['', Validators.required],
    password: ['', [Validators.required,Validators.minLength(5)]],
    password2: ['', Validators.required]
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private usuarioiService:UsuarioService, private fb:FormBuilder) {
      this.usuario = usuarioiService.usuario;
   }

  ngOnInit(): void {
    this.formularioPerfil();
  }

  formularioPerfil(){
    this.perfilForm = this.fb.group({
      email: [this.usuario.email,[Validators.required,Validators.email]],
      first_name: [this.usuario.first_name,Validators.required],
      last_name: [this.usuario.last_name, Validators.required],
    })
  }

  campoNoValido(campo:string):Boolean{
    return this.perfilForm.get(campo).invalid && this.perfilForm.get(campo).touched
  }

  campoNoValidoPassword(campo:string):Boolean{    
    return this.passwordForm.get(campo).invalid && this.passwordForm.get(campo).touched
  }

  actualizarPerfil(){    
    if (this.perfilForm.invalid) {
      return Object.values(this.perfilForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    this.usuarioiService.actualizarPerfil(this.usuario.id,this.perfilForm.value)
    .subscribe(data => {
      Swal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
    },(err) => {
      Swal.fire('Error', err, 'error');
    });
  }

  actualizarPassword(){
    if (this.passwordForm.invalid) {
      return Object.values(this.passwordForm.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }

    const data = {
      ...this.passwordForm.value
    }
    delete data.password2;
    this.usuarioiService.actualizarPerfil(this.usuario.id,data)
    .subscribe(data => {
      console.log(data);
      Swal.fire('Actualizado', 'Contraseña actualizado correctamente', 'success');
    },(err) => {      
      Swal.fire('Error', err.error.message, 'error');
    });
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return (formGroup: FormGroup) => {
      const pass1Control =  formGroup.get(pass1Name);
      const pass2Control =  formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({noEsIgual:true});
      }

    }

  }

}
