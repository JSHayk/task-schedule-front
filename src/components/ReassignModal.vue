<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Reassign Task</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleReassign" class="p-6 space-y-6">
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <p class="text-sm text-gray-600 mb-4">
            Reassigning: <span class="font-semibold text-gray-900">{{ task.title }}</span>
          </p>
          <p class="text-sm text-gray-600 mb-4">
            Current assignee: <span class="font-semibold text-gray-900">{{ task.user.name }}</span>
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            New Assignee <span class="text-red-500">*</span>
          </label>
          <CustomSelect
            v-model="selectedUserId"
            :options="userOptions"
            placeholder="Select user"
          />
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="loading || !selectedUserId"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Reassigning...' : 'Reassign Task' }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import CustomSelect from '@/components/CustomSelect.vue'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  close: []
  save: []
}>()

const taskStore = useTaskStore()
const loading = ref(false)
const errorMessage = ref('')
const selectedUserId = ref<string | number | null>(null)

const availableUsers = computed(() => {
  return taskStore.users.filter(user => user.id !== props.task.userId)
})

const userOptions = computed(() =>
  availableUsers.value.map(user => ({
    value: user.id,
    label: user.name
  }))
)

async function handleReassign() {
  if (!selectedUserId.value) {
    errorMessage.value = 'Please select a user'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const userId = typeof selectedUserId.value === 'string' 
      ? parseInt(selectedUserId.value) 
      : selectedUserId.value
    
    await taskStore.reassignTask(props.task.id, userId)
    emit('save')
    emit('close')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to reassign task'
  } finally {
    loading.value = false
  }
}
</script>
