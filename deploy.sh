#!/bin/bash

echo "🚀 מתחיל תהליך פריסה..."

# בדיקה שהכל עובד
echo "📦 בודק build של frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ שגיאה ב-build של frontend"
    exit 1
fi
echo "✅ Frontend build הצליח"

cd ..

echo "📦 בודק build של backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ שגיאה בהתקנת dependencies של backend"
    exit 1
fi
echo "✅ Backend dependencies הותקנו"

cd ..

echo ""
echo "🎉 הכל מוכן לפריסה!"
echo ""
echo "📋 הוראות פריסה:"
echo "1. העלה את הקוד ל-GitHub"
echo "2. לך ל-railway.app ופרוס את ה-backend"
echo "3. לך ל-vercel.com ופרוס את ה-frontend"
echo "4. הגדר את REACT_APP_API_URL ב-Vercel"
echo ""
echo "📖 לפרטים נוספים, ראה DEPLOYMENT_GUIDE.md"
