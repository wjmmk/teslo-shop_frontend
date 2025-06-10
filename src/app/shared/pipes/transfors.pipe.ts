import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({name: 'customTranslate'})
export class TransforsPipe implements PipeTransform {

  private dictionary: { [key: string]: string } = {
    "Chill Pullover Hoodie": "Sudadera Chill con Capucha",
    "Men's Quilted Shirt Jacket": "Chaqueta Acolchada para Hombre",
    "Women’s Powerwall Tee": "Camiseta Powerwall para Mujer",
    "Men's Solar Roof Tee": "Camiseta solar (Tesla Solar Roof) para Hombre",
    "Scribble T Logo Onesie": "Body con Logo T de Garabato",
    "Men's Turbine Short Sleeve Tee": "Camiseta de Manga Corta Turbine para Hombre",
    "Men's 3D T Logo Tee": "Camiseta 3D con Logo T para Hombre",
    "Kids 3D T Logo Tee": "Camiseta 3D con Logo T para Niños",
    "Women's T Logo Short Sleeve Scoop Neck Tee": "Camiseta de Manga Corta con Logo T para Mujer",
    "Men's Raven Lightweight Zip Up Bomber Jacket": "Chaqueta Bomber Ligera con Cremallera Raven para Hombre",
    "Women's Corp Jacket": "Chaqueta Corp para Mujer",
    "Men's Haha Yes Tee": "Camiseta Haha Yes para Hombre",
  };

  transform(value: string): string {
    return this.dictionary[value] || value;
  }

}
