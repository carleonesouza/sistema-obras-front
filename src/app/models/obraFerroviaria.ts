import { Obra } from "app/interfaces/obra";

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
    novaBitola: string;
    novaVelocidade: number;
    produto: any;
    capacidadeDinamica: number;
    user: any;
    tipo_infraestrutura: any;
    usuario_que_alterou: any;
    funcao_estrutura: any;
    responsavel: string;
    sim_nao: any;
    latitude: any;
    longitude: any;
    municipio: any;
    uf: any;
    data_base_orcamento: string | Date;
    
    public constructor(init?: Partial<ObraFerroviaria>) {
        Object.assign(this, init);
    }   
   
};
