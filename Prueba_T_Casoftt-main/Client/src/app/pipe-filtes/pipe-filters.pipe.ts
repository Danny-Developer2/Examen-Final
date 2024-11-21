import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFilters',
  standalone: true 
})
export class PipeFiltersPipe implements PipeTransform {

  transform(items: any[], year: number | null, term: string | null): any[] {
    if (!items) return [];
  
   
    if (year) {
      items = items.filter(item => item.year.toString().includes(year));
    }
  
    
    if (term && term.trim().length > 0) {
      items = items.filter(item => item.model && item.model.toLowerCase().includes(term.toLowerCase()));
    }
    console.log('soy lo filtrado' , items)
    return items;
  }
  
}
