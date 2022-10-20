import {
  Component, OnInit, OnDestroy, Input, OnChanges, Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/contracts/clip';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  /* Section Alert*/
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertMsg: string = 'Please wait! Updating clip!';
  inSubmission: boolean = false;
  /* Section Alert*/

  constructor(private modalService: ModalService, private clipService: ClipService) { }

  // Reactive Form //
  clipID = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]);
  editForm = new FormGroup({ title: this.title, id: this.clipID });
  // Reactive Form //

  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnDestroy() {
    this.modalService.unregister('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {

    if (!this.activeClip) {
      return;
    }
    /* Section Alert*/
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';
    /* Section Alert*/

    try {

      await this.clipService.updateClip(
        this.clipID.value, this.title.value
      )

    }
    catch (err) {
      /* Section Alert*/
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later!';
      console.log(err);
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }

}
