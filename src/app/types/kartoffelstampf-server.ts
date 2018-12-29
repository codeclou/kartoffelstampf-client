//
// Typings: https://github.com/codeclou/karteoffelstampf-server
//

export interface KartoffelstampfTerminalOutputEntryPayload {
  text: string;
}

export interface KartoffelstampfTerminalOutputEntry {
  payload: KartoffelstampfTerminalOutputEntryPayload;
  type: string;
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
