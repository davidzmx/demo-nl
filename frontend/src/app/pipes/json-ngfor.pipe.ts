import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonNgfor' })
export class JsonNgforPipe implements PipeTransform {
    transform(value, args: string[]): any {
        const keys = [];
        for (const key of Object.keys(value)) {
            keys.push({ key, value: value[key] });
        }
        return keys;
    }
}
