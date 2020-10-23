import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'dataFormater' })
export class DataFormater implements PipeTransform {
    transform(item: any, value: any): string {
        if (value == 'DateCreated') {
            return new Date(parseInt(item[value].substr(6, 13))).toDateString();
        }       
        return item[value];
    }
}