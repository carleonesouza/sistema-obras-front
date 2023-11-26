import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";

export class ObraHidroviaria implements Obra {

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
    situacaoHidrovia: string;
    temEclusa: string;
    temBarragem: string;
    tipoEmbarcacao: string;
    ampliacaoCapacidade: string;
    profundidadeMinima: number;
    profundidadeMaxima: number;
    comboiosCheia: string;
    comboiosEstiagem: string;
    novaLargura: number;
    novoComprimento: number;
    user: any;
    tipo_infraestrutura: any;
    produto: any;
    usuario_que_alterou: any;
    funcao_estrutura: any;
    situacao: any;
    sim_nao: any;
    latitude: any;
    longitude: any;
    municipio: any;
    uf: any;
    data_base_orcamento: string | Date;

    public constructor(init?: Partial<ObraHidroviaria>) {
        Object.assign(this, init);
    }  
    
};
