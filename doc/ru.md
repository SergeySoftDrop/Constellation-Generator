# 🌌 Constellation-Generator

## Содержание
- [Описание](#описание)
- [Установка](#установка)
- [Использование](#использование)

## Описание

**Constellation-Generator** — это простой визуальный генератор созвездий на HTML5 Canvas.  
Проект создан с нуля, используя чистый JavaScript, без сторонних библиотек.  

🔹 Частицы двигаются в случайных направлениях  
🔹 Частицы соединяются линиями, если находятся близко друг к другу  
🔹 Поддержка кастомизации через интерфейс настроек (цвет, количество частиц, скорость и др.)  
🔹 Две версии структуры проекта (monolithic, modular)

**Структура проекта:**  

- **Monolithic** — весь код в одном файле, проще для понимания. Использует меньше памяти, но больше ресурсов процессора.
- **Modular** — код разделён на модули, удобнее для расширения и поддержки. Использует больше памяти, но меньше ресурсов процессора.

## Установка

### 1️⃣ Клонируйте репозиторий:
```bash
git clone https://github.com/SergeySoftDrop/Constellation-Generator.git
```

### 2️⃣ Или скачайте .zip архив:
[Скачать ZIP](https://github.com/SergeySoftDrop/Constellation-Generator/archive/refs/heads/main.zip)

### 3️⃣ Перейдите в папку src и откройте файл index.html в браузере

## Использование

#### По умолчанию используется monolithic структура и проект может быть запущен без использования веб-сервера.

Чтобы использовать модульную версию, замените подключение monolithic/index.js на modular/main.js

```HTML
<!-- <script src="monolithic/index.js"></script> -->
<script src="modular/main.js" type="module"></script>
```
