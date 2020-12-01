<template>
  <div id="app">
    <Header v-if="showHeader" />

    <router-view />
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'App',

  components: { Header },

  computed: {
    showHeader() {
      return !this.$route.meta.hideHeader
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
