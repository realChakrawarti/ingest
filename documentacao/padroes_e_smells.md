# Padrões de Projeto e Code Smells - Ingest

Este documento detalha a análise de qualidade de código realizada no projeto Ingest, identificando oportunidades de melhoria (Code Smells) e aplicando/sugerindo soluções baseadas em padrões de projeto (GoF) e princípios SOLID.

---

## 1. Code Smells Identificados

### Code Smell 1: Tratamento de Erro Ausente (Loading Infinito)
* **Trecho do código:** Verificado no carregamento inicial do contexto de autenticação no arquivo `src/features/auth/context-provider.tsx`. O estado `loading` inicia como `true` e não possui um timeout de segurança caso o Firebase falhe na inicialização.
* **Problema identificado:** O sistema não possui um mecanismo de "timeout" ou tratamento de exceção amigável para falhas de conexão com o BaaS (Firebase). Isso resulta em uma tela preta ou carregamento infinito caso as credenciais estejam ausentes ou ocorra uma falha de rede, prejudicando severamente a experiência do usuário (UX).
* **Solução proposta/aplicada:** Implementar um temporizador de segurança (timeout) ou um mecanismo de barreira de erro (Error Boundary) que, após um intervalo definido (ex: 5 segundos) sem resposta do Firebase, altere o estado de carregamento e exiba uma mensagem clara de erro de conectividade ao usuário.

---

### Code Smell 2: Obsessão por Primitivos (Primitive Obsession)
* **Trecho do código:** Encontrado na assinatura dos parâmetros da função de atualização do catálogo no arquivo `src/entities/catalogs/services/update-catalog-channels.ts`. A assinatura recebe: `(userId: string, catalogId: string, channel: ZCatalogChannel)`.
* **Problema identificado:** A função depende de múltiplos tipos primitivos (`string`) passados consecutivamente de forma solta. Se o desenvolvedor acidentalmente inverter a ordem das strings de `userId` e `catalogId` ao chamar a função em outras partes do sistema, o compilador do TypeScript não acusará erros (ambos são strings), mas gerará falhas graves de consistência de dados em produção, salvando as informações no local incorreto.
* **Solução proposta/aplicada:** Encapsular os parâmetros correlacionados em um objeto estruturado de dados (Parameter Object) para garantir segurança de tipos em tempo de compilação e melhorar a legibilidade do código.

---

### Code Smell 3: Falta de Validação na Camada de Domínio/Serviço (Duplicidade)
* **Trecho do código:** Código original em `src/entities/catalogs/services/update-catalog-channels.ts` que confiava exclusivamente na função do Firebase Firestore (`FieldValue.arrayUnion`).
* **Problema identificado:** O Firestore considera o objeto inteiro para evitar duplicatas em `arrayUnion`. Se uma única propriedade mutável do canal (como a URL da foto de perfil ou descrição) mudar no YouTube, o Firestore tratará como um canal inédito e o inserirá novamente no array, gerando dados duplicados visualmente na interface. O sistema falhava ao não realizar uma checagem de exclusividade baseada em um identificador estável único (`channelId`).
* **Solução proposta/aplicada:** Refatorar a lógica de serviço para verificar defensivamente se um canal com o mesmo identificador estável (`channelId`) já reside no catálogo antes de persistir no banco de dados.

---

## 2. Padrões de Projeto (Design Patterns)

### Padrão 1: Command (Padrão de Comportamento)
* **Onde é sugerido/aplicado:** Na estrutura de serviços de mutação do catálogo em `src/entities/catalogs/services/` (como `create-catalog.ts`, `delete-catalog.ts`, `update-catalog-channels.ts`).
* **Justificativa:** Cada operação de alteração de catálogo funciona como um comando encapsulado autônomo com uma única responsabilidade (SRP). Isso permite desacoplar a interface do usuário da lógica de persistência de dados. No futuro, esse padrão facilita a implementação de recursos como filas de execução offline e histórico de ações para desfazer/refazer (undo/redo).

### Padrão 2: Repository Pattern (Padrão Estrutural)
* **Onde é sugerido/aplicado:** Na interface de persistência de dados com o Firebase Firestore em `src/shared/lib/firebase/refs.ts` e arquivos de serviços de entidade.
* **Justificativa:** O projeto centraliza a geração de referências do banco de dados (através do objeto `refs`). Esse desacoplamento funciona como um Repositório, isolando o restante do código da aplicação dos detalhes técnicos de infraestrutura do Firebase Firestore. Se o projeto decidir migrar o banco de dados para outro serviço futuramente, as camadas de visualização e negócios permanecerão intactas.