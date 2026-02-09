// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface ChatResponse {
  success: boolean;
  question: string;
  answer: string;
  context?: any;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = `${environment.baseUrl}/chat`;

  constructor(private http: HttpClient) {}

  askQuestion(question: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/ask`, {
      question
    });
  }
}
