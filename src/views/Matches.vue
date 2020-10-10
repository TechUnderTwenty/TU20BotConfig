<template>
  <div class="max-w-4xl mx-auto px-4 mb-32">
    <div class="text-2xl font-bold block mb-1">
      Name Matches
    </div>

    <div class="flex mb-3">
      <DiscordSelector
        :options="roles"
        v-model="selected"
        class="w-full max-w-sm"
        icon="role"
      />

      <div class="ml-auto flex">
        <input
          type="file"
          ref="attachment"
          class="hidden"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @change="uploadFile"
        />

        <button
          class="bg-blue-500 text-sm text-white transition-colors duration-150 hover:bg-blue-600 rounded px-4 py-2 flex items-center ml-4"
          :class="{ 'cursor-not-allowed opacity-50': !selected }"
          @click="selected && openFile()"
        >
          <ArrowUp class="w-4 h-4 mr-2" />

          Import
        </button>

        <button
          class="bg-blue-500 text-sm text-white transition-colors duration-150 hover:bg-blue-600 rounded px-4 py-2 flex items-center ml-4"
          :class="{ 'cursor-not-allowed opacity-50': !selected }"
          @click="selected && create()"
        >
          <Plus class="w-4 h-4 mr-2" />

          Create
        </button>
      </div>
    </div>

    <div v-if="error" class="text-red-500 font-light">
      <span class="font-medium">
        Something went wrong.
      </span>
      {{ error }}
    </div>

    <div v-for="(match, index) of matches" :key="index" class="py-4 border-b">
      <div class="flex items-center text-gray-700">
        <Collection class="w-6 h-6 mr-4" />
        <div class="font-medium text-md">{{ roleName(match.role) }}</div>

        <div class="ml-auto">
          <button
            v-if="expanded === index"
            class="text-red-700 hover:text-red-600 hover:underline mr-4"
            @click="remove(index)"
          >
            Remove
          </button>
          <button
            v-if="expanded !== index"
            class="text-blue-700 hover:text-blue-600 hover:underline"
            @click="expanded = index"
          >
            More...
          </button>

          <button
            v-if="expanded === index"
            class="text-blue-700 hover:text-blue-600 hover:underline"
            @click="expanded = -1"
          >
            Less...
          </button>
        </div>
      </div>

      <div v-if="expanded === index" class="mt-4 px-4">
        <div class="flex items-center">
          <div class="mr-2 font-medium text-sm">Registered Users</div>

          <button @click="add(index)" class="ml-auto p-1">
            <Plus class="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div
          v-for="(detail, i) of match.details"
          :key="i"
          class="flex items-center my-2"
        >
          <User class="w-6 h-6 mr-4 text-gray-700" />

          <input
            v-model="detail.firstName"
            placeholder="John"
            class="text-sm px-2 p-1 rounded bg-gray-100 mr-2 w-32"
            @input="save(index)"
          />
          <input
            v-model="detail.lastName"
            placeholder="Appleseed"
            class="text-sm px-2 p-1  rounded bg-gray-100 mr-2 w-32"
            @input="save(index)"
          />
          <input
            v-model="detail.email"
            placeholder="example@email.com"
            class="text-sm px-2 p-1 rounded bg-gray-100 mr-2 flex-1"
            @input="save(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Icons
import Plus from 'heroicons/outline/plus.svg'
import User from 'heroicons/outline/user.svg'
import ArrowUp from 'heroicons/outline/arrow-up.svg'
import Collection from 'heroicons/outline/collection.svg'

// Components
import DiscordSelector from '@/components/DiscordSelector'

// Libraries
import axios from 'axios'

export default {
  name: 'Matches',

  components: {
    Plus,
    User,
    ArrowUp,
    Collection,

    DiscordSelector
  },

  data() {
    return {
      expanded: -1,

      selected: null,
      roles: [],

      error: null,
      matches: []
    }
  },

  async mounted() {
    await this.getMatches()

    this.roles = (await axios.get('/api/discord/roles')).data
  },

  methods: {
    async getMatches() {
      this.matches = (await axios.get('/api/match')).data
    },

    roleName(role) {
      return role.name || `Role #${role.id}`
    },

    // Not going to bother syncing this with the server, editing text fields will do that.
    add(index) {
      this.matches[index].details.push({
        firstName: '',
        lastName: '',
        email: ''
      })
    },

    async create() {
      const id = (
        await axios.post('/api/match', {
          role: this.selected.id,
          details: []
        })
      ).data

      await this.getMatches()

      this.expanded = id
      this.selected = null

      return id
    },

    async remove(index) {
      await axios.delete(`/api/match/${index}`)

      await this.getMatches()
    },

    async save(index) {
      const match = this.matches[index]

      await axios.put(`/api/match/${index}`, {
        role: match.role.id,
        details: match.details
      })
    },

    async uploadFile(input) {
      this.error = null

      const file = input.target.files[0]

      if (!file) {
        return
      }

      const index = await this.create()

      try {
        const result = (await axios.put(`/api/match/${index}/data`, file)).data

        if (result.error) {
          this.error = result.error
        } else {
          this.matches[index].details = result.details
        }
      } catch (e) {
        this.error = e.toString()
      }
    },

    openFile() {
      this.$refs.attachment.click()
    }
  }
}
</script>
