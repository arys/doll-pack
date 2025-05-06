This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Генератор Фигурок

Минималистичное веб-приложение, генерирующее фотореалистичные изображения фигурок пользователей с использованием API Segmind GPT-Image-1.

## Начало работы

Сначала создайте файл `.env.local` в корневом каталоге с вашим API-ключом Segmind:

```
SEGMIND_API_KEY=ваш_ключ_api_segmind
```

Затем запустите сервер разработки:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере, чтобы увидеть результат.

## Функции

- Загрузка вашего изображения
- Добавление имени и пользовательского описания
- Указание аксессуаров и стиля одежды для фигурки
- Генерация фотореалистичного изображения фигурки с использованием модели Segmind GPT-Image-1
- Скачивание сгенерированного изображения

## Технологический стек

- Next.js 15 с App Router
- React 19
- Tailwind CSS
- Segmind API для генерации изображений

## Дополнительная информация

Чтобы узнать больше о Next.js, ознакомьтесь со следующими ресурсами:

- [Документация Next.js](https://nextjs.org/docs) - узнайте о функциях и API Next.js.
- [Изучите Next.js](https://nextjs.org/learn) - интерактивный учебник по Next.js.

Вы можете ознакомиться с [GitHub-репозиторием Next.js](https://github.com/vercel/next.js) - ваши отзывы и вклад приветствуются!

## Развертывание на Vercel

Самый простой способ развернуть ваше Next.js приложение — использовать [платформу Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) от создателей Next.js.

Ознакомьтесь с [документацией по развертыванию Next.js](https://nextjs.org/docs/app/building-your-application/deploying) для получения дополнительной информации.
