# Relatório de otimização de SEO — Portfólio Davi Costa

Data: 01/11/2026 · Escopo: `index.html`, `demo/mindflow`, `demo/escolar`, `style.css`, `script.js` e arquivos de configuração novos.
Identidade visual e funcionalidades preservadas (comparação de capturas de tela antes/depois: layout idêntico nos temas claro e escuro, em 1280 px e 390 px).

---

## ⚠️ Ação obrigatória antes de publicar: informar o domínio

Eu não sei o endereço final do site, então canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml` usam o marcador **`https://SEU-DOMINIO.com.br`**.
Troque em todos os arquivos de uma vez (Linux/macOS; no VS Code: Ctrl+Shift+H, "Substituir tudo"):

```bash
grep -rl "SEU-DOMINIO.com.br" . | xargs sed -i 's#SEU-DOMINIO\.com\.br#seudominio.com.br#g'
```

As linhas comentadas do `.htaccess` (opção www / sem www) usam `SEU-DOMINIO\.com\.br` com barras invertidas; edite à mão se for usá-las.
Se o site ficar numa subpasta (ex.: `usuario.github.io/portfolio/`), ajuste também os caminhos absolutos do `.htaccess` e do `404.html`.

---

## Resultados medidos (Lighthouse 13, local, emulação de celular e desktop)

| Métrica | Celular antes → depois | Desktop antes → depois |
|---|---|---|
| Desempenho | 95 → **100** | 100 → **100** |
| Acessibilidade | 100 → 100 | 100 → 100 |
| Boas práticas | 96 → 96 | 92 → 92 |
| SEO | 100 → 100 | 100 → 100 |
| LCP | 1,6 s → **1,1 s** | 0,6 s → 0,6 s |
| TBT (proxy de INP) | 180 ms → **30–50 ms** | 10 ms → ~0 ms |
| CLS | 0 → 0 | 0 → 0 |
| Peso transferido | 143 KB → 225 KB* | 665 KB → **267 KB** |

\* No celular o peso subiu porque as capas dos projetos agora começam a carregar a partir do HTML (antes só depois do JavaScript). O desempenho melhorou mesmo assim.

Outras validações:
- **W3C Nu HTML Checker** (validador oficial): 0 erros e 0 avisos nas 4 páginas (só "info" sobre barras em tags void, que é estilo).
- **axe-core, WCAG 2.2 AA + boas práticas**: de 5 tipos de violação para **0**, em tema claro e escuro, desktop e celular, com os diálogos de currículo e contato abertos.
- **Referências locais**: nenhum link ou imagem quebrado; as 3 URLs do `sitemap.xml` existem como arquivos.
- **Teste funcional** em navegador: animação do título, abas, galeria, modal de projeto, botão "Voltar", pular para o conteúdo e páginas de demo sem erros de JavaScript.

**Não foi possível rodar o PageSpeed Insights** (exige internet; o ambiente de teste só tinha acesso local). O Lighthouse local usa o mesmo motor, mas rode o PSI depois de publicar para ter os dados reais de campo. A única "falha" restante no console do teste é o Google Fonts, bloqueado no ambiente de teste.

---

## 1. Estrutura HTML e semântica
- `title` e `meta description` reescritos com palavras-chave naturais: "Davi Costa | Desenvolvedor Backend Júnior (PHP e Laravel)".
- `canonical`, `meta robots` (com `max-image-preview:large`), `viewport` e `lang="pt-BR"` já existiam/ficaram corretos.
- **H1 agora tem o texto real no HTML.** Antes ele era vazio e só o JavaScript digitava o texto; buscadores e leitores sem JS não viam o título. O JS limpa o texto e refaz a animação igual à anterior (sem piscar).
- Landmarks completos: `header`, `nav`, `main` (com `id="conteudo"`), `section` com `aria-labelledby`, `article` e `footer`. Hierarquia h1 → h2 → h3 conferida.
- Fallback `<noscript>` com a lista de habilidades (antes só existia via JS) e com a lista de telas nas páginas de demo.

## 2. SEO técnico
- `robots.txt` (libera tudo, inclusive CSS/JS/imagens que o Googlebot precisa para renderizar) e `sitemap.xml` com as 3 URLs.
- URLs amigáveis: canonical e sitemap usam `/` e `/demo/mindflow/`, `/demo/escolar/` (sem `index.html`).
- Redirecionamentos 301: `.htaccess` (Apache: HTTPS, `index.html` → pasta, opção www) e `_redirects` (Netlify/Cloudflare Pages). GitHub Pages não aceita redirecionamentos de servidor; lá o `canonical` já evita conteúdo duplicado.
- `404.html` próprio com `noindex`, evitando "soft 404".
- **JSON-LD (Schema.org)**: `WebSite` + `ProfilePage` + `Person` na home (somente dados que já estão no site: cargo, redes LinkedIn e GitHub, tecnologias); `WebPage` + `BreadcrumbList` nas demos.
- **Favicon rastreável**: era um `data:` URI (o Google não lê). Agora são arquivos: `favicon.ico`, `assets/favicon.svg`, `assets/favicon-48.png` e `assets/apple-touch-icon.png`.
- "Ver projeto" virou **link real** (`<a href>`): antes era botão e nenhuma página de demo era descobrível por rastreamento. O clique comum continua abrindo o modal; Ctrl/Cmd+clique abre em nova aba.

