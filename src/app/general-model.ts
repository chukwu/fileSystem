export class fileSystem {
  file_id:number;
  fileName:string;
  fileSizeKB:number;
  fileLocation:string;
  fileExtension:string;
  videoThumbnail:string;
  pdfImage:string;
  otherFileThumbnail:string;
  page_id:number;
  section_id:number;
  file_date:Date;
  entry_date:Date;
  entered_or_editedby:string;
  enteredby_id:string
}

export class initData{
  constructor(){
    
  }
  static readonly url:string = "http://chukwu-001-site1.atempurl.com";
}
