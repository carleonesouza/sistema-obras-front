import { Obra } from "app/interfaces/obra";
import { Municipio } from "./municipio";
import { Produto } from "./produto";

export class ObraHidroviaria implements Obra {

    id: number;
    empreendimento: any;
    tipo: any;
    nomeDaInfraestrutura: string;
    descricao: string;
    intervencao: any;
    status: any;
    instrumento: string;
    dataInicio: string | Date;
    dataConclusao: string | Date;
    documentosAdicionais?: string;
    arquivoGeorreferenciado?: string;
    valorGlobal: number;
    percentualFinanceiroExecutado: number;
    situacaoHidrovia: any;
    temEclusa: any;
    temBarragem: any;
    tipoEmbarcacao: any;
    ampliacaoCapacidade: any;
    profundidadeMinima: number;
    profundidadeMaxima: number;
    comboiosCheia: string;
    comboiosEstiagem: string;
    novaLargura: number;
    novoComprimento: number;
    user: any;
    tipo_infraestrutura: any;
    usuario_que_alterou: any;
    funcao_estrutura: any;
    responsavel: string;
    sim_nao: any;
    latitude: any;
    longitude: any;
    uf: any;
    produtos: Produto[];
    municipios: Municipio[];
    data_base_orcamento: string | Date;

    public constructor(init?: Partial<ObraHidroviaria>) {
        Object.assign(this, init);
    }  
    
};
