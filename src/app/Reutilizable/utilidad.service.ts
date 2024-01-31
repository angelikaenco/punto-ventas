import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';
import { ToastrService } from 'ngx-toastr';
import { isDate } from 'moment';


@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(
    private _snackBar: MatSnackBar,
    private toastr: ToastrService
  ) { }


  mensajeSucess(mensaje: string, tipo: string) {
    this.toastr.success(mensaje, tipo, {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  mensajeWarning(mensaje: string, tipo: string) {
    this.toastr.warning(mensaje, tipo, {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  mensajeError(mensaje: string, tipo: string) {
    this.toastr.error(mensaje, tipo, {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  mostrarAlertaGeneral(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  guardarSesionUsuario(usuarioSesion: Sesion) {
    localStorage.setItem("usuario", JSON.stringify(usuarioSesion));
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem("usuario");

    const usuario = JSON.parse(dataCadena!);

    return usuario;
  }

  eliminarSesionUsuario() {
    localStorage.removeItem("usuario")
  }


}


