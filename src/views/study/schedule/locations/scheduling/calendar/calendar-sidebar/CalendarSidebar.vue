<template>
  <div
    class="
      sidebar-wrapper
      d-flex
      justify-content-between
      flex-column flex-grow-1
    "
  >
    <div class="p-2">
      <!-- <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        aria-controls="sidebar-add-new-event"
        :aria-expanded="String(isEventHandlerSidebarActive)"
        variant="primary"
        block
        @click="$emit('update:isEventHandlerSidebarActive', true)"
      >
        Add Activity
      </b-button> -->
      <div class="mt-3">
        <h5 class="app-label section-label mb-1">
          <span class="align-middle">{{
            $i18n.locale == "ar" ? "التقويمات" : "Schedules"
          }}</span>
        </h5>
        <b-form-checkbox v-model="checkAll" class="mb-1">
          {{ $i18n.locale == "en" ? "View All" : "عرض الكل" }}
        </b-form-checkbox>
        <b-form-group>
          <b-form-checkbox-group
            v-model="selectedCalendars"
            name="event-filter"
            stacked
          >
            <b-form-checkbox
              v-for="item in calendarOptions"
              :key="item.label"
              name="event-filter"
              :value="item.label"
              class="mb-1"
              :class="`custom-control-${item.color}`"
            >
              {{ $i18n.locale == "en" ? item.label : item.label_local }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </div>
      <div class="mt-3">
        <h5 class="app-label section-label mb-1">
          <span class="align-middle">{{
            $i18n.locale == "ar" ? "نوع الأوقات" : "Times Type"
          }}</span>
        </h5>
        <b-form-group class="cursor-pointer">
          <b-form-radio
            v-model="selectedTimeType"
            name="some-radios"
            class="cursor-pointer"
            value="regular_time"
            >{{
              $i18n.locale == "en" ? "Regular Time" : "الأوقات المعتادة"
            }}</b-form-radio
          >
          <b-form-radio
            v-model="selectedTimeType"
            name="some-radios"
            class="cursor-pointer"
            value="ramadan_time"
            >{{
              $i18n.locale == "en" ? "Ramadan Time" : "أوقات رمضان"
            }}</b-form-radio
          >
        </b-form-group>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BFormGroup,
  BFormCheckboxGroup,
  BFormCheckbox,
  BImg,
  BFormRadio,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import useCalendarSidebar from "./useCalendarSidebar";

export default {
  directives: {
    Ripple,
  },
  components: {
    BButton,
    BImg,
    BFormCheckbox,
    BFormGroup,
    BFormCheckboxGroup,
    BFormRadio,
  },
  props: {
    isEventHandlerSidebarActive: {
      type: Boolean,
      require: true,
    },
  },
  setup() {
    const { calendarOptions, selectedCalendars, selectedTimeType, checkAll } =
      useCalendarSidebar();

    return {
      calendarOptions,
      selectedCalendars,
      selectedTimeType,
      checkAll,
    };
  },
};
</script>

<style>
</style>
