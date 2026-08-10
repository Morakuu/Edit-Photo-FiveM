# Instrukcja wdrożenia darmowego serwera Backend Proxy (Render.com)

Ten poradnik pokaże Ci jak za darmo wdrożyć serwer, który będzie ukrywał Twoje klucze do GitHub i Discord.

## Krok 1: Publikacja kodu na GitHub
1. Zaloguj się na swoje konto na [GitHub](https://github.com/).
2. Utwórz nowe repozytorium o nazwie np. `ems-backend-proxy` (ustaw je jako **Prywatne**!).
3. Prześlij do niego dwa pliki, które stworzyliśmy w tym folderze:
   - `server.js`
   - `package.json`

## Krok 2: Konfiguracja na Render.com (Darmowy Hosting)
1. Wejdź na [Render.com](https://render.com/) i załóż darmowe konto (najlepiej logując się przez GitHuba).
2. W panelu Dashboard (prawy górny róg) kliknij przycisk **"New +"** i wybierz **"Web Service"**.
3. Wybierz opcję **"Build and deploy from a Git repository"** i kliknij "Next".
4. Podłącz swoje konto GitHub i wybierz z listy nowo utworzone repozytorium `ems-backend-proxy`.
5. Wypełnij prosty formularz:
   - **Name:** np. `ems-backend-proxy`
   - **Region:** Frankfurt (EU) (dla najmniejszych opóźnień)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Wybierz darmowy plan **"Free"**.

## Krok 3: Konfiguracja zmiennych środowiskowych (Kluczy API)
Zanim klikniesz "Create Web Service", zjedź na dół do sekcji **"Environment Variables"** i dodaj 3 zmienne:

1. **Key:** `GITHUB_TOKEN` | **Value:** *Wklej tu swój token GitHub (ten, który zaczynał się od github_pat...)*
2. **Key:** `DISCORD_ACTIVE_USERS_WEBHOOK` | **Value:** *Wklej tu link do webhooka kanału aktywności*
3. **Key:** `DISCORD_ADMIN_LOG_WEBHOOK` | **Value:** *Wklej tu link do webhooka logów dla obdukcji itp.*

*Możesz dodać te klucze skopiowane ze starych ustawień Twojej aplikacji.*

Po uzupełnieniu kliknij **"Create Web Service"**.

## Krok 4: Skopiowanie adresu serwera
Render zacznie budować Twój serwer. Potrwa to od 1 do 3 minut.
Gdy status zmieni się na zielony **"Live"**, na samej górze po lewej stronie pod nazwą usługi znajdziesz adres przypisany do Twojego serwera, np.:
`https://ems-backend-proxy-xyz.onrender.com`

**Zapisz ten adres URL**. Będziemy go potrzebować w kolejnym etapie, aby podmienić go w kodzie `app.html` w zmiennej `BACKEND_URL`.
