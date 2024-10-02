import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule
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
 
}
