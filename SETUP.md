# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/event-planner
AUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Generate a secure AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your connection string:
MONGODB_URI=mongodb://localhost:27017/event-planner
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace in `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-planner
```

### 4. Seed Admin Users

```bash
npm run seed:admins
```

You should see:
```
✓ Successfully created 2 admin users!

Credentials:
Admin 1: admin1@eventplanner.com / Admin123!
Admin 2: admin2@eventplanner.com / Admin456!
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Test the Application

1. **Visit the public site**: http://localhost:3000
2. **Visit admin login**: http://localhost:3000/admin/login
3. **Login with**:
   - Email: `admin1@eventplanner.com`
   - Password: `Admin123!`
4. **You should be redirected to**: http://localhost:3000/admin

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] `.env.local` file created with correct values
- [ ] MongoDB is running and accessible
- [ ] Admin users seeded successfully
- [ ] Development server starts without errors
- [ ] Can access public homepage
- [ ] Can access admin login page
- [ ] Can login with admin credentials
- [ ] Redirected to admin dashboard after login
- [ ] Can see admin sidebar and navigation
- [ ] Logout button works

## Common Issues

### "Cannot connect to MongoDB"
**Solution**: 
- Check if MongoDB is running: `mongosh` (should connect)
- Verify `MONGODB_URI` in `.env.local`
- For Atlas: Check IP whitelist and credentials

### "Admin users already exist"
**Solution**: 
- This is normal if you've already seeded
- To re-seed, delete the admins collection first:
```bash
mongosh event-planner --eval "db.admins.deleteMany({})"
npm run seed:admins
```

### "AUTH_SECRET is not defined"
**Solution**: 
- Make sure `.env.local` exists in the project root
- Restart the dev server after creating `.env.local`

### Login page shows but login doesn't work
**Solution**: 
- Check browser console for errors
- Verify admin users were seeded
- Check MongoDB connection
- Verify credentials are correct

### "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After successful setup:

1. **Change default passwords** (important for production)
2. **Explore the admin dashboard**
3. **Review the code structure** in `README.md`
4. **Start building event management features**

## Need Help?

- Check `README.md` for detailed documentation
- Review error messages in the terminal
- Check browser console for client-side errors
- Verify all environment variables are set correctly

