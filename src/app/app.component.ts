import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';
import { MonitorComponent } from "./components/monitor/monitor.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
    MonitorComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Parametros', action: this.modalParameters, icon: 'po-icon-settings', shortLabel: 'Parametros' },    
    { label: 'Filtros', action: this.modalFilters, icon: 'po-icon-filter', shortLabel: 'Filtros' },
    { label: 'Atualizar', action: this.modalFilters, icon: 'po-icon-refresh', shortLabel: 'Atualizar' },
    { label: 'Exportar para Excel', action: this.modalFilters, icon: 'po-icon-doc-xls', shortLabel: 'Excel' }
  ];

  private modalParameters(){
    alert("parameters")
  }

  private modalFilters(){
    alert("filters")
  }

  private refresh(){
    alert("Refresh")
  }

  private exportExcel(){
    alert("Excel")
  }
}
