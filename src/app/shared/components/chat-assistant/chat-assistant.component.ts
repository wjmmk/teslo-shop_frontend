import { Component, signal } from '@angular/core';

@Component({
  selector: 'chat-assistant',
  imports: [],
  templateUrl: './chat-assistant.component.html',
  styleUrl: './chat-assistant.component.css'
})
export class ChatAssistantComponent {
  isOpen = signal(false); // Controla abrir/cerrar el chat
  messages = signal<{ from: 'user' | 'bot', text: string }[]>(['Bienvenido al Asistente de Chat. ¿Te ayudo a encontrar lo que buscas?'].map(text => ({ from: 'bot', text })));
  userMessage = signal('');

  toggleChat() {
    this.isOpen.update((v) => !v);
  }

  sendMessage() {
    const message = this.userMessage().trim();
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
