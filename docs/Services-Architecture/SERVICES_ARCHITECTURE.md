# Services Architecture

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ VirtualOffice│  │ CoworkingSpace│  │ EventSpaces  │      │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘      │
└─────────┼──────────────────┼─────────────────┼──────────────┘
          │                  │                 │
          └──────────────────┼─────────────────┘
                             │
          ┌──────────────────┼─────────────────┐
          │                  │                 │
┌─────────▼────────┐ ┌──────▼──────┐ ┌────────▼──────┐
│ virtualOffice    │ │  coworking  │ │  eventSpace   │
│ .service.ts      │ │ Space.svc.ts│ │ .service.ts   │
│                  │ │             │ │               │
│ - getByCity()    │ │ -getByCity()│ │ -getByCity()  │
│ - getAll()       │ │ -getAll()   │ │ -getAll()     │
│ - getById()      │ │ -getById()  │ │ -getById()    │
│ - create()       │ │ -create()   │ │ -create()     │
│ - update()       │ │ -update()   │ │ -update()     │
│ - delete()       │ │ -delete()   │ │ -delete()     │
└─────────┬────────┘ └──────┬──────┘ └────────┬──────┘
          │                  │                 │
          └──────────────────┼─────────────────┘
                             │
                     ┌───────▼────────┐
                     │  index.ts      │
                     │  (exports all) │
                     └───────┬────────┘
                             │
                     ┌───────▼────────────┐
                     │  api.service.ts    │
                     │                    │
                     │ - axios instance   │
                     │ - interceptors     │
                     │ - error handling   │
                     │ - base config      │
                     └───────┬────────────┘
                             │
                    ┌────────▼──────────┐
                    │   AXIOS LIBRARY   │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │   BACKEND API     │
                    │  http://localhost │
                    │      :5000/api    │
                    └───────────────────┘
```

## 📊 Data Flow Example

### Virtual Office City Lookup

```
User selects city "Delhi"
           │
           ▼
    VirtualOffice.tsx
           │
    useEffect hook triggered
           │
           ▼
    import getVirtualOfficesByCity
           │
           ▼
    Call: getVirtualOfficesByCity('Delhi')
           │
           ▼
    virtualOffice.service.ts
           │
           ├─ Validate input
           │
           ▼
    axiosInstance.get('/virtualOffice/getByCity/Delhi')
           │
           ├─ Request interceptor (logs)
           │
           ▼
    Backend API
           │
           ├─ Process request
           │
           ▼
    Database query
           │
           ├─ Fetch offices for Delhi
           │
           ▼
    Response: {success: true, data: [...]}
           │
           ├─ Response interceptor (validates)
           │
           ▼
    Type cast as ApiResponse<VirtualOfficeItem[]>
           │
           ├─ Verify success flag
           │
           ▼
    Return data array
           │
           ▼
    VirtualOffice.tsx receives data
           │
           ├─ setState(data)
           │
           ▼
    Component re-renders with offices
           │
           ▼
    User sees list of offices
```

## 🔄 Error Flow

```
API Call Fails
      │
      ▼
Backend returns error response
      │
      ▼
Response interceptor catches error
      │
      ▼
Log error to console
      │
      ▼
Promise rejected in service
      │
      ▼
catch block in service extracts message
      │
      ▼
throw new Error(message)
      │
      ▼
Component catch block handles
      │
      ├─ setState(error)
      │
      ▼
Component renders error message
      │
      ▼
