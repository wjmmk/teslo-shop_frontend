import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ChatService, ChatResponse } from './chat.service';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl;

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a question and receive a response', () => {
    const mockResponse: ChatResponse = {
      success: true,
      question: 'What is this?',
      answer: 'This is a test answer.',
      timestamp: new Date(),
    };

    service.askQuestion('What is this?').subscribe((response) => {
      expect(response.success).toBeTrue();
      expect(response.answer).toBe('This is a test answer.');
    });

    const req = httpMock.expectOne(`${baseUrl}/chat/ask`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ question: 'What is this?' });
    req.flush(mockResponse);
  });

  it('should handle error when asking question', () => {
    service.askQuestion('test').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/chat/ask`);
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
