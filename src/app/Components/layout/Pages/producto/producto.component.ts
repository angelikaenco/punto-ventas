import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { ModalProductoComponent } from '../../Modals/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTable: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'accion'];
  dataInicio: Producto[] = [];
  dataListaProducto = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerProductos() {
    this._productoService.lista().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.dataListaProducto.data = resp.value;
        } else {
          this._utilidadServicio.mensajeWarning("No hay datos registrados.", "Advertencia");
        }
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el Servidor.", "Error");
      }
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProducto.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProducto.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto() {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.obtenerProductos();
      }
    });
  }

  editarProducto(producto: Producto) {
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado == "true") {
        this.obtenerProductos();
      }
    });
  }


  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: "¿Desea eliminar el Producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, Eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, Volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoService.eliminar(producto.idProducto).subscribe({
          next: (resp) => {
            if (resp.status) {
              this._utilidadServicio.mensajeSucess("Producto eliminado", "Exito");
              this.obtenerProductos();
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
