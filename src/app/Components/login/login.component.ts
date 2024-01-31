import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //creamos variables
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({ //pasamos los campos del formularios
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.mostrarLoading = true;
    //le pasamos los valores o datos del formularios a nuestro request
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };

    //le pasamos nuestra request de tipo login al servicio de iniciar sesion
    this._usuarioServicio.iniciarSesion(request).subscribe({
      next: (data) => {
        if (data.status) { //si el usuario existe 
          //guardamos la sesion del usuario
          this._utilidadServicio.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])//navega a la url de pages
        } else {
          this._utilidadServicio.mensajeWarning("Usuario no registrado!", "Error" )
        };
      },
      complete: () => {
        this.mostrarLoading = false;
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el servidor", "Error")
      }
    });
  }


}
