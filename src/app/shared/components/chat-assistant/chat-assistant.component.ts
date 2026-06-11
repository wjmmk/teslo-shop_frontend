import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ChatService } from '@products/services/chat.service';
import { ProductsCartService } from '@products/services/products-cart.service';

@Component({
  selector: 'chat-assistant',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-assistant.component.html',
  styleUrl: './chat-assistant.component.css'
})
export class ChatAssistantComponent {
  productsCartService = inject(ProductsCartService);
  isOpen = signal(false); // Controla abrir/cerrar el chat
 // messages = signal<{ from: 'user' | 'bot', text: string }[]>(['Bienvenido al Asistente de Chat. ¿Estoy aqui para ayudarte a encontrar lo que buscas?'].map(text => ({ from: 'bot', text })));
  userMessage = signal('');

  messages = signal<{ from: 'user' | 'bot'; text: string; timestamp?: Date }[]>([
    {
      from: 'bot',
      text: '👋 ¡Hola! Bienvenido al Asistente de Chat. ¿Estoy aqui para ayudarte a encontrar lo que buscas?',
      timestamp: new Date(),
    },
  ]);
  isLoading = signal(false); // Nuevo: indica si está esperando respuesta
  error = signal<string | null>(null); // Nuevo: manejo de errores

   constructor(private readonly chatService: ChatService) {
    // Effect para scroll automático cuando hay nuevos mensajes
    effect(() => {
      if (this.messages().length > 0) {
        this.scrollToBottom();
      }
    });
  }

  toggleChat() {
    this.isOpen.update((v) => !v);
  }


  async sendMessage() {
    const message = this.userMessage().trim();
    console.log('📤 Mensaje enviado:', message);

    // Validación
    if (!message) return;
    if (this.isLoading()) {
      console.warn('⏳ Ya hay una consulta en proceso');
      return;
    }

    // 1. Agregar mensaje del usuario
    this.messages.update((msgs) => [
      ...msgs,
      {
        from: 'user',
        text: message,
        timestamp: new Date(),
      },
    ]);

    // 2. Limpiar input y activar loading
    this.userMessage.set('');
    this.isLoading.set(true);
    this.error.set(null);

    // 3. Agregar indicador de "escribiendo..."
    const typingMessageIndex = this.messages().length;
    this.messages.update((msgs) => [
      ...msgs,
      {
        from: 'bot',
        text: '⏳ Buscando información...',
        timestamp: new Date(),
      },
    ]);

    try {
      // 4. Llamar al servicio real de Gemini
      const response = await firstValueFrom(this.chatService.askQuestion(message));
      // 5. Reemplazar mensaje de "escribiendo..." con respuesta real
      this.messages.update((msgs) => {
        const newMessages = [...msgs];
        newMessages[typingMessageIndex] = {
          from: 'bot',
          text: response.answer,
          timestamp: new Date(response.timestamp),
        };
        return newMessages;
      });

      console.log('✅ Respuesta recibida:', response);

      // 6. Si hay contexto de productos, podrías hacer algo adicional
      if (response.context?.products?.length > 0) {
        this.handleProductContext(response.context.products);
      }
    } catch (error: any) {
      console.error('❌ Error al enviar mensaje:', error);

      // Reemplazar mensaje de "escribiendo..." con error
      this.messages.update((msgs) => {
        const newMessages = [...msgs];
        newMessages[typingMessageIndex] = {
          from: 'bot',
          text: '😕 Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
          timestamp: new Date(),
        };
        return newMessages;
      });

      // Setear error para mostrar en la UI si es necesario
      this.error.set(error.message || 'Error desconocido');
    } finally {
      // 7. Desactivar loading
      this.isLoading.set(false);
    }
  }

  /**
   * Maneja el contexto de productos devuelto por la IA
   * (Opcional: puedes usarlo para hacer algo especial con los productos encontrados)
   */
  private handleProductContext(products: any[]) {
    console.log('🛍️ Productos encontrados:', products);

    // Ejemplo: podrías agregar un mensaje adicional con enlaces a productos
    // o actualizar algún estado en el servicio de carrito

    // Por ahora solo lo logueamos
  }

  /**
   * Limpia la conversación
   */
  clearChat() {
    this.messages.set([
      {
        from: 'bot',
        text: '👋 ¡Hola! Soy el asistente de Teslo Shop. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
      },
    ]);
    this.error.set(null);
  }

  /**
   * Scroll automático al último mensaje
   */
  private scrollToBottom() {
    requestAnimationFrame(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }

  /**
   * Sugerencias rápidas que el usuario puede clickear
   */
  quickQuestions = [
    '¿Qué productos de hombre tienen disponible?',
    '¿Cuál es el precio de las camisetas?',
    '¿Tienen productos sostenibles?',
    'Muéstrame los productos más vendidos',
  ];

  /**
   * Envía una pregunta predefinida
   */
  sendQuickQuestion(question: string) {
    this.userMessage.set(question);
    this.sendMessage();
  }
}

