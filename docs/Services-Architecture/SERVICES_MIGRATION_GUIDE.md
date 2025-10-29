# API Services Migration Guide

This guide helps you migrate existing API calls to the new centralized services structure.

## 🎯 Quick Reference

### Old Pattern vs New Pattern

#### Virtual Offices

**OLD:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${apiUrl}/virtualOffice/getByCity/${city}`);
const data = await response.json();
```

**NEW:**
```typescript
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
const data = await getVirtualOfficesByCity(city);
```

#### Coworking Spaces

**OLD:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${apiUrl}/coworkingSpace/getByCity/${city}`);
const data = await response.json();
```

**NEW:**
```typescript
import { getCoworkingSpacesByCity } from '@/services/coworkingSpace.service';
const data = await getCoworkingSpacesByCity(city);
```

---

## 📋 Step-by-Step Migration

### Step 1: Identify API Calls
Look for patterns like:
- `fetch(${apiUrl}/...)`
- `axios.get(...)`
- Manual error handling

### Step 2: Add Service Import
```typescript
// At the top of your file
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
// or
import { getCoworkingSpacesByCity } from '@/services/coworkingSpace.service';
```

### Step 3: Replace API Call
Replace the old fetch/axios call with the service function.

### Step 4: Simplify Error Handling
The service already handles errors, just catch and use:
```typescript
try {
  const data = await getVirtualOfficesByCity(city);
  // use data
} catch (error: any) {
  console.error(error.message);
  // handle error
}
```

---

## 🔍 All Available Services

### Virtual Office Service
```typescript
import {
  getVirtualOfficesByCity,
  getAllVirtualOffices,
  getVirtualOfficeById,
  createVirtualOffice,
  updateVirtualOffice,
  deleteVirtualOffice
} from '@/services/virtualOffice.service';
```

### Coworking Space Service
```typescript
import {
  getCoworkingSpacesByCity,
  getAllCoworkingSpaces,
  getCoworkingSpaceById,
  createCoworkingSpace,
  updateCoworkingSpace,
  deleteCoworkingSpace
} from '@/services/coworkingSpace.service';
```

### Core API Service (for custom calls)
```typescript
import axiosInstance from '@/services/api.service';

// Use for custom requests
const response = await axiosInstance.get('/custom/endpoint');
```

---

## ✅ Migration Checklist

- [ ] Replace all `/virtualOffice/getByCity/` calls
- [ ] Replace all `/coworkingSpace/getByCity/` calls
- [ ] Remove hardcoded `import.meta.env.VITE_API_URL` references
- [ ] Remove manual error handling (services handle it)
- [ ] Add proper error catching with try-catch
- [ ] Test all pages work correctly
- [ ] Remove any unused fetch/axios imports

---

## 🧪 Testing After Migration

1. **Verify Data Loading**: Check that all pages load data correctly
2. **Error Handling**: Test with network disabled to ensure errors display properly
3. **Performance**: Verify no performance regression
4. **Types**: Ensure TypeScript compilation succeeds

---

## 📝 Example: Complete Migration

### Before (EventSpaces.tsx):
```typescript
import { useState, useEffect } from 'react';

export const EventSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      setError('');
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/eventSpace/getByCity/Delhi`);
        const data = await response.json();
        
        if (data.success) {
          setSpaces(data.data);
        } else {
          setError(data.message || 'Failed to fetch');
        }
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // JSX...
};
```

### After (EventSpaces.tsx):
```typescript
import { useState, useEffect } from 'react';
// NEW: Import from services
import { getEventSpacesByCity } from '@/services/eventSpace.service';

export const EventSpaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      setError('');
      try {
        // SIMPLIFIED: Just call the service
        const data = await getEventSpacesByCity('Delhi');
        setSpaces(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  // JSX...
};
```

**Changes:**
- ✅ One import statement vs hardcoded API URL
- ✅ Clean, readable service call
- ✅ Consistent error handling
- ✅ Better type safety
- ✅ Less code overall

---

## 🆕 Adding a New Service

If you need to create a service for a new module (e.g., Event Spaces):

### 1. Create `eventSpace.service.ts`:
```typescript
import axiosInstance from './api.service';
import { EventSpaceItem } from '@/types/services';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getEventSpacesByCity = async (city: string): Promise<EventSpaceItem[]> => {
  try {
    const response = await axiosInstance.get(`/eventSpace/getByCity/${city}`);
    const data = response.data as ApiResponse<EventSpaceItem[]>;
    
    if (response.status === 200 && data.success) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to fetch event spaces');
  } catch (error: any) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
};
```

### 2. Update `services/index.ts`:
```typescript
export * as eventSpaceService from './eventSpace.service';
```

### 3. Use in Components:
```typescript
import { getEventSpacesByCity } from '@/services/eventSpace.service';

const spaces = await getEventSpacesByCity('Delhi');
```

---

## 💡 Best Practices

1. **Always use try-catch** when calling services
2. **Handle errors gracefully** - show user-friendly messages
3. **Use loading states** while fetching data
4. **Type your data** using the interfaces from `@/types/services`
5. **Keep services focused** - one responsibility per service
6. **Document complex queries** with JSDoc comments
7. **Test error scenarios** - network down, invalid responses, etc.

---

## ❓ FAQ

**Q: Can I still use axios directly?**
A: Yes, but it's recommended to use the services. If you need custom logic, import `axiosInstance` from `api.service.ts`.

**Q: How do I handle pagination?**
A: Add parameters to the service function:
```typescript
export const getVirtualOfficesByCity = async (
  city: string, 
  page?: number, 
  limit?: number
) => {
  // implementation
}
```

**Q: Can I use these services in Hooks?**
A: Absolutely! Create a custom hook that uses the services:
```typescript
export const useVirtualOffices = (city: string) => {
  const [data, setData] = useState([]);
  // ... implement hook using services
  return { data, loading, error };
}
```

**Q: What about authentication?**
A: Add headers in the api.service interceptor:
```typescript
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🚀 Next Steps

1. ✅ Review this guide
2. ✅ Check migrated components (VirtualOffice.tsx, CoworkingSpace.tsx)
3. ✅ Migrate remaining pages using this guide
4. ✅ Test thoroughly
5. ✅ Remove old API call patterns
6. ✅ Update project documentation

**Need help?** Check `/services/README.md` for detailed API documentation.
