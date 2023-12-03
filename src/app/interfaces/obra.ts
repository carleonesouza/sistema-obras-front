import { Municipio } from "app/models/municipio";
import { Produto } from "app/models/produto";

export interface Obra {
    id: number;
    empreendimento: any;
    user: any; // Assumindo que há uma relação com empreendimento
    tipo: string; // Por exemplo, 'aero', 'duto', 'ferroviario', etc.
    tipo_infraestrutura: any;
    descricao: string;
    responsavel: string;
    intervencao: any;
    status: any;
    funcao_estrutura: any;
    instrumento: string;
    sim_nao: any;
    dataInicio: Date | string;
    dataConclusao: Date | string;
    documentosAdicionais?: string; // Pode ser um URL para download ou algo assim
    arquivoGeorreferenciado?: string; // Opcional, pode ser um URL para download
    valorGlobal: number;
    percentualFinanceiroExecutado: number;
    produtos: Array<Produto>;
    latitude: any;
    longitude:any;
    municipios: Array<Municipio>;
    uf: any;
    usuario_que_alterou: any;
    data_base_orcamento: Date | string;
    // Inclua campos adicionais específicos de cada tipo de obra
  }
  
  