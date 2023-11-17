import { Endereco } from "app/models/endereco";

export interface Obra {
    id: number;
    empreendimento: number; // Assumindo que há uma relação com empreendimento
    tipo: string; // Por exemplo, 'aero', 'duto', 'ferroviario', etc.
    nomeDaInfraestrutura: string;
    descricao: string;
    intervencao: string;
    status: any;
    instrumento: string;
    dataInicio: Date | string;
    dataConclusao: Date | string;
    documentosAdicionais?: string; // Pode ser um URL para download ou algo assim
    endereco: Endereco;
    arquivoGeorreferenciado?: string; // Opcional, pode ser um URL para download
    valorGlobal: number;
    percentualFinanceiroExecutado: number;
    // Inclua campos adicionais específicos de cada tipo de obra
  }
  
  