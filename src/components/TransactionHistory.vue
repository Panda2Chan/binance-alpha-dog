<script setup lang="tsx">
// @ts-ignore
import ValidationUtils from '../utils/validation'
// @ts-ignore
import TransactionUtils from '../utils/transaction'
import { ref } from 'vue';
import dayjs from 'dayjs'

interface TransactionDay {
  date: string;
  tokenStats: Record<string, {
    inflow: number;
    outflow: number;
    address: string
  }>;
  transactions: any[];
  totalBnb: number;
}

const expandIndexMap = ref<Record<number, boolean>>({})

defineProps<{
  data: TransactionDay[];
}>();



const toggleExpand = (index: number) => {
  if (!expandIndexMap.value[index]) expandIndexMap.value[index] = false
  expandIndexMap.value[index] = !expandIndexMap.value[index]
};

const getAmountByTransactions = (transactions: any[]) => {
  return transactions.reduce((acc, item) => {
    const all = item.tokens?.['BSC-USD']?.outflow || 0
    return acc + all
  }, 0) * 2
}



// 获取总交易量
const getAmountFormat = (transactions: any[]): string => {
  const amount = getAmountByTransactions(transactions)
  return ValidationUtils.formatMoney(amount)
}

// 获取总积分
const getScoreFormat = (transactions: any[]): string => {
  const amount = getAmountByTransactions(transactions)
  const tradeScore = TransactionUtils.calculatePoints(amount);
  return `+${tradeScore}`;
}

// 获取消耗
const getConsumeFormat = (day: TransactionDay): string => {
  const { inflow = 0, outflow = 0 } = day.tokenStats?.['BSC-USD'] || {}
  const amount = inflow - outflow
  return ValidationUtils.formatMoney(amount)
}
const getCount = (transactions: any[]): number => {
  // 只进算买入次数
  // return transactions.reduce((acc, item) => {
  //   const time = item.tokens?.['BSC-USD']?.outflow > 0 ? 1 : 0
  //   return acc + time
  // }, 0)

  return transactions?.length || 0
}
const columns = [
  { title: "交易哈希", key: "hash" },
  { title: "时间", key: "timeStamp" },
  { title: "代币", key: "coin" },
  { title: "转入", key: "inflow" },
  { title: "转出", key: "outflow" },
  { title: "状态", key: "status" },
]


const getFlowData = (transactions: any[]) => {
  const res: any[] = []
  transactions.forEach(item => {
    Object.entries(item.tokens).forEach(([key, value]: [string, any]) => {
      if (value.inflow === 0 && value.outflow == 0) return
      res.push({
        hash: item.hash,
        hashFormat: ValidationUtils.formatTransactionHash(item.hash),
        timeStamp: dayjs(item.timeStamp * 1000).format('HH:mm:ss'),
        coin: key,
        inflow: ValidationUtils.formatTokenAmount(value.inflow),
        outflow: ValidationUtils.formatTokenAmount(value.outflow),
        status: item.status,
      })
    })
  })

  return res
}


</script>

<template>
  <div>
    <h2 class="text-xl font-medium mb-6">
      交易记录
      <span class="block text-xs mt-2 text-text-secondary">
        最近15天交易记录。
      </span>
    </h2>
    <div class="space-y-3">
      <template v-if="data?.length > 0">
        <div v-for="(day, index) in data" :key="day.date"
          class="bg-card-bg border border-card-border rounded-lg overflow-hidden  cursor-pointer"
          @click="toggleExpand(index)">
          <div class="p-4 flex justify-between items-center">
            <h4 class="text-base font-medium">{{ day.date }}</h4>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5 transition-transform duration-300"
              :class="expandIndexMap[index] ? 'rotate-180' : ''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          <div class="p-4 pt-0 ">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-text-secondary mb-1">交易次数</p>
                <p class="font-medium">{{ getCount(day.transactions) }} 笔</p>
              </div>
              <div>
                <p class="text-text-secondary mb-1">总交易量</p>
                <p class="font-medium">{{ getAmountFormat(day.transactions) }}</p>
              </div>
              <div>
                <p class="text-text-secondary mb-1">消耗总量</p>
                <p class="font-medium text-binance-yellow">{{ getConsumeFormat(day) }}</p>
              </div>
              <div>
                <p class="text-text-secondary mb-1">获得积分</p>
                <p class="font-medium text-binance-yellow">{{ getScoreFormat(day.transactions) }}</p>
              </div>
            </div>
          </div>

          <div v-if="expandIndexMap[index]" class="border-t border-card-border p-4 ">
            <table class="w-full table-auto  rounded-lg overflow-hidden shadow-md">
              <thead class="bg-card-bg text-text-secondary">
                <tr>
                  <th v-for="item in columns" :key="item.key" class="px-4 py-3 text-left text-sm font-medium">
                    {{ item.title }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-card-border">
                <tr v-for="(transaction, transIndex) in getFlowData(day.transactions)" :key="transIndex">
                  <td v-for="item in columns" class="px-4 py-3 text-sm">

                    <template v-if="item.key === 'hash'">
                      <a :href="`https://bscscan.com/tx/${transaction.hash}`" target="_blank"
                        class="text-binance-yellow hover:underline">
                        {{ transaction.hashFormat }}
                      </a>
                    </template>
                    <template v-else-if="item.key === 'status'">
                      <span :class="transaction.status === '成功' ? 'text-green-500' : 'text-red-500'">
                        {{ transaction.status }}
                      </span>
                    </template>
                    <template v-else>
                      {{ transaction[item.key] }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>


      <div v-else class="border border-card-border rounded-lg text-sm p-5">
        未找到该地址下的交易记录
      </div>

    </div>
  </div>
</template>