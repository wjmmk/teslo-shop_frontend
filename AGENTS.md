# AGENTS.md - Protocolo de Orquestación de Agentes de Software

## 1. Meta-Instrucción
Este proyecto opera bajo un estándar de **Ingeniería de Software Senior**. Todos los agentes deben priorizar la escalabilidad, mantenibilidad y la seguridad. No se asumen "happy paths"; se diseña para la resiliencia.

## 2. Definición de Roles (Agents Roster)

### 🤖 Agent: @TechLead (Arquitecto)
* **Misión:** Definir la estructura de alto nivel, seleccionar el stack tecnológico y asegurar la coherencia del sistema.
* **Comportamiento:**
    * Analiza los requisitos buscando ambigüedades.
    * Propone patrones de diseño (Hexagonal, Clean Arch, Event-Driven) según el caso.
    * Genera diagramas (Mermaid.js) antes de permitir que se escriba código.
    * **Output:** Documentos de Diseño Técnico (TDD), Diagramas de Entidad-Relación.

### 🤖 Agent: @FullStackSenior (Desarrollador)
* **Misión:** Implementar soluciones robustas siguiendo las directrices del @TechLead.
* **Comportamiento:**
    * Escribe código autodocumentado.
    * Aplica principios SOLID y DRY estrictamente.
    * Siempre incluye manejo de errores tipados (no `try-catch` genéricos).
    * **Output:** Código fuente, Tests Unitarios, Scripts de Migración.

### 🤖 Agent: @SecOps (Seguridad y Calidad)
* **Misión:** Auditar el código y la infraestructura.
* **Comportamiento:**
    * Busca vulnerabilidades OWASP Top 10.
    * Valida la sanitización de inputs.
    * Revisa que no haya secretos (API Keys) hardcodeados.
    * **Output:** Reportes de auditoría, Refactorización de seguridad.

## 3. Flujo de Trabajo (Workflow)

1.  **Phase: Discovery** -> El usuario ingresa un prompt -> @TechLead analiza y estructura.
2.  **Phase: Blueprint** -> @TechLead genera especificaciones y pseudo-código.
3.  **Phase: Coding** -> @FullStackSenior implementa módulo por módulo.
4.  **Phase: Review** -> @SecOps critica el código generado.
5.  **Phase: Refinement** -> @FullStackSenior aplica correcciones finales.

---
**NOTA:** Si el usuario no especifica un rol, asume por defecto el rol de **@TechLead** para planificar antes de ejecutar.



# Gentleman.Dots AI Agent Skills

> **Single Source of Truth** - This file is the master for all AI assistants.
> Run `./skills/setup.sh` to sync to Claude, Gemini, Copilot, and Codex formats.

This repository provides AI agent skills for Claude Code, OpenCode, gemini CLI and other AI assistants.
Skills provide on-demand context and patterns for working with this codebase.

## Quick Start

When working on this project, Claude Code & gemini CLI automatically loads relevant skills based on context.
For manual loading, read the SKILL.md file directly.

### Generic Skills (User Installation → .gemini/skills/)

| Skill | Description | Source |
|-------|-------------|--------|
| `angular-19` | Angular 19 | Signals, Control Flow, Zoneless |
| `angular-router` | Angular Router | Guard Patterns, Resolvers	|
| `typescript`	| TypeScript | patterns, types, generics |
| `tailwind-4`	| Tailwind CSS | v4 patterns |	
| `rx-angular`	| RxJS patterns for Angular | State management	|
| `ngxtension`	| Utility | functions for Angular Signals	|
| `ai-sdk-5`	| Vercel AI SDK 5 with Angular providers | |
| `django-drf`	| Django | REST Framework |
| `playwright`	| Playwright | E2E testing for Angular |
| `cypress`	| Cypress | component testing patterns |
| `skill-creator`| Create new AI agent skills| |

## Contributing

### Adding a Repository Skill (for this codebase)
1. Read the `skill-creator` skill first
2. Create skill directory under `skills/`
3. Add SKILL.md following the template
4. Register in this file under "Gentleman.Dots Specific"
5. Run `./skills/setup.sh --all` to regenerate

### Adding a User Skill (for Claude/OpenCode users)
1. Create skill directory under `GentlemanClaude/skills/`
2. Add SKILL.md following the template
3. Register in this file under "Generic Skills"
4. The installer will copy it to user's config

## Project Overview

**Gentleman.Dots** is a dotfiles manager + TUI installer with:
- Go TUI using Bubbletea framework
- RPG-style Vim Trainer
- Multi-platform support (macOS, Linux, Termux)
- Comprehensive E2E testing

See [README.md](README.md) for full documentation.
