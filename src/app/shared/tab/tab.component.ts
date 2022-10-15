import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input() tabTitle = '';
  // We should restrict the content to one tab at a time.
  // We are going to keep track of an active tab by adding an active property to the tab component.
  // The container will check each tab component.
  // If the active property is true, it'll render that tab respective content.
  @Input() active = false;

  constructor() { }

  ngOnInit(): void {
  }

}
