import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { FormUtils } from 'src/app/Utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

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
    inStock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    } else {
      const formValue = this.productForm.value;

      const productLike: Partial<Product> = {
        ...(formValue as any),
        tags: formValue.tags
          ?.toLowerCase()
          .split(', ')
          .map((tag) => tag.trim()) ?? []
      };
      console.log('Product-Details: ', productLike);
      this.productsService.updateProduct(productLike);
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
