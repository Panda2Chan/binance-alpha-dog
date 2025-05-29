<template>
  <div class=" text-white pt-6  mx-auto">
    <!-- Header -->
    <h2 class="text-xl font-medium mb-6">Alpha 积分系统</h2>

    <!-- What is Alpha Points System -->
    <div class="border border-gray-700 rounded-lg p-6 mb-6">
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-4">什么是Alpha积分系统？</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-start">
            <span class="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Alpha 积分基于净资产因素计算：</span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><span class="text-yellow-400">余额</span>：15天内持有的现货和 Alpha 代币的美元价值</span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span><span class="text-yellow-400">交易量</span>：每日购买 Alpha 代币所花费的美元</span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>积分在15天期间内每日累积</span>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>更高的积分可以获得更好的平台权益</span>
          </li>
        </ul>
      </div>

      <!-- Balance Points Table -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-4">余额积分（每日）</h3>
        <div class="border border-gray-700 rounded-lg overflow-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="bg-yellow-600 text-black px-4 py-3 text-left font-medium">余额</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$100</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$1,000</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$10,000</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$100,000+</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="bg-yellow-600 text-black px-4 py-3 font-medium">积分</td>
                <td class="bg-gray-900 px-4 py-3 text-center">1</td>
                <td class="bg-gray-900 px-4 py-3 text-center">2</td>
                <td class="bg-gray-900 px-4 py-3 text-center">3</td>
                <td class="bg-gray-900 px-4 py-3 text-center">4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Trading Volume Points Table -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-4">交易量积分（每日）</h3>
        <div class="border border-gray-700 rounded-lg overflow-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="bg-yellow-600 text-black px-4 py-3 text-left font-medium">交易量</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$2</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$4</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$8</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$16</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$32</th>
                <th class="bg-gray-800 px-4 py-3 text-center">$64</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="bg-yellow-600 text-black px-4 py-3 font-medium">积分</td>
                <td class="bg-gray-900 px-4 py-3 text-center">1</td>
                <td class="bg-gray-900 px-4 py-3 text-center">2</td>
                <td class="bg-gray-900 px-4 py-3 text-center">3</td>
                <td class="bg-gray-900 px-4 py-3 text-center">4</td>
                <td class="bg-gray-900 px-4 py-3 text-center">5</td>
                <td class="bg-gray-900 px-4 py-3 text-center">6</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-400 mt-2">每次交易量都可获得 1 积分</p>
      </div>

      <!-- Best Strategy -->
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-4">最佳策略（每日）</h3>
        <div class="border border-gray-700 rounded-lg overflow-auto">
          <table class="w-full">
            <tbody>
              <tr class="border-b border-gray-700">
                <td class="bg-yellow-600 text-black px-4 py-3 font-medium">策略</td>
                <td class="bg-gray-900 px-4 py-3">持有 $1,000 (2 分) + 每日交易 $16,384 (14分)</td>
              </tr>
              <tr>
                <td class="bg-yellow-600 text-black px-4 py-3 font-medium">结果</td>
                <td class="bg-gray-900 px-4 py-3">16分/天 × 15天 = 240 分</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- How to Check Points -->
      <div>
        <h3 class="text-lg font-medium mb-4">如何查看你的积分</h3>
        <ol class="space-y-2 text-sm">
          <li class="flex items-start">
            <span class="text-yellow-400 mr-3 font-medium">1.</span>
            <span>打开币安 App</span>
          </li>
          <li class="flex items-start">
            <span class="text-yellow-400 mr-3 font-medium">2.</span>
            <span>在搜索栏中搜索 "Alpha 积分"</span>
          </li>
          <li class="flex items-start">
            <span class="text-yellow-400 mr-3 font-medium">3.</span>
            <span>在结果页面查看你的积分明细</span>
          </li>
        </ol>
      </div>
    </div>


  </div>
</template>

<script setup>
// This component displays the Alpha Points System information
// No reactive data needed for this static information display
</script>

<style scoped>
/* Additional custom styles if needed */
</style>