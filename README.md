# FlashSpace Web Client

A modern React-based web application for FlashSpace - a platform for coworking spaces and virtual offices.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FlashSpace-web-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### Core Technologies
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### UI Components
- **Radix UI** - Headless UI components
- **Shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Headless UI** - Additional components

### State Management & Data Fetching
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Maps & Visualization
- **Google Maps API** - Interactive maps
- **MapLibre GL** - Map rendering
- **GSAP** - Animations

### Authentication
- **Google OAuth** - Social authentication
- **JWT** - Token-based auth

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # Base UI components (buttons, inputs, etc.)
│   ├── forms/           # Form components
│   ├── auth/            # Authentication components
│   ├── admin/           # Admin-specific components
│   ├── ClientDashboard/ # Client dashboard components
│   ├── Map/             # Map-related components
│   ├── Spaces/          # Space listing/detail components
│   └── services/        # Service-related components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── lib/                 # Library configurations
├── config/              # App configuration
├── contexts/            # React context providers
├── data/                # Static data and constants
├── assets/              # Static assets (images, fonts)
└── layouts/             # Layout components
```

## 🎨 Component Development

### Creating a New Component

1. **Use TypeScript interfaces for props**
   ```typescript
   interface ComponentProps {
     title: string;
     isVisible?: boolean;
     onAction?: () => void;
   }

   const Component: React.FC<ComponentProps> = ({ title, isVisible = true, onAction }) => {
     // Component logic
   };
   ```

2. **Follow the component structure**
   ```typescript
   // Hooks at the top
   const [state, setState] = useState();
   
   // Effects after state
   useEffect(() => {
     // Effect logic
   }, [dependencies]);
   
   // Event handlers
   const handleClick = () => {
     // Handler logic
   };
   
   // Early returns for conditional rendering
   if (!isVisible) return null;
   
   return (
     <div className="component-container">
       {/* JSX content */}
     </div>
   );
   ```

3. **Use Tailwind CSS for styling**
   ```typescript
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
     <span className="text-lg font-semibold text-gray-800">{title}</span>
     <button 
       onClick={handleClick}
       className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
     >
       Action
     </button>
   </div>
   ```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run build:dev        # Build for development
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Testing (if configured)
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
```

## 🌐 API Integration

### Service Layer Pattern

Create service files in `src/services/` for API interactions:

```typescript
// src/services/userService.ts
import { api } from '@/config/api.config';

export const userService = {
  async getProfile(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async updateProfile(id: string, data: UserUpdateData) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }
};
```

### Using TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '@/services/userService';

const UserProfile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getProfile(userId)
  });

  const updateMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: () => {
      // Handle success
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* User profile UI */}
    </div>
  );
};
```

## 🎯 Key Features

### Authentication Flow
- Google OAuth integration
- JWT token management
- Protected routes
- Role-based access control

### Dashboard Features
- User profile management
- Booking management
- KYC verification
- Invoice tracking
- Support ticket system

### Map Integration
- Interactive Google Maps
- Location search
- Space visualization
- Booking interface

### Responsive Design
- Mobile-first approach
- Tailwind responsive utilities
- Touch-friendly interfaces
- Progressive enhancement

## 🔒 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Google Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# App Configuration
VITE_APP_NAME=FlashSpace
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false
```

## 📱 Responsive Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices (phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

## 🧪 Testing Guidelines

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Component from './Component';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } }
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('Component', () => {
  it('renders correctly', () => {
    renderWithProviders(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment-Specific Builds
```bash
npm run build:dev    # Development build
npm run build        # Production build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📈 Performance Guidelines

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### Image Optimization
```typescript
// Use WebP format when possible
<img 
  src="image.webp" 
  alt="Description"
  loading="lazy"
  className="w-full h-auto"
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🐛 Debugging

### Development Tools
- React Developer Tools
- TanStack Query DevTools
- Vite DevTools

### Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded">
    <h2 className="text-lg font-semibold text-red-800">Something went wrong:</h2>
    <pre className="mt-2 text-sm text-red-600">{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query Docs](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**Happy coding! 🚀**