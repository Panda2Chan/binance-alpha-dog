<script setup lang="ts">
import { ref } from 'vue';

interface TransactionDay {
  date: string;
  expanded: boolean;
  transactions: number;
  volume: string;
  tokenAmount: string;
  points: string;
}

const transactionDays = ref<TransactionDay[]>([
  {
    date: '2025年5月27日',
    expanded: false,
    transactions: 8,
    volume: '$0',
    tokenAmount: '0.00 USDT',
    points: '+0'
  },
  {
    date: '2025年5月26日',
    expanded: false,
    transactions: 6,
    volume: '$0',
    tokenAmount: '0.00 USDT',
    points: '+0'
  },
  {
    date: '2025年5月25日',
    expanded: false,
    transactions: 6,
    volume: '$0',
    tokenAmount: '0.00 USDT',
    points: '+0'
  },
  {
    date: '2025年5月24日',
    expanded: false,
    transactions: 6,
    volume: '$0',
    tokenAmount: '0.00 USDT',
    points: '+0'
  }
]);

const toggleExpand = (index: number) => {
  transactionDays.value[index].expanded = !transactionDays.value[index].expanded;
};
</script>

<template>
  <div>
    <h3 class="text-sm text-text-secondary font-medium mb-4">交易记录</h3>
    
    <div class="space-y-3">
      <div 
        v-for="(day, index) in transactionDays" 
        :key="day.date"
        class="bg-card-bg border border-card-border rounded-lg overflow-hidden"
      >
        <div 
          class="p-4 flex justify-between items-center cursor-pointer"
          @click="toggleExpand(index)"
        >
          <h4 class="text-base font-medium">{{ day.date }}</h4>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor" 
            class="w-5 h-5 transition-transform duration-300"
            :class="day.expanded ? 'rotate-180' : ''"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        
        <div v-if="day.expanded" class="p-4 pt-0 border-t border-card-border">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p class="text-text-secondary mb-1">交易次数</p>
              <p class="font-medium">{{ day.transactions }} 笔</p>
            </div>
            <div>
              <p class="text-text-secondary mb-1">总交易量</p>
              <p class="font-medium">{{ day.volume }}</p>
            </div>
            <div>
              <p class="text-text-secondary mb-1">消耗总量</p>
              <p class="font-medium text-binance-yellow">{{ day.tokenAmount }}</p>
            </div>
            <div>
              <p class="text-text-secondary mb-1">获得积分</p>
              <p class="font-medium text-binance-yellow">{{ day.points }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>