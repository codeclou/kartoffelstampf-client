//
// Typings: https://github.com/codeclou/karteoffelstampf-server
//

export interface KartoffelstampfTerminalOutputEntry {
  payload: any;
  type: string;
  compressInstruction: KartoffelstampfCompressInstruction;
}

export interface KartoffelstampfImageUploadRequest {
  contentDataUri: string;
}
export interface KartoffelstampfImageUploadResponse {
  fileName: string;
}

export class KartoffelstampfCompressInstruction {

  public static COMPRESS_TYPE_LOSSLESS = 'LOSSLESS';

  public compressType: string;
  public temporaryFileName: string;

}
