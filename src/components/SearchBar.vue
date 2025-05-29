<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { Loader, Search, X, Trash2 } from 'lucide-vue-next'
// @ts-ignore
import StorageUtils from '../utils/storage'
defineProps<{
  modelValue: string
  loading: boolean
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void,
  (e: 'clear'): void,
  (e: 'submit', value: string): void
}>();
const addresses = ref(StorageUtils.loadAddresses() || []);

// 控制历史记录框是否显示
const showAddresses = ref(false);

// 选择历史记录
const selectAddress = (address: string) => {
  emits('update:modelValue', address);
  showAddresses.value = false;
};

// 删除历史记录
const deleteAddress = (index: number) => {
  addresses.value.splice(index, 1);
  StorageUtils.saveAddresses(addresses.value);
};

// 输入框聚焦时显示历史记录
const handleFocus = () => {
  addresses.value = StorageUtils.loadAddresses() || [];
  showAddresses.value = true;
};

// 输入框失焦时隐藏历史记录
const handleBlur = () => {
  // 使用 setTimeout 避免点击历史记录时来不及触发选择事件
  setTimeout(() => {
    showAddresses.value = false;
  }, 200);
};
</script>

<template>
  <div class="relative mb-6">
    <div class="relative flex items-center">
      <input type="text" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" placeholder="BSC地址 0x123..."
        class="w-full bg-card-bg border border-card-border rounded-lg py-3 px-4 pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-binance-yellow/50"
        @focus="handleFocus" @blur="handleBlur" />
      <button v-if="modelValue" @click="$emit('clear')"
        class="absolute right-12 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary p-1">
        <X />
      </button>
      <button class="absolute right-3 top-1/2 -translate-y-1/2 bg-binance-yellow text-black p-1 rounded"
        @click="$emit('submit', modelValue)">
        <Search v-show="!loading" />
        <Loader v-show="loading" class="animate-spin" />
      </button>
    </div>
    <!-- 历史记录框 -->
    <div v-if="showAddresses && addresses.length > 0"
      class="absolute w-full  bg-card-bg border border-card-border rounded-lg mt-1 z-10">
      <ul>
        <li v-for="(address, index) in addresses" :key="index"
          class="text-sm py-2 px-4 flex justify-between items-center" @click="selectAddress(address)">
          <span>{{ address }}</span>
          <button @click.stop="deleteAddress(index)" class="text-text-tertiary hover:text-text-secondary p-1">
            <Trash2 />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>