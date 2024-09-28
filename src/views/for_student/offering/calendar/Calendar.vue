<template>
  <div class="app-calendar overflow-hidden border">
    <div class="row no-gutters">
      <!-- Sidebar -->
      <div
        class="col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column"
        :class="{'show': isCalendarOverlaySidebarActive}"
      >
        <calendar-sidebar :is-event-handler-sidebar-active.sync="isEventHandlerSidebarActive" />
      </div>

      <!-- Calendar -->
        <div class="col position-relative">
          <div class="card shadow-none border-0 mb-0 rounded-0">
            <div class="card-body pb-0">
              <full-calendar
                ref="refCalendar"
                :options="calendarOptions"
                class="full-calendar"
              >
                <template v-slot:eventContent="arg">
                  <div style="height: 100%" :id="arg.event.id">
                    <span class="d-block" v-if="arg.event.title">
                      {{
                        $i18n.locale == "ar" ? arg.event.title : arg.event.title
                      }}</span
                    >
                  </div>
                  <!-- <b-tooltip
                    triggers="hover click"
                    :target="arg.event.id"
                    :variant="'dark'"
                  >
                    <div class="info">
                      <p class="d-block m-0" v-if="arg.event.extendedProps">
                        {{ arg.event.extendedProps.start_time }} -
                        {{ arg.event.extendedProps.end_time }}
                      </p>
                      <span
                        class="d-block"
                        v-if="arg.event.extendedProps.group != null"
                        >{{
                          $i18n.locale == "ar"
                            ? arg.event.extendedProps.group.name_local
                            : arg.event.extendedProps.group.name
                        }}</span
                      >
                      <span
                        class="d-block"
                        v-if="arg.event.extendedProps.section != null"
                        >{{
                          $i18n.locale == "ar"
                            ? arg.event.extendedProps.section.name_local
                            : arg.event.extendedProps.section.name
                        }}</span
                      >
                      <p
                        class="d-block m-0"
                        v-if="arg.event.extendedProps.location"
                      >
                        {{
                          $i18n.locale == "ar"
                            ? "الموقع: " +
                              arg.event.extendedProps.location.name_local
                            : "Location: " +
                              arg.event.extendedProps.location.name
                        }}
                      </p>
                      <p
                        class="d-block m-0"
                        v-if="arg.event.extendedProps.courseName"
                      >
                        {{
                          $i18n.locale == "ar"
                            ? "اسم المادة: " +
                              arg.event.extendedProps.courseName
                            : "Course Name: " +
                              arg.event.extendedProps.courseName
                        }}
                      </p>
                      <p
                        class="d-block m-0"
                        v-if="arg.event.extendedProps.instructors"
                      >
                        <span>
                          {{
                            $i18n.locale == "ar"
                              ? "أعضاء هيئة التدريس: "
                              : "Instructors: "
                          }}
                        </span>
                        <span
                          class="d-block m-0"
                          v-for="instructor in arg.event.extendedProps
                            .instructors"
                          :key="instructor.id"
                        >
                          {{
                            $i18n.locale == "ar"
                              ? instructor.academic_name_local
                              : instructor.academic_name
                          }}
                        </span>
                      </p>
                    </div>
                    <div v-if="arg.event.conflicts">
                      <div v-if="arg.event.extendedProps.conflicts.location_conflicts || arg.event.extendedProps.conflicts.instructor_conflicts">
                        <div
                          v-if="
                            arg.event.extendedProps.conflicts.location_conflicts
                              .length > 0 ||
                            arg.event.extendedProps.conflicts.instructor_conflicts
                              .length > 0
                          "
                          class="conflict-info"
                        >
                          <div
                            v-if="
                              arg.event.extendedProps.conflicts.instructor_conflicts
                                .length > 0
                            "
                          >
                            <p
                              class="d-block m-0"
                              v-for="item in arg.event.extendedProps.conflicts
                                .instructor_conflicts"
                              :key="item.id"
                            >
                              {{ $i18n.locale == "ar" ? item.msg_ar : item.msg }}
                            </p>
                          </div>
                          <div
                            v-if="
                              arg.event.extendedProps.conflicts.location_conflicts
                                .length > 0
                            "
                          >
                            <p
                              class="d-block m-0"
                              v-for="item in arg.event.extendedProps.conflicts
                                .location_conflicts"
                              :key="item.id"
                            >
                              {{ $i18n.locale == "ar" ? item.msg_ar : item.msg }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </b-tooltip> -->
                </template>
              </full-calendar>
            </div>
          </div>
        </div>
      <!-- <div class="card shadow-none border-0 mb-0 rounded-0 w-75" v-else >
        <div class="card-body pb-0 ">
          <div class="row justify-content-center">
            Has No Calender 
          </div>
        </div>
      </div> -->

      <!-- Sidebar Overlay -->
      <div
        class="body-content-overlay"
        :class="{'show': isCalendarOverlaySidebarActive}"
        @click="isCalendarOverlaySidebarActive = false"
      />
      <calendar-event-handler
        v-if="handleEvents"
        v-model="isEventHandlerSidebarActive"
        :event="event"
        :clear-event-data="clearEventData"
        @remove-event="removeEvent"
        @add-event="addEvent"
        @update-event="updateEvent"
      />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import store from '@/store'
import { onUnmounted } from '@vue/composition-api'
import calendarStoreModule from './calendarStoreModule'
import CalendarSidebar from './calendar-sidebar/CalendarSidebar.vue'
import CalendarEventHandler from './calendar-event-handler/CalendarEventHandler.vue'
import useCalendar from './useCalendar'
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    CalendarSidebar,
    CalendarEventHandler,
  },
  props:{
    handleEvents: {type: Boolean}
  },
  setup() {
    
    const CALENDAR_APP_STORE_MODULE_NAME = 'calendar'

    // Register module
    if (!store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.registerModule(CALENDAR_APP_STORE_MODULE_NAME, calendarStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CALENDAR_APP_STORE_MODULE_NAME)) store.unregisterModule(CALENDAR_APP_STORE_MODULE_NAME)
    })

    const {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      fetchEvents,
      refetchEvents,
      calendarOptions,
      handleEvents,

      // ----- UI ----- //
      isEventHandlerSidebarActive,
    } = useCalendar()

    fetchEvents()

    return {
      refCalendar,
      isCalendarOverlaySidebarActive,
      event,
      clearEventData,
      addEvent,
      updateEvent,
      removeEvent,
      refetchEvents,
      calendarOptions,
      handleEvents,
      // ----- UI ----- //
      isEventHandlerSidebarActive,
    }
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/apps/calendar.scss";
.fc .fc-button-primary {
    background-color: unset !important;
    /* background-color: var(--fc-button-bg-color, #2C3E50); */
    border-color: unset !important; 
    /* border-color: var(--fc-button-border-color, #2C3E50); */
}
</style>
