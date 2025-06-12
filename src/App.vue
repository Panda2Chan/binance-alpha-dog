<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import FilterSlider from './components/FilterSlider.vue'
import DailyStats from './components/DailyStats.vue'
import OverallStats from './components/OverallStats.vue'
import TransactionHistory from './components/TransactionHistory.vue'
import Hero from './components/Hero.vue'
// @ts-ignore
import ApiUtils from './utils/api'
// @ts-ignore
import ValidationUtils from './utils/validation'
// @ts-ignore
import TransactionUtils from './utils/transaction'
// @ts-ignore
import StorageUtils from './utils/storage'
import Describe from './components/Describe.vue'

import {fetchTokensPrice ,getAmountByTransactions} from './utils/index.util'

const washTrade =  ref(StorageUtils.load("washTrade",true) || false);
const balanceScore = ref<number>(0);
const filteredTransactions = ref<any[]>([]);
const isLoading = ref<boolean>(false);
const searchQuery = ref('');
const priceMap  = ref<Record<string,number>>({})
const clearSearch = () => {
  searchQuery.value = '';
};


// 交易记录中涉及的所有代币tokens
const allTokens = computed(() => {
  const res:string[] = filteredTransactions.value.reduce((acc: string[], item: any) => {
    const tokens = Object.keys(item.tokens) as string[];
    return [...acc, ...tokens];
  },[])
  // 去重
  return [...new Set(res)]
})


// 交易按天分组
const dailyTransactions = computed(() => {
  const res = TransactionUtils.groupTransactionsByDay(filteredTransactions.value).map((item: any) => {
    return item[1]
  })
  return res
})

// 今日交易流水
const todayTransactions = computed(() => {
 const today = new Date();
  return filteredTransactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.timeStamp * 1000);
      return transactionDate.toDateString() === today.toDateString();
    });
})
// 今日交易量
const todayAmountFormat = computed(() => {
  const amount = getAmountByTransactions(todayTransactions.value,priceMap.value)
  return ValidationUtils.formatMoney(amount)
});

// 今日积分
const todayScoreFormat = computed(() => {
  const amount = getAmountByTransactions(todayTransactions.value,priceMap.value,washTrade.value)
  const tradeScore = TransactionUtils.calculatePoints(amount);
  return `+${tradeScore + balanceScore.value}`;
});


/* ----------------------------------- */
// 总交易量
const totalAmountFormat = computed(() => {
  const amount = getAmountByTransactions(filteredTransactions.value,priceMap.value,washTrade.value);
  return ValidationUtils.formatMoney(amount)
});

// 总积分
const totalScoreFormat = computed(() => {
  // 分别计算每天的积分 然后汇总
  const totalScore = dailyTransactions.value.reduce((acc: number, item: any) => {
    const amount = getAmountByTransactions(item.transactions,priceMap.value,washTrade.value)
    const tradeScore = TransactionUtils.calculatePoints(amount);
    return acc + tradeScore;
  }, 0);

  return `+${totalScore}`;
})




const handleSearch = async (address: string) => {
  try {
    const isValid = ValidationUtils.isValidAddress(address)
    if (!isValid) {
      alert('无效的BSC地址');
      return;
    }

    const addresses = StorageUtils.loadAddresses() || []
    const newAddresses = [...new Set([...addresses, address])]
    // 点击搜索后，将搜索值存到本地
    StorageUtils.saveAddresses(newAddresses)

    isLoading.value = true;
    // 获取交易数据
    filteredTransactions.value  = await ApiUtils.fetchAddressData(address);

    // 如果没有交易，显示错误
    if (filteredTransactions.value.length === 0) {
      alert('未找到与目标合约的交易记录');
      return;
    }
    // 计算涉及到的所有代币tokens的价格
    priceMap.value = await fetchTokensPrice(allTokens.value)
    
   


  } catch (error: any) {
    console.error('获取交易数据时出错:', error);
    alert('获取交易数据时出错: ' + error.message);
  } finally {
    isLoading.value = false
  }
};
</script>

<template>
  <div class="min-h-screen bg-dark-bg text-text-primary">
    <Header />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <Hero />
      <SearchBar 
        v-model="searchQuery"
        v-model:wash-trade="washTrade"
        :loading="isLoading" 
        @clear="clearSearch"
        @submit="handleSearch"
      />
      <!-- <QuickActions /> -->
      <FilterSlider v-model="balanceScore" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DailyStats transactionCount="2" pointsCount="1" :amount="todayAmountFormat" :points="todayScoreFormat" />
      </div>
      <OverallStats :totalVolume="totalAmountFormat" :totalPoints="totalScoreFormat" />
      <!-- <Calculator /> -->
      <TransactionHistory :data="dailyTransactions" :priceMap="priceMap" :washTrade="washTrade" />
      <Describe />
    </div>
  </div>
</template>