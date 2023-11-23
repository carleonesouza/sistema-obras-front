import { Obra } from "app/interfaces/obra";
import { Endereco } from "./endereco";


export class ObraPortuaria implements Obra {

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
    tipoEmbarcacao: string;
    ampliacaoCapacidade: string;
    tipoProduto: string;
    novoCalado: string;
    novaLargura: number;
    novoComprimento: number;    
    capacidadeDinamica: number; 
    user: any;
    tipo_infraestrutura: any;
    produto: any;

    public constructor(init?: Partial<ObraPortuaria>) {
        Object.assign(this, init);
    }
   
};
