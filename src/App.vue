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


const balanceScore = ref<number>(0);
const filteredTransactions = ref<any[]>([]);
const totalAmount = ref<number>(0);
const todayAmount = ref<number>(0);
const isLoading = ref<boolean>(false);
const searchQuery = ref('0x04f843b19c7d639b1a2b1620ccb9bfaf2c935fd6');
const clearSearch = () => {
  searchQuery.value = '';
};


// 交易按天分组
const dailyTransactions = computed(() => {
  const res = TransactionUtils.groupTransactionsByDay(filteredTransactions.value).map((item: any) => {
    return item[1]
  })
  return res
})
// 今日交易量
const todayAmountFormat = computed(() => {
  return ValidationUtils.formatMoney(todayAmount.value)
});
// 今日积分
/**
 * 积分 = 交易量 + 余额
 * 交易量2u 1分；4u 2分；8u 3分；以此类推
 * 余额 0 1 2 3 4 分
 */
const todayScoreFormat = computed(() => {
  // 交易量2u 1分；4u 2分；8u 3分；以此类推
  const tradeScore = TransactionUtils.calculatePoints(todayAmount.value);
  return `+${tradeScore + balanceScore.value}`;
});




/* ----------------------------------- */
// 总交易量
const totalAmountFormat = computed(() => {
  return ValidationUtils.formatMoney(totalAmount.value)
});

// 总积分
const totalScoreFormat = computed(() => {
  // 分别计算每天的积分 然后汇总
  const totalScore = dailyTransactions.value.reduce((acc: number, item: any) => {
    const amount = getAmountByTransactions(item.transactions)
    const tradeScore = TransactionUtils.calculatePoints(amount);
    return acc + tradeScore;
  }, 0);

  return `+${totalScore}`;
})


const getAmountByTransactions = (transactions: any[]) => {
  return transactions.reduce((acc, item) => {
    const all = item.tokens?.['BSC-USD']?.outflow || 0
    return acc + all
  }, 0) * 2
}


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
    const res = await ApiUtils.fetchAddressData(address);
    // 保存交易数据
    filteredTransactions.value = res;

    // 如果没有交易，显示错误
    if (filteredTransactions.value.length === 0) {
      alert('未找到与目标合约的交易记录');
      return;
    }

    // 计算今日交易量
    const today = new Date();
    const todayTransactions = filteredTransactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.timeStamp * 1000);

      return transactionDate.toDateString() === today.toDateString();
    });

    /**
     * * BSC链双倍交易量
     */
    todayAmount.value = getAmountByTransactions(todayTransactions);


    totalAmount.value = getAmountByTransactions(filteredTransactions.value)




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
      <SearchBar v-model="searchQuery" :loading="isLoading" @clear="clearSearch" @submit="handleSearch" />
      <!-- <QuickActions /> -->
      <FilterSlider v-model="balanceScore" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DailyStats transactionCount="2" pointsCount="1" :amount="todayAmountFormat" :points="todayScoreFormat" />
      </div>
      <OverallStats :totalVolume="totalAmountFormat" :totalPoints="totalScoreFormat" />
      <!-- <Calculator /> -->
      <TransactionHistory :data="dailyTransactions" />
      <Describe />
    </div>
  </div>
</template>