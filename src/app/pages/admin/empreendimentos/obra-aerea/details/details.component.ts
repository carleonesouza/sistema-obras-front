import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EmpreendimentosService } from '../../empreendimentos.service';

@Component({
  selector: 'app-obra-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class ObraDetailsComponent implements OnInit {

  @Input() empreendimentoForm: FormGroup;
  @Input() formObra: FormGroup;
  empreendimento$: Observable<any>;
  obra$: Observable<any>;
  obra: any;
  creating: boolean;
  title: string;
  loading: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _route: ActivatedRoute, 
    public _dialog: DialogMessage, 
    private _obraService: EmpreendimentosService) { }

  ngOnInit(): void {


    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Obra';
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.obra$ = this._obraService.obra$;

      this.obra$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((obra: any) => {
          // Get the Lista
          this.obra = obra;
          if (this.obra) {
            this.loading = false;
          }

        });


    }
  }


}
