import { initData } from './general-model';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'helper'
})
export class HelperPipe implements PipeTransform {
  constructor(private sanitizer:DomSanitizer){

  }
  myurl:string = initData.url;
  
  transform(value: any, args?: any): any {
    if(!value){
      return null;
    }
    if(args == "rewriteUrl"){
      value = value.replace("~\\","/").replace("\\","/");
      return `${this.myurl}/api/Misc/getAsset/?f=${value}&t=${window.localStorage.getItem('AccessToken')}`
    }
    if(args == "sanitize"){
      return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
    if(args == "fileExt"){
      return (value as string).toLowerCase().replace(".","");
    }
    if(args == "fileSize"){
      return value > 1000 ? `${Math.round(value/1000)}MB` : `${value}Kb`;
    }
  }

}
