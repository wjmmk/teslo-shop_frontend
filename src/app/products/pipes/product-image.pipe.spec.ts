import { ProductImagePipe } from './product-image.pipe';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl;

describe('ProductImagePipe', () => {
  let pipe: ProductImagePipe;

  beforeEach(() => {
    pipe = new ProductImagePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return no-image placeholder for null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('./assets/images/no-image.jpg');
  });

  it('should return no-image placeholder for undefined', () => {
    const result = pipe.transform(undefined as unknown as null);
    expect(result).toBe('./assets/images/no-image.jpg');
  });

  it('should return blob URL as-is', () => {
    const blobUrl = 'blob:http://localhost:3000/image.jpg';
    const result = pipe.transform(blobUrl);
    expect(result).toBe(blobUrl);
  });

  it('should return full URL for a string image name', () => {
    const result = pipe.transform('image-name.jpg');
    expect(result).toBe(`${baseUrl}/files/product/image-name.jpg`);
  });

  it('should return no-image placeholder for empty array', () => {
    const result = pipe.transform([]);
    expect(result).toBe('./assets/images/no-image.jpg');
  });

  it('should return first image URL from string array', () => {
    const result = pipe.transform(['img1.jpg', 'img2.jpg']);
    expect(result).toBe(`${baseUrl}/files/product/img1.jpg`);
  });

  it('should handle single-element array', () => {
    const result = pipe.transform(['only-image.jpg']);
    expect(result).toBe(`${baseUrl}/files/product/only-image.jpg`);
  });
});
