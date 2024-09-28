<template>
  <b-card no-body >
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h2 class="mb-25 font-weight-bolder">
          {{ statistic }}
          <span 
            style="font-size:18px" 
            class="pb-2 font-weight-bold" 
            v-if="count || count == 0"
          >
            {{ `(${count})` }}
          </span>
        </h2>
        <span class="d-block">{{ statisticTitle }}</span>
      </div>
      <b-avatar
        :variant="`light-${color}`"
        size="40"
      >
        <feather-icon
          size="15"
          :icon="icon"
          v-if="!egpIcon"
        />
        <span style="font-size:18px" v-if="egpIcon">
          E£
        </span>
      </b-avatar>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
  },
  props: {
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
    egpIcon: {
      type: Boolean,
      default: false,
    },
    count: {
      type: String,
      default: null,
    },
  },
}
</script>
