// Full Calendar Plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import i18n from '@/libs/i18n';
import { Tooltip } from 'bootstrap';

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// eslint-disable-next-line object-curly-newline
import { ref, computed, watch, onMounted } from '@vue/composition-api'
import store from '@/store'

export default function userCalendar() {

  const url = window.location.href;
  const num = parseInt(url.substr(url.lastIndexOf('/') + 1))
  const routeParamsId =  isNaN(num) ? '' : num ;

  // Use toast
  const toast = useToast()
  // ------------------------------------------------
  // refCalendar
  // ------------------------------------------------
  const refCalendar = ref(null)

  // ------------------------------------------------
  // calendarApi
  // ------------------------------------------------
  let calendarApi = null
  onMounted(() => {
    calendarApi = refCalendar.value.getApi()

  })

  // ------------------------------------------------
  // calendars
  // ------------------------------------------------
  const calendarsColor = {
    Lecture: 'primary',
    Lab: 'success',
    Tutorial: 'warning',
    Clinic: 'info'
  }

  // ------------------------------------------------
  // event
  // ------------------------------------------------
  const blankEvent = {
    day: null,
    start: null,
    end: null,
    group: null,
    section: null,
    instructor: null,
    online: false ? 0 : false,
    extendedProps: {
      calendar: null,
      location: null,
    },
  }
  const event = ref(JSON.parse(JSON.stringify(blankEvent)))
  const clearEventData = () => {
    event.value = JSON.parse(JSON.stringify(blankEvent))
  }

  // *===========================================================================---*
  // *--------- Calendar API Function/Utils --------------------------------------------*
  // Template Future Update: We might move this utils function in its own file
  // *===========================================================================---*

  // ------------------------------------------------
  // (UI) addEventInCalendar
  // ? This is useless because this just add event in calendar and not in our data
  // * If we try to call it on new event then callback & try to toggle from calendar we get two events => One from UI and one from data
  // ------------------------------------------------
  // const addEventInCalendar = eventData => {
  //   toast({
  //     component: ToastificationContent,
  //     position: 'bottom-right',
  //     props: {
  //       title: 'Event Added',
  //       icon: 'CheckIcon',
  //       variant: 'success',
  //     },
  //   })
  //   calendarApi.addEvent(eventData)
  // }

  // ------------------------------------------------
  // (UI) updateEventInCalendar
  // ------------------------------------------------
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {

    toast({
      component: ToastificationContent,
      props: {
        title: `${updatedEventData.extendedProps.calendar} Updated`,
        icon: 'CheckIcon',
        variant: 'success',
      },
    })

    const existingEvent = calendarApi.getEventById(updatedEventData.id)

    // --- Set event properties except date related ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // --- Set date related props ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // --- Set event's extendedProps ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  // ------------------------------------------------
  // (UI) removeEventInCalendar
  // ------------------------------------------------
  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }

  // ------------------------------------------------
  // grabEventDataFromEventApi
  // ? It will return just event data from fullCalendar's EventApi which is not required for event mutations and other tasks
  // ! You need to update below function as per your extendedProps
  // ------------------------------------------------
  const grabEventDataFromEventApi = eventApi => {
    const {
      id,
      day,
      start,
      end,
      group,
      section,
      online,
      instructor,
      extendedProps: { calendar, location },
    } = eventApi

    return {
      id,
      day,
      start,
      end,
      group,
      section,
      online,
      instructor,
      extendedProps: {
        calendar,
        location,
      },
    }
  }

  // ------------------------------------------------
  // addEvent
  // ------------------------------------------------
  const addEvent = eventData => {
    const payload = {}
    const calendarLabel = store.state.calendar.calendarOptions.filter((el)=>{
      return el.label == eventData.extendedProps.calendar
    })
    payload.day = eventData.day
    payload.type = eventData.extendedProps.calendar
    payload.offering_id = routeParamsId
    payload.slot_from_id = eventData.start_id
    payload.num_of_slots = eventData.num_of_slots
    payload.location_id = eventData.online ? null : eventData.extendedProps.location
    payload.group_id = eventData.group
    payload.instructors = eventData.instructors ? eventData.instructors.map(el=>el.id) : null
    payload.section_id = eventData.section.id
    payload.online = eventData.online
    store.dispatch('calendars/addEvent', { query: payload }).then(() => {
      // eslint-disable-next-line no-use-before-define
      refetchEvents()
      toast({
        component: ToastificationContent,
        props: {
          title: i18n.locale == 'ar' ? `تم اضافة ${calendarLabel[0].label_local}` : `${eventData.extendedProps.calendar} Added`,
          icon: 'CheckIcon',
          variant: 'success',
        },
      })
    })
  }

  // ------------------------------------------------
  // updateEvent
  // ------------------------------------------------
  const updateEvent = eventData => {
    const payload = {}
    const calendarLabel = store.state.calendar.calendarOptions.filter((el)=>{
      return el.label == eventData.extendedProps.calendar
    })
    payload.location_id = eventData.online ? null : eventData.extendedProps.location
    payload.offering_id = routeParamsId
    payload.slot_from_id = eventData.start_id
    payload.num_of_slots = eventData.num_of_slots
    payload.day = eventData.day
    payload.start = eventData.start
    payload.group_id = eventData.group ? eventData.group.id : null
    payload.section_id = eventData.section ? eventData.section.id : null
    payload.instructors = eventData.instructors ? eventData.instructors.map(el=>el.id) : null
    payload.online = eventData.online
    payload.id = eventData.id
    payload.type = eventData.extendedProps.calendar
    store.dispatch('calendars/updateEvent', { query: payload }).then(response => {
      refetchEvents()
      toast({
        component: ToastificationContent,
        props: {
          title: i18n.locale == 'ar' ? `تم تعديل ${calendarLabel[0].label_local}` : `${eventData.extendedProps.calendar} Updated`,
          icon: 'CheckIcon',
          variant: 'success',
        },
      })
      const updatedEvent = response.data.event
      const propsToUpdate = ['id', 'day', 'group' , 'section']
      const extendedPropsToUpdate = ['calendar', 'location']
      updateEventInCalendar(updatedEvent, propsToUpdate, extendedPropsToUpdate)
    })
  }

  // ------------------------------------------------
  // removeEvent
  // ------------------------------------------------
  const removeEvent = () => {
    const eventId = event.value.id
    store.dispatch('calendars/removeEvent', { id: eventId }).then(() => {
      removeEventInCalendar(eventId)
      toast({
        component: ToastificationContent,
        props: {
          title: i18n.locale == 'ar' ? `تم الحذف بنجاح` : `Removed Successfully`,
          icon: 'CheckIcon',
          variant: 'success',
        },
      })
    })
  }

  // ------------------------------------------------
  // refetchEvents
  // ------------------------------------------------
  const refetchEvents = () => {
    calendarApi.refetchEvents()
  }

  // ------------------------------------------------
  // selectedCalendars
  // ------------------------------------------------
  const selectedCalendars = computed(() => store.state.calendar.selectedCalendars)

  watch(selectedCalendars, () => {
    refetchEvents()
  })

  // --------------------------------------------------------------------------------------------------
  // AXIOS: fetchEvents
  // * This will be called by fullCalendar to fetch events. Also this can be used to refetch events.
  // --------------------------------------------------------------------------------------------------
  const fetchEvents = (info, successCallback) => {
    // If there's no info => Don't make useless API call
    if (!info) return

    // Fetch Events from API endpoint
    store
      .dispatch('calendars/fetchEvents', { calendars: {types: selectedCalendars.value, time_type: selectedTimeType.value , date: info ? info.startStr.split('T')[0] : null} , id : routeParamsId , type: 'student'} )
      .then(response => {
        successCallback(store.getters['calendars/items'].schedules)
      })
      .catch(() => {
        // toast({
        //   component: ToastificationContent,
        //   props: {
        //     title: 'Error fetching calendar events',
        //     icon: 'AlertTriangleIcon',
        //     variant: 'danger',
        //   },
        // })
      })
  }

  // ------------------------------------------------------------------------
  // calendarOptions
  // * This isn't considered in UI because this is the core of calendar app
  // ------------------------------------------------------------------------
  const selectedTimeType = computed(() => store.state.calendars.selectedTimeType)

  watch(selectedTimeType, (newval) => {
    refetchEvents()
  })

  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'timeGridWeek',
    firstDay: -1,
    locale: i18n.locale == 'en' ? 'en' : i18n.locale,
    height: 740,
    dayHeaderFormat:{
      weekday: 'short'
    },
    // headerToolbar: {
    //   start: 'sidebarToggle',
    //   end: 'timeGridWeek,timeGridDay,listMonth',
    // },
    headerToolbar: {
      start: 'timeGridWeek,timeGridDay,listMonth',
      center: 'title',
      end: 'prev,next'
    },
    slotDuration: '01:00:00',
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    events: fetchEvents,
    slotEventOverlap: false,
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: false,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: true,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventDidMount: function(info) {
      var tooltip = new Tooltip(info.el, {
        html: true,
        title: `
          ${info.event.extendedProps?.start_time} -
          ${info.event.extendedProps?.end_time}
          ${
            info.event.extendedProps && info.event.extendedProps.group ?
            `<p class="m-0">
              ${
                i18n.locale == "ar"
                  ? info.event.extendedProps?.group.name_local
                  : info.event.extendedProps?.group.name
              }
            </p>`
            :''
          }
          ${
            info.event.extendedProps && info.event.extendedProps.section ?
            `<p class="m-0">
              ${
                i18n.locale == "ar"
                  ? info.event.extendedProps?.section.name_local
                  : info.event.extendedProps?.section.name
              }
            </p>`
            :''
          }
          ${
            info.event.extendedProps && info.event.extendedProps.location ?
            `<p class="m-0">
              ${
                i18n.locale == "ar"
                  ? "الموقع: " +
                    info.event.extendedProps?.location?.name_local
                  : "Location: " +
                    info.event.extendedProps?.location?.name
              }
            </p>`
            :''
          }
          ${ info.event.extendedProps && info.event.extendedProps.courseName ?
            `<p class="m-0">
              ${
                i18n.locale == "ar"
                  ? "اسم المادة: " +
                    info.event.extendedProps?.courseName
                  : "Course Name: " +
                  info.event.extendedProps?.courseName
              }
            </p>`
            :''
          }
          ${ 
            info.event.extendedProps && info.event.extendedProps.instructors ?
            `<p class="m-0">
              ${
                i18n.locale == "ar"
                  ? "أعضاء هيئة التدريس: "
                  : "Instructors: "
              }
            </p>
            <span
              class="d-block m-0"
            >
              ${
                Array(info.event.extendedProps.instructors.length).fill().map((item, i) => `
                  <span class="d-block">${i18n.locale == "ar" ? info.event.extendedProps.instructors[i].academic_name_local : info.event.extendedProps.instructors[i].academic_name}</span>
                `).join('')
              }
            </span>`
            :''
          }
        `,
        placement: 'top',
        trigger: 'click hover focus',
        container: 'body'
      });
    },

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`,
      ]
    },
    eventClick({ event: clickedEvent }) {
      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      isEventHandlerSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        // --- This dummy text actual icon rendering is handled using SCSS ----- //
        text: 'sidebar',
        click() {
          // eslint-disable-next-line no-use-before-define
          isCalendarOverlaySidebarActive.value = !isCalendarOverlaySidebarActive.value
        },
      },
    },

    dateClick(info) {
      /*
        ! Vue3 Change
        Using Vue.set isn't working for now so we will try to check reactivity in Vue 3 as it can handle this automatically
        ```
        event.value.start = info.date
        ```
      */
      event.value = JSON.parse(JSON.stringify(Object.assign(event.value, { start: info.date })))
      // eslint-disable-next-line no-use-before-define
      isEventHandlerSidebarActive.value = false
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      updateEvent(grabEventDataFromEventApi(droppedEvent))
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      updateEvent(grabEventDataFromEventApi(resizedEvent))
    },

    // Get direction from app state (store)
    direction: computed(() => (store.state.appConfig.isRTL ? 'rtl' : 'ltr')),
    rerenderDelay: 350,
  })

  // ------------------------------------------------------------------------

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const isEventHandlerSidebarActive = ref(false)

  const isCalendarOverlaySidebarActive = ref(false)

  return {
    refCalendar,
    isCalendarOverlaySidebarActive,
    calendarOptions,
    event,
    clearEventData,
    addEvent,
    updateEvent,
    removeEvent,
    refetchEvents,
    fetchEvents,
    selectedTimeType,
    // ----- UI ----- //
    isEventHandlerSidebarActive,
  }
}
