<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  modelValue: string
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'clear'): void
}>();
</script>

<template>
  <div class="relative mb-6">
    <div class="relative flex items-center">
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="0xAc285F9BF78eC7B16cb1999A5c7Ddd7867C3e3c9" 
        class="w-full bg-card-bg border border-card-border rounded-lg py-3 px-4 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-binance-yellow/50"
      />
      <button 
        v-if="modelValue" 
        @click="$emit('clear')"
        class="absolute right-12 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-binance-yellow text-black p-1 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </div>
  </div>
</template>