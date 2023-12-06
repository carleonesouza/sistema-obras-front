import { Obra } from "app/interfaces/obra";
import { Municipio } from "./municipio";
import { Produto } from "./produto";

export class ObraFerroviaria implements Obra {

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
    kmInicial: number;
    kmFinal: number;
    extensao: number;
    bitola: any;
    novaVelocidade: number;
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
    data_base_orcamento: string | Date;
    produtos: Produto[];
    municipios: Municipio[];
    
    public constructor(init?: Partial<ObraFerroviaria>) {
        Object.assign(this, init);
    }   
   
};
