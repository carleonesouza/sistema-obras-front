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
    materialTransportado: string;
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
    usuario_que_alterou: any;
    tipo_duto: any;
    nivel_duto:any;
    funcao_estrutura: any;
    situacao: any;
    sim_nao: any;
    latitude: any;
    longitude: any;
    municipio: any;
    uf: any;
    data_base_orcamento: string | Date;
        
    public constructor(init?: Partial<ObraDuto>) {
        Object.assign(this, init);
    }
       
};