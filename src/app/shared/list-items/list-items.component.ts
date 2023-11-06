import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, fromEvent, Observable } from 'rxjs';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { FuseDrawerMode } from '@fuse/components/drawer';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ListItemsComponent {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  @Input() listCount: number = 0;
  @Input() listName: string;
  @Input() placeHolder: string;
  @Input() items$: Observable<any[]>;
  @Input() itemNome: string;
  @Input() itemId: any;
  @Input() include: boolean = false;
  @Input() individuo: boolean = false;
  @Input() listNames: string;
  @Input() drawerMode: 'side' | 'over';
  @Input() mode: FuseDrawerMode;
  @Input() searchInputControl: FormControl = new FormControl();
  @Input() totalElements: number = 0;
  @Input() pageSize = 0;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 100];
  @Input() pageEvent: PageEvent;
  @Input() pageSlice;
  @Output() associa: EventEmitter<any> = new EventEmitter<any>();
  @Output() syncList: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() addItem: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addIdentificador: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventPages: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(@Inject(DOCUMENT) private _document: any,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
  ) {}



  onBackdropClicked() {
    return null;
  }


  openDrawer(){

   // Subscribe to MatDrawer opened change
   this.matDrawer.openedChange.subscribe((opened) => {
    if (!opened) {
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }
  });

  // Subscribe to media changes
  this._fuseMediaWatcherService.onMediaChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(({ matchingAliases }) => {

      // Set the drawerMode if the given breakpoint is active
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
      }
      else {
        this.drawerMode = 'over';
      }

      // Mark for check
    this._changeDetectorRef.markForCheck();
    });

  // Listen for shortcuts
  fromEvent(this._document, 'keydown')
    .pipe(
      takeUntil(this._unsubscribeAll),
      filter<KeyboardEvent>(event =>
        (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
        && (event.key === '/') // '/'
      )
    )
    .subscribe(() => { });
  }

  onPageChange(event): void {
    this.eventPages.next(event);
  }

  createItem(add: boolean){
    this.addItem.next(add);
    if(add){
      this.openDrawer();
    }
  }

  searchItems(event){
    this.searchItem.next(event);
  }

  syncListas(event){
    this.syncList.next(event);
  }

  associaItem(event){
    this.associa.next(event);
  }

  addIndIdentificador(event){
    this.addIdentificador.next(event);
  }

  trackByFn(index: number, item: any): any
    {
        return item?.id || index;
    }

}
