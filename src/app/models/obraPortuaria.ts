import { Obra } from "app/interfaces/obra";
import { Municipio } from "./municipio";
import { Produto } from "./produto";

export class ObraPortuaria implements Obra {

    id: number;
    empreendimento: any;
    tipo: string;
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
    tipoEmbarcacao: string;
    ampliacaoCapacidade: string;
    novoCalado: string;
    novaLargura: number;
    novoComprimento: number;    
    capacidadeDinamica: number; 
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
   
    public constructor(init?: Partial<ObraPortuaria>) {
        Object.assign(this, init);
    }
    
};
