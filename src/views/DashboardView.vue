<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Task Board</h1>
            <p class="text-sm text-gray-600 mt-1">Welcome, {{ authStore.user?.name }}</p>
          </div>
          <button
            @click="authStore.logout(); router.push('/login')"
            class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                type="text"
                placeholder="Search tasks by title or description..."
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <CustomSelect
              v-model="filterStatus"
              :options="statusOptions"
              placeholder="All Statuses"
              @update:modelValue="loadTasks"
            />
          </div>
          <div>
            <CustomSelect
              v-model="filterUser"
              :options="userOptions"
              placeholder="All Users"
              @update:modelValue="loadTasks"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <button
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
          >
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </span>
          </button>
          <div v-if="searchQuery || filterStatus || filterUser" class="text-sm text-gray-600">
            {{ taskStore.tasks.length }} {{ pluralize(taskStore.tasks.length, 'task') }} found
          </div>
        </div>
      </div>

      <div v-if="taskStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading tasks...</p>
      </div>

      <div v-else-if="taskStore.tasks.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p class="text-gray-600 mb-6">Get started by creating your first task</p>
        <button
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
        >
          Create Task
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="status in taskStore.statuses" 
          :key="status.id" 
          class="bg-gray-100 rounded-xl p-4 transition-colors"
          :class="{ 'bg-blue-50 ring-2 ring-blue-300': isDragOver === status.id }"
          @dragover.prevent="handleDragOver(status.id)"
          @dragleave="handleDragLeave"
          @drop.prevent.stop="handleDrop(status.id)"
        >
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
            <span class="w-3 h-3 rounded-full mr-2" :class="getStatusColor(status.name)"></span>
            {{ formatStatusName(status.name) }}
            <span class="ml-auto text-sm text-gray-500">{{ getTasksByStatus(status.id).length }}</span>
          </h3>
          <div class="space-y-3 min-h-[100px]">
            <div
              v-for="task in getTasksByStatus(status.id)"
              :key="task.id"
              draggable="true"
              @dragstart="handleDragStart(task)"
              @dragend="handleDragEnd"
              class="cursor-move"
            >
              <TaskCard
                :task="task"
                @edit="openEditModal"
                @reassign="openReassignModal"
                @delete="handleDelete"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskModal
      v-if="showModal"
      :task="selectedTask"
      @close="closeModal"
      @save="handleSave"
    />

    <ReassignModal
      v-if="showReassignModal && taskToReassign"
      :task="taskToReassign"
      @close="closeReassignModal"
      @save="handleReassignSave"
    />

    <ConfirmModal
      v-if="showDeleteConfirm && taskToDelete"
      title="Delete Task"
      :message="`Are you sure you want to delete <strong>${taskToDelete.title}</strong>? This action cannot be undone.`"
      confirmText="Delete"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <div v-if="isCreating" class="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-700 font-medium">Creating task...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { taskApi } from '@/services/api'
import TaskCard from '@/components/TaskCard.vue'
import TaskModal from '@/components/TaskModal.vue'
import ReassignModal from '@/components/ReassignModal.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { Task } from '@/types'
import { getStatusColor, formatStatusName, pluralize } from '@/utils/helpers'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const searchQuery = ref('')
const filterStatus = ref<number | null>(null)
const filterUser = ref<number | null>(null)
const showModal = ref(false)
const selectedTask = ref<Task | null>(null)
const showReassignModal = ref(false)
const taskToReassign = ref<Task | null>(null)
const showDeleteConfirm = ref(false)
const taskToDelete = ref<Task | null>(null)
const deleteLoading = ref(false)
const isCreating = ref(false)
const draggedTask = ref<Task | null>(null)
const isDropping = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const statusOptions = computed(() => [
  { value: null, label: 'All Statuses' },
  ...taskStore.statuses.map(status => ({
    value: status.id,
    label: formatStatusName(status.name),
    color: getStatusColor(status.name)
  }))
])

const userOptions = computed(() => [
  { value: null, label: 'All Users' },
  ...taskStore.users.map(user => ({
    value: user.id,
    label: user.name
  }))
])

onMounted(async () => {
  await taskStore.fetchUsers()
  await loadTasks()
})

async function loadTasks() {
  await taskStore.fetchTasks({
    search: searchQuery.value || undefined,
    statusId: filterStatus.value || undefined,
    userId: filterUser.value || undefined
  })
}

function handleSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadTasks()
  }, 500)
}

function clearSearch() {
  searchQuery.value = ''
  loadTasks()
}

function getTasksByStatus(statusId: number) {
  return taskStore.tasks.filter(task => task.statusId === statusId)
}

function openCreateModal() {
  selectedTask.value = null
  showModal.value = true
}

function openEditModal(task: Task) {
  selectedTask.value = task
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTask.value = null
}

async function handleSave() {
  isCreating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    closeModal()
    await loadTasks()
  } finally {
    isCreating.value = false
  }
}

function openReassignModal(task: Task) {
  taskToReassign.value = task
  showReassignModal.value = true
}

function closeReassignModal() {
  showReassignModal.value = false
  taskToReassign.value = null
}

async function handleReassignSave() {
  closeReassignModal()
  await loadTasks()
}

function handleDelete(taskId: number) {
  const task = taskStore.tasks.find(t => t.id === taskId)
  if (task) {
    taskToDelete.value = task
    showDeleteConfirm.value = true
  }
}

async function confirmDelete() {
  if (!taskToDelete.value) return
  
  deleteLoading.value = true
  try {
    await taskStore.deleteTask(taskToDelete.value.id)
    showDeleteConfirm.value = false
    taskToDelete.value = null
  } catch (error) {
    alert('Failed to delete task')
  } finally {
    deleteLoading.value = false
  }
}

function cancelDelete() {
  showDeleteConfirm.value = false
  taskToDelete.value = null
}

const isDragOver = ref<number | null>(null)

function handleDragStart(task: Task) {
  draggedTask.value = task
}

function handleDragEnd() {
  draggedTask.value = null
  isDragOver.value = null
}

function handleDragOver(statusId: number) {
  isDragOver.value = statusId
}

function handleDragLeave() {
  isDragOver.value = null
}

async function handleDrop(newStatusId: number) {
  if (isDropping.value) return
  
  isDragOver.value = null
  
  if (!draggedTask.value) return
  
  if (draggedTask.value.statusId === newStatusId) {
    draggedTask.value = null
    return
  }

  const taskId = draggedTask.value.id
  isDropping.value = true
  
  try {
    await taskApi.update(taskId, { statusId: newStatusId })
    await loadTasks()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Failed to update task status')
  } finally {
    draggedTask.value = null
    isDropping.value = false
  }
}
</script>
