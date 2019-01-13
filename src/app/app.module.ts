import { XhrService } from './xhr.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AppComponent } from './app.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { HelperPipe } from './helper.pipe';
@NgModule({
  declarations: [
    AppComponent,
    FileUploaderComponent,
    HelperPipe
  ],
  imports: [
    BrowserModule,HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [XhrService,HttpClientModule],
  entryComponents: [FileUploaderComponent],
  exports:[HttpClientModule,HelperPipe]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const el = createCustomElement(FileUploaderComponent, { injector: this.injector });
    customElements.define('file-uploader', el);
  }
}
