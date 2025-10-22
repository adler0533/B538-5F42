# 📱 אלפון דיגיטלי - Digital Phonebook

אפליקציית ניהול אנשי קשר עם React Frontend ו-Node.js Backend.

## 🚀 פריסה לאינטרנט - הוראות מפורטות

### 1. הכנת הפרויקט לפריסה

#### א. עדכון URL ה-API

1. ערוך את הקובץ `frontend/.env.production`
2. החלף את `https://your-backend-url.onrender.com/api` עם ה-URL האמיתי של ה-Backend שלך

### 2. פריסת ה-Backend ל-Render

#### א. יצירת חשבון Render

1. לך לאתר [render.com](https://render.com)
2. הרשם עם GitHub או Gmail
3. אשר את החשבון

#### ב. חיבור ל-GitHub

1. לחץ על "New +" → "Web Service"
2. בחר "Build and deploy from a Git repository"
3. חבר את חשבון ה-GitHub שלך
4. בחר את ה-repository של הפרויקט

#### ג. הגדרות הפריסה

1. **Name**: `digital-phonebook-backend`
2. **Environment**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Instance Type**: `Free`
6. **Auto-Deploy**: `Yes`

#### ד. משתני סביבה

הוסף את המשתנים הבאים:

- `NODE_ENV`: `production`
- `PORT`: `10000`

#### ה. פריסה

1. לחץ על "Create Web Service"
2. המתן לסיום הפריסה (5-10 דקות)
3. העתק את ה-URL שנוצר (בפורמט: `https://xxx.onrender.com`)

### 3. פריסת ה-Frontend ל-Vercel

#### א. יצירת חשבון Vercel

1. לך לאתר [vercel.com](https://vercel.com)
2. הרשם עם GitHub
3. אשר את החשבון

#### ב. עדכון URL ה-API

1. ערוך את הקובץ `frontend/.env.production`
2. החלף את `your-backend-url.onrender.com` עם ה-URL של ה-Backend מ-Render

#### ג. פריסה

1. לך ל-Vercel Dashboard
2. לחץ על "Add New..." → "Project"
3. בחר את ה-repository שלך
4. **Framework Preset**: `Create React App`
5. **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `build`
8. לחץ על "Deploy"

### 4. בדיקת הפריסה

#### א. בדיקת ה-Backend

1. לך ל-URL של ה-Backend
2. הוסף `/api/health` לסוף ה-URL
3. אתה אמור לראות: `{"status":"OK","timestamp":"..."}`

#### ב. בדיקת ה-Frontend

1. לך ל-URL של ה-Frontend מ-Vercel
2. בדוק שהאפליקציה עובדת
3. נסה להוסיף איש קשר חדש
4. בדוק שהנתונים נשמרים

### 5. פתרון בעיות נפוצות

#### בעיה: ה-Frontend לא מתחבר ל-Backend

**פתרון**:

1. ודא שה-URL ב-`.env.production` נכון
2. ודא שה-Backend רץ ב-Render
3. בדוק את ה-CORS settings ב-Backend

#### בעיה: ה-Backend לא רץ

**פתרון**:

1. בדוק את הלוגים ב-Render Dashboard
2. ודא שכל ה-dependencies מותקנים
3. בדוק שה-port נכון (10000 ל-Render)

#### בעיה: הנתונים לא נשמרים

**פתרון**:

1. בדוק שה-SQLite database נוצר
2. בדוק את ה-permissions של ה-filesystem
3. בדוק את ה-API endpoints

### 6. עדכונים עתידיים

#### עדכון ה-Backend

1. ערוך את הקוד
2. Push ל-GitHub
3. Render יבנה ויפרס אוטומטית

#### עדכון ה-Frontend

1. ערוך את הקוד
2. Push ל-GitHub
3. Vercel יבנה ויפרס אוטומטית

## 🛠️ פיתוח מקומי

### הפעלת ה-Backend

```bash
cd backend
npm install
npm start
```

### הפעלת ה-Frontend

```bash
cd frontend
npm install
npm start
```

## 📁 מבנה הפרויקט

```
digital-phonebook-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   ├── vercel.json
│   ├── .env
│   └── .env.production
├── render.yaml
└── README.md
```

## 🔧 טכנולוגיות

- **Frontend**: React, Axios
- **Backend**: Node.js, Express, SQLite
- **Deployment**: Vercel (Frontend), Render (Backend)
- **Database**: SQLite (מקומי + בענן)

## 📱 תכונות

- ✅ הוספת אנשי קשר
- ✅ עריכת אנשי קשר
- ✅ מחיקת אנשי קשר
- ✅ חיפוש אנשי קשר
- ✅ סימון מועדפים
- ✅ עיצוב רספונסיבי
- ✅ שמירה בענן
- ✅ פריסה אוטומטית

---

**הערה**: שתי הפלטפורמות (Vercel ו-Render) חינמיות, אבל יש מגבלות על השימוש. אם תגיע למגבלות, תוכל לשדרג לתכניות בתשלום.
# B538-5F42
