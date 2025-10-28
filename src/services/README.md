# Services Documentation

This directory contains all API service layers for the Flashspace Frontend application. The services provide a centralized, maintainable way to handle all HTTP requests to the backend API.

## 📁 Structure

```
services/
├── api.service.ts              # Core API configuration & axios instance
├── virtualOffice.service.ts    # Virtual Office API calls
├── coworkingSpace.service.ts   # Coworking Space API calls
├── index.ts                    # Central export file
└── README.md                   # This file
```

## 🔧 Core Service: `api.service.ts`

The main API service that configures axios and handles centralized error handling.

### Features:
- **Axios Instance**: Pre-configured with base URL and default headers
- **Request Interceptor**: Logs all outgoing requests
- **Response Interceptor**: Centralizes error handling
- **Error Handling**: Generic error handler for consistent error responses
- **Success Check**: Utility to verify API response status

### Configuration:
- Base URL: `import.meta.env.VITE_API_URL` or `http://localhost:5000/api`
- Timeout: 30 seconds
- Content-Type: `application/json`

### Usage:
```typescript
import axiosInstance from '@/services/api.service';

// Make custom requests
const response = await axiosInstance.get('/endpoint');
```

## 🏢 Virtual Office Service: `virtualOffice.service.ts`

Handles all virtual office related API calls.

### Available Functions:

#### `getVirtualOfficesByCity(city: string)`
Fetch virtual offices for a specific city.

```typescript
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';

const offices = await getVirtualOfficesByCity('Delhi');
```

#### `getAllVirtualOffices()`
Fetch all virtual offices.

```typescript
const allOffices = await getAllVirtualOffices();
```

#### `getVirtualOfficeById(id: string)`
Fetch a specific virtual office by ID.

```typescript
const office = await getVirtualOfficeById('office-id-123');
```

#### `createVirtualOffice(data: Partial<VirtualOfficeItem>)`
Create a new virtual office.

```typescript
const newOffice = await createVirtualOffice({
  name: 'New Office',
  address: '123 Main St',
  price: '₹999/month',
  // ... other fields
});
```

#### `updateVirtualOffice(id: string, data: Partial<VirtualOfficeItem>)`
Update an existing virtual office.

```typescript
const updated = await updateVirtualOffice('office-id', {
  price: '₹1,099/month'
});
```

#### `deleteVirtualOffice(id: string)`
Delete a virtual office.

```typescript
await deleteVirtualOffice('office-id');
```

## 🛋️ Coworking Space Service: `coworkingSpace.service.ts`

Handles all coworking space related API calls.

### Available Functions:

#### `getCoworkingSpacesByCity(city: string)`
Fetch coworking spaces for a specific city.

```typescript
import { getCoworkingSpacesByCity } from '@/services/coworkingSpace.service';

const spaces = await getCoworkingSpacesByCity('Mumbai');
```

#### `getAllCoworkingSpaces()`
Fetch all coworking spaces.

```typescript
const allSpaces = await getAllCoworkingSpaces();
```

#### `getCoworkingSpaceById(id: string)`
Fetch a specific coworking space by ID.

```typescript
const space = await getCoworkingSpaceById('space-id-123');
```

#### `createCoworkingSpace(data: Partial<CoworkingSpaceItem>)`
Create a new coworking space.

```typescript
const newSpace = await createCoworkingSpace({
  name: 'New Workspace',
  address: '456 Business Ave',
  price: '₹15,000/month',
  // ... other fields
});
```

#### `updateCoworkingSpace(id: string, data: Partial<CoworkingSpaceItem>)`
Update an existing coworking space.

```typescript
const updated = await updateCoworkingSpace('space-id', {
  price: '₹16,000/month'
});
```

#### `deleteCoworkingSpace(id: string)`
Delete a coworking space.

```typescript
await deleteCoworkingSpace('space-id');
```

## 📦 Central Export: `index.ts`

Import all services from a single location:

```typescript
import * as virtualOfficeService from '@/services/virtualOffice.service';
import * as coworkingSpaceService from '@/services/coworkingSpace.service';
import axiosInstance from '@/services/api.service';
```

Or use namespaced imports:

```typescript
import { virtualOfficeService, coworkingSpaceService } from '@/services';

await virtualOfficeService.getVirtualOfficesByCity('Delhi');
```

## 🎯 Usage Examples

### In React Components:

```typescript
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { useState, useEffect } from 'react';

function VirtualOfficeList({ city }: { city: string }) {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getVirtualOfficesByCity(city);
        setOffices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [city]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {offices.map(office => (
        <div key={office._id}>{office.name}</div>
      ))}
    </div>
  );
}
```

## ⚠️ Error Handling

All services include built-in error handling:

```typescript
try {
  const data = await getVirtualOfficesByCity('Delhi');
  // Handle success
} catch (error: any) {
  console.error(error.message);
  // Handle error
}
```

## 🔄 API Response Format

All backend responses follow this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

## 🔐 Type Safety

All services are fully typed with TypeScript:

```typescript
import { VirtualOfficeItem, CoworkingSpaceItem } from '@/types/services';

const office: VirtualOfficeItem = await getVirtualOfficeById('id');
const spaces: CoworkingSpaceItem[] = await getAllCoworkingSpaces();
```

## 📝 Adding New Services

To add a new service:

1. Create a new file: `newModule.service.ts`
2. Import `axiosInstance` from `api.service.ts`
3. Define `ApiResponse` interface for type safety
4. Export typed functions following the pattern
5. Update `index.ts` to export the new service

Example:
```typescript
// newModule.service.ts
import axiosInstance from './api.service';
import { NewModuleItem } from '@/types/services';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getNewModuleItems = async (): Promise<NewModuleItem[]> => {
  try {
    const response = await axiosInstance.get('/newModule/getAll');
    const data = response.data as ApiResponse<NewModuleItem[]>;
    
    if (response.status === 200 && data.success) {
      return data.data;
    }
    
    throw new Error(data.message || 'Failed to fetch items');
  } catch (error: any) {
    console.error('Error fetching items:', error);
    throw error;
  }
};
```

## 🚀 Environment Variables

Make sure your `.env` file includes:

```env
VITE_API_URL=http://localhost:5000/api
```

Or it will default to `http://localhost:5000/api`

## 📚 Related Documentation

- Backend API Documentation: See `flashspace-web-server` README
- Type Definitions: `src/types/services.ts`
- Components using services: `src/pages/services/`
