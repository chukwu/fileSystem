import { XhrService } from './xhr.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { HelperPipe } from './helper.pipe';
import { ChartComponent } from './chart/chart.component';
@NgModule({
  declarations: [
    AppComponent,
    FileUploaderComponent,
    HelperPipe,
    ChartComponent
  ],
  imports: [
    BrowserModule,HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [XhrService,HttpClientModule],
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
