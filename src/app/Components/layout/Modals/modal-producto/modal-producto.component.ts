import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formularioProducto: FormGroup;
  tituloModal: string = "Agregar";
  botonModal: string = "Guardar";
  listaCategoria: Categoria[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProducto: Producto,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _producoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProducto = fb.group({
      nombre: ["", [Validators.required]],
      idCategoria: ["", [Validators.required]],
      stock: ["", [Validators.required]],
      precio: ["", [Validators.required]],
      esActivo: ["", [Validators.required]]
    });

    if (this.dataProducto != null) {
      this.tituloModal = "Editar";
      this.botonModal = "Actualizar"
    }


    this._categoriaServicio.lista().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.listaCategoria = resp.value;
        }
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
      }
    });


  }

  ngOnInit(): void {
    if (this.dataProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.dataProducto.nombre,
        idCategoria: this.dataProducto.idCategoria,
        stock: this.dataProducto.stock,
        precio: this.dataProducto.precio,
        esActivo: this.dataProducto.esActivo.toString(),
      });
    }
  }

  guardarEditar_Producto() {

    const _producto: Producto = {
      idProducto: this.dataProducto == null ? 0 : this.dataProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo)
    }

    //ejecutar el servico para guardar o editar
    if (this.dataProducto == null) {//guardar
      this._producoServicio.guardar(_producto).subscribe({
        next: (resp) => {
          if (resp.status) {
            this._utilidadServicio.mensajeSucess("Producto Registrado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mensajeError("No se resgitro el Producto", "Error");
          }
        },
        error: () => {
          this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
        }
      });
    } else {
      this._producoServicio.editar(_producto).subscribe({
        next: (resp) => {
          if (resp.status) {
            this._utilidadServicio.mensajeSucess("Producto Actualizado", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadServicio.mensajeError("No se edito el Producto", "Error");
          }
        },
        error: () => {
          this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
        }
      });
    }
  }

}
