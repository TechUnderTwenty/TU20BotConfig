<template>
  <div class="max-w-4xl mx-auto px-4 mb-32">
    <div class="text-2xl font-bold block mb-1">
      Factory Channels
    </div>

    <div class="flex mb-3">
      <DiscordSelector
        :options="channels"
        v-model="selected"
        class="w-full max-w-sm"
        icon="audio"
      />

      <button
        class="bg-blue-500 text-sm text-white transition-colors duration-150 hover:bg-blue-600 rounded px-4 py-2 flex items-center ml-auto"
        :class="{ 'cursor-not-allowed opacity-50': !selected }"
        @click="makeFactory"
      >
        <ArrowRight class="w-4 h-4 mr-2" />
        Convert
      </button>
    </div>
    <div
      v-for="(factory, index) of factories"
      :key="index"
      class="py-4 border-b"
    >
      <div class="flex items-center text-gray-700">
        <VolumeUp class="w-6 h-6 mr-4" />
        <div class="font-medium text-md">{{ factory.channelName }}</div>

        <div class="ml-auto">
          <button
            v-if="expanded === index"
            class="text-red-700 hover:text-red-600 hover:underline mr-4"
            @click="remove(factory)"
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

      <div v-if="expanded === index" class="mt-2 text-sm px-4">
        <div class="flex items-center mb-2">
          <label for="name" class="mr-2 font-medium">
            Sub Channel Name:
          </label>
          <input
            id="name"
            type="text"
            v-model="factory.name"
            class="border bg-gray-100 rounded px-2 py-1"
            @input="save(factory)"
          />
        </div>

        <div class="flex items-center mb-2">
          <label for="max-channels" class="mr-2 font-medium">
            Max Channels:
          </label>
          <input
            id="max-channels"
            type="number"
            v-model="factory.maxChannels"
            class="border bg-gray-100 rounded px-2 py-1 w-24"
            @input="save(factory)"
          />
        </div>

        <div class="font-semibold">
          Sub Channels
        </div>

        <div
          v-for="(channel, index) of factory.channels"
          :key="index"
          class="flex items-center text-gray-700 my-1 pl-4"
        >
          <ArrowDown class="w-4 h-4 mr-2" />
          <div class="text-sm">
            {{ channel.name }}
          </div>
        </div>
        <button
          v-if="factory.channels.length"
          class="text-red-700 font-bold"
          @click="clean(factory)"
        >
          Clean All
        </button>
        <div v-else>
          No active channels.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Icons
import VolumeUp from 'heroicons/outline/volume-up.svg'
import ArrowDown from 'heroicons/outline/arrow-down.svg'
import ArrowRight from 'heroicons/outline/arrow-right.svg'

// Components
import DiscordSelector from '@/components/DiscordSelector'

// Libraries
import axios from 'axios'

export default {
  name: 'Factories',

  components: { VolumeUp, ArrowDown, ArrowRight, DiscordSelector },

  data() {
    return {
      factories: [],

      selected: null,
      channels: [],

      expanded: -1
    }
  },

  async mounted() {
    await this.getFactories()
  },

  methods: {
    async getFactories() {
      this.factories = (await axios.get('/api/factory')).data

      this.channels = (
        await axios.get('/api/discord/channels', { params: { type: 'audio' } })
      ).data.filter(x => !this.factories.some(y => y.id === x.id))
    },

    async makeFactory() {
      if (!this.selected) {
        return
      }

      await axios.post(`/api/factory/${this.selected.id}`)

      this.selected = null

      await this.getFactories()
    },

    async save(factory) {
      await axios.put(`/api/factory/${factory.id}`, {
        name: factory.name,
        maxChannels: factory.maxChannels
      })
    },

    async clean(factory) {
      await axios.put(`/api/factory/${factory.id}/clean`)

      factory.channels = []
    },

    async remove(factory) {
      await axios.delete(`/api/factory/${factory.id}`)

      this.factories = this.factories.filter(x => x.id !== factory.id)

      this.expanded = -1
    }
  }
}
</script>
