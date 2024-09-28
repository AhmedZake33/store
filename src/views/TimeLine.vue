<template>
  <app-timeline>
    <app-timeline-item
        title="Goal Achieved"
        subtitle="All milestones are completed"
        time="few minutes ago"
        variant="success"
    />

    <app-timeline-item
        title="Last milestone remain"
        subtitle="You are just one step away from your goal"
        time="3 minutes ago"
        variant="info"
    />

    <app-timeline-item
        title="Your are running low on time"
        subtitle="Only 30 minutes left to finish milestone"
        time="21 minutes ago"
        variant="warning"
    />

    <app-timeline-item
        title="Client Meeting"
        subtitle="New event has been added to your schedule"
        time="36 minutes ago"
    />

    <app-timeline-item
        title="Product Design"
        subtitle="Product design added in workflow"
        time="1 hour ago"
        variant="secondary"
    />
  </app-timeline>
</template>

<script>
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'

export default {
  components: {
    AppTimeline,
    AppTimelineItem,
  },
}
</script>
