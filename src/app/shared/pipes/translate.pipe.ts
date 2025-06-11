import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({name: 'customTranslate'})
export class TransLatePipe implements PipeTransform {

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
    "Men's Cybertruck Owl Tee": "Camiseta Cybertruck Owl para Hombre",
    "Women's Small Wordmark Short Sleeve V-Neck Tee": "Camiseta de Manga Corta con Logo Pequeño para Mujer",
    "Women's Chill Half Zip Cropped Hoodie": "Sudadera Cropped con Media Cremallera Chill para Mujer",
    "Kids Racing Stripe Tee": "Camiseta con Rayas de Carreras para Niños",
    "Men's 3D T Logo Long Sleeve Tee": "Camiseta de Manga Larga 3D con Logo T para Hombre",
    "Women's Turbine Cropped Long Sleeve Tee": "Camiseta de Manga Larga Cropped Turbine para Mujer",
    "Men's Chill Full Zip Hoodie": "Sudadera con Cremallera Completa Chill para Hombre",
    "Women's Plaid Mode Tee": "Camiseta de Cuadros Mode para Mujer",
    "Thermal Cuffed Beanie": "Gorro Térmico con Puños",
    "Zero Emissions (Almost) Onesie": "Body Cero Emisiones (Casi)",
    "3D Large Wordmark Pullover Hoodie": "Buzzo con Logo Grande 3D",
    "Men's Chill Quarter Zip Pullover - White": "Sudadera con Media Cremallera Chill - Blanca para Hombre",
    "Men's Plaid Mode Tee": "Camiseta de Cuadros Mode para Hombre",
    "Cybertruck Graffiti Hoodie": "Buzzo con Graffiti de Cybertruck",
    "Kids Scribble T Logo Tee": "Camiseta con Logo T de Garabato para Niños",
    "Women's Cropped Puffer Jacket": "Chaqueta Acolchada Cropped para Mujer",
    "Men's 3D Large Wordmark Tee": "Camiseta con Logo Grande 3D para Hombre",
    "Women's Large Wordmark Short Sleeve Crew Neck Tee": "Camiseta de Manga Corta con Logo Grande para Mujer",
    "Men's Chill Quarter Zip Pullover - Gray": "Sudadera con Media Cremallera Chill - Gris para Hombre",
    "Women's Raven Slouchy Crew Sweatshirt": "Sudadera Raven Slouchy para Mujer",
    "Relaxed T Logo Hat": "Gorra Relaxed con Logo T",
    "Kids Checkered Tee": "Camiseta a Cuadros para Niños",
    "Men's S3XY Tee": "Camiseta S3XY para Hombre",
    "Men's 3D Wordmark Long Sleeve Tee": "Camiseta de Manga Larga 3D con Logo para Hombre",
    "Women's T Logo Long Sleeve Scoop Neck Tee": "Camiseta de Manga Larga con Logo T y Escote Redondeado para Mujer",
    "Men's Raven Lightweight Hoodie": "Sudadera Ligera Raven para Hombre",
    "Kids Cyberquad Bomber Jacket": "Chaqueta Bomber Cyberquad para Niños",
    "Men's Battery Day Tee": "Camiseta Battery Day para Hombre",
    "Men’s Chill Crew Neck Sweatshirt": "Sudadera con Cuello Redondo Chill para Hombre",
    "Men's Turbine Long Sleeve Tee": "Camiseta de Manga Larga Turbine para Hombre",
    "Kids Cybertruck Long Sleeve Tee": "Camiseta de Manga Larga Cybertruck para Niños",
    "Women's Raven Joggers": "Pantalones Raven para Mujer",
    "Men’s Cybertruck Bulletproof Tee": "Camiseta a Prueba de Balas Cybertruck para Hombre",
    "Made on Earth by Humans Onesie": "Body Hecho en la Tierra por Humanos",
    "Men's Let the Sun Shine Tee": "Camiseta Let the Sun Shine para Hombre"
  };

  transform(value: string): string {
    return this.dictionary[value] || value;
  }

}
