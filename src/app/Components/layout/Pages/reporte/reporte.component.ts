import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Reporte } from 'src/app/Interfaces/reporte';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit {

  formularioFiltro: FormGroup;
  listaVentasReportes: Reporte[] = [];
  columnasTable: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReportes);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private utilidadService: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ["", Validators.required],
      fechaFin: ["", Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    debugger;
    const fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if (fechaInicio === "Invalid date" || fechaFin === "Invalid date") {
      this.utilidadService.mensajeWarning("Ingresar 'Fecha Inicio' y 'Fecha Fin'", "Warning");
      return;
    }

    this.ventaService.reporte(fechaInicio, fechaFin).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.listaVentasReportes = resp.value;
          this.dataVentaReporte.data = resp.value;
        }else{
          this.listaVentasReportes = [];
          this.dataVentaReporte.data = [];
          this.utilidadService.mensajeWarning("No se encontraron datos", "Warning");
        }
      },
      error: () => {
        this.utilidadService.mensajeError("Hubo un problema con el servidor", "Error");
      }
    });
  }

  //esportar excel
  exportarExcel(){
    const wb = XLSX.utils.book_new(); //libro
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReportes);//hoja

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte Ventas.xlsx");
  }

}
