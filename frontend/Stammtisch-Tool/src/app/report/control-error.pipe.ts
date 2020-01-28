import { Pipe, PipeTransform } from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Pipe({
  name: 'controlError'
})
export class ControlErrorPipe implements PipeTransform {
    constructor(private logger: NGXLogger) {
    }

  transform(value: string): string {
      switch (value) {
          case 'date':
              return 'date needs to be today or in the past';
          case 'startTime':
              return 'a start time is required';
          case 'endTime':
              return 'an end time is required';
          case 'organisersM':
              return 'there must be 0 or more male organisers';
          case 'organisersF':
              return 'there must be 0 or more female organisers';
          case 'organisersX':
              return 'there must be 0 or more diverse organisers';
          case 'regularAttendeesM':
              return 'there must be 0 or more male regular attendees';
          case 'regularAttendeesF':
              return 'there must be 0 or more female regular attendees';
          case 'regularAttendeesX':
              return 'there must be 0 or more diverse regular attendees';
          case 'newAttendeesM':
              return 'there must be 0 or more male new attendees';
          case 'newAttendeesF':
              return 'there must be 0 or more female new attendees';
          case 'newAttendeesX':
              return 'there must be 0 or more diverse new attendees';
          case 'topics':
              return 'at least one topic is required';
          default:
              this.logger.error(value);
              return 'Error: unknown control';


      }
  }

}
