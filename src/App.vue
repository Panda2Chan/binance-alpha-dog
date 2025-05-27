<script setup lang="ts">
import { ref } from 'vue'
import Header from './components/Header.vue'
import SearchBar from './components/SearchBar.vue'
import QuickActions from './components/QuickActions.vue'
import FilterSlider from './components/FilterSlider.vue'
import DailyStats from './components/DailyStats.vue'
import OverallStats from './components/OverallStats.vue'
import TransactionHistory from './components/TransactionHistory.vue'
import Calculator from './components/Calculator.vue'
import Hero from './components/Hero.vue'

const searchQuery = ref('');
const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="min-h-screen bg-dark-bg text-text-primary">
    <Header />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <Hero />
      <SearchBar v-model="searchQuery" @clear="clearSearch" />
      <QuickActions />
      <FilterSlider />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DailyStats 
          transactionCount="2"
          pointsCount="1"
          amount="$0" 
          points="+0" 
        />
      </div>
      <OverallStats 
        totalVolume="$258,661.165" 
        totalPoints="+156" 
      />
      <Calculator />
      <TransactionHistory />
    </div>
  </div>
</template>