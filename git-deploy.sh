#!/bin/bash

echo "🚀 מתחיל תהליך Git ו-פריסה..."

# בדיקה שהכל עובד
echo "📦 בודק build..."
./deploy.sh
if [ $? -ne 0 ]; then
    echo "❌ שגיאה ב-build"
    exit 1
fi

echo ""
echo "📝 מוסיף קבצים ל-Git..."
git add .

echo "💾 יוצר commit..."
git commit -m "🚀 Ready for deployment - Digital Phonebook App

✨ Features:
- Israeli phone number validation
- RTL Hebrew layout
- Contact management (add, edit, delete)
- Favorites system
- Search and filter
- Responsive design
- Custom favicon and branding

🔧 Technical:
- React frontend
- Node.js/Express backend
- SQLite database
- CORS enabled
- Production ready"

echo "📤 דוחף ל-GitHub..."
git push origin main

echo ""
echo "🎉 הקוד הועלה ל-GitHub!"
echo ""
echo "📋 השלבים הבאים:"
echo "1. לך ל-railway.app ופרוס את ה-backend"
echo "2. לך ל-vercel.com ופרוס את ה-frontend"
echo "3. הגדר את REACT_APP_API_URL ב-Vercel"
echo ""
echo "📖 לפרטים נוספים, ראה QUICK_DEPLOY.md"
