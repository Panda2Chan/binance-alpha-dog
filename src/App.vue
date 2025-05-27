<script setup lang="ts">
import { computed, ref } from 'vue'
import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import QuickActions from './components/QuickActions.vue'
import FilterSlider from './components/FilterSlider.vue'
import DailyStats from './components/DailyStats.vue'
import OverallStats from './components/OverallStats.vue'
import TransactionHistory from './components/TransactionHistory.vue'
import Calculator from './components/Calculator.vue'
import Hero from './components/Hero.vue'
// @ts-ignore
import ApiUtils from './utils/api'
// @ts-ignore
import ValidationUtils from './utils/validation'
// @ts-ignore
import TransactionUtils from './utils/transaction'

const balanceScore = ref<number>(0);
const filteredTransactions = ref<any[]>([]);
const totalVolume = ref<any>();
const searchQuery = ref('0xAc285F9BF78eC7B16cb1999A5c7Ddd7867C3e3c9');
const clearSearch = () => {
  searchQuery.value = '';
};





const handleSearch = async (address: string) => {
  try {
    const isValid = ValidationUtils.isValidAddress(address)
    if (!isValid) {
      alert('无效的BSC地址');
      return;
    }
    // 获取交易数据
    const res = await ApiUtils.fetchAddressData(address);
    // 保存交易数据
    filteredTransactions.value = res;

    // 如果没有交易，显示错误
    if (filteredTransactions.value.length === 0) {
      alert('未找到与目标合约的交易记录');
      return;
    }
    console.log("filteredTransactions", filteredTransactions);


    // 计算今日交易量
    const stats = await TransactionUtils.calculateStatistics(filteredTransactions.value, null);
    totalVolume.value = stats
    console.log(totalVolume.value);



  } catch (error: any) {
    console.error('获取交易数据时出错:', error);
    alert('获取交易数据时出错: ' + error.message);
  } finally {
    // TODO loading false
  }
};
</script>

<template>
  <div class="min-h-screen bg-dark-bg text-text-primary">
    <Header />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <Hero />
      <SearchBar v-model="searchQuery" @clear="clearSearch" @submit="handleSearch" />
      <QuickActions />
      <FilterSlider v-model="balanceScore" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DailyStats transactionCount="2" pointsCount="1" amount="$0" points="+0" />
      </div>
      <OverallStats totalVolume="$258,661.165" totalPoints="+156" />
      <Calculator />
      <TransactionHistory />
    </div>
  </div>
</template>