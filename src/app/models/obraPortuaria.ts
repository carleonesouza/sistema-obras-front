import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";


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
   
    public constructor(init?: Partial<ObraPortuaria>) {
        Object.assign(this, init);
    }
    
};
