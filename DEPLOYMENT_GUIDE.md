# 🚀 מדריך פריסה - האלפון הדיגיטלי

## שלב 1: פריסת ה-Backend ל-Railway

### 1.1 הכנה

```bash
cd backend
```

### 1.2 יצירת חשבון Railway

1. לך ל-[railway.app](https://railway.app)
2. התחבר עם GitHub
3. לחץ על "New Project"

### 1.3 פריסת ה-Backend

1. בחר "Deploy from GitHub repo"
2. בחר את הרפוזיטורי שלך
3. בחר את התיקייה `backend`
4. Railway יזהה אוטומטית את ה-Dockerfile
5. לחץ על "Deploy"

### 1.4 קבלת ה-URL

- לאחר הפריסה, תקבל URL כמו: `https://your-app-name.railway.app`
- העתק את ה-URL הזה

## שלב 2: פריסת ה-Frontend ל-Vercel

### 2.1 הכנה

```bash
cd frontend
```

### 2.2 יצירת חשבון Vercel

1. לך ל-[vercel.com](https://vercel.com)
2. התחבר עם GitHub
3. לחץ על "New Project"

### 2.3 פריסת ה-Frontend

1. בחר את הרפוזיטורי שלך
2. בחר את התיקייה `frontend`
3. Vercel יזהה אוטומטית שזה React app
4. לחץ על "Deploy"

### 2.4 הגדרת Environment Variables

1. ב-Vercel Dashboard, לך ל-Settings → Environment Variables
2. הוסף:
   - `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`

### 2.5 Redeploy

לחץ על "Redeploy" כדי שהשינויים ייכנסו לתוקף

## שלב 3: בדיקה

### 3.1 בדיקת ה-Backend

```bash
curl https://your-backend-url.railway.app/api/health
```

### 3.2 בדיקת ה-Frontend

פתח את ה-URL של Vercel ובדוק שהכל עובד

## 🔧 פתרון בעיות

### בעיה: CORS

אם יש בעיות CORS, וודא שה-backend מגדיר:

```javascript
app.use(
  cors({
    origin: ["https://your-frontend-url.vercel.app"],
    credentials: true,
  })
);
```

### בעיה: Database

Railway ייצור מסד נתונים חדש. אם אתה רוצה לשמור על הנתונים:

1. העתק את `phonebook.db` ל-Railway
2. או השתמש ב-PostgreSQL במקום SQLite

### בעיה: Environment Variables

וודא שה-`REACT_APP_API_URL` מוגדר נכון ב-Vercel

## 📱 תוצאה סופית

לאחר הפריסה תקבל:

- **Frontend URL**: `https://your-app-name.vercel.app`
- **Backend URL**: `https://your-backend-name.railway.app`

## 💰 עלויות

- **Vercel**: חינם (עד 100GB bandwidth)
- **Railway**: חינם (עד $5 credit)
- **סה"כ**: 0$ לחודש! 🎉
