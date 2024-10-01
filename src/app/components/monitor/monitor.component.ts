import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PoComponentsModule, PoTableColumn } from '@po-ui/ng-components';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    FormsModule,
    PoComponentsModule,
    JsonPipe,
    PoCodeEditorModule
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})
export class MonitorComponent implements OnInit{
  jsonTeste:Object = {
      nome: "Renan", 
      idade: 34,
      nacionalidade: "Brasileiro",
      conjuge: {
        nome: "Milena",
        idade: 27
      },
      filhos: [
        {
          nome: "Sarah",
          idade: 10
        },
        {
          nome: "Ayla",
          idade: 2
        },
      ]
    }

  ngOnInit(): void {
  }
  

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
