import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
Chart.register(...registerables);


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  totalIngresos: string = "0";
  totalVenta: string = "0";
  totalProducto: string = "0";

  constructor(
    private dashService: DashBoardService,
    private utilidadService: UtilidadService
  ) { }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.dashService.resumen().subscribe({
      next: (resp) => {
        if (resp.status) {
          this.totalIngresos = resp.value.totalIngresos;
          this.totalVenta = resp.value.totalVentas;
          this.totalProducto = resp.value.totalProductos;

          const arrayData: any[] = resp.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          console.dir(labelTemp);
          console.dir(dataTemp);

          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: () => {
        this.utilidadService.mensajeError("Hubo un problema con el Servidor", "Error");
      }
    });
  }

}
