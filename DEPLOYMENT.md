# Průvodce nasazením

Tento web běží na **Cloudflare Pages** (zdarma). Správa obsahu probíhá přes **Decap CMS** na adrese `/admin/`.

---

## Co budete potřebovat

- GitHub účet (pro správu obsahu)
- Cloudflare účet (zdarma, na https://cloudflare.com)

---

## Krok 1 — Nahrajte kód na GitHub

1. Vytvořte nový repozitář na GitHubu (např. `lf-web`)
2. Nahrajte celý obsah složky `presentation-web` do tohoto repozitáře:

```
git init
git add .
git commit -m "init"
git remote add origin https://github.com/<org>/<repo>.git
git push -u origin main
```

---

## Krok 2 — Vytvořte GitHub OAuth App

Tato aplikace umožní editorům přihlásit se do CMS přes GitHub.

1. Na GitHubu přejděte na: **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Vyplňte:
   - **Application name:** `LF Praha CMS`
   - **Homepage URL:** `https://<your-project>.pages.dev` (adresu zjistíte v kroku 3, prozatím dejte `https://example.com`)
   - **Authorization callback URL:** `https://<your-project>.pages.dev/callback` (stejně tak)
3. Klikněte **Register application**
4. Na stránce aplikace uvidíte **Client ID** — zkopírujte ho
5. Klikněte **Generate a new client secret** a zkopírujte vygenerovaný secret

> ⚠️ Secret se zobrazí pouze jednou. Uložte ho někam bezpečně.

---

## Krok 3 — Nasaďte na Cloudflare Pages

1. Přihlaste se na https://dash.cloudflare.com
2. V levém menu klikněte **Workers & Pages → Create → Pages**
3. Zvolte **Connect to Git** a propojte svůj GitHub účet
4. Vyberte repozitář `lf-web`
5. V nastavení buildu vyplňte:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Klikněte **Save and Deploy**
7. Cloudflare provede první build a přidělí vám adresu ve tvaru `https://lf-web-xxxx.pages.dev`

---

## Krok 4 — Nastavte proměnné prostředí

Po nasazení je potřeba přidat tajné klíče pro OAuth.

1. Ve Cloudflare Pages přejděte na svůj projekt → **Settings → Environment variables**
2. Přidejte dvě proměnné (pro **Production** i **Preview**):

| Název | Hodnota |
|-------|---------|
| `GITHUB_CLIENT_ID` | Client ID z kroku 2 |
| `GITHUB_CLIENT_SECRET` | Client Secret z kroku 2 |

3. Klikněte **Save**

---

## Krok 5 — Aktualizujte konfiguraci v kódu

Nyní znáte svou pages.dev adresu. Aktualizujte 3 místa v kódu:

### `astro.config.mjs`
```js
site: 'https://lf-web-xxxx.pages.dev',
```

### `public/admin/config.yml`
```yaml
backend:
  repo: <org>/lf-web          # váš GitHub org/uživatel a repozitář
  base_url: https://lf-web-xxxx.pages.dev
```

Commitněte a pushněte změny — Cloudflare automaticky spustí nový build.

---

## Krok 6 — Aktualizujte GitHub OAuth App

Nyní, když znáte finální adresu, vraťte se do GitHub OAuth App (Settings → Developer settings → OAuth Apps) a aktualizujte obě URL:

- **Homepage URL:** `https://lf-web-xxxx.pages.dev`
- **Authorization callback URL:** `https://lf-web-xxxx.pages.dev/callback`

---

## Krok 7 — Ověřte, že vše funguje

1. Otevřete `https://lf-web-xxxx.pages.dev` — web by se měl zobrazit
2. Otevřete `https://lf-web-xxxx.pages.dev/admin/` — zobrazí se CMS
3. Klikněte **Login with GitHub** a přihlaste se
4. Vytvořte zkušební aktualitu a klikněte **Publish**
5. Počkejte ~1 minutu a obnovte web — nová aktualita by se měla zobrazit

---

## Přidávání vlastní domény (volitelné)

Pokud chcete místo `pages.dev` používat vlastní doménu (např. `studenti-lf.cz`):

1. V Cloudflare Pages → **Custom domains → Set up a custom domain**
2. Zadejte doménu a postupujte podle instrukcí (DNS záznam)
3. Po aktivaci aktualizujte `site` v `astro.config.mjs` a `base_url` v `config.yml` na novou doménu
4. Aktualizujte také GitHub OAuth App URL

---

## Jak přidat nový příspěvek (pro editora)

1. Přejděte na `https://vas-web.pages.dev/admin/`
2. Přihlaste se GitHub účtem
3. Klikněte **Aktuality → New Aktualita**
4. Vyplňte název, datum, perex a obsah
5. Klikněte **Publish** (nebo **Save Draft** pro uložení konceptu)
6. Web se automaticky aktualizuje do ~1 minuty

---

## Ceny a limity (Free tier)

### Cloudflare Pages (hosting + CI/CD)

| Položka | Limit |
|---------|-------|
| Buildy | 500 / měsíc |
| Souběžné buildy | 1 |
| Vlastní domény | 100 |
| Bandwidth | Neomezená |
| Požadavky na statické soubory | Neomezené |
| Projekty | Neomezené |

### Cloudflare Pages Functions (OAuth proxy — `/auth` a `/callback`)

| Položka | Limit |
|---------|-------|
| Požadavky | 100 000 / den |
| CPU čas | 10 ms / požadavek |
| Paměť | 128 MB |

OAuth proxy zpracuje každé přihlášení editora jako 2 požadavky (jeden na `/auth`, jeden na `/callback`). Při 10 přihlášeních denně je to 20 požadavků — daleko pod limitem.

### GitHub (repozitář + OAuth App)

| Položka | Limit |
|---------|-------|
| Veřejný repozitář | Neomezený |
| OAuth App | Zdarma |
| GitHub API (přes Decap CMS) | 5 000 požadavků / hodinu |

### Celkové náklady

**0 Kč / měsíc** — pokud nepřekročíte 500 buildů měsíčně, což při příležitostném publikování aktualit nenastane.

Jediný možný výdaj je vlastní doména (cca 200–300 Kč/rok), která je ale volitelná.
