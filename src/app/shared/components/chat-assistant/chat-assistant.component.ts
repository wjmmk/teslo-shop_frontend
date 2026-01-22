import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat-assistant',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-assistant.component.html',
  styleUrl: './chat-assistant.component.css'
})
export class ChatAssistantComponent {
  isOpen = signal(false); // Controla abrir/cerrar el chat
  messages = signal<{ from: 'user' | 'bot', text: string }[]>(['Bienvenido al Asistente de Chat. ¿Estoy aqui para ayudarte a encontrar lo que buscas?'].map(text => ({ from: 'bot', text })));
  userMessage = signal('');

  toggleChat() {
    this.isOpen.update((v) => !v);
  }

  sendMessage() {
    const message = this.userMessage().trim();
    console.log('Mensaje enviado:', message);
    if (!message) return;

    // Agregar el mensaje del usuario a la vista
    this.messages.update((msgs) => [...msgs, { from: 'user', text: message }]);
    this.userMessage.set('');

    // TODO: Llamar al servicio (NestJS) para la IA real
    // Por ahora agregamos un mensaje bot simulado
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'bot', text: 'Procesando tu solicitud...' },
    ]);
  }
}
