import axios from 'axios'
import type { LoginDto, AuthResponse, Task, CreateTaskDto, UpdateTaskDto, User, TaskStatus } from '@/types'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const authApi = {
    login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data)
}

export const taskApi = {
    getAll: (params?: { search?: string; statusId?: number; userId?: number }) =>
        api.get<Task[]>('/tasks', { params }),
    getOne: (id: number) => api.get<Task>(`/tasks/${id}`),
    create: (data: CreateTaskDto) => api.post<Task>('/tasks', data),
    update: (id: number, data: UpdateTaskDto) => api.patch<Task>(`/tasks/${id}`, data),
    delete: (id: number) => api.delete(`/tasks/${id}`),
    reassign: (id: number, userId: number) => api.patch<Task>(`/tasks/${id}/reassign`, { userId })
}

export const userApi = {
    getAll: () => api.get<User[]>('/users')
}

export default api
