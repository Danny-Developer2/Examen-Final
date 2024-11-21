import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeFilters',
  standalone: true // Si usas standalone, agrégalo en los imports del módulo
})
export class PipeFiltersPipe implements PipeTransform {

  transform(items: any[], yearFilter: number | null, modelFilter: string | null): any[] {
    if (!items) return [];
    
    // Filtra por Año
    if (yearFilter) {
      items = items.filter(item => item.Año === yearFilter);
    }

    // Filtra por Modelo
    if (modelFilter) {
      items = items.filter(item => 
        item.Modelo.toLowerCase().includes(modelFilter.toLowerCase())
      );
    }
    console.log(items);
    return items;
  }
}
