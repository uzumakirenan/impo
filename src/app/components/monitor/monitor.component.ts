import { JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoComponentsModule,PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { MonitorService } from '../../services/monitor.service';
import { IntegracaoFilter } from '../../interfaces/integracao.interfaceFilter';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    FormsModule,
    PoComponentsModule,
    JsonPipe
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss'
})

export class MonitorComponent implements OnInit{
  @ViewChild('modalFilters', { static: true }) modalFilters?:PoModalComponent
  @ViewChild('modalParameter', { static: true }) modalParameter?:PoModalComponent

  loading:boolean = false
  integrations:any[] = []
  retornoIntegracao?:string = ""
  tipoJson:string = "Json Enviado"
  jsonEnviado?:string
  jsonRetorno?:string
  filters:IntegracaoFilter = new IntegracaoFilter()
  lastFilters?:IntegracaoFilter
  pasoeIsConnected:string = "pasoeON"
  bancosDisconectados:string = ""
  autoRefreshSwitch:boolean = false
  intervalAutoRefresh?:any
  lastUpdate?:Date
  firstSearch:boolean = true

  constructor(
    private monitorService: MonitorService,
    public notificationsService: PoNotificationService,
  ){}

  currentRequest?:any

  ngOnInit(): void {
    this.getStatusPasoe()
  }
  
