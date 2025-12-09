<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50" @click.self="$emit('cancel')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            <p class="text-sm text-gray-600 mt-1" v-html="message"></p>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="$emit('cancel')"
            class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            :disabled="loading"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Deleting...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmText?: string
  loading?: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>
