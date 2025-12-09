<template>
  <div class="relative" ref="selectRef">
    <button
      type="button"
      @click="toggleDropdown"
      class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer transition hover:border-gray-400 text-left"
      :class="{ 'ring-2 ring-blue-500 border-transparent': isOpen }"
    >
      <span class="flex items-center gap-2">
        <span 
          v-if="selectedOption?.color" 
          class="w-3 h-3 rounded-full shrink-0"
          :class="selectedOption.color"
        ></span>
        <span :class="{ 'text-gray-400': !selectedLabel, 'text-gray-900': selectedLabel }">
          {{ selectedLabel || placeholder }}
        </span>
      </span>
    </button>
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <svg 
        class="h-5 w-5 text-gray-400 transition-transform duration-200" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
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
        class="absolute z-[100] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value ?? `option-${index}`"
          @click="selectOption(option)"
          class="px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition flex items-center gap-2"
          :class="{
            'bg-blue-100 text-blue-900 font-medium': modelValue === option.value,
            'text-gray-900': modelValue !== option.value
          }"
        >
          <span 
            v-if="option.color" 
            class="w-3 h-3 rounded-full shrink-0"
            :class="option.color"
          ></span>
          <span>{{ option.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SelectOption {
  value: string | number | null
  label: string
  color?: string
}

const props = defineProps<{
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const selectedLabel = computed(() => {
  return selectedOption.value?.label || ''
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(option: SelectOption) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
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
