import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertService, ComponentLoaderOptions } from '@libs/shared';
import { Store } from '@ngrx/store';
import { getVisualsettings, UpdateDefaultUiManagementSettings } from 'projects/libs/state-management/src/lib/state/Visual-settings/visual-settings.actions';
import { selectAllVisualsettings } from 'projects/libs/state-management/src/lib/state/Visual-settings/visual-settings.selector';
import { TranslateService } from '@ngx-translate/core';
import { selectDefaultLanguage } from '@libs/state-management';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private alertService: AlertService,public translate:TranslateService) { }
  visualsettingsData: any = [];
  rdsvisualsettingsMfeConfig: ComponentLoaderOptions;
  currentAlerts: any = [];
  public rdsAlertMfeConfig: ComponentLoaderOptions = {
    name: 'RdsCompAlert',
    input: {
      currentAlerts: this.currentAlerts
    },
    output: {
      onAlertHide: (event: any) => {
        this.currentAlerts = event;
      }
    }
  }
  ngOnInit(): void {
    this.store.select(selectDefaultLanguage).subscribe((res: any) => {

      if (res) {

        this.translate.use(res);
      }
     })
    this.subscribeToAlerts();

    this.rdsvisualsettingsMfeConfig = {
      name: 'RdsCompVisualSettings',
      input: {
        navtabItems: this.navtabItems,
        listskin: this.listskin,
        listSubmenu: this.listSubmenu,
        visualsettingsItem: this.visualsettingsData,
        isShimmer:true
      },
      output: {
        onSaveVisualsettingsData: (visualsettingsItem: any) => {
          if (visualsettingsItem) {
            this.store.dispatch(UpdateDefaultUiManagementSettings(visualsettingsItem));
          }
          console.log(visualsettingsItem);
        }
      }
    }
    this.store.dispatch(getVisualsettings());
    this.store.select(selectAllVisualsettings).subscribe((res: any) => {
    this.visualsettingsData=[];
      if (res && res.visualsettings && res.status === 'success') {
        this.visualsettingsData = res.visualsettings;
        const mfeConfig = this.rdsvisualsettingsMfeConfig
        mfeConfig.input.visualsettingsItem = [... this.visualsettingsData];
        mfeConfig.input.isShimmer=false
        this.rdsvisualsettingsMfeConfig = mfeConfig;
      }
    })
  }
  // @Output()
  // onSubcribe = new EventEmitter<{ evnt: any, defaultThemeSettings: any }>()
  navtabItems: any = [
    { label: 'Header Bar', tablink: '#nav-headerbar', ariacontrols: 'nav-headerbar' },
    { label: 'Subheader', tablink: '#nav-subheader', ariacontrols: 'nav-subheader' },
    { label: 'Menu', tablink: '#nav-Menu', ariacontrols: 'nav-Menu' },
    { label: 'Footer', tablink: '#nav-footer', ariacontrols: 'nav-footer' },
  ]
  listskin: any[] = [
    { value: 'dark', displayText: 'Dark'},
    { value: 'light', displayText: 'Light' },
  ]
  listSubmenu: any[] = [
    { value: 'false', displayText: 'Accordian'},
    { value: 'true', displayText: 'Dropdown'},
  ]

  subscribeToAlerts() {
    this.alertService.alertEvents.subscribe((alert) => {
      this.currentAlerts = [];
      const currentAlert: any = {
        type: alert.type,
        title: alert.title,
        message: alert.message,
      };
      this.currentAlerts.push(currentAlert);
      const rdsAlertMfeConfig = this.rdsAlertMfeConfig;
      rdsAlertMfeConfig.input.currentAlerts = [...this.currentAlerts];
      this.rdsAlertMfeConfig = rdsAlertMfeConfig;
    });
  }
  getNavTabItems(): any {

    this.navtabItems[0].label = this.translate.instant('Header Bar');

    this.navtabItems[1].label = this.translate.instant('Subheader');
    this.navtabItems[2].label = this.translate.instant('Menu');
    this.navtabItems[2].label = this.translate.instant('Footer');
    return this.navtabItems;

  }
}
