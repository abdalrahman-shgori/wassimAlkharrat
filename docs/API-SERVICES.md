# Services API Documentation

## Overview
The Services API allows you to manage event planning services (Weddings, Birthdays, etc.).

## Base URL
```
/api/services
```

## Authentication
- **Public endpoints**: GET requests (read-only)
- **Protected endpoints**: POST, PUT, DELETE (require admin authentication)

---

## Endpoints

### 1. Get All Services
**GET** `/api/services`

Get a list of all services.

**Query Parameters:**
- `active` (optional): Set to `"true"` to get only active services

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Weddings",
      "slug": "weddings",
      "description": "Create unforgettable wedding celebrations...",
      "icon": "💍",
      "isActive": true,
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 2
}
```

**Example:**
```bash
# Get all services
curl http://localhost:3000/api/services

# Get only active services
curl http://localhost:3000/api/services?active=true
```

---

### 2. Get Service by ID
**GET** `/api/services/[id]`

Get a single service by its ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Weddings",
    "slug": "weddings",
    "description": "Create unforgettable wedding celebrations...",
    "icon": "💍",
    "isActive": true,
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Invalid service ID
- `404`: Service not found

---

### 3. Create Service
**POST** `/api/services` 🔒 **Admin Only**

Create a new service.

**Request Body:**
```json
{
  "name": "Corporate Events",
  "slug": "corporate-events",
  "description": "Professional corporate event planning services",
  "icon": "🏢",
  "isActive": true,
  "order": 3
}
```

**Required Fields:**
- `name` (string): Service name
- `slug` (string): URL-friendly identifier (must be unique)
- `description` (string): Service description

**Optional Fields:**
- `icon` (string): Emoji icon (default: "🎉")
- `isActive` (boolean): Whether service is active (default: true)
- `order` (number): Display order (auto-incremented if not provided)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Corporate Events",
    "slug": "corporate-events",
    "description": "Professional corporate event planning services",
    "icon": "🏢",
    "isActive": true,
    "order": 3,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Missing required fields
- `401`: Unauthorized (not logged in as admin)
- `409`: Slug already exists

---

### 4. Update Service
**PUT** `/api/services/[id]` 🔒 **Admin Only**

Update an existing service.

**Request Body:** (all fields optional)
```json
{
  "name": "Wedding Planning",
  "description": "Updated description",
  "isActive": false,
  "order": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Wedding Planning",
    "slug": "weddings",
    "description": "Updated description",
    "icon": "💍",
    "isActive": false,
    "order": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Invalid service ID
- `401`: Unauthorized
- `404`: Service not found
- `409`: Slug already exists (if updating slug)

---

### 5. Delete Service
**DELETE** `/api/services/[id]` 🔒 **Admin Only**

Delete a service.

**Response:**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

**Errors:**
- `400`: Invalid service ID
- `401`: Unauthorized
- `404`: Service not found

---

## Seeded Services

The database comes pre-seeded with two services:

1. **Weddings** 💍
   - Slug: `weddings`
   - Comprehensive wedding planning services

2. **Birthdays** 🎂
   - Slug: `birthdays`
   - Birthday party planning for all ages

---

## Testing the API

### Using cURL:

```bash
# Get all services
curl http://localhost:3000/api/services

# Get a specific service
curl http://localhost:3000/api/services/[service-id]

# Create a new service (requires admin login)
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Corporate Events",
    "slug": "corporate-events",
    "description": "Professional event planning",
    "icon": "🏢"
  }'

# Update a service (requires admin login)
curl -X PUT http://localhost:3000/api/services/[service-id] \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'

# Delete a service (requires admin login)
curl -X DELETE http://localhost:3000/api/services/[service-id]
```

### Using JavaScript/Fetch:

```javascript
// Get all active services
const response = await fetch('/api/services?active=true');
const { data } = await response.json();

// Create a new service (admin only)
const response = await fetch('/api/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Corporate Events',
    slug: 'corporate-events',
    description: 'Professional event planning services',
    icon: '🏢'
  })
});
```

---

## Re-seeding Services

To reset the services to the default two:

```bash
# Delete all services from MongoDB first
# Then run:
npm run seed:services
```