## 3. Desempenho e responsividade
- **Miniaturas reais** (256×144, recorte idêntico ao que o CSS já mostrava): as 16 miniaturas carregavam as capturas inteiras (1,1 MB no total); agora são ~59 KB.
- Imagens com `width`/`height` (capas e logos) para evitar deslocamento de layout; `loading="lazy"` mantido nas imagens abaixo da dobra; imagem principal com `preload` e `fetchpriority="high"`.
- As capas tinham `src=""` (inválido e dependente de JS); agora apontam para a imagem real.
- Imagens já estavam em WebP; AVIF não foi adicionado para não criar arquivos redundantes.
- `.htaccess` com compressão e cache do navegador (1 semana para CSS/JS, 1 mês para imagens; HTML sem cache).
- Responsividade conferida de 320 a 1920 px: sem rolagem horizontal.

## 4. Acessibilidade (WCAG 2.2)
- Link "Pular para o conteúdo" (aparece só ao focar com Tab).
- Abas de habilidades seguem o padrão WAI-ARIA: setas, Home e End, `aria-controls` e painel rotulado.
- Modal de projeto: restante da página fica `inert` enquanto aberto, o iframe ganha título descritivo, foco volta ao botão de origem.
- Rótulos das miniaturas descritivos e na ordem certa ("Ver tela 3: Cadastro de colaborador"; antes pulavam de 8 para 7).
- `alt` descritivo na imagem principal e nos logotipos; `lang="en"` em "LET'S CONNECT:"; `aria-label` removidos de `div` sem papel; `div` dentro de `label` (HTML inválido) trocado por `span`.
- Contraste: o selo "JavaScript" (branco sobre #a68f00 = 3,2:1) passou para #8a7500 (4,5:1). **É a única mudança visual**, muito sutil. Rótulo do link de e-mail ajustado para conter o texto visível.

## 5. Conteúdo e compartilhamento
- Open Graph e Twitter Cards completos, com imagem 1200×630 nova (`img/og-image.jpg`, 70 KB, nas cores do site) e texto alternativo.
- Metadados exclusivos em cada página (título, descrição, canonical, OG/Twitter).
- Link interno de volta ao portfólio nas demos (agora `<a>`), âncoras descritivas e menu/rodapé apontando para as seções.

## 6. Integração e validação (passo a passo após publicar)
1. Troque o domínio (seção no topo) e publique.
2. No **Google Search Console**, adicione a propriedade (domínio via DNS ou prefixo de URL com a tag HTML `<meta name="google-site-verification" ...>` no `<head>`).
3. Envie `https://seudominio.com.br/sitemap.xml` em *Sitemaps* e use *Inspeção de URL* na home → "Solicitar indexação".
4. Teste o JSON-LD em https://search.google.com/test/rich-results e o desempenho em https://pagespeed.web.dev.
5. Teste o compartilhamento com o depurador do Facebook/LinkedIn (Post Inspector); eles guardam cache, então reenvie após alterar a imagem.

---

## Pontos de atenção (não alterados de propósito)
- **Link do Instagram no rodapé** aponta para `https://www.instagram.com/` (página genérica, sem o seu perfil). Coloque o seu perfil ou remova; não o incluí no JSON-LD.
- **Capas dos projetos no desktop aparecem esticadas**: o CSS força a proporção 1280:628 em capturas que têm outra proporção (o Lighthouse aponta `image-aspect-ratio`). Corrigir muda o visual, então não mexi. Se quiser, adicione `object-fit: cover; object-position: top;` em `.projeto-capa > img`.
- Título/descrição das demos dizem "galeria de telas" porque as demos são capturas, não o sistema em execução. É a descrição fiel.
- Os diretórios `assets/css` e `assets/js` são cópias antigas não usadas; podem ser apagados.
- CSS e JS não foram minificados para você continuar editando os arquivos-fonte; com compressão (gzip) o ganho de minificar é pequeno.
- Os links internos usam `index.html` (para o site continuar abrindo com duplo clique em `file://`). O servidor redireciona para a URL limpa, e o `canonical` já indica a versão correta.
- Seu título animado com `aria-label` continua (evita o leitor de tela ler o texto pela metade); o validador html-validate o marca como "não recomendado", mas o validador oficial do W3C aceita.

## Arquivos
**Novos:** `robots.txt`, `sitemap.xml`, `404.html`, `.htaccess`, `_redirects`, `favicon.ico`, `img/og-image.jpg`, `assets/favicon-48.png`, `assets/apple-touch-icon.png`, `assets/icon-192.png`, `img/MindFlow/thumbs/*` (8), `img/Sistema_Escolar_Davi/thumbs/*` (8), `RELATORIO-SEO.md`.
**Alterados:** `index.html`, `style.css`, `script.js`, `demo/mindflow/index.html`, `demo/escolar/index.html`, `demo/_tour.js`, `LEIA-ME.txt`.
