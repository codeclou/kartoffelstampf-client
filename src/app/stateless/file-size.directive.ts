import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';


@Pipe({ name: 'fileSize', pure: false })
export class FileSizePipe implements PipeTransform {
  transform(size: number) {
    const sizeInMegaBytes = size / 1024 / 1024;
    const formattedSize = formatNumber(sizeInMegaBytes, 'en_US', '.3');
    return `${formattedSize} MB`;
  }
}
