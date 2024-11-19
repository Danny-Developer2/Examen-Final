export class Photo {
    id: number | null = null;
    url: string | null = null;
  
    constructor(init?: Partial<Photo>) {
      Object.assign(this, init);
    }
  }
  
  export const photosForTesting: Photo[] = [
    new Photo({ url: 'https://tmna.aemassets.toyota.com/is/image/toyota/toyota/jellies/max/2024/corolla/nightshade/1868/218/36/5.png?fmt=png-alpha&wid=930&qlt=90', id: 1, }),
    new Photo({ url: 'https://toyotaveracruz.com/Assets/ModelosNuevos/Img/Modelos/corolla/24/Colores/rojo.png', id: 2, }),
    new Photo({ url: 'https://www.diariomotor.com/imagenes/2023/12/toyota-corolla-2024-p.jpg', id: 3, }),
  ];
  