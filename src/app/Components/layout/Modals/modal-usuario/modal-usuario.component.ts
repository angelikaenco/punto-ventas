import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  //clarcion de variables
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloModal: string = "Agregar";
  botonModal: string = "Guardar";
  listaRoles: Rol[] = [];


  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ["", [Validators.required]],
      correo: ["", [Validators.required]],
      idRol: ["", [Validators.required]],
      clave: ["", [Validators.required]],
      esActivo: ["1", [Validators.required]],
    });

    if (this.dataUsuario != null) {
      this.tituloModal = "Editar";
      this.botonModal = "Actualizar"
    }

    this._rolServicio.lista().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.listaRoles = resp.value;
        }
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
      }
    });
  }

  ngOnInit(): void {

    if (this.dataUsuario != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.dataUsuario.nombreCompleto,
        correo: this.dataUsuario.correo,
        idRol: this.dataUsuario.idRol,
        clave: this.dataUsuario.clave,
        esActivo: this.dataUsuario.esActivo.toString(),
      });
    }

  }

  //metoodo para crear e editar
  guardarEditar_Usuario() {

    const _usuario: Usuario = {
      idUsuario: this.dataUsuario == null ? 0 : this.dataUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

    //ejecutar el servico para guardar o editar
    if (this.dataUsuario == null) {//guardar
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (resp) => {
          if (resp.status) {
            this._utilidadServicio.mensajeSucess("Usuario Registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mensajeError("No se resgitro el Usuario", "Error");
          }
        },
        error: () => {
          this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
        }
      });
    } else {
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (resp) => {
          if (resp.status) {
            this._utilidadServicio.mensajeSucess("Usuario Actualizado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mensajeError("No se edito el Usuario", "Error");
          }
        },
        error: () => {
          this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
        }
      });
    }
  }

}
