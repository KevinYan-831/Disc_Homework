# Pet Your Pet - Backend API

## New Backend Structure

```
/backend
├── /src
│   ├── /config          # Service setup (Database, Supabase Auth)
│   │   ├── database.js  # Drizzle ORM & PostgreSQL connection
│   │   ├── schema.js    # Database schema definitions
│   │   └── supabase.js  # Supabase authentication client
│   │
│   ├── /controllers     # Business logic for routes
│   │   ├── authController.js    # Authentication logic (signup, signin, signout)
│   │   └── petsController.js    # Pet CRUD operations
│   │
│   ├── /middleware      # Request interceptors
│   │   ├── auth.js          # Auth middleware (optionalAuth, requireAuth, extractUserId)
│   │   ├── errorHandler.js  # Centralized error handling
│   │   └── logger.js        # Request logging
│   │
│   ├── /routers         # API route definitions
│   │   ├── auth.js      # /api/auth routes
│   │   └── pets.js      # /api/pets routes
│   │
│   └── index.js         # Main entry point (Express server)
│
├── .env                 # Environment variables (SECRET!)
├── .gitignore
├── package.json
└── drizzle.config.js
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/api/auth/signup` - Create new user account
- **POST** `/api/auth/signin` - Sign in existing user
- **POST** `/api/auth/signout` - Sign out current user
- **POST** `/api/auth/verify` - Verify authentication token
- **GET** `/api/auth/profile` - Get current user profile (requires auth)

### Pets Routes (`/api/pets`)

- **GET** `/api/pets` - Fetch all pets for current user
- **POST** `/api/pets` - Create a new pet (requires auth)
- **PUT** `/api/pets/:id` - Update pet by ID (requires auth & ownership)
- **DELETE** `/api/pets/:id` - Delete pet by ID (requires auth & ownership)

### Health Check

- **GET** `/api/health` - Check if server is running

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=your_postgres_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (for authentication)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## Installation & Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Supabase JS SDK** (if not already installed)
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your database and Supabase credentials

4. **Run the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Server should be running at:**
   ```
   http://localhost:5000
   ```

## Key Architecture Changes

### 1. ✅ Proper MVC Structure
- **Controllers**: Business logic separated from routes
- **Routers**: Clean route definitions
- **Middleware**: Reusable authentication and error handling
- **Config**: Centralized service configuration

### 2. ✅ Authentication Moved to Backend
- All Supabase auth operations now happen server-side
- Frontend receives JWT tokens from backend
- Secure service role key stays in backend only

### 3. ✅ Middleware Pattern
- `optionalAuth`: Allows requests with or without auth
- `requireAuth`: Blocks unauthenticated requests
- `extractUserId`: Backward compatible with old header method

### 4. ✅ Better Error Handling
- Centralized error handler
- Consistent error response format
- Proper HTTP status codes

## Authentication Flow

1. **User signs up/in** → Frontend calls `/api/auth/signin`
2. **Backend validates** → Checks credentials with Supabase
3. **Backend returns token** → Sends JWT access token to frontend
4. **Frontend stores token** → Saved in localStorage & AuthContext
5. **Future requests** → Frontend includes token in `Authorization: Bearer <token>` header
6. **Backend verifies** → Middleware validates token with Supabase

## Security Best Practices

✅ **Environment variables** - Never commit `.env` to version control  
✅ **Service role key** - Used only in backend (has admin privileges)  
✅ **Bearer tokens** - Stateless authentication via JWT  
✅ **CORS configuration** - Only allow specific frontend origin  
✅ **Input validation** - Validate all user inputs  
✅ **Error messages** - Don't leak sensitive information  

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get pets (with token)
curl http://localhost:5000/api/pets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create pet (with token)
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Fluffy","species":"cat","age":3}'
```

## Development Commands

```bash
# Start server
npm start

# Start with nodemon (auto-reload)
npm run dev

# Database migrations
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (GUI)
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions on deploying to:
- **Backend**: Render
- **Frontend**: Firebase

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### Database connection issues
- Check `DATABASE_URL` in `.env`
- Verify Supabase pooler connection string
- Ensure IP is allowed in Supabase dashboard

### Authentication errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` (not anon key!)
- Check token format: `Bearer <token>`
- Ensure Supabase project URL is correct

## Migration from Old Structure

### Old Structure (Deprecated)
```
/backend/src
├── /db
│   ├── config.js
│   └── schema.js
├── /routes
│   └── pets.js
└── index.js
```

### New Structure
```
/backend/src
├── /config
│   ├── database.js  (was db/config.js)
│   ├── schema.js    (was db/schema.js)
│   └── supabase.js  (NEW!)
├── /controllers     (NEW!)
├── /middleware      (NEW!)
├── /routers         (was /routes)
└── index.js
```

### Update Imports
Old:
```javascript
const { db, pets } = require('./db/config');
```

New:
```javascript
const { db, pets } = require('../config/database');
```

## Next Steps

1. ☑️ Delete old `/db` and `/routes` folders
2. ☑️ Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase dashboard
3. ☑️ Test all API endpoints
4. ☑️ Update frontend to use new auth flow
5. ☑️ Deploy to Render

---

**Built with:**
- Express.js - Web framework
- Drizzle ORM - Database ORM
- Supabase - Authentication & PostgreSQL
- PostgreSQL - Database
