<script setup lang="ts">
const navItems = [
  { name: 'Home', link: '#' },
  { name: 'AI', link: '#' },
  { name: 'Alpha Tool', link: '#', active: true }
];
</script>

<template>
  <header class="bg-dark-bg border-b border-card-border">
    <nav class="max-w-6xl mx-auto px-4 py-3">
      <ul class="flex justify-center space-x-8">
        <li v-for="item in navItems" :key="item.name">
          <a 
            :href="item.link" 
            class="py-2 px-1 inline-block text-sm font-medium transition-colors"
            :class="item.active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'"
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>