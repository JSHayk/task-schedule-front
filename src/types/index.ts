export interface User {
    id: number
    email: string
    name: string
}

export interface TaskStatus {
    id: number
    name: string
}

export interface Task {
    id: number
    title: string
    description: string
    startDate: string
    endDate: string
    statusId: number
    userId: number
    status: TaskStatus
    user: User
    createdAt: string
    updatedAt: string
}

export interface CreateTaskDto {
    title: string
    description?: string
    startDate: string
    endDate: string
    statusId: number
    userId: number
}

export interface UpdateTaskDto {
    title?: string
    description?: string
    startDate?: string
    endDate?: string
    statusId?: number
    userId?: number
}

export interface LoginDto {
    email: string
    password: string
}

export interface AuthResponse {
    access_token: string
    user: User
}
