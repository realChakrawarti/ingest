# Contribuições

Registro das contribuições realizadas ao projeto [Ingest](https://github.com/realChakrawarti/ingest).

---

## Issue #306 — Integração do Vitest Browser mode com preview (testes locais)

| Campo | Detalhe |
|-------|---------|
| **Issue** | [#306 — Integrate Vitest Browser mode with preview configuration for only local testing](https://github.com/realChakrawarti/ingest/issues/306) |
| **Branch** | `improve/vitest-browser-preview` |
| **Tipo** | `improve(testing)` |
| **Status** | Implementado |

### Contexto

A issue pedia a configuração de testes automatizados no projeto, em duas frentes:

1. **Testes unitários** — exemplo sugerido: `src/shared/utils/format-large-number.ts`
2. **Testes em browser mode** — usando o provider `preview` do Vitest, para validar interações reais de componentes como "Copy link" e "Marked watched", **somente em ambiente local** (sem execução em CI)

### Solução implementada

Foi adicionada a infraestrutura de testes com [Vitest](https://vitest.dev/) dividida em dois projetos independentes:

| Projeto | Provider / ambiente | Escopo |
|---------|---------------------|--------|
| `unit` | Node.js | Utilitários e lógica pura |
| `browser` | `@vitest/browser-preview` (Chromium) | Componentes React com DOM, clipboard e IndexedDB |

#### Decisões técnicas

- **Provider `preview`** escolhido conforme a issue: abre o navegador local do desenvolvedor para inspeção visual, sem exigir Playwright/WebdriverIO.
- **Separação por convenção de arquivo:** `*.test.*` para unitários, `*.browser.test.*` para browser — evita que testes browser rodem acidentalmente no CI.
- **Projeto browser desabilitado em CI:** quando `process.env.CI` está definido, o projeto `browser` não inclui nenhum arquivo de teste.
- **Shim de `process.env`** no setup browser (`vitest.browser.setup.ts`), pois módulos como `app-config.ts` dependem de `process` e falham no ambiente do navegador.
- **`vi.useFakeTimers()`** nos testes com clique, exigido pelo provider preview ao usar `@testing-library/user-event` internamente.

### Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `vitest.config.ts` | Configuração dos projetos `unit` e `browser` |
| `vitest.browser.setup.ts` | Setup global dos testes browser (CSS + shim de `process`) |
| `src/shared/utils/format-large-number.test.ts` | 6 casos unitários para formatação de números |
| `src/widgets/youtube/copy-link.browser.test.tsx` | 2 casos browser para o botão "Copy link" |
| `src/widgets/youtube/marked-watched.browser.test.tsx` | 3 casos browser para "Marked watched" / "Marked unwatched" |
| `src/test/fixtures/video.ts` | Fixture de vídeo reutilizada nos testes browser |
| `testes_devops.md` | Documentação operacional dos testes e pipeline CI |
| `.github/workflows/ci.yml` | Pipeline GitHub Actions (lint, unit tests, typecheck) |
| `src/types/static-assets.d.ts` | Tipos para imports de imagem no `tsc --noEmit` |

### Arquivos modificados

| Arquivo | Alteração |
|---------|-----------|
| `package.json` | Scripts `lint`, `typecheck`, `test`, `test:watch`, `test:browser`, `test:browser:watch` e dependências de dev |
| `Justfile` | Receitas `test`, `test-watch`, `test-browser`, `test-browser-watch` |
| `.github/workflows/ci.yml` | Pipeline GitHub Actions (lint, unit tests, typecheck) |

### Dependências adicionadas

```
vitest
@vitest/browser-preview
@vitejs/plugin-react
vite-tsconfig-paths
vitest-browser-react
```

### Como validar

```bash
# Testes unitários (6 casos)
npm test

# Testes browser (5 casos — requer navegador local)
npm run test:browser
```

Resultado esperado: **11 testes passando** (6 unitários + 5 browser).

Para detalhes de cada suite, comandos via `just` e comportamento em CI, consulte [`testes_devops.md`](./testes_devops.md).

### Critérios de aceite atendidos

- [x] Vitest configurado para testes unitários
- [x] Exemplo unitário em `format-large-number`
- [x] Browser mode com provider `preview` configurado
- [x] Testes browser para "Copy link"
- [x] Testes browser para "Marked watched"
- [x] Testes browser restritos ao ambiente local (não executam em CI)
- [x] Scripts e receitas `just` para execução
- [x] Pipeline GitHub Actions com lint, typecheck e testes unitários

### Referências

- [Vitest — Browser Mode](https://vitest.dev/guide/browser/why.html)
- [Vitest — Configuring Preview](https://vitest.dev/config/browser/preview.html)
- [vitest-browser-react](https://github.com/vitest-community/vitest-browser-react)

---

*Última atualização: julho de 2026*
