# Личный сайт

Одностраничный лендинг-портфолио frontend-разработчика: **Vue 3 + Vite + SCSS**, анимации **GSAP** и canvas-сетка на фоне.

## Стек

- **Vue 3** (Composition API, `<script setup>`)
- **Vite 8**
- **Pinia**
- **vue-i18n** (RU / EN)
- **SCSS** (BEM, mobile-first, Stylelint)
- **GSAP** (ScrollTrigger, SplitText, scroll-сцены)
- Шрифт **Montserrat** (Google Fonts)

## Требования

- Node.js `^20.19.0` или `>=22.12.0`
- npm (в проекте только npm)

## Локальный запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://127.0.0.1:5173/`.

### Полезные команды

| Команда | Описание |
|--------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Локальный просмотр сборки |
| `npm run lint:style` | Stylelint для SCSS и Vue |

Контент (проекты, опыт, контакты): `src/data/site.js`.  
Тексты RU / EN: `src/locales/`.

## Сборка для выкладки

```bash
npm install
npm run build
```

Готовые файлы появятся в папке **`dist/`**:

```
dist/
├── index.html
├── favicon.svg
└── assets/
    ├── index-….css
    └── index-….js
```

Для GitHub Pages (base `/em-vue/`):

```bash
DEPLOY_PAGES=true npm run build
```

## GitHub Pages

Сайт: https://evgeny-markov.github.io/em-vue/
