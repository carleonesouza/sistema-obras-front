import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit } from '@angular/core';
import { StoreService } from '../store/store.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements  OnInit
{


    selectedClient: any;
    currentDate: any;
    chartOptions: any;
    chartOptions2: any;
    sequenciaNotasNPS: Array<number>;
    sequencialNPS: Array<number>;

        constructor(private _storeService: StoreService){
      
        this.selectedClient = 'Todos';
        this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');

      //  this.chartOptions = {
      //     series: [
      //       {
      //         name: 'Número de atendimentos',
      //         data: [25, 48, 50, 21, 93]
      //       }
      //     ],
      //     chart: {
      //       height: 160,
      //       type: 'bar'
      //     },
      //     title: {
      //       text: 'Acumulado do dia'
      //     },
      //     xaxis: {
      //       categories: ['DM', 'HAS',  'IDOSOS',  'GRAVIDEZ',  'Sem Comorb.']
      //     }
      //   };

      //   this.chartOptions2 = {
      //     series: [
      //       {
      //         name: 'Nota de NPS',
      //         data: this.sequenciaNotasNPS
      //       }
      //     ],
      //     chart: {
      //       id: 'chart2',
      //       height: 350,
      //       type: 'line'
      //     },
      //     title: {
      //       text: 'Sequencia de atendimentos'
      //     },
      //     xaxis: {
      //       categories: this.sequencialNPS
      //     }
      //   };
      }




       ngOnInit() {
      //   setInterval(() => {
      // const proximoSequencialNPS = this.sequencialNPS[this.sequencialNPS.length -1]+1;
      // const notaAleatoriaNPS =   parseInt((Math.random() * (10 - 7) + 7).toFixed(0), 10);

      //     this.sequenciaNotasNPS.push(notaAleatoriaNPS);
      //     this.sequencialNPS.push(proximoSequencialNPS);

      //     if(this.sequenciaNotasNPS.length > 30){
      //       this.sequenciaNotasNPS.shift();
      //       this.sequencialNPS.shift();
      //     }

      //     window.ApexCharts.exec('chart2', 'updateOptions', {
      //       series: [
      //         {
      //           name: 'Nota de NPS',
      //           data: this.sequenciaNotasNPS
      //         }
      //       ],
      //       chart: {
      //         id: 'chart2',
      //         height: 350,
      //         type: 'line'
      //       },
      //       title: {
      //         text: 'Sequencia de atendimentos'
      //       },
      //       xaxis: {
      //         categories: this.sequencialNPS
      //       }
      //     });

      //   }, 2000);

       }
  }
