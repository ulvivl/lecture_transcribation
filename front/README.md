# Front
Проект реализован на React

Основные пакеты:
- [Dotenv](http://npmjs.com/package/dotenv)
- [React](https://pt-br.reactjs.org/)
- [React DOM](https://pt-br.reactjs.org/docs/react-dom.html)
- [React Router Dom](https://reacttraining.com/react-router/web/)
- [Typescript](https://www.typescriptlang.org/)
- [MUI](https://mui.com/)
- [FSD](https://feature-sliced.design/ru/)

Менеджер пакетов - [Yarn](https://yarnpkg.com/)
## Файлы конфигурации
Конфигурация сборщика - [Webpack](https://webpack.js.org/)
  -> Файл webpack.ts
Конфигурация - [Typescript](https://www.typescriptlang.org/)
  -> Файл tsconfig.json
## Стили
В основе UI лежит - [MUI](https://mui.com/)

Глобальные стили реализуется через темы
Основная тема размещена в /src/app/styles/mainTheme.ts
В теме можно глобально переопределить стили MUI

Дополнительный UI-kit должен быть расположен в /src/shared/ui

## Архитектура
Архитектурная методология в основе проекта - [FSD](https://feature-sliced.design/ru/)

# Рекомендации
- Использовать PascalCase при именовании компонентов
- Использовать camelCase для функций, объявленных внутри компонентов React