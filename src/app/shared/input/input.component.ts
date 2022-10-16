import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  // We will be sending a FormControl from the parent component.
  @Input() control: FormControl = new FormControl();
  // The type attribute should have a default value if the parent component doesn't provide one
  // If the user doesn't supply a type will assume the type should be set to text.
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() maskFormat = '';

  constructor() { }

  ngOnInit(): void {
  }

}
