# Deploy ke Vercel (Backend + Frontend)

## 1. Push Kedua Repo ke GitHub

Pastikan Anda sudah push:
- Backend ke: `https://github.com/RanaAqilaK/sbd-cs10-backend`
- Frontend ke: `https://github.com/RanaAqilaK/sbd-cs10-frontend`

## 2. Deploy Backend ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik "Add New..." → "Project"
4. Pilih repo `sbd-cs10-backend`
5. Di "Configure Project":
   - Framework Preset: **Node.js**
   - Root Directory: `.` (root)
   - Build Command: `npm install`
   - Output Directory: (kosongkan)
6. Klik "Environment Variables" dan tambahkan:
   ```
   DB_USER=postgres
   DB_HOST=<database-host-anda>
   DB_NAME=sbd_db
   DB_PASSWORD=<password-database>
   DB_PORT=5432
   JWT_SECRET=<secret-jwt-panjang>
   CORS_ORIGIN=https://<frontend-vercel-url>.vercel.app
   NODE_ENV=production
   ```
7. Klik "Deploy"

Setelah deploy, Anda akan dapat URL backend seperti: `https://sbd-cs10-backend.vercel.app`

## 3. Deploy Frontend ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik "Add New..." → "Project"
3. Pilih repo `sbd-cs10-frontend`
4. Di "Configure Project":
   - Framework: **Next.js** (auto-detect)
   - Root Directory: `.` (root)
5. Klik "Environment Variables" dan tambahkan:
   ```
   NEXT_PUBLIC_API_URL=https://<backend-vercel-url>.vercel.app
   ```
   (Contoh: `https://sbd-cs10-backend.vercel.app`)
6. Klik "Deploy"

Setelah deploy, frontend akan dapat URL seperti: `https://sbd-cs10-frontend.vercel.app`

## 4. Update Backend CORS (Jika Frontend URL Sudah Tahu)

1. Buka project backend di Vercel
2. Settings → Environment Variables
3. Update `CORS_ORIGIN` ke URL frontend yang sudah dideploy
4. Redeploy (Deployments → Re-deploy)

## 5. Testing

1. Buka frontend URL: https://sbd-cs10-frontend.vercel.app
2. Coba login/register
3. Coba buka halaman items
4. Cek browser console jika ada error CORS

## Troubleshooting

### CORS Error "Origin not allowed"
- Pastikan CORS_ORIGIN di backend = URL frontend
- Backend perlu di-redeploy setelah update env

### 502 Bad Gateway
- Backend mungkin timeout atau database tidak reach
- Cek console backend di Vercel → Logs
- Pastikan DATABASE_URL atau DB credentials benar

### API calls ke localhost
- Frontend masih pakai API URL localhost
- Set `NEXT_PUBLIC_API_URL` di Vercel frontend environment

## Catatan Penting

- **Vercel serverless timeout**: 60 detik max (gratis: 10s)
- **Database**: Pastikan database accessible dari public internet (atau setup IP whitelist)
- **Environment**: Jangan commit `.env` file, hanya set di Vercel dashboard
- **Redeploy**: Setiap kali ubah environment variables, perlu redeploy

## Struktur Yang Sudah Siap

✅ Backend Express di `/api/index.js` (Vercel compatible)
✅ Frontend Next.js di root frontend folder
✅ vercel.json sudah ada di backend
✅ CORS auto-detect environment
✅ API URL auto-detect Vercel deployment
