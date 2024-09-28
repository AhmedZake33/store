<template>
  <b-overlay
    :show="refresh"
    rounded="sm"
    no-fade
  >
    <app-timeline>
      <app-timeline-item
        v-for="log in logs"
        :key="log.id"
        :variant="getColor(log.new_status)"
      >
        <div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1 mb-sm-0">
          <h6>
            <span v-if="log.new_group && log.old_group.id != log.new_group.id">
              {{ $t('ticket_group_updated_from') }}
              <b-badge
                variant="secondary"
              >
                {{ getTranslatedNameFromObject(log.old_group) }}
              </b-badge>
              &nbsp; <feather-icon :icon="$i18n.locale=='en'?'ArrowRightIcon':'ArrowLeftIcon'" class="mr-75" />
              <b-badge
                variant="primary"
              >
                {{ getTranslatedNameFromObject(log.new_group) }}
              </b-badge>
            </span>
            <span v-else-if="log.new_status && log.old_status.id != log.new_status.id">
              {{ $t('ticket_status_updated_from') }}
              <b-badge
                v-if="status = getTicketStatusBadge(log.old_status)"
                :variant="getColor(log.old_status)"
              >
                {{ status.label }}
              </b-badge>
              &nbsp; <feather-icon :icon="$i18n.locale=='en'?'ArrowRightIcon':'ArrowLeftIcon'" class="mr-75" />
              <b-badge
                v-if="status = getTicketStatusBadge(log.new_status)"
                :variant="getColor(log.new_status)"
              >
                {{ status.label }}
              </b-badge>
            </span>
            <span v-else>
              <b-badge
                v-if="status = getTicketStatusBadge(log.new_status?log.new_status:log.old_status)"
                :variant="getColor(log.new_status?log.new_status:log.old_status)"
              >
                {{ status.label }}
              </b-badge>
            </span>
          </h6>
          <small class="text-muted">{{ moment.utc(log.created_at_formatted).locale($i18n.locale).fromNow() }}</small>
        </div>
        <p v-if="log.feedback == 'Ticket Created'">{{$i18n.locale=='en'?'Ticket Created':'تم إنشاء الشكوى'}}</p>
        <p v-else-if="log.feedback == 'Ticket Opened'">{{$i18n.locale=='en'?'Ticket Opened':'جارى المعالجة'}}</p>
        <p v-else >{{ log.feedback }}</p>
        <b-media>
          <template #aside>
            <b-avatar />
          </template>
          <h6>{{ getTranslatedNameFromObject(log.user) }}</h6>
          <p class="mb-0">
            {{ getTranslatedNameFromObject(log.new_group?log.new_group:log.old_group) }}
          </p>
        </b-media>
      </app-timeline-item>
    </app-timeline>
  </b-overlay>
</template>

<script>
import {
  BImg, BMedia, BAvatar, BOverlay, BBadge,
} from 'bootstrap-vue'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import moment from 'moment';
import TicketApi from '@/api/system/ticket'

const ticketApi = new TicketApi()

export default {
  components: {
    BImg,
    BMedia,
    BAvatar,
    AppTimeline,
    AppTimelineItem,
    BOverlay,
    BBadge,
  },
  props: {
    ticketId: null,
  },
  data() {
    return {
      logs: null,
      refresh: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.refresh = true
      ticketApi.getTicketHistory(this.ticketId).then(data => {
        this.logs = data.data
        this.refresh = false
      })
    },
    formatTimer(created_at) {
        return moment.utc(created_at).fromNow();
      },
      getColor(status){
      if(status.name == "New")
      {
        return 'info'
      }
      if(status.name == "Open")
      {
        return 'secondary'
      }
      else if(status.name == "Re-Open")
      {
        return 'warning'
      }
      else if(status.name == "Postponed")
      {
        return 'danger'
      }
      else if(status.name == "Resolved")
      {
        return 'success'
      }
      else if(status.name == "Incomplete")
      {
        return 'dark'
      }
    },
  },
  
}
</script>

<style>

</style>
