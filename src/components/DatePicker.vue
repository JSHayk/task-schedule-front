<template>
  <div class="relative" ref="datePickerRef">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <input
        :value="displayValue"
        @click="togglePicker"
        readonly
        :placeholder="placeholder"
        class="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 transition cursor-pointer hover:border-gray-400 bg-white"
        :class="hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-transparent'"
      />
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72"
      >
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            @click="previousMonth"
            class="p-1 hover:bg-gray-100 rounded transition"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="font-semibold text-gray-900">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button
            type="button"
            @click="nextMonth"
            class="p-1 hover:bg-gray-100 rounded transition"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in dayNames" :key="day" class="text-center text-xs font-medium text-gray-500 py-1">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="day in calendarDays"
            :key="day.date"
            type="button"
            @click="selectDate(day)"
            :disabled="!day.isCurrentMonth"
            class="aspect-square flex items-center justify-center text-sm rounded-lg transition"
            :class="getDayClasses(day)"
          >
            {{ day.day }}
          </button>
        </div>

        <div class="mt-3 pt-3 border-t border-gray-200">
          <button
            type="button"
            @click="selectToday"
            class="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Today
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  hasError?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const datePickerRef = ref<HTMLElement | null>(null)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const selectedDate = computed(() => props.modelValue || '')

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  const lastDate = lastDay.getDate()
  const prevLastDate = prevLastDay.getDate()

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevLastDate - i,
      date: new Date(currentYear.value, currentMonth.value - 1, prevLastDate - i).toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  const today = new Date().toISOString().split('T')[0]
  for (let i = 1; i <= lastDate; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i).toISOString().split('T')[0]
    days.push({
      day: i,
      date,
      isCurrentMonth: true,
      isToday: date === today,
      isSelected: date === selectedDate.value
    })
  }

  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      date: new Date(currentYear.value, currentMonth.value + 1, i).toISOString().split('T')[0],
      isCurrentMonth: false,
      isToday: false,
      isSelected: false
    })
  }

  return days
})

function togglePicker() {
  isOpen.value = !isOpen.value
  if (isOpen.value && selectedDate.value) {
    const date = new Date(selectedDate.value + 'T00:00:00')
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDate(day: any) {
  if (!day.isCurrentMonth) return
  emit('update:modelValue', day.date)
  isOpen.value = false
}

function selectToday() {
  const today = new Date().toISOString().split('T')[0] || ''
  emit('update:modelValue', today)
  currentMonth.value = new Date().getMonth()
  currentYear.value = new Date().getFullYear()
  isOpen.value = false
}

function getDayClasses(day: any) {
  if (!day.isCurrentMonth) {
    return 'text-gray-300 cursor-not-allowed'
  }
  if (day.isSelected) {
    return 'bg-blue-600 text-white font-semibold hover:bg-blue-700'
  }
  if (day.isToday) {
    return 'bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100'
  }
  return 'text-gray-700 hover:bg-gray-100'
}

function handleClickOutside(event: MouseEvent) {
  if (datePickerRef.value && !datePickerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
