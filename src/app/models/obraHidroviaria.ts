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

    public constructor(init?: Partial<ObraHidroviaria>) {
        Object.assign(this, init);
    }
  
    
};
