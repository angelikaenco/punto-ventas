import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modals/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'accion'];
  dataInicio: Usuario[] = [];
  dataListaUsuario = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private dialog: MatDialog,
    private _usuaripServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerUsuarios() {
    this._usuaripServicio.lista().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.dataListaUsuario.data = resp.value;
        } else {
          this._utilidadServicio.mensajeWarning("No hay datos registrados", "Advertencia");
        }
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
      }
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.obtenerUsuarios();
      }
    });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.obtenerUsuarios();
      }
    });
  }


  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: usuario.nombreCompleto,
      icon: "question",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, Eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, Volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._usuaripServicio.eliminar(usuario.idUsuario).subscribe({
          next: (resp) => {
            if (resp.status) {
              this._utilidadServicio.mensajeSucess("Usuario eliminado", "Exito");
              this.obtenerUsuarios();
            } else {
              this._utilidadServicio.mensajeError("No se pudo eliminar", "Error");
            }
          },
          error: () => {
            this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
          }
        });
      }
    });
  }


}
