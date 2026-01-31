import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@store/components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { ChatAssistantComponent } from '@shared/components/chat-assistant/chat-assistant.component';
import { ParticleBackgroundComponent } from '../../pages/landing-page/components/particle-background/particle-background.component';


@Component({
    selector: 'app-store-front-layout',
    imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatAssistantComponent, ParticleBackgroundComponent],
    templateUrl: './store-front-layout.component.html'
})
export class StoreFrontLayoutComponent { }
