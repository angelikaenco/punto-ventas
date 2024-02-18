import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';

import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  listaMenus: Menu[] = [];
  nombreUsuario: string = "";
  correoUsuario: string = "";
  rolUsuario: string = "";

  constructor(
    private router: Router,
    private menuService: MenuService,
    private utilidadService: UtilidadService
  ) { }

  ngOnInit(): void {
    const user = this.utilidadService.obtenerSesionUsuario();
    if (user != null) {
      this.nombreUsuario = user.nombreCompleto;
      this.correoUsuario = user.correo;
      this.rolUsuario = user.rolDescripcion;

      this.menuService.lista(user.idUsuario).subscribe({
        next: (resp) => {
          if (resp.status) {
            this.listaMenus = resp.value;
          }
        },
        error: () => {
          this.utilidadService.mensajeError("Hubo un problema con el Servidor", "Error");
        }
      });
    }

  }


  cerrarSesion(){
    this.utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }

}
