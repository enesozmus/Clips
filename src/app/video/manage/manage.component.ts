import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/contracts/clip';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  videoOrder: string = '1';
  clips: IClip[] = [];
  // send edit.component.ts
  activeClip: IClip | null = null;
  /*
    We're going to be introduced to a new type of observable called a BehaviorSubject.
    Normally, we can subscribe to observables to wait for values pushed by the observable.
    Subscribers don't have the power to force the observable to push a new value. This is not true for behavior subjects.
    We can create an object that acts like an observable and observer.

    We are going to create an observable called sort$.
    Whenever this property changes we're going to push a new value from our observable.
    This observable will emit values whenever the sorting order changes.
  */
  sort$: BehaviorSubject<string>;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService) {
    // Next, we need to pass an initial value to push by the observable.
    // We will pass in the videoOrder property.
    this.sort$ = new BehaviorSubject(this.videoOrder);
    // this.sort$.subscribe(console.log);
    // We didn't push this value from our observable. Rather, we pushed this value from our observer.
    // This is the power of BehaviorSubject.
    // We can create an object to act as an observer and observable at the same time.
    // this.sort$.next('test');
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: Params) => {

      this.videoOrder = params.sort == '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe(docs => {

      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id, ...doc.data()
        });
      });
    });
  }


  sort($event: Event) {

    const { value } = ($event.target as HTMLSelectElement);
    //this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sort: value }
    });
  }

  openModal($event: Event, clip: IClip) {

    $event.preventDefault();

    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  deleteClip($event: Event, clip: IClip) {

    $event.preventDefault();

    this.clipService.deleteClip(clip);
    this.clips.forEach((element, index) => {
      if (element.docID == clip.docID){
        this.clips.splice(index, 1);
      }
    });
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == $event.docID) {
        this.clips[index].title = $event.title;
      }
    })
  }

}
