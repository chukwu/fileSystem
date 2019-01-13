import { fileSystem, initData } from './../general-model';
import { XhrService } from './../xhr.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation,NgZone, ViewChild, ElementRef } from '@angular/core';

declare var swal;
@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class FileUploaderComponent implements OnInit {
  @Input() inputName = 'result';
  @Input() set AccessToken(value:string) {
    this.token = value;
    window.localStorage.setItem("AccessToken", value);
  }
  token:string;
  @Output() result = new EventEmitter();
  @Input() myurl:string = initData.url;
  @Input() fileSystemInit:string;
  @Input() previewMode:boolean = false;

  @Input() set clear(istrue:boolean) {
    this.clearStorage();
  }
  @ViewChild("previewDiv") previewDiv:ElementRef;
  fileSystems:Array<fileSystem> = [];
  localHostfileSystems:string;
  previewFs:fileSystem;
  finalResultString:string;
  progress:number = 0;
  constructor(private xhr:XhrService, private ngZone:NgZone) { 
    this.xhr.currentProgress.subscribe((progress:string) =>{
      this.ngZone.run(() => {
        this.progress = Number(progress);
      })

    })
    this.myurl = initData.url;
    this.AccessToken = '2cNf07d-36X5rGFn28AlGPj-YL35qCM6OIqCb6Wh93tyv9rUsPiCxbpBC8Szv70VXqie636b224vfEsi1s_JH0htkiTHsgrQdcOgGrwqOADAJp6ena415r7VYI2Vr6kuu_DUY86RyN6clCPKFt_blM8pyKuikm7X6oM7zn6p1siEEeE7J4qKtG9zBcLVoK-zg47O9vo3TTjnHbIF5Y0ByDq8BoGWt6gmM4CEOwsI-kys2NWjZwCdmK2Nv9Ew5E1iTLM0Fv6ojLZNmYQetnHS1lY7aOGWpGwmOImAfYBcL6sdZLyWYRBsGWuFgLwmZCG2_UtGiZ5Sa92VgsaTIntIPHpompF235vVS2-WukR8Tma3k4Th2YyjcUhbstDhbk4O-jU5tKcbET3CJPDkgU9AHtz8vMGggHesKF7IL544l6t0ut5jB1-M8oeAiwinya1MY-wODdfMURaZ0_sjS1YTptleFxN5soCfyCoy6xYAjc2KH2ENOszOPUYbQjYr9NlaexMou3t4bnSXjMucnViu7cRac6h3y7OGhbVQQMbzmZ7oVw86hRK7jD8Ssbpn-6nWr9dMHIkpqU8cQ2v2J3M5-4mZd6HyZXqyB58mHnNsAd5MtY-zyJzIFkg9Y4nmuHOaxMUk_bTAFMKKnhOe7kXWgHIGai-GGJhbuz-LeOcr_p4yaTW2gqQAthtY4ZpJTf_oG0ZRkSf-K3j51q4Han5_DBCpt00jqEdw3wSD9DU-_KU49vvY_s_WHv_BM-duWekrzqcvEvVayYTUOS8H7SqTXw';
  }

  ngOnInit() {
    this.localHostfileSystems = window.localStorage.getItem("fileSystems");
    if(this.localHostfileSystems){
      this.fileSystems = JSON.parse(this.localHostfileSystems);

    }
    if(this.fileSystemInit){
      let fsAll:Array<fileSystem> = JSON.parse(this.fileSystemInit);
      fsAll.forEach((fs:fileSystem) => {
        this.fileSystems.push(fs);
      })
    }


  }

  clearStorage(){
    // window.localStorage.removeItem("fileSystems");
    // this.ngZone.run(() => {
    //   this.fileSystems = [];
    // })
    this.result.emit(this.fileSystems);
  }

  filesystemChanged(){
    this.result.emit(this.fileSystems);
    this.finalResultString = JSON.stringify(this.fileSystems);
    window.localStorage.setItem("fileSystems", this.finalResultString);
  }

  onFileSelectChange(event:any){
    if(Array.from(event.target.files).length > 0){
      const formData = new FormData();
      Array.from(event.target.files).forEach((file: File) => formData.append('assets[]', file, file.name));
  
      this.xhr.RestAPI(formData,`${this.myurl}/api/Misc/asset`, this.token, true).then((asset:fileSystem) => {
        this.ngZone.run(() => {
          this.fileSystems.push(asset);
          this.filesystemChanged();
        })
      });
    }

  }

  downloadFile(fs:fileSystem){
    let url:string = this.rewriteUrl(fs);
    let a:any = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    let fileName:string = fs.fileName
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  rewriteUrl(fs:fileSystem):string{
    let value:string = fs.fileLocation.replace("~\\","/").replace("\\","/");
    return `${this.myurl}/api/Misc/getAsset/?f=${value}&t=${window.localStorage.getItem('AccessToken')}`
  }

  showPreviewModal(fs:fileSystem, ui:any){
    swal({
      title: fs.fileName,
      content: ui,
      dangerMode: true,
      buttons: {
        cancel: "Close",
        download:this.previewMode ? {
          text: "Download",
          value: "download",
        } : null,
        confirm: {
          text: "Delete",
          value: "remove",
        }
      },
    }).then((value) => {
      switch (value) {
        case "remove":
          if(this.fileSystemInit){
            let fsAll:Array<fileSystem> = JSON.parse(this.fileSystemInit);
            let exist:fileSystem = fsAll.find((fsystem:fileSystem) => {
              return fs.file_id === fsystem.file_id;
            })

            if(exist){
              this.deleteLocal(fs);
            }else{
              this.delete(fs);
            }
          }else{
            this.delete(fs);
          }
          
          break;
        case "download":
          this.downloadFile(fs);
          break;    
        default:
          
      }
    });
  }

  previewThis(fs:fileSystem){
    this.ngZone.run(() =>{
      this.previewFs = fs;
      console.log(this.previewFs);
      setTimeout(()=>{
        var slider = this.previewDiv.nativeElement;
        this.showPreviewModal(fs, slider);
        
      }, 100)
    })
  }

  deleteLocal(previewFs:fileSystem){
    this.fileSystems.forEach((fs:fileSystem, index:number) => {
      if(previewFs.file_id === fs.file_id){
        this.fileSystems.splice(index, 1);
        swal("Removed!", "Process was completed successfully.", "success");
        this.filesystemChanged();
      }
    })
  }

  delete(previewFs:fileSystem){


    this.xhr.deleteCall(previewFs.file_id,`${this.myurl}/api/Misc/deleteAsset`, this.token).then((result:any) => {
      console.log(result);
      this.ngZone.run(() =>{
        this.previewFs = null;
        this.fileSystems.forEach((fs:fileSystem, index:number) => {
          if(previewFs.file_id === fs.file_id){
            this.fileSystems.splice(index, 1);
            swal("Deleted!", "Process was completed successfully", "success");
            this.filesystemChanged();
          }
        })  
      })
    }).catch(err =>{
      console.log(err);
    });

  }

  whatFileType(fs:fileSystem):string{

    let ext:string = fs ? fs.fileExtension.replace(".","").toLowerCase() : null;
    if(ext){
      ext = ext.toLowerCase();
      if(this.getImagesExtentions().indexOf(ext) > -1){
        return "image";
      }else if(this.getAudioExtentions().indexOf(ext) > -1){
        return "audio";
      }else if(this.getVideosExtentions().indexOf(ext) > -1){
        return "video";
      }else if(this.getOtherExtToOpen().indexOf(ext) > -1){
        return "othervalid";
      }else if(ext == "pdf"){
        return "pdf";
      }else{
        return "others"
      }
    }

  }

  getImagesExtentions():Array<string>{
    return ["jpg","jpeg","png","gif","tiff","svg"];
  }

  getVideosExtentions():Array<string>{
    return ["mov","mpeg","mp4","webm","avi","wmv","ogg","flv","mov","webm"];
  }

  getAudioExtentions():Array<string>{
    return ["mp3","wma","wav","aif","aifc","aiff","au","ea"];
  }  

  getOtherExtToOpen():Array<string>{
    return ["doc","docx","xls","xlsx","ppt","pptx"];
  }


}
