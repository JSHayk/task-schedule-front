import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskApi, userApi } from '@/services/api'
import type { Task, CreateTaskDto, UpdateTaskDto, User } from '@/types'

export const useTaskStore = defineStore('task', () => {
    const tasks = ref<Task[]>([])
    const users = ref<User[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const statuses = [
        { id: 1, name: 'TODO' },
        { id: 2, name: 'IN_PROGRESS' },
        { id: 3, name: 'DONE' },
        { id: 4, name: 'CANCELLED' }
    ]

    async function fetchTasks(filters?: { search?: string; statusId?: number; userId?: number }) {
        loading.value = true
        error.value = null
        try {
            const response = await taskApi.getAll(filters)
            tasks.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch tasks'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchUsers() {
        try {
            const response = await userApi.getAll()
            users.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch users'
        }
    }

    async function createTask(data: CreateTaskDto) {
        loading.value = true
        error.value = null
        try {
            const response = await taskApi.create(data)
            tasks.value.unshift(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create task'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateTask(id: number, data: UpdateTaskDto) {
        loading.value = true
        error.value = null
        try {
            const response = await taskApi.update(id, data)
            const index = tasks.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tasks.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update task'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteTask(id: number) {
        loading.value = true
        error.value = null
        try {
            await taskApi.delete(id)
            tasks.value = tasks.value.filter(t => t.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete task'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function reassignTask(id: number, userId: number) {
        loading.value = true
        error.value = null
        try {
            const response = await taskApi.reassign(id, userId)
            const index = tasks.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tasks.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to reassign task'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        tasks,
        users,
        statuses,
        loading,
        error,
        fetchTasks,
        fetchUsers,
        createTask,
        updateTask,
        deleteTask,
        reassignTask
    }
})
