import { Component } from '@angular/core';
import { PoComponentsModule, PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    PoComponentsModule
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})
export class MonitorComponent {

  public readonly integracaoTableColumns: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status', 
      type: 'columnTemplate'
      //color: this.rowColor.bind(this) 
    },
    { property: 'dtIntegracao', label: 'Data Integração', type: 'date' },
    { property: 'horaIniIntegracao', label: 'Hr Ini. Integração' },
    { property: 'horaIniApiDts', label: 'Hora Inicio Integração' },
    { property: 'horaFimApiDts', label: 'Hora Inicio Integração' },
    { property: 'horaFimIntegracao', label: 'Hora Inicio Integração' },
    { property: 'retornoIntegracao', label: 'Retorno da Integração' },
    { property: 'emp', label: 'Empresa' },
    { property: 'estab', label: 'Estabelecimento' },
    { property: 'matricula', label: 'Matrícula' },
    { property: 'nomeFuncionario', label: 'Nome Funcionário' },
    { property: 'emp', label: 'Empresa' },
    { property: 'dataCalendario', label: 'Data Calendario' },
    { property: 'escala', label: 'Escala' },
    { property: 'kdiario', label: 'KDiario' },
    { property: 'tipoDia', label: 'Tipo Dia' },
    { property: 'inicio-jornada-1', label: 'Ini Jornada 1' },
    { property: 'fim-jornada-1', label: 'Fim Jornada 1' },
    { property: 'inicio-joranada-2', label: 'Ini Jornada 2' },
    { property: 'fim-joranada-2', label: 'Fim Jornada 2' },
    { property: 'sindicato', label: 'Sindicato' },
    { property: 'posto', label: 'Posto' }
  ];
}
