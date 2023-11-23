import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraDuto implements Obra {

    id: number;
    empreendimento: number;
    tipo: string;
    nomeDaInfraestrutura: string;
    descricao: string;
    intervencao: string;
    status: any;
    instrumento: string;
    dataInicio: string | Date;
    dataConclusao: string | Date;
    documentosAdicionais?: string;
    endereco: Endereco;
    arquivoGeorreferenciado?: string;
    valorGlobal: number;
    percentualFinanceiroExecutado: number;
    tipoDuto: string;
    funcaoEstrutura: string;
    materialTransportado: string;
    nivelDuto: string;
    codigoOrigem: string;
    codigoDestino: string;
    nomeXRL: string;
    novaExtesao: number;
    espessura: number;
    vazaoProjeto: number;
    vazaoOperacional: number;
    novaAreaImpactada: number;
    user: any;
    tipo_infraestrutura: any;
    produto: any;
        
    public constructor(init?: Partial<ObraDuto>) {
        Object.assign(this, init);
    }
   
       
};