<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
    <div class="flex items-start justify-between mb-3">
      <h4 class="font-semibold text-gray-900 flex-1 pr-2">{{ task.title }}</h4>
      <div class="flex gap-1">
        <button
          @click.stop="$emit('edit', task)"
          class="text-gray-400 hover:text-blue-600 transition"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click.stop="$emit('reassign', task)"
          class="text-gray-400 hover:text-purple-600 transition"
          title="Reassign"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', task.id)"
          class="text-gray-400 hover:text-red-600 transition"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <p v-if="task.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="space-y-2 text-xs text-gray-500">
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ task.user.name }}
      </div>
      <div class="flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types'
import { formatShortDate } from '@/utils/helpers'

defineProps<{
  task: Task
}>()

defineEmits<{
  edit: [task: Task]
  reassign: [task: Task]
  delete: [id: number]
}>()

const formatDate = formatShortDate
</script>
