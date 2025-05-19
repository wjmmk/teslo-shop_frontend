import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { firstValueFrom } from 'rxjs';
import { FormUtils } from 'src/app/Utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();
  wasSaved = signal(false);
  fb = inject(FormBuilder);
  router = inject(Router);
  productsService = inject(ProductsService);


  ngOnInit(): void {
    this.setFormValue(this.product());

  }

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)]
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  async onSubmit() {
    if (this.productForm.invalid) {
      return;
    } else {
      const formValue = this.productForm.value;
      this.productForm.markAllAsTouched();

      const productLike: Partial<Product> = {
        ...(formValue as any),
        tags:
          typeof formValue.tags === 'string'
            ? formValue.tags
              ?.toLowerCase()
              .split(',')
              .map((tag) => tag.trim())
            : [],
      };

      // Logica para crear un nuevo producto.
      if (this.product().id === 'new') {
          const product = await firstValueFrom(
            this.productsService.createProduct(productLike)
          );
          this.router.navigate(['/admin/products', product.id]);
      } else {
          await firstValueFrom(
            this.productsService.updateProduct(this.product().id, productLike)
          );
      }
      this.wasSaved.set(true);
      setTimeout(() => {
        this.wasSaved.set(false);
      }, 2000);
      this.productForm.reset(this.product() as any);
    }
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else { currentSizes.push(size); }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  setFormValue(formLike: Partial<Product>) {
   // this.productForm.patchValue(formLike as any);
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({tags: formLike.tags?.join(', ') });
  }
}
