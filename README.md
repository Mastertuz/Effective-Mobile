# User Service API

Сервис управления пользователями с аутентификацией и авторизацией.

## Технологии

- **Node.js** + **TypeScript**
- **Express.js** - веб-фреймворк
- **bcrypt** - хеширование паролей
- **jsonwebtoken** - JWT токены для аутентификации
- **JSON файл** - хранение данных (для простоты демонстрации)

## Структура проекта

```
src/
├── controllers/     # Контроллеры
├── middleware/      # Middleware для аутентификации
├── models/          # Типы и интерфейсы
├── routes/          # Маршруты API
├── services/        # Бизнес-логика
├── app.ts          # Основной файл приложения
└── config.ts       # Конфигурация
```

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Запуск сервера для разработки
```bash
npm run dev
```

### 3. Сборка проекта
```bash
npm run build
```

### 4. Запуск production версии
```bash
npm start
```

## API Endpoints

Сервер запускается на порту **3000**

### Аутентификация

#### 1. Регистрация пользователя
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "Иван Петров",
  "birthDate": "1990-05-15",
  "email": "ivan@example.com",
  "password": "password123",
  "role": "user"  // необязательно, по умолчанию "user"
}
```

**Ответ:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "fullName": "Иван Петров",
    "birthDate": "1990-05-15",
    "email": "ivan@example.com",
    "role": "user",
    "isActive": true
  }
}
```

#### 2. Авторизация пользователя
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ответ:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "fullName": "Иван Петров",
    "birthDate": "1990-05-15",
    "email": "ivan@example.com",
    "role": "user",
    "isActive": true
  }
}
```

### Защищенные endpoints (требуют токен в заголовке)

Добавьте заголовок: `Authorization: Bearer <your_jwt_token>`

#### 3. Получение пользователя по ID
```http
GET /api/auth/users/:id
Authorization: Bearer <token>
```

**Доступ:**
- Админ: может получить любого пользователя
- Пользователь: может получить только себя

#### 4. Получение списка пользователей
```http
GET /api/auth/users
Authorization: Bearer <token>
```

**Доступ:** только для админа

#### 5. Блокировка пользователя
```http
PATCH /api/auth/users/:id/block
Authorization: Bearer <token>
```

**Доступ:**
- Админ: может заблокировать любого пользователя
- Пользователь: может заблокировать только себя

## Учетная запись администратора по умолчанию

При первом запуске автоматически создается учетная запись администратора:

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `admin`

## Примеры использования

### 1. Авторизация администратора
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 2. Регистрация нового пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Тест Пользователь",
    "birthDate": "1995-12-01",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Получение списка пользователей (от имени админа)
```bash
curl -X GET http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Получение пользователя по ID
```bash
curl -X GET http://localhost:3000/api/auth/users/2 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Блокировка пользователя
```bash
curl -X PATCH http://localhost:3000/api/auth/users/2/block \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Модель пользователя

```typescript
interface User {
  id: number;
  fullName: string;        // ФИО
  birthDate: string;       // Дата рождения (YYYY-MM-DD)
  email: string;           // Email (уникальное значение)
  password: string;        // Пароль (хешируется)
  role: 'admin' | 'user';  // Роль пользователя
  isActive: boolean;       // Статус активности
}
```

## Проверка работоспособности

Для проверки того, что сервер запущен:
```bash
curl http://localhost:3000/health
```

## Особенности реализации

1. **Безопасность:**
   - Пароли хешируются с помощью bcrypt
   - JWT токены для аутентификации
   - Middleware для проверки прав доступа

2. **Структура:**
   - Разделение на слои (controllers, services, middleware)
   - TypeScript для типизации
   - Модульная архитектура

3. **Хранение данных:**
   - JSON файл для простоты демонстрации
   - Легко заменить на любую базу данных

4. **Авторизация:**
   - Роли admin/user
   - Пользователи могут управлять только своими данными
   - Админы имеют полный доступ

## Возможные улучшения

- Подключение реальной базы данных (PostgreSQL, MongoDB)
- Валидация данных с помощью Joi или class-validator
- Логирование с помощью Winston
- Тестирование с Jest
- Документация API с Swagger
- Rate limiting
- CORS настройки
- Переменные окружения для конфигурации
# Effective-Mobile
