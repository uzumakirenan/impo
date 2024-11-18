const dataAtual = new Date()
const dataLimite = new Date(dataAtual)
dataLimite.setMonth(dataLimite.getMonth() - 3)



export class IntegracaoFilter {
    dtIniIntegracao:Date = dataLimite
    dtFimIntegracao:Date = dataAtual
    horaIniIntegracao:string = "00:00:00"
    horaFimIntegracao:string = "23:59:59"
    statusIntegracao:string = "TODOS"
    empresaIni:string = "0"
    empresaFim:string = "99999999"
    estabelIni:string = "0"
    estabelFim:string = "99999999"
    matriculaIni:string = "0"
    matriculaFim:string = "999999999"
    //Filtros Planejado SIP x DTS
    dataIniCalendarioPla?:Date
    dataFimCalendarioPla?:Date
    escalaIniPla:string = ""
    escalaFimPla:string = "ZZZZZZZZ"
    kdiarioIniPla:string = ""
    kdiarioFimPla:string = "ZZZZZZZZ"
    sindicatoIniPla:string = ""
    sindicatoFimPla:string = "ZZZZZZZZ"
    postoIniPla:string = ""
    postoFimPla:string = "ZZZZZZZZ"
    //Filtros Movimentação SIP x DTS
    dataIniMarcacao?:Date
    dataFimMarcacao?:Date
    horaIniMarcacao:string = "00:00:00"
    horaFimMarcacao:string = "23:59:59"
    dataIniProcessoMarcacao?:Date
    dataFimProcessoMarcacao?:Date
    tipoMovimentacaoMarcacao:string = ""
    turnoMarcacao:string = ""
    tipoDeDiaMarcacao:string = ""
    situacaoAfastamento:string = ""
    cidMarcacao:string = ""
    crmMarcacao:string = ""
    //Filtros Carol X Datasul/Sip
    dataIniProcessoCarol?:Date
    dataFimProcessoCarol?:Date
    cpfCarol:string = ""
    //Tipos de Integrações
    planejadoSipDts:boolean = (localStorage.getItem("planejadoSipDts") == 'true')
    movimentacaoSipDts:boolean = (localStorage.getItem("movimentacaoSipDts") == 'true')
    marcacoesCarolDtsSip:boolean = (localStorage.getItem("marcacoesCarolDtsSip") == 'true')
    marcacoesCingoSip:boolean = (localStorage.getItem("marcacoesCingoSip") == 'true')
    caminhoPasoe:string = ""
}