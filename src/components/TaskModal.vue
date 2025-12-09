<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
      <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
        <h2 class="text-xl font-bold text-gray-900">
          {{ task ? 'Edit Task' : 'Create Task' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="p-6 space-y-6">
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            :class="validationErrors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-transparent'"
            placeholder="Enter task title"
            @blur="validateField('title')"
          />
          <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">{{ validationErrors.title }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span class="text-red-500">*</span>
            </label>
            <DatePicker
              v-model="form.startDate"
              placeholder="Select start date"
              :hasError="!!validationErrors.startDate"
              @update:modelValue="validateField('startDate')"
            />
            <p v-if="validationErrors.startDate" class="mt-1 text-sm text-red-600">{{ validationErrors.startDate }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              End Date <span class="text-red-500">*</span>
            </label>
            <DatePicker
              v-model="form.endDate"
              placeholder="Select end date"
              :hasError="!!validationErrors.endDate"
              @update:modelValue="validateField('endDate')"
            />
            <p v-if="validationErrors.endDate" class="mt-1 text-sm text-red-600">{{ validationErrors.endDate }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Assigned User <span class="text-red-500">*</span>
            </label>
            <CustomSelect
              v-model="form.userId"
              :options="userOptions"
              placeholder="Select user"
              @update:modelValue="validateField('userId')"
            />
            <p v-if="validationErrors.userId" class="mt-1 text-sm text-red-600">{{ validationErrors.userId }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status <span class="text-red-500">*</span>
            </label>
            <CustomSelect
              v-model="form.statusId"
              :options="statusOptions"
              placeholder="Select status"
              @update:modelValue="validateField('statusId')"
            />
            <p v-if="validationErrors.statusId" class="mt-1 text-sm text-red-600">{{ validationErrors.statusId }}</p>
          </div>
        </div>

        </div>
      </form>

      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
        <div class="flex gap-3">
          <button
            type="submit"
            @click="handleSubmit"
            :disabled="loading || !isFormValid"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task') }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import CustomSelect from '@/components/CustomSelect.vue'
import DatePicker from '@/components/DatePicker.vue'
import type { Task } from '@/types'
import { getStatusColor, formatStatusName, getTodayDate } from '@/utils/helpers'

const props = defineProps<{
  task?: Task | null
}>()

const emit = defineEmits<{
  close: []
  save: []
}>()

const taskStore = useTaskStore()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  userId: '' as string | number,
  statusId: '' as string | number
})

const validationErrors = reactive({
  title: '',
  startDate: '',
  endDate: '',
  userId: '',
  statusId: ''
})

const userOptions = computed(() => 
  taskStore.users.map(user => ({
    value: user.id,
    label: user.name
  }))
)

const statusOptions = computed(() =>
  taskStore.statuses.map(status => ({
    value: status.id,
    label: formatStatusName(status.name),
    color: getStatusColor(status.name)
  }))
)

const isFormValid = computed(() => {
  return form.title.trim() !== '' &&
         form.startDate !== '' &&
         form.endDate !== '' &&
         form.userId !== '' &&
         form.statusId !== '' &&
         !Object.values(validationErrors).some(error => error !== '')
})

function validateField(field: keyof typeof validationErrors) {
  switch (field) {
    case 'title':
      validationErrors.title = form.title.trim() === '' ? 'Title is required' : ''
      break
    case 'startDate':
      validationErrors.startDate = form.startDate === '' ? 'Start date is required' : ''
      if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
        validationErrors.startDate = 'Start date must be before end date'
      }
      break
    case 'endDate':
      validationErrors.endDate = form.endDate === '' ? 'End date is required' : ''
      if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
        validationErrors.endDate = 'End date must be after start date'
      }
      break
    case 'userId':
      validationErrors.userId = form.userId === '' ? 'Please select a user' : ''
      break
    case 'statusId':
      validationErrors.statusId = form.statusId === '' ? 'Please select a status' : ''
      break
  }
}

function validateAllFields() {
  validateField('title')
  validateField('startDate')
  validateField('endDate')
  validateField('userId')
  validateField('statusId')
  return !Object.values(validationErrors).some(error => error !== '')
}

watch(() => props.task, (task) => {
  if (task) {
    form.title = task.title
    form.description = task.description || ''
    form.startDate = task.startDate || ''
    form.endDate = task.endDate || ''
    form.userId = task.userId.toString()
    form.statusId = task.statusId.toString()
  } else {
    const today = getTodayDate()
    form.title = ''
    form.description = ''
    form.startDate = today
    form.endDate = today
    form.userId = ''
    form.statusId = '1'
  }
}, { immediate: true })

async function handleSubmit() {
  if (!validateAllFields()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const data = {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      userId: parseInt(form.userId.toString()),
      statusId: parseInt(form.statusId.toString())
    }

    if (props.task) {
      await taskStore.updateTask(props.task.id, data)
    } else {
      await taskStore.createTask(data)
    }

    emit('save')
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
