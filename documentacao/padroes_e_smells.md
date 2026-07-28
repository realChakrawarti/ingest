## Code Smell 1: Tratamento de Erro Ausente (Loading Infinito)

* **Trecho do código:** Verificado no carregamento inicial do contexto de autenticação (`src/features/auth/context-provider.tsx`). O estado `loading` inicia como `true` e não possui um timeout de segurança caso o Firebase falhe na inicialização:
  ```tsx
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const authStateChanged = async (user: User | null) => {
      // ...
    };

    // CODE SMELL: Se o client.auth falhar silenciosamente (ex: erro de API Key ou rede),
    // o onAuthStateChanged não avisa o sistema e o 'loading' fica travado em true infinitamente.
    const unsubscribeFromAuth = onAuthStateChanged(
      client.auth,
      authStateChanged
    );
  // ...
* **Problema identificado:** O sistema não possui um mecanismo de "timeout" ou tratamento de exceção amigável para falhas de conexão com o BaaS (Firebase). Isso resulta em uma tela preta ou carregamento infinito, prejudicando a experiência do usuário (UX).
* **Solução proposta/aplicada:** Implementar uma barreira de erro (Error Boundary) ou um estado de erro que exiba uma mensagem clara ("Erro ao conectar com o servidor") após um período determinado de tentativa de conexão.