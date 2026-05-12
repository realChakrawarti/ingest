## Code Smell 1: Tratamento de Erro Ausente (Loading Infinito)

* **Trecho do código:** Verificado globalmente no carregamento de componentes que dependem do Firebase Auth/Firestore (ex: `src/features/auth/context-provider.tsx`).
* **Problema identificado:** O sistema não possui um mecanismo de "timeout" ou tratamento de exceção amigável para falhas de conexão com o BaaS (Firebase). Isso resulta em uma tela preta ou carregamento infinito, prejudicando a experiência do usuário (UX).
* **Solução proposta/aplicada:** Implementar uma barreira de erro (Error Boundary) ou um estado de erro que exiba uma mensagem clara ("Erro ao conectar com o servidor") após um período determinado de tentativa de conexão.