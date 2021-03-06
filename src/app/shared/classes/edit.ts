import { Subject } from 'rxjs';
import { DAO } from './dao';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';

export abstract class Edit<T> implements OnInit, OnDestroy {
  public ngUnsubscribe = new Subject();
  public object: T;

  constructor(
    public service: DAO<T>,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.service
      .object
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((object: T) => !!object ? false : this.onBack('../'))
      )
      .subscribe(object => this.object = object, e => this.onBack('../'));
  }

  ngOnDestroy() {
    // this.service.objectSubject.next(null);
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit(object: T): Promise<void> {
    const id = this.object['id'];
    return this.service
      .update(id, object)
      .then(flag => this.onBack('../'))
    // .then(() => this.notificationsService.show(`${this.service['className']} editado`, undefined, 'info'));
  }

  onBack(noId: string = '') {
    this.router.navigate([`../${noId}`], { relativeTo: this.route });
  }
}