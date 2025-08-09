# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   
   ssh root@jafasol.com -p 5050
   cd /var/www/jafasol/backend
   ./quick-deploy.sh
   # 1. Stop PM2 processes
pm2 delete all
pm2 kill
pm2 flush

# 2. Copy the fixed server file
cp server-clean.js server.js

# 3. Start PM2 with the fixed server
pm2 start server.js --name jafasol-backend
pm2 save
pm2 startup

# 4. Check if it's working
pm2 status
pm2 logs jafasol-backend --lines 10


# Copy frontend build
scp -P 5050 -r frontend/dist/* root@jafasol.com:/var/www/jafasol/frontend/dist/

# Copy admin build  
scp -P 5050 -r "main jafasol admin/dist/*" root@jafasol.com:/var/www/jafasol/admin/dist/
ssh root@jafasol.com -p 5050 "chmod -R 755 /var/www/jafasol/frontend/dist"
ssh root@jafasol.com -p 5050 "chmod -R 755 /var/www/jafasol/admin/dist"
ssh root@jafasol.com -p 5050 "chown -R www-data:www-data /var/www/jafasol/frontend/dist"
ssh root@jafasol.com -p 5050 "chown -R www-data:www-data /var/www/jafasol/admin/dist"
ssh root@jafasol.com -p 5050 "systemctl reload nginx"

scp -P 5050 -r dist/* root@jafasol.com:/var/www/jafasol/frontend/dist/

scp -P 5050 -r frontend/dist/* root@jafasol.com:/var/www/jafasol/frontend/dist/
scp -P 5050 -r "main jafasol admin/dist/*" root@jafasol.com:/var/www/jafasol/admin/dist/
pwermission 
ssh root@jafasol.com -p 5050 "chown -R www-data:www-data /var/www/jafasol/frontend/dist && chown -R www-data:www-data /var/www/jafasol/admin/dist"

bash deploy.sh
scp -P 5050 -r dist/* root@jafasol.com:/var/www/jafasol/admin/dist/