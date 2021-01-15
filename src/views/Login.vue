<template>
  <div class="max-w-lg mx-auto p-4 shadow-lg mt-6">
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
        <small class="font-light text-gray-500 text-xs mb-2"> Username </small>
        <input
          type="text"
          class="border rounded p-2 text-lg w-full bg-gray-100 font-mono"
          v-model="username"
          required
        />
        <small class="font-light text-gray-500 text-xs mb-2 mt-8">
          Password
        </small>
        <input
          type="password"
          class="border rounded p-2 text-lg w-full bg-gray-100 font-mono"
          v-model="password"
          required
        />
      </div>

      <div
        class="font-light text-red-500 text-xs mt-2"
        :class="{ 'opacity-0 hidden': !error }"
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
      username: '',
      password: '',

      error: null
    }
  },

  methods: {
    login() {
      this.error = null

      axios
        .post('/api/admin/login', '', {
          params: { username: this.username, password: this.password }
        })
        .then(result => {
          localStorage.setItem('auth:token', result.data)
          // Navigate to home
          window.location = '/'
        })
        .catch(error => {
          if (error.response) {
            // If the response was Unauthorised
            if (error.response.status === 401) {
              this.error = 'Invalid username or password'
            } else {
              this.error = `${error.response.data} (Invalid Token)`
            }

            console.error(error.response.data)
          } else if (error.request) {
            this.error = `${error.request}`
          }
        })
    }
  }
}
</script>
