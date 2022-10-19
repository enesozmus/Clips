import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss']
})
export class ClipComponent implements OnInit {

  id: string = '';

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    /*
      We can grab information about the current route through the snapshot object.
      we can have multiple route parameters in a single path.
      {{ id }}

      this.id = this.activatedRoute.snapshot.params.id;
    */
    /*
      The params property is an observable, this observable will push values whenever the roots parameters have changed.
      Let's subscribe to the observable.
    */
    this.activatedRoute.params.subscribe((params: Params) => {
      
      this.id = params.id;
      
    });
  }

}