  public readonly integracaoTableColumns: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status', 
      type: 'columnTemplate'
      //color: this.rowColor.bind(this) 
    },
    { property: 'dtIntegracao', label: 'Data Integração', type: "date" },
    { property: 'horaIniIntegracao', label: 'Hr Ini. Integração' },
    { property: 'horaIniApiDts', label: 'Hora Ini Api Dts' },
    { property: 'horaFimApiDts', label: 'Hora Fim Api Dts' },
    { property: 'horaFimIntegracao', label: 'Hora Fim Integração' },
    { property: 'emp', label: 'Empresa' },
    { property: 'estab', label: 'Estabelecimento' },
    { property: 'matricula', label: 'Matrícula' },
    { property: 'nomeFuncionario', label: 'Nome Funcionário' },
    { property: 'dataCalendario', label: 'Data Calendario', type: "date" },
    { property: 'escala', label: 'Escala', type: 'number' },
    { property: 'kdiario', label: 'KDiario' },
    { property: 'tipoDia', label: 'Tipo Dia' },
    { property: 'inicioJornada1', label: 'Ini Jornada 1', type: "dateTime" },
    { property: 'fimJornada1', label: 'Fim Jornada 1', type: "dateTime" },
    { property: 'inicioJoranada2', label: 'Ini Jornada 2' },
    { property: 'fimJoranada2', label: 'Fim Jornada 2' },
    { property: 'sindicato', label: 'Sindicato' },
    { property: 'posto', label: 'Posto' }
  ];

  cancelRequest(){
    this.loading = false
    this.currentRequest.unsubscribe()
    this.currentRequest = undefined    
  }

  getIntegrations(){
    this.currentRequest = this.monitorService.getIntegrations(this.filters).subscribe({
      next: result => {
        this.integrations = result.items
        this.lastUpdate = new Date()
      },

      error: e => {
        console.log(e)
      },

      complete: () => {
        this.loading = false
      }
    })
  }

  clickInIntegration(e:any){
    this.retornoIntegracao = e.retornoIntegracao
    this.jsonEnviado = JSON.parse(e.jsonEnviado)
    this.jsonRetorno = JSON.parse(e.jsonRetorno)
    
  }

  clickOutIntegration(){
    this.retornoIntegracao = ""
    this.jsonEnviado = undefined
    this.jsonRetorno = undefined
  }

  numeraisIntegracao(tipo:number):number{
    switch(tipo){
      case 1:
        return this.integrations.length
        break;

      case 2:
        return this.integrations.filter(x => x.situacao == "ERRO").length
        break;  

      case 3:
        return this.integrations.filter(x => x.situacao == "OK").length
        break;

      default:
        return 0
        break;
    }
  }

  refresh(){
    this.integrations = []
    this.jsonEnviado = undefined
    this.jsonRetorno = undefined
    this.retornoIntegracao = ""
    this.getIntegrations()
  }
  
  openFilter(){
    this.lastFilters = JSON.parse(JSON.stringify(this.filters))
    this.modalFilters?.open()
  }

  okFilter(){
    this.lastFilters = JSON.parse(JSON.stringify(this.filters))
    setTimeout(()=>{
      //VALIDAÇÕES FILTRO
      
      const dataIniSplit = this.filters.dtIniIntegracao.toString().split("-")
      const dataFimSplit = this.filters.dtFimIntegracao.toString().split("-")
      
      const dataLimite = new Date(Number(dataIniSplit[0]), Number(dataIniSplit[1]), Number(dataIniSplit[2]))      
      const dataFim = new Date(Number(dataFimSplit[0]), Number(dataFimSplit[1]), Number(dataFimSplit[2]))      

      dataLimite.setMonth(dataLimite.getMonth() + 3)      

      if(dataFim > dataLimite){
        this.notificationsService.error("Data da integração deve ter um intervalo de no máximo 3 meses.")
      } else if(this.filters.dtIniIntegracao > this.filters.dtFimIntegracao){
        this.notificationsService.error("Data da integração inicial deve ser menor que a data final.")
      } else if(this.filters.horaIniIntegracao > this.filters.horaFimIntegracao){
        this.notificationsService.error("Hora da initegração inicial deve ser menor que a hora final")
      } else if(this.filters.empresaIni > this.filters.empresaFim) {
        this.notificationsService.error("Codigo da empresa inicial deve ser menor que codigo final")
      } else if(this.filters.estabelIni > this.filters.estabelFim){
        this.notificationsService.error("Codigo do estabelecimento inicial deve ser menor que codigo final")
      } else if(this.filters.matriculaIni > this.filters.matriculaFim){
        this.notificationsService.error("Codigo da matricula inicial deve ser menor que codigo final")        
      } else {
        if(this.firstSearch){
          this.firstSearch = false
        }

        this.loading = true
        this.getIntegrations()
        this.modalFilters?.close()
      }     
        
    },100)
  }

  cancelFilter(){
    if(this.lastFilters){
      this.filters = JSON.parse(JSON.stringify(this.lastFilters))
    }
    this.modalFilters?.close()
  }

  resetFilters(){
    this.filters = new IntegracaoFilter()
  }

  openParameter(){
    this.lastFilters = JSON.parse(JSON.stringify(this.filters))
    this.modalParameter?.open()
  }

  okParameter(){
    this.lastFilters = JSON.parse(JSON.stringify(this.filters))
    localStorage.setItem("planejadoSipDts", String(this.filters.planejadoSipDts))
    localStorage.setItem("movimentacaoSipDts", String(this.filters.movimentacaoSipDts))
    localStorage.setItem("marcacoesCarolDtsSip", String(this.filters.marcacoesCarolDtsSip))
    localStorage.setItem("marcacoesCingoSip", String(this.filters.marcacoesCingoSip))
    this.modalParameter?.close()
  }

  cancelParameter(){
    if(this.lastFilters){
      this.filters = this.lastFilters = JSON.parse(JSON.stringify(this.lastFilters))
    }
    this.modalParameter?.close()
  }

  getStatusPasoe(){
    setInterval(() => {
      this.monitorService.getStatusPasoe().subscribe({
        next: result => {
          this.pasoeIsConnected = result.status
          this.bancosDisconectados = result.bancosDisconectados
        },

        complete: () => {
          if(this.pasoeIsConnected && this.bancosDisconectados.length > 0){
            this.pasoeIsConnected = "pasoeWARNING"
          }
        }
      })
    }, 30000)
  }

  autoRefresh(){
    this.intervalAutoRefresh = setInterval(()=>{
      this.refresh()
      this.lastUpdate = new Date()
    }, 10000)
  }

  changeAutoRefresh(e:any){
    if(e == false){
      clearInterval(this.intervalAutoRefresh)
    } else {
      this.autoRefresh()
    }
  }
}
