# Contribuições e Relatório de Engenharia - Ingest

Este documento detalha as contribuições da dupla para o projeto Ingest, divididas entre a correção da issue (Caminho A) e a engenharia de qualidade (Caminho B).

---

## 1. Divisão de Papéis da Dupla
* **Erick Yuri:** Análise arquitetural (PR1), mapeamento de padrões/smells (PR2) e documentação técnica de refatoração (PR3).
* **Iasmin:** Implementação de testes automatizados (PR4), melhorias no pipeline de CI/CD (PR5) e resolução programática da duplicação de canais (PR6).

---

## 2. Caminho A: Manutenção Corretiva (Issue #306)
* **Issue associada:** [#306](https://github.com/realChakrawarti/ingest/issues/306) (Canais Duplicados no Catálogo)
* **Descrição da Solução:** O sistema permitia a inserção de registros duplicados de canais do YouTube em um mesmo catálogo caso atributos variáveis (como avatar ou descrição) mudassem. A solução consistiu em interceptar a operação de escrita no Firebase Firestore e garantir a unicidade do canal baseando-se estritamente no identificador estável `channelId`.

---

## 3. Caminho B: Engenharia de Qualidade e Refatoração
* **Descrição da Refatoração:** 
  Refatoramos a camada de serviços em `src/entities/catalogs/services/update-catalog-channels.ts`. 
  
  * **Antes:** O código realizava um push direto e cego no array usando `FieldValue.arrayUnion(channel)` do Firestore. Como o Firestore compara o objeto de forma estrita e literal, qualquer pequena diferença de string em campos secundários criava um elemento duplicado.
  * **Depois:** Implementamos uma checagem ativa que lê o estado atualizado do catálogo persistido no banco de dados, mapeia os IDs de canais já existentes, e valida se o novo canal (`channelId`) já está registrado. A persistência só é disparada se o canal não for duplicado, agindo como uma barreira de integridade em nível de serviço.

---

  ## 4. Lista de Pull Requests
* **PR1 (Arquitetura):** [Link do seu PR1 aqui]
* **PR2 (Padrões):** [Link do seu PR2 aqui]
* **PR3 (Refatoração):** [Link do PR3 - a ser preenchido após abertura]
* **PR4 (Testes):** [A cargo da Iasmin]
* **PR5 (DevOps):** [A cargo da Iasmin]
* **PR6 (Issue Resolvida):** [A cargo da Iasmin]