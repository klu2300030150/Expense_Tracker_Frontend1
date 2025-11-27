# Deploy Backend to Railway

## Quick Steps

### 1. Create a New Railway Project for Backend

1. Go to [Railway](https://railway.app/) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `klu2300030150/Expense_Tracker_Frontend1`
5. Railway will detect your Node.js app automatically

### 2. Configure Environment Variables

In your Railway project dashboard, go to **Variables** tab and add:

```
DATABASE_URL=mysql://root:jsMCBLUiFOYHjkIHwrjZKlSPTDhmtJDd@gondola.proxy.rlwy.net:47595/railway
PORT=5000
NODE_ENV=production
```

**Important:** Railway will automatically set the `PORT` variable, but you can override it if needed.

### 3. Deploy

Railway will automatically:
- Detect `package.json`
- Run `npm install`
- Start the server with `node server.js`

### 4. Get Your Backend URL

Once deployed, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

Copy this URL - you'll need it for the frontend configuration.

### 5. Test Your Backend

Visit in browser:
```
https://your-app-name.up.railway.app/api/health
```

You should see:
```json
{"status":"ok","database":"connected"}
```

## Alternative: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project or create new one
railway link

# Add environment variables
railway variables set DATABASE_URL="mysql://root:jsMCBLUiFOYHjkIHwrjZKlSPTDhmtJDd@gondola.proxy.rlwy.net:47595/railway"

# Deploy
railway up
```

## Next Steps

After deploying the backend:
1. Copy your Railway backend URL
2. Update `src/config.js` with the new URL
3. Rebuild the frontend for GitHub Pages
4. Your GitHub Pages site will now connect to Railway backend!
