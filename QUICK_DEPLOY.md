# 🚀 פריסה מהירה - האלפון הדיגיטלי

## ⚡ פריסה מהירה (5 דקות)

### 1️⃣ העלה ל-GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2️⃣ פרוס Backend (Railway)

1. לך ל-[railway.app](https://railway.app)
2. התחבר עם GitHub
3. "New Project" → "Deploy from GitHub repo"
4. בחר את הרפוזיטורי
5. בחר תיקייה: `backend`
6. לחץ "Deploy"
7. **העתק את ה-URL** (כמו: `https://your-app.railway.app`)

### 3️⃣ פרוס Frontend (Vercel)

1. לך ל-[vercel.com](https://vercel.com)
2. התחבר עם GitHub
3. "New Project" → בחר רפוזיטורי
4. בחר תיקייה: `frontend`
5. לחץ "Deploy"

### 4️⃣ הגדר Environment Variables

1. ב-Vercel Dashboard → Settings → Environment Variables
2. הוסף: `REACT_APP_API_URL` = `https://your-backend-url.railway.app/api`
3. לחץ "Redeploy"

## ✅ בדיקה

פתח את ה-URL של Vercel ובדוק שהכל עובד!

## 🆘 אם משהו לא עובד

1. בדוק את ה-console בדפדפן
2. בדוק את ה-logs ב-Railway
3. בדוק את ה-logs ב-Vercel
4. וודא שה-API URL נכון

## 💰 עלויות

- **Vercel**: חינם
- **Railway**: חינם (עד $5 credit)
- **סה"כ**: 0$ 🎉
