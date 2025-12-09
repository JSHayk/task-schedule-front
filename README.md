# Frontend - Task Scheduling UI

Modern Vue 3 application with TypeScript, Pinia, and Tailwind CSS.

## Tech Stack

- **Framework**: Vue 3.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4.x
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 3.x
- **Icons**: Heroicons (inline SVG)

## Prerequisites

- Node.js 18+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

The API URL is configured in `src/services/api.ts`:
```typescript
const api = axios.create({
    baseURL: 'http://localhost:3000'
})
```

For production, update this to your API URL.

### 3. Start Development Server

```bash
npm run dev
```

Application runs on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Output in `dist/` folder.

## Project Structure

```
src/
├── assets/            # Static assets
│   └── main.css       # Global styles
├── components/        # Reusable components
│   ├── ConfirmModal.vue
│   ├── CustomSelect.vue
│   ├── DatePicker.vue
│   ├── ReassignModal.vue
│   ├── TaskCard.vue
│   └── TaskModal.vue
├── router/            # Vue Router
│   └── index.ts
├── services/          # API layer
│   └── api.ts
├── stores/            # Pinia stores
│   ├── auth.ts
│   └── task.ts
├── types/             # TypeScript types
│   └── index.ts
├── utils/             # Utility functions
│   └── helpers.ts
├── views/             # Page components
│   ├── DashboardView.vue
│   └── LoginView.vue
├── App.vue            # Root component
└── main.ts            # Entry point
```

## Features

### Authentication
- JWT token-based authentication
- Auto-redirect on auth failure
- Token stored in localStorage
- Protected routes with navigation guards

### Task Management
- Create, edit, delete tasks
- Drag and drop to change status
- Real-time validation
- Overlap detection with error messages

### Search & Filtering
- Debounced search (500ms)
- Filter by status
- Filter by user
- Task count display

### UI Components

**CustomSelect** - Dropdown with color indicators
```vue
<CustomSelect
  v-model="selectedValue"
  :options="options"
  placeholder="Select option"
/>
```

**DatePicker** - Calendar date picker
```vue
<DatePicker
  v-model="date"
  placeholder="Select date"
  :hasError="false"
/>
```

**TaskModal** - Create/edit task form
```vue
<TaskModal
  :task="task"
  @close="closeModal"
  @save="handleSave"
/>
```

**ConfirmModal** - Confirmation dialog
```vue
<ConfirmModal
  title="Delete Task"
  message="Are you sure?"
  confirmText="Delete"
  @confirm="handleConfirm"
  @cancel="handleCancel"
/>
```

## State Management

### Auth Store (`stores/auth.ts`)
```typescript
const authStore = useAuthStore()

// State
authStore.user          // Current user
authStore.token         // JWT token
authStore.isAuthenticated  // Boolean

// Actions
authStore.login(credentials)
authStore.logout()
authStore.initAuth()
```

### Task Store (`stores/task.ts`)
```typescript
const taskStore = useTaskStore()

// State
taskStore.tasks         // Task array
taskStore.users         // User array
taskStore.statuses      // Status array
taskStore.loading       // Loading state
taskStore.error         // Error message

// Actions
taskStore.fetchTasks(filters)
taskStore.fetchUsers()
taskStore.createTask(data)
taskStore.updateTask(id, data)
taskStore.deleteTask(id)
taskStore.reassignTask(id, userId)
```

## Utility Functions

### Helpers (`utils/helpers.ts`)

```typescript
// Get Tailwind color class for status
getStatusColor(statusName)
// 'TODO' → 'bg-gray-400'

// Format status name
formatStatusName(statusName)
// 'IN_PROGRESS' → 'IN PROGRESS'

// Smart pluralization
pluralize(count, singular, plural?)
// pluralize(1, 'task') → 'task'
// pluralize(2, 'task') → 'tasks'

// Get today's date in ISO format
getTodayDate()
// '2024-12-10'

// Format date for display
formatShortDate(date)
// '2024-12-10' → 'Dec 10'
```

## Routing

```typescript
// Public routes
/login              // Login page

// Protected routes (require auth)
/                   // Redirects to /dashboard
/dashboard          // Main task board
```

Route guards automatically redirect:
- Unauthenticated users → `/login`
- Authenticated users on `/login` → `/dashboard`

## API Integration

### API Service (`services/api.ts`)

```typescript
// Authentication
authApi.login(credentials)

// Tasks
taskApi.getAll(params?)
taskApi.getOne(id)
taskApi.create(data)
taskApi.update(id, data)
taskApi.delete(id)
taskApi.reassign(id, userId)

// Users
userApi.getAll()
```

Axios interceptors:
- Automatically adds JWT token to requests
- Handles 401 errors (auto-logout)

## Styling

### Tailwind CSS

Custom configuration in `tailwind.config.js`:
```javascript
{
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {}
  }
}
```

### Global Styles

Located in `src/assets/main.css`:
- Tailwind imports
- Custom date picker styles
- Global body styles

## Scripts

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # Run TypeScript checks
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

## Environment Variables

Create `.env` file for environment-specific config:

```env
VITE_API_URL=http://localhost:3000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Build Configuration

### Vite Config (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

### TypeScript Config

- `tsconfig.json` - Base config
- `tsconfig.app.json` - App-specific config
- `tsconfig.node.json` - Node-specific config

## Production Deployment

### Build

```bash
npm run build
```

### Deploy Options

**1. Static Hosting (Netlify, Vercel)**
- Deploy `dist/` folder
- Configure redirects for SPA routing

**2. Nginx**
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**3. Docker**
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Environment Setup

Update API URL for production:
```typescript
// src/services/api.ts
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com'
})
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Failed
- Check backend is running
- Verify API URL in `api.ts`
- Check CORS configuration

### Build Fails
- Clear `node_modules` and reinstall
- Check TypeScript errors: `npm run type-check`
- Verify all imports are correct

### Styles Not Loading
- Ensure Tailwind is configured
- Check `main.css` is imported in `main.ts`
- Clear browser cache

## Development Tips

### Hot Module Replacement
Vite provides instant HMR - changes reflect immediately.

### Vue DevTools
Install Vue DevTools browser extension for debugging:
- Component inspector
- Pinia state viewer
- Performance profiling

### TypeScript
Enable strict mode for better type safety:
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## License

MIT
