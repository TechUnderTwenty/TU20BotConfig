<template>
  <div class="max-w-lg mx-auto p-4">
    <form @submit.prevent="login" class="p-8 border rounded">
      <div class="flex items-center text-2xl justify-center mb-4">
        <img
          class="w-16 h-16 mr-4 rounded-full"
          src="@/assets/tu20logo.png"
          alt="TU20 Logo"
        />
        TU20 Bot Config
      </div>

      <div>
        <div class="font-light text-gray-500 text-xs mb-2">
          Token
        </div>
        <input
          type="text"
          class="border rounded p-2 text-lg w-full bg-gray-100 font-mono"
          v-model="token"
          required
        />
      </div>

      <div
        class="font-light text-red-500 text-xs mt-2"
        :class="{ 'opacity-0': !error }"
      >
        Failed to log in. {{ error }}
      </div>

      <div class="justify-right mt-4">
        <button
          type="submit"
          class="bg-blue-500 text-sm text-white transition-colors duration-150 hover:bg-blue-600 rounded px-4 py-2 flex items-center ml-auto"
        >
          <ArrowCircleRight class="w-4 h-4 mr-2" />
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// Icons
import ArrowCircleRight from 'heroicons/outline/arrow-circle-right.svg'

// Libraries
import axios from 'axios'

export default {
  name: 'Login.vue',

  components: { ArrowCircleRight },

  data() {
    return {
      token: '',

      error: null
    }
  },

  methods: {
    async login() {
      this.error = null

      try {
        const result = await axios.get('/api/ping', {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        if (result.data === 'Pong') {
          localStorage.setItem('auth:token', this.token)

          window.location = '/'
        } else {
          this.error = result.data
        }
      } catch (e) {
        console.log(e.response.data)

        this.error = `${e.response.data} (Invalid Token)`
      }
    }
  }
}
</script>
