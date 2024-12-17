import { JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoComponentsModule,PoModalComponent, PoNotificationService, PoTableColumn, PoTableColumnSpacing, PoTableComponent, PoTableDetail, PoTableRowTemplateArrowDirection } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { MonitorService } from '../../services/monitor.service';
import { IntegracaoFilter } from '../../interfaces/integracao.interfaceFilter';
import * as XLSX from 'xlsx-js-style'

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
  @ViewChild('modalMarcacoes', { static: true }) modalMarcacoes?:PoModalComponent
  @ViewChild('modalExportExcel', { static: true }) modalExportExcel?:PoModalComponent
  @ViewChild('listaIntegTable') listaIntegTable?:PoTableComponent
  @ViewChild('tablePlanejadoSipDts') tablePlanejadoSipDts?:PoTableComponent
  @ViewChild('tableMovimentacaoSipDts') tableMovimentacaoSipDts?:PoTableComponent 
  @ViewChild('tableMarcacaoCarolDtsSip') tableMarcacaoCarolDtsSip?:PoTableComponent  

  loading:boolean = false
  integrations:any[] = []
  retornoIntegracao?:string
  tipoJson:string = "Json Enviado"
  jsonEnviado?:string
  jsonRetorno?:string
  filters:IntegracaoFilter = new IntegracaoFilter()
  lastFilters?:IntegracaoFilter
  pasoeIsConnected:string = "pasoeConnecting" //"pasoeON"
  bancosDesconectados:string = ""
  autoRefreshSwitch:boolean = false
  intervalAutoRefresh?:any
  lastUpdate?:Date
  firstSearch:boolean = true
  ultimosRegistros:number = 0
  novosRegistros:number = 0
  totalNovosRegistros:number = 0
  marcacoes:any[] = []

  //caminhoPasoe:string = "http://172.20.32.122:8092/apsv"

  constructor(
    private monitorService: MonitorService,
    public notificationsService: PoNotificationService,
  ){}

  currentRequest?:any

  ngOnInit(): void {
    this.notificationsService.setDefaultDuration(3000)
    this.getCaminhoPasoe()
    this.getStatusPasoe()
  }

  public readonly directionTableTemplate:PoTableRowTemplateArrowDirection = PoTableRowTemplateArrowDirection.Left
  public readonly spacingColumns:PoTableColumnSpacing = PoTableColumnSpacing.Small
  
  public readonly integracaoTableColumns: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status Integração', 
      type: 'columnTemplate'
      //color: this.rowColor.bind(this) 
    },
    { property: 'tipo', label: 'Tipo da integração' },
    { property: 'dtIntegracao', label: 'Data Integração', type: "date" },
    { property: 'horaIniIntegracao', label: 'Hr Ini. Integração' },
    { property: 'horaFimIntegracao', label: 'Hora Fim Integração' },
    { property: 'horaIniApiDts', label: 'Hora Ini Api Dts' },
    { property: 'horaFimApiDts', label: 'Hora Fim Api Dts' }
  ];

  public readonly envPlanSipDts: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status', 
      type: 'columnTemplate'
    },
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

  public readonly envMovSipDts: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status', 
      type: 'columnTemplate'
    },
    { property: 'emp', label: 'Empresa' },
    { property: 'estab', label: 'Estabelecimento' },
    { property: 'matricula', label: 'Matrícula' }, //funcionario
    { property: 'nomeFuncionario', label: 'Nome Funcionário' },
    { property: 'dataMarcacao', label: 'Data Marcação', type: "date" },
    { property: 'horaMarcacao', label: 'Hora Marcação' },
    { property: 'dataProcesso', label: 'Data Processo', type: "date" },
    { property: 'tipoMovimentacao', label: 'Tipo Movimentação' },
    { property: 'escala', label: 'Escala', type: 'number' },
    { property: 'kdiario', label: 'KDiario' },
    { property: 'tipoDia', label: 'Tipo Dia' },
    { property: 'situacaoAfastamento', label: 'Situação Afastamento' },
    { property: 'cid', label: 'CID' },
    { property: 'crm', label: 'CRM' },
    { property: 'entidade', label: 'Entidade' },
    { property: 'ufEntidade', label: 'UF Entidade' },
    { property: 'turno', label: 'Turno' },
  ];

  public readonly envMarCarolDtsIsp: Array<PoTableColumn> = [
    { 
      property: 'situacao', 
      label: 'Status', 
      type: 'columnTemplate'
    },
    { property: 'emp', label: 'Empresa' },
    { property: 'estab', label: 'Estabelecimento' },
    { property: 'matricula', label: 'Matrícula' }, //funcionario
    { property: 'nomeFuncionario', label: 'Nome Funcionário' },
    { property: 'cpf', label: 'CPF' },
    { property: 'dataProcesso', label: 'Data Processo', type: "date" },
    { 
      property: 'onTimeInfo', 
      label: 'Marcações (Batidas)', 
      type: "columnTemplate" 
    },
    
  ];

  public readonly envMarCingoSip: Array<PoTableColumn> = [
    { property: 'nome', label: 'Nome' },
    { property: 'idade', label: 'Idade' }
  ];

  public readonly columnMarcacoes: Array<PoTableColumn> = [
    { property: 'dataBatida', label: 'Data' },
    { property: 'conteudo', label: 'Hora' }
  ];

  cancelRequest(){
    this.loading = false
    this.currentRequest.unsubscribe()
    this.currentRequest = undefined    
  }

  getCaminhoPasoe(){
    this.monitorService.getEnderecoPasoe().subscribe({
      next: result => {
        this.filters.caminhoPasoe = result.caminhoPasoe
      }
    })
  }

  setCaminhoPasoe(){
    let compareLastFilter:IntegracaoFilter = JSON.parse(JSON.stringify(this.lastFilters))
    
    if(compareLastFilter.caminhoPasoe != this.filters.caminhoPasoe) {
      this.monitorService.setEnderecoPasoe(this.filters.caminhoPasoe).subscribe({
        next: () => {
          this.notificationsService.success(`Endereço PASOE salvo com sucesso.`)
        }
      })
    }    
  }

  getIntegrations(){
    this.loading = true
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
        this.novosRegistros = 0
        this.ultimosRegistros = 0
        this.totalNovosRegistros = 0
      }
    })
  }

  clickInIntegration(e:any){
    this.tablePlanejadoSipDts?.unselectRows()
    this.tableMovimentacaoSipDts?.unselectRows()
    this.tableMarcacaoCarolDtsSip?.unselectRows()
    this.retornoIntegracao = e.descricao

    if(e.situacao.situacao == "ERRO"){
      this.jsonEnviado = e.jsonEnviado.replaceAll("\r\n", "").replaceAll("\"", "").replaceAll(" ", "")
      this.jsonRetorno = e.jsonRetorno.replaceAll("\r\n", "").replaceAll("\"", "").replaceAll(" ", "")
    }

    else {
      this.jsonEnviado = JSON.parse(e.jsonEnviado)
      this.jsonRetorno = JSON.parse(e.jsonRetorno)
    }
    
  }

  clickOutIntegration(){
    this.retornoIntegracao = undefined
    this.jsonEnviado = undefined
    this.jsonRetorno = undefined
  }

  clickInDetail(e:any){
    this.listaIntegTable?.unselectRows()
    this.retornoIntegracao = e.descricao
    this.jsonEnviado = undefined //JSON.parse(e.jsonEnviado)
    this.jsonRetorno = undefined //JSON.parse(e.jsonRetorno)
  }

  clickOutDetail(){
    this.retornoIntegracao = undefined
    this.jsonEnviado = undefined
    this.jsonRetorno = undefined
  }

  unselectAll(){
    this.listaIntegTable?.unselectRows()
    this.tablePlanejadoSipDts?.unselectRows()
    this.tableMovimentacaoSipDts?.unselectRows()
    this.tableMarcacaoCarolDtsSip?.unselectRows()
  }

  numeraisIntegracao(tipo:number):number{
    switch(tipo){
      case 1:
        return this.integrations.length
        break;

      case 2:
        return this.integrations.filter(x => x.situacao.situacao == "ERRO").length
        break;  

      case 3:
        return this.integrations.filter(x => x.situacao.situacao == "OK").length
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

      
      if(!this.validaData(this.filters.dtIniIntegracao, this.filters.dtFimIntegracao, "Data de integração")){
        return
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

        if(this.integrations.length > 0){
          this.refresh()
        } else {
          this.getIntegrations()
        }
        
        this.modalFilters?.close()
      }
        
    },100)
  }

  validaData(p_dataIni:Date, p_dataFim:Date, label:string = "Data"):boolean{
      const dataIniSplit = p_dataIni.toString().split("-")
      const dataFimSplit = p_dataFim.toString().split("-")
      
      const dataLimite = new Date(Number(dataIniSplit[0]), Number(dataIniSplit[1]), Number(dataIniSplit[2]))      
      const dataFim = new Date(Number(dataFimSplit[0]), Number(dataFimSplit[1]), Number(dataFimSplit[2]))      

      dataLimite.setMonth(dataLimite.getMonth() + 3)

      if(dataFim > dataLimite){
        this.notificationsService.error(`${label} deve ter um intervalo de no máximo 3 meses.`)
        return false
      } else if(p_dataIni > p_dataFim){
        this.notificationsService.error(`${label} inicial deve ser menor que a data final.`)
        return false
      } else {
        return true
      }
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
    setTimeout(() => {
      //this.lastFilters = JSON.parse(JSON.stringify(this.filters))
      localStorage.setItem("planejadoSipDts", String(this.filters.planejadoSipDts))
      localStorage.setItem("movimentacaoSipDts", String(this.filters.movimentacaoSipDts))
      localStorage.setItem("marcacoesCarolDtsSip", String(this.filters.marcacoesCarolDtsSip))
      localStorage.setItem("marcacoesCingoSip", String(this.filters.marcacoesCingoSip))
      this.setCaminhoPasoe()
      this.modalParameter?.close()
    }, 100)
  }

  cancelParameter(){
    if(this.lastFilters){
      this.filters = this.lastFilters = JSON.parse(JSON.stringify(this.lastFilters))
    }
    this.modalParameter?.close()
  }

  openModalMarcacoes(e:string){
    console.clear()
    console.log(e)
    this.marcacoes = []
    const marcacoesJson = JSON.parse(e.replaceAll("-", "/"))
    this.marcacoes = marcacoesJson

    this.modalMarcacoes?.open()
  }

  okModalMarcacoes(){
    this.marcacoes = []
    this.modalMarcacoes?.close()
  }

  getStatusPasoe(){
    setInterval(() => {
      this.monitorService.getStatusPasoe().subscribe({
        next: result => {
          this.pasoeIsConnected = result.status
          this.bancosDesconectados = result.bancosDisconectados
          console.log(result)
        },

        complete: () => {
          if(this.pasoeIsConnected && this.bancosDesconectados.length > 0){
            this.pasoeIsConnected = "pasoeWARNING"
          }
        }
      })
    }, 60000)
  }

  autoRefresh(){
    this.intervalAutoRefresh = setInterval(()=>{
      this.monitorService.getNovasEntradas().subscribe({
        next: result => {
          if(this.ultimosRegistros <= 0 || this.ultimosRegistros > result.registros){
            this.ultimosRegistros = result.registros
          } else {
            this.novosRegistros = result.registros - this.ultimosRegistros
            this.ultimosRegistros = result.registros
            this.totalNovosRegistros = this.totalNovosRegistros + this.novosRegistros
          }
          
        },

        complete: () => {
          if(this.novosRegistros > 0){
            this.notificationsService.success(`${this.novosRegistros} registros integrados no ultimo minuto.`)
            this.novosRegistros = 0
          }
        }
      })
      this.lastUpdate = new Date()
    }, 60000)
  }

  changeAutoRefresh(e:any){
    if(e == false){
      clearInterval(this.intervalAutoRefresh)
    } else {
      this.autoRefresh()
    }
  }

  saveJson(content:string, fileName:string){
    const contentString = JSON.stringify(content)
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";

    const blob = new Blob([contentString], {type: "plain/text"})
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName + ".json";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  exportExcel(data:any, tipo:string){
    const dataArray = data.filter((item:any) => item.tipo == tipo)

    console.log(data)
    console.log(dataArray)

    const styleBorderAll = {
      left: {
        style: "thin", 
        color: { rgb: "000000"}
      }, 
      top: {
        style: "thin", 
        color: { rgb: "000000"}
      }, 
      right: {
        style: "thin", 
        color: { rgb: "000000"}
      }, 
      bottom: {
        style: "thin", 
        color: { rgb: "000000"}
      }
    }

    const dados = [];
    const cabecalhoIntegracao = [
      { v: 'Status Integração',     t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Tipo de Integração',    t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Data Integração',       t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Hora Ini Integração',   t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Hora Fim Integração',   t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Hora Ini Api Datasul',  t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } },
      { v: 'Hora Fim Api Datasul',  t: 's', s: { border: styleBorderAll, font: { bold: true }, fill: { fgColor: { rgb: "E9E9E9" } } } }
    ]    

    dados.push(cabecalhoIntegracao);
    
    dataArray.forEach((dado:any, idxInteg:any) => {
      if((dataArray.length - 1) === idxInteg){
        dados.push([
          { v: dado.situacao.situacao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },      
          { v: dado.tipo, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: new Date(dado.dtIntegracao).toLocaleDateString(), t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaIniIntegracao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaFimIntegracao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaIniApiDts, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, }, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaFimApiDts, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, bottom: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
        ]);
      } else {
        dados.push([
          { v: dado.situacao.situacao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },      
          { v: dado.tipo, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: new Date(dado.dtIntegracao).toLocaleDateString(), t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaIniIntegracao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaFimIntegracao, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaIniApiDts, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
          { v: dado.horaFimApiDts, t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}, fill: { fgColor: { rgb: "e3e9f7" } } } },
        ]);
      }
      

      if(dado.detail.length > 0){ //e3f7ea
        if(tipo == "Envio Planejado SIP x Datasul"){
          dados.push([
            { v: "", t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}}, 
            { v: 'Status', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Empresa', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Estabelecimento', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Matrícula', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Nome Funcionário', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Data Calendário', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Descrição', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Escala', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'KDiario', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Tipo Dia', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Ini Jornada 1', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Fim Jornada 1', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Ini Jornada 2', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Fim Jornada 2', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Sindicato', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Posto', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } }        
            ]
          )

          dado.detail.forEach((detail:any, idx:any) => {
            if((dado.detail.length - 1) === idx){
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.dataCalendario ? detail.dataCalendario : "",
                { v: detail.descricao ? detail.descricao : "",           t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.escala ? detail.escala : "",           t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.kdiario ? detail.kdiario : "",          t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.tipoDia ? detail.tipoDia : "",          t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.inicioJornada1 ? new Date(detail.inicioJornada1).toLocaleString() : "",   t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.fimJornada1 ? new Date(detail.fimJornada1).toLocaleString() : "",      t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.inicioJoranada2 ? new Date(detail.inicioJoranada2).toLocaleString() : "",  t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.fimJoranada2 ? new Date(detail.fimJoranada2).toLocaleString() : "",     t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.sindicato ? detail.sindicato : "",        t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.posto ? detail.posto : "",            t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}}}            
              ])
            } else {
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.dataCalendario ? detail.dataCalendario : "", 
                detail.descricao ? detail.descricao : "",
                detail.escala ? detail.escala : "", 
                detail.kdiario ? detail.kdiario : "", 
                detail.tipoDia ? detail.tipoDia : "", 
                detail.inicioJornada1 ? new Date(detail.inicioJornada1).toLocaleString() : "", 
                detail.fimJornada1 ? new Date(detail.fimJornada1).toLocaleString() : "", 
                detail.inicioJoranada2 ? new Date(detail.inicioJoranada2).toLocaleString() : "", 
                detail.fimJoranada2 ? new Date(detail.fimJoranada2).toLocaleString() : "", 
                detail.sindicato ? detail.sindicato : "",
                { v: detail.posto ? detail.posto : "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}}}}}            
              ]) 
            }           
          })
        }

        if(tipo == "Envio Movimentação SIP x Datasul"){
          dados.push([
            { v: "", t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}}, 
            { v: 'Status', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Empresa', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Estabelecimento', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Matrícula', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Nome Funcionário', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Data Marcação', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Hora Marcação', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Data Processo', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Descrição', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Tipo Movimentação', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Escala', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'KDiario', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Tipo Dia', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Situação Afastamento', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'CID', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'CRM', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Entidade', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'UF Entidade', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Turno', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } }        
            ]
          )

          dado.detail.forEach((detail:any, idx:any) => {
            if((dado.detail.length - 1) === idx){
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.dataMarcacao ? new Date(detail.dataMarcacao).toLocaleDateString() : "",
                { v: detail.horaMarcacao ? detail.horaMarcacao : "",           t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.dataProcesso ? new Date(detail.dataProcesso).toLocaleDateString() : "",           t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.descricao ? detail.descricao : "",           t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.tipoMovimentacao ? detail.tipoMovimentacao : "",          t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.escala ? detail.escala : "",          t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.kdiario ? detail.kdiario : "",   t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.tipoDia ? detail.tipoDia : "",      t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.situacaoAfastamento ? detail.situacaoAfastamento : "",  t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.cid ? detail.cid : "",     t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.crm ? detail.crm : "",        t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.entidade ? detail.entidade : "",        t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.ufEntidade ? detail.ufEntidade : "",        t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: detail.turno ? detail.turno : "",            t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}}}            
              ])
            } else {
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.dataMarcacao ? new Date(detail.dataMarcacao).toLocaleDateString() : "",
                detail.horaMarcacao ? detail.horaMarcacao : "",
                detail.dataProcesso ? new Date(detail.dataProcesso).toLocaleDateString() : "", 
                detail.descricao ? detail.descricao : "",
                detail.tipoMovimentacao ? detail.tipoMovimentacao : "",
                detail.escala ? detail.escala : "",
                detail.kdiario ? detail.kdiario : "",
                detail.tipoDia ? detail.tipoDia : "",
                detail.situacaoAfastamento ? detail.situacaoAfastamento : "",
                detail.cid ? detail.cid : "", 
                detail.crm ? detail.crm : "",
                detail.entidade ? detail.entidade : "", 
                detail.ufEntidade ? detail.ufEntidade : "",  
                { v: detail.turno ? detail.turno : "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}}}}}            
              ]) 
            }           
          })
        }
        
        if(tipo == "Envio Marcações Carol x Datasul/SIP"){
          dados.push([
            { v: "", t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}}, 
            { v: 'Status', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Empresa', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Estabelecimento', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Matrícula', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Nome Funcionário', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'CPF', t: 's', s: { font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Data Processo', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } },
            { v: 'Marcações', t: 's', s: { border:{ top: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}, font: { bold: true }, fill: { fgColor: { rgb: "e3f7ea" } } } }        
            ]
          )

          dado.detail.forEach((detail:any, idx:any) => { 
            let currentMarcacoes = ""
            const marcacoesJson = detail.onTimeInfo ? JSON.parse(detail.onTimeInfo) : []
            marcacoesJson.forEach((marc:any, idxMarc:any) => {
              if(idxMarc == 0){
                currentMarcacoes = marc.conteudo + " - " + marc.dataBatida.replaceAll("-", "/")
              } else {
                currentMarcacoes = currentMarcacoes + "; " + marc.conteudo + " - " + marc.dataBatida.replaceAll("-", "/")
              }
            })

            if((dado.detail.length - 1) === idx){
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.cpf ? detail.cpf : "",                
                { v: detail.dataProcesso ? new Date(detail.dataProcesso).toLocaleDateString() : "",   t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}}}},
                { v: currentMarcacoes,            t: 's', s: { border:{ bottom: { style: "thin", color: { rgb: "000000"}}, right: { style: "thin", color: { rgb: "000000"}}}}}            
              ])
            } else {
              dados.push([
                { v: "", t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}} }, fill: { fgColor: { rgb: "ffffff" } }}},  
                detail.situacao ? detail.situacao : "", 
                detail.emp ? detail.emp : "", 
                detail.estab ? detail.estab : "", 
                detail.matricula ? detail.matricula : "", 
                detail.nomeFuncionario ? detail.nomeFuncionario : "", 
                detail.cpf ? detail.cpf : "", 
                detail.dataProcesso ? new Date(detail.dataProcesso).toLocaleDateString() : "",
                { v: currentMarcacoes, t: 's', s: { border:{ right: { style: "thin", color: { rgb: "000000"}}}}}            
              ]) 
            }           
          })
        }
      }
      
    });
    
    const workbook = XLSX.utils.book_new();
    
    const worksheet = XLSX.utils.aoa_to_sheet(dados);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

    XLSX.writeFile(workbook, tipo + '.xlsx');
    
  }
}
