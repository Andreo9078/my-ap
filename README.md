# Установка


1. Установить Node.js
2. В директории с package.json прописать:

```bash
npm install
```

# Запуск в тестовом режиме

1. Убедится, что в файле electron/main.cts переменная isDevelopment = true
2. Использовать команду в терминале 

```bash
npm start build
```

Следующие команды должны быть запущен в разных терминалах

3. Запуск локального сервера vite

```bash
npm run start_react
```

4. Запуск electron
```bash
npm start
```
