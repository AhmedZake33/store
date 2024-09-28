<template>
  <b-card class="text-center">
    <b-avatar
      class="mb-1"
      :variant="`light-${color}`"
      size="45"
    >
      <feather-icon
        size="21"
        :icon="icon"
      />
    </b-avatar>
    <div class="truncate">
      <h2 v-if="!small" class="mb-25 font-weight-bolder">
        {{ statistic }}
      </h2>
      <strong v-if="small" class=" d-block mb-25 font-weight-bolder">
        {{ statistic }}
      </strong>
      <span>{{ statisticTitle }}</span>
    </div>
  </b-card>
</template>

<script>
import { BCard, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BAvatar,
  },
  props: {
    small:Boolean,
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
}
</script>
