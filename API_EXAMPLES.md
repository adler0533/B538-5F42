# 📡 דוגמאות API

## בסיס URL

```
http://localhost:3001/api (מקומי)
https://your-backend.onrender.com/api (פרודקשן)
```

## Endpoints

### 1. בדיקת בריאות השירות

```bash
GET /api/health
```

**תגובה:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. קבלת כל אנשי הקשר

```bash
GET /api/contacts
```

**פרמטרים אופציונליים:**

- `filter=favorites` - רק מועדפים
- `search=דוד` - חיפוש

**תגובה:**

```json
[
  {
    "id": 1,
    "firstName": "דוד",
    "lastName": "כהן",
    "phone": "050-1234567",
    "isFavorite": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. קבלת איש קשר לפי ID

```bash
GET /api/contacts/1
```

**תגובה:**

```json
{
  "id": 1,
  "firstName": "דוד",
  "lastName": "כהן",
  "phone": "050-1234567",
  "isFavorite": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. יצירת איש קשר חדש

```bash
POST /api/contacts
Content-Type: application/json
```

**Body:**

```json
{
  "firstName": "רחל",
  "lastName": "לוי",
  "phone": "052-9876543",
  "isFavorite": false
}
```

**תגובה:**

```json
{
  "id": 2,
  "firstName": "רחל",
  "lastName": "לוי",
  "phone": "052-9876543",
  "isFavorite": false
}
```

### 5. עדכון איש קשר

```bash
PUT /api/contacts/2
Content-Type: application/json
```

**Body:**

```json
{
  "firstName": "רחל",
  "lastName": "לוי-כהן",
  "phone": "052-9876543",
  "isFavorite": true
}
```

**תגובה:**

```json
{
  "id": 2,
  "firstName": "רחל",
  "lastName": "לוי-כהן",
  "phone": "052-9876543",
  "isFavorite": true
}
```

### 6. החלפת סטטוס מועדף

```bash
PATCH /api/contacts/2/favorite
```

**תגובה:**

```json
{
  "id": 2,
  "firstName": "רחל",
  "lastName": "לוי-כהן",
  "phone": "052-9876543",
  "isFavorite": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 7. מחיקת איש קשר

```bash
DELETE /api/contacts/2
```

**תגובה:**

```json
{
  "message": "Contact deleted successfully"
}
```

## דוגמאות עם curl

### יצירת איש קשר

```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "משה",
    "lastName": "ישראלי",
    "phone": "054-5555555",
    "isFavorite": false
  }'
```

### קבלת אנשי קשר

```bash
curl http://localhost:3001/api/contacts
```

### חיפוש אנשי קשר

```bash
curl "http://localhost:3001/api/contacts?search=דוד"
```

### קבלת מועדפים בלבד

```bash
curl "http://localhost:3001/api/contacts?filter=favorites"
```

## קודי שגיאה

- **400**: Bad Request - נתונים חסרים או לא תקינים
- **404**: Not Found - איש קשר לא נמצא
- **500**: Internal Server Error - שגיאת שרת

## דוגמאות שגיאות

### איש קשר לא נמצא

```json
{
  "error": "Contact not found"
}
```

### נתונים חסרים

```json
{
  "error": "Missing required fields"
}
```
