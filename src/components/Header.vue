<template>
  <div class="mb-4 px-4">
    <!-- Logo -->
    <div class="flex items-center py-6">
      <img
        src="@/assets/tu20logo.png"
        alt="TU20"
        class="rounded-full w-10 h-10 ml-auto"
      />

      <div class="ml-4 text-2xl mr-auto font-bold">
        TU20 Bot Settings
      </div>
    </div>

    <!-- Nav Links -->
    <div class="flex justify-center mx-auto max-w-4xl border-b">
      <router-link
        tag="a"
        to="/server"
        class="flex items-center font-light p-2"
        :class="{ 'border-b-2 border-black font-bold': server }"
      >
        <Globe class="w-4 h-4 mr-2" />
        Server
      </router-link>
      <router-link
        tag="a"
        to="/welcome"
        class="flex items-center font-light p-2"
        :class="{ 'border-b-2 border-black font-bold': welcome }"
      >
        <Hand class="w-4 h-4 mr-2" />
        Welcome
      </router-link>
      <router-link
        tag="a"
        to="/logs"
        class="flex items-center font-light p-2"
        :class="{ 'border-b-2 border-black font-bold': logs }"
      >
        <ClipboardList class="w-4 h-4 mr-2" />
        Logs
      </router-link>
      <router-link
        tag="a"
        to="/factories"
        class="flex items-center font-light p-2"
        :class="{ 'border-b-2 border-black font-bold': factories }"
      >
        <LightningBolt class="w-4 h-4 mr-2" />
        Factories
      </router-link>
      <router-link
        tag="a"
        to="/matches"
        class="flex items-center font-light p-2"
        :class="{ 'border-b-2 border-black font-bold': matches }"
      >
        <Collection class="w-4 h-4 mr-2" />
        Matches
      </router-link>
      <button
        class="flex items-center font-light p-2 bg-blue-100 rounded-t px-2 ml-4"
        @click="commit"
      >
        <LockClosed class="w-4 h-4 mr-2" />
        Commit
      </button>
      <button
        class="flex items-center font-light p-2 bg-blue-100 rounded-t px-2 ml-4"
        @click="logout"
      >
        <Logout class="w-4 h-4 mr-2" />
        Logout
      </button>
    </div>

    <Flash ref="commit">All settings committed.</Flash>
  </div>
</template>

<script>
// Icons
import Hand from 'heroicons/outline/hand.svg'
import Globe from 'heroicons/outline/globe.svg'
import LightningBolt from 'heroicons/outline/lightning-bolt.svg'
import ClipboardList from 'heroicons/outline/clipboard-list.svg'
import Collection from 'heroicons/outline/collection.svg'
import LockClosed from 'heroicons/outline/lock-closed.svg'
import Logout from 'heroicons/outline/logout.svg'

// Components
import Flash from '@/components/Flash'

// Libraries
import axios from 'axios'

export default {
  name: 'Header',

  components: {
    Hand,
    Globe,
    LightningBolt,
    ClipboardList,
    Collection,
    LockClosed,
    Logout,

    Flash
  },

  computed: {
    server() {
      return this.$route.meta.server
    },

    welcome() {
      return this.$route.meta.welcome
    },

    logs() {
      return this.$route.meta.logs
    },

    factories() {
      return this.$route.meta.factories
    },

    matches() {
      return this.$route.meta.matches
    }
  },

  methods: {
    async commit() {
      await axios.put('/api/commit')
      this.$refs.commit.show()
    },
    async logout() {
      localStorage.removeItem('auth:token')
      window.location.href = '/'
    }
  }
}
</script>
