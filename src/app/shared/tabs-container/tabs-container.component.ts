import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit {

  // 'The ContentChildren' decorator for helping us select elements inside our template.
  // This function has one required parameter.
  // This decorator targets projected content.
  // We are trying to select 'the TabComponent', which are sent down as projected content.
  //@ContentChildren(TabComponent) tabs = {};
  // this.tabs. → içeriğine ulaşabilmek istedik.
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();

  constructor() { }

  ngAfterContentInit(): void {

    // If they're all set to false, the user won't be able to see anything.
    const activeTabs = this.tabs?.filter(tab => tab.active);


    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }

    //console.log(this.tabs); // → QueryList  → There are two tab components.
    // ♫ We've successfully retrieved a list of tabs inside the container.
    // ♫ If we add more tabs, the decorator will always return the correct amount of tabs.

  }

  selectTab(tab: TabComponent) {

    this.tabs?.forEach(tab => {
      tab.active = false;
    });

    tab.active = true;

    return false;
  }

  // ngOnInit()           runs after component has been initialized
  // AfterContentInit()   runs after projected content has been initialize    
}
