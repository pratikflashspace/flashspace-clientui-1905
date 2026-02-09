# Ticket System Debug Report

**Date:** 2026-02-07  
**Status:** Blocked on backend authentication issue

---

## Problem
New tickets created from `/dashboard/support` show success on UI but **don't persist to MongoDB**.  
Admin can't see tickets at `/admin/tickets`.

---

## Root Cause Identified: API Endpoint Mismatch (FIXED)

Frontend was calling **wrong endpoints**:

| Action | Was Calling | Should Call |
|--------|-------------|-------------|
| Create ticket | `/api/user/support/tickets` | `/api/tickets` |
| Get user tickets | `/api/user/support/tickets` | `/api/tickets/my-tickets` |
| Admin get all | `/api/admin/tickets` | `/api/tickets/admin/all` |
| Admin stats | `/api/admin/tickets/stats` | `/api/tickets/admin/stats` |

### Files Modified ✅
1. `src/config/api.config.ts` - Fixed user ticket endpoints
2. `src/services/userDashboard.service.ts` - Use `MY_TICKETS` for fetching
3. `src/services/admin.service.ts` - Fixed all admin ticket endpoints  
4. `src/pages/admin/TicketSystem.tsx` - Replaced mock data with real API calls

---

## Current Blocker: 403 Forbidden Errors

After fixing endpoints, **backend returns 403** for:
- `POST http://localhost:5000/api/tickets` (create)
- `GET http://localhost:5000/api/tickets/my-tickets` (fetch)
- `GET http://localhost:5000/api/tickets/admin/all` (admin fetch)

### Why 403?
The frontend sends cookies correctly (`withCredentials: true`), but the **backend ticket routes** likely have different authentication middleware than other routes.

---

## What Needs to Happen on Backend

Check your ticket routes file (likely `routes/tickets.js` or similar):

```javascript
// Ensure these middleware are applied correctly:
router.post('/', authMiddleware, createTicket);        // User creates ticket
router.get('/my-tickets', authMiddleware, getMyTickets); // User gets own tickets
router.get('/admin/all', adminMiddleware, getAllTickets); // Admin gets all
```

**Verify:**
1. The auth middleware is the SAME one used for working routes (like `/api/user/dashboard`)
2. CORS allows credentials from `localhost:5173`
3. The cookie name/JWT validation matches other authenticated routes

---

## Quick Test Commands

```bash
# Test if auth works on other routes (should return 200)
curl -X GET http://localhost:5000/api/user/dashboard --cookie "your_session_cookie"

# Test ticket route (currently returns 403)
curl -X GET http://localhost:5000/api/tickets/my-tickets --cookie "your_session_cookie"
```

---

## Resume Instructions

When you return:
1. Tell me if you fixed the backend ticket auth middleware
2. Or share the backend ticket routes file so I can identify the issue
3. Frontend is ready - just needs backend to accept the requests
