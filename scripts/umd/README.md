# UMD

## Определение

**UMD** (Universal Module Definition) — это способ организовать JavaScript-код так, чтобы он работал в разных средах:

1. В браузере (даже без сборщиков вроде Webpack);
2. В Node.js;
3. С системами модулей вроде CommonJS (используется в Node.js) или AMD (например, RequireJS для браузера).

## Подготовка

1. Установить Node.JS + NPM
2. Прописать эту команду в консоли:

```sh
npm install -g umd uglify-js
```

## Примеры

> [!TIP]
> Вызов с root-папки проекта.

Конвертация [скрипта](/libs/donationalerts/donationalerts.js) взаимодействия с **st-aniby** и **DonationAlerts** в формат UMD.

```sh
./scripts/umd/compile.sh ./libs/sfutils/donationalerts.js DonationAlerts ./libs/donationalerts/donationalerts
```

То же самое, но для [sfutils.js](/libs/sfutils/sfutils.js)

```sh
./scripts/umd/compile.sh ./libs/sfutils/sfutils.js sfutils ./libs/sfutils/sfutils
```