User sees error feedback
```

## 🎯 Service Layer Responsibilities

```
┌────────────────────────────────────────┐
│     SERVICE LAYER RESPONSIBILITIES     │
├────────────────────────────────────────┤
│                                        │
│  1. Request Formation                  │
│     └─ Build URL with parameters       │
│     └─ Format request body             │
│     └─ Set proper HTTP method          │
│                                        │
│  2. Error Handling                     │
│     └─ Catch all exceptions            │
│     └─ Extract meaningful messages     │
│     └─ Throw consistent errors         │
│                                        │
│  3. Response Parsing                   │
│     └─ Type cast responses             │
│     └─ Validate structure              │
│     └─ Extract data from envelope      │
│                                        │
│  4. Type Safety                        │
│     └─ Ensure TypeScript compliance    │
│     └─ Provide typed return values     │
│     └─ Document parameter types        │
│                                        │
│  5. Logging                            │
│     └─ Debug information               │
│     └─ Error tracking                  │
│                                        │
└────────────────────────────────────────┘
```

## 📦 Component Structure

```
services/
│
├── api.service.ts
│   ├── axiosInstance (configured axios)
│   ├── Interceptors
│   │   ├── Request logger
│   │   └── Response error handler
│   ├── handleApiError() utility
│   └── isSuccessResponse() utility
│
├── virtualOffice.service.ts
│   ├── ApiResponse<T> interface
│   ├── getVirtualOfficesByCity()
│   ├── getAllVirtualOffices()
│   ├── getVirtualOfficeById()
│   ├── createVirtualOffice()
│   ├── updateVirtualOffice()
│   └── deleteVirtualOffice()
│
├── coworkingSpace.service.ts
│   ├── ApiResponse<T> interface
│   ├── getCoworkingSpacesByCity()
│   ├── getAllCoworkingSpaces()
│   ├── getCoworkingSpaceById()
│   ├── createCoworkingSpace()
│   ├── updateCoworkingSpace()
│   └── deleteCoworkingSpace()
│
├── [future] eventSpace.service.ts
├── [future] businessSetup.service.ts
│
├── index.ts
│   ├── export api.service
│   ├── export virtualOffice.service (namespaced)
│   ├── export coworkingSpace.service (namespaced)
│   └── export legacy services (for migration)
│
└── README.md (documentation)
```

## 🔗 Integration Points

```
┌─────────────────────────────────┐
│       PAGES / COMPONENTS        │
├─────────────────────────────────┤
│ - VirtualOffice.tsx             │
│ - CoworkingSpace.tsx            │
│ - EventSpaces.tsx (future)      │
│ - Business.tsx (future)         │
└────────────────┬────────────────┘
                 │
        ┌────────▼─────────┐
        │ Import services  │
        │ from @/services/ │
        └────────┬─────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    │    USE SERVICES         │
    │   (async/await)         │
    │                         │
    │  ✅ Cleaner code        │
    │  ✅ Error handling      │
    │  ✅ Type safety         │
    │  ✅ Single source       │
    │  ✅ Easy testing        │
    │                         │
    └────────────┬────────────┘
                 │
        ┌────────▼──────────────┐
        │   Update component    │
        │   state with data     │
        │                       │
        │  - setLoading(false)  │
        │  - setData(result)    │
        │  - setError(null)     │
        └────────┬──────────────┘
                 │
        ┌────────▼──────────────┐
        │  Re-render with data  │
        │  show to user         │
        └───────────────────────┘
```

## 🎯 Benefits Summary

```
┌──────────────────────────────────────────────┐
│           ARCHITECTURE BENEFITS              │
├──────────────────────────────────────────────┤
│                                              │
│  1. SEPARATION OF CONCERNS                   │
│     • API logic separate from UI logic       │
│     • Each service has single responsibility │
│                                              │
│  2. REUSABILITY                              │
│     • Services used across multiple views    │
│     • No code duplication                    │
│                                              │
│  3. MAINTAINABILITY                          │
│     • Changes in one place                   │
│     • Easier to debug                        │
│     • Clear API documentation                │
│                                              │
│  4. TESTABILITY                              │
│     • Easy to mock services                  │
│     • Unit test API logic                    │
│     • Integration testing                    │
│                                              │
│  5. SCALABILITY                              │
│     • Simple pattern to add new services     │
│     • Consistent code structure              │
│     • Easy for team collaboration            │
│                                              │
│  6. TYPE SAFETY                              │
│     • Full TypeScript support                │
│     • Compile-time error checking            │
│     • Better IDE autocomplete                │
│                                              │
└──────────────────────────────────────────────┘
```
