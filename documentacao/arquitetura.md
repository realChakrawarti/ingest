# Arquitetura do Projeto Ingest

## 1. Visão Geral
O Ingest é uma aplicação web moderna voltada para a organização de canais do YouTube em catálogos personalizados. O sistema utiliza uma arquitetura baseada em componentes e serviços distribuídos.

## 2. Tecnologias Utilizadas
* **Framework:** Next.js (React) - Escolhido pela facilidade de roteamento e renderização eficiente.
* **Linguagem:** TypeScript - Garante segurança de tipos e melhor manutenção.
* **Estilização:** Tailwind CSS - Utilizado para design responsivo e rápido desenvolvimento.
* **Backend como Serviço (BaaS):** Firebase - Gerencia autenticação e banco de dados em tempo real.
* **Gerenciador de Pacotes:** pnpm - Focado em performance e economia de espaço em disco.

## 3. Padrão Arquitetural
O projeto segue uma estrutura baseada em **Feature-Sliced Design (FSD)** ou camadas modulares, onde as funcionalidades são divididas em:
* `app`: Configurações globais e rotas.
* `entities`: Modelos de dados de negócio (ex: Canais, Catálogos).
* `features`: Ações que o usuário pode realizar (ex: adicionar canal).
* `shared`: Componentes e funções reutilizáveis (UI kit, hooks).

## 4. Diagrama de Componentes (Mermaid)
```mermaid
graph TD
    User((Usuário)) --> Frontend[Frontend Next.js]
    Frontend --> Auth[Firebase Auth]
    Frontend --> DB[Firebase Firestore]
    Frontend --> YTAPI[YouTube Data API]