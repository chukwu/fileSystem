import { XhrService } from './xhr.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { HelperPipe } from './helper.pipe';
import { ChartComponent } from './chart/chart.component';

import { FormsModule } from '@angular/forms';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as highchart3D from 'highcharts/highcharts-3d.src';
@NgModule({
  declarations: [
    AppComponent,
    FileUploaderComponent,
    HelperPipe,
    ChartComponent
  ],
  imports: [
    BrowserModule,HttpClientModule,ChartModule,FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [XhrService,HttpClientModule, { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting,highchart3D ] }],
  entryComponents: [FileUploaderComponent, ChartComponent],
  exports:[HttpClientModule,HelperPipe]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const fl = createCustomElement(FileUploaderComponent, { injector: this.injector });
    const chart = createCustomElement(ChartComponent, { injector: this.injector });
    customElements.define('file-uploader', fl);
    customElements.define('high-chart-comp', chart);
  }
}
