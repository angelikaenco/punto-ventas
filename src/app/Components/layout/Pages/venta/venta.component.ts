import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];

  listaProductoVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoPago: string = "Efectivo";
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ["producto", "cantidad", "precio", "total", "accion"];
  datosDetalleVenta = new MatTableDataSource(this.listaProductoVenta);

  //metodo para la busqueda
  retornarProductosFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ["", Validators.required],
      cantidad: ["", Validators.required],
    });

    this.productoService.lista().subscribe({
      next: (resp) => {
        if (resp.status) {
          const lista = resp.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error: () => {
        this._utilidadServicio.mensajeError("Hubo un problema con el Servidor", "Error");
      }
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosFiltro(value);
    });

  }

  ngOnInit(): void {
  }

  //mostrar pro seleccionado
  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  //metodo para registrar
  agregarProductoVenta() {
    const cantidad: number = this.formularioProductoVenta.value.cantidad;
    const precio: number = parseFloat(this.productoSeleccionado.precio);
    const total: number = cantidad * precio;
    this.totalPagar = this.totalPagar + total;

    this.listaProductoVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: cantidad,
      precioTexto: String(precio.toFixed(2)),
      totalTexto: String(total.toFixed(2))
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductoVenta);

    this.formularioProductoVenta.patchValue({
      producto: "",
      cantidad: ""
    });
  }

  //eliminar
  eliminarProducto(detalle: DetalleVenta) {
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
    this.listaProductoVenta = this.listaProductoVenta.filter(p => p.idProducto != detalle.idProducto);

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductoVenta);
  }

  registrarVenta() {
    if (this.listaProductoVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipoPago,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductoVenta
      }
      this.ventaService.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductoVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductoVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              text: `Numero de Venta ${response.value.numeroDocumento}`
            });
          }
          else {
            this._utilidadServicio.mensajeWarning("No se pudo registrar la venta", "Error");
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: () => {
          this._utilidadServicio.mensajeError("Hubo un problema con el servidor", "Error");
        }
      });
    }
  }
}
