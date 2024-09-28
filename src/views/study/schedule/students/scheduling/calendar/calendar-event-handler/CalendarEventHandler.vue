<template>
  <div>
    <b-sidebar
      id="sidebar-add-new-event"
      sidebar-class="sidebar-lg"
      :visible="isEventHandlerSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-event-handler-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <!-- Header -->
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">
            {{
              eventLocal.id
                ? $i18n.locale == "ar"
                  ? "تعديل النشاط"
                  : "Update Activity"
                : $i18n.locale == "ar"
                ? "اضافة نشاط"
                : "Add Activity"
            }}
          </h5>
          <div>
            <feather-icon
              v-if="eventLocal.id"
              icon="Trash2Icon"
              class="cursor-pointer"
              @click="
                $emit('remove-event');
                hide();
              "
            />
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>

        <!-- Body -->
        <validation-observer #default="{ handleSubmit }" ref="refFormObserver">
          <!-- Form -->
          <b-form
            class="p-2"
            @submit.prevent="handleSubmit(onSubmit)"
            @reset.prevent="resetForm"
          >
            <!-- Title -->
            <!-- <validation-provider
              #default="validationContext"
              name="Title"
              rules="required"
            >
              <b-form-group
                label="Title"
                label-for="event-title"
              >
                <b-form-input
                  id="event-title"
                  v-model="eventLocal.title"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Event Title"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider> -->

            <!-- Calendar -->
            <validation-provider
              #default="validationContext"
              name="Calendar"
              rules="required"
            >
              <b-form-group
                label="Type"
                label-for="calendar"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="eventLocal.extendedProps.calendar"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="calendarOptions"
                  label="label"
                  :reduce="(calendar) => calendar.label"
                  input-id="calendar"
                >
                  <template #option="{ color, label }">
                    <div
                      class="rounded-circle d-inline-block mr-50"
                      :class="`bg-${color}`"
                      style="height: 10px; width: 10px"
                    />
                    <span> {{ label }}</span>
                  </template>

                  <template #selected-option="{ color, label }">
                    <div
                      class="rounded-circle d-inline-block mr-50"
                      :class="`bg-${color}`"
                      style="height: 10px; width: 10px"
                    />
                    <span> {{ label }}</span>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل التقويم مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Groups -->
            <validation-provider
              #default="validationContext"
              name="Groups"
              rules="required"
              v-if="eventLocal.extendedProps.calendar == 'Lecture'"
            >
              <b-form-group label="Groups" label-for="groups">
                <v-select
                  v-model="eventLocal.group"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.groups"
                  label="label"
                  input-id="groups"
                >
                  <template slot="option" slot-scope="option">
                    {{ $i18n.locale == "en" ? option.name : option.name_local }}
                  </template>
                  <template #selected-option="{ name, name_local }">
                    <div v-if="$i18n.locale == 'ar'">{{ name_local }}</div>
                    <div v-else>{{ name }}</div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل المجموعات مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Sections -->
            <validation-provider
              #default="validationContext"
              name="Sections"
              rules="required"
              v-else
            >
              <b-form-group
                :label="$i18n.locale == 'ar' ? 'الاقسام' : 'Sections'"
                label-for="sections"
              >
                <v-select
                  v-if="lookups"
                  v-model="eventLocal.section"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.sections"
                  label="label"
                  input-id="sections"
                >
                  <template slot="option" slot-scope="option">
                    {{ $i18n.locale == "en" ? option.name : option.name_local }}
                  </template>
                  <template #selected-option="{ name, name_local }">
                    <div v-if="$i18n.locale == 'ar'">{{ name_local }}</div>
                    <div v-else>{{ name }}</div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل الاقسام مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Days -->
            <validation-provider
              #default="validationContext"
              name="Days"
              rules="required"
            >
              <b-form-group label="Day" label-for="days">
                <v-select
                  v-model="eventLocal.day"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="days"
                  :reduce="(val) => val"
                  label="label"
                  input-id="days"
                >
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل الايام مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Start Date -->
            <validation-provider
              #default="validationContext"
              name="Start Date"
              rules="required"
            >
              <b-form-group
                label="Start"
                label-for="start"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="eventLocal.start_id"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.slots"
                  label="label"
                  :reduce="(val) => val.id"
                  input-id="start"
                >
                  <template slot="option" slot-scope="option">
                    {{
                      $i18n.locale == "en"
                        ? option.regular_time_start
                        : option.regular_time_start
                    }}
                  </template>
                  <template #selected-option="{ regular_time_start }">
                    <div style="display: flex; align-items: baseline">
                      <div v-if="$i18n.locale == 'ar'">
                        {{ regular_time_start }}
                      </div>
                      <div v-else>{{ regular_time_start }}</div>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل تاريخ البداية مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- End Date -->
            <validation-provider
              #default="validationContext"
              name="End"
              rules="required"
            >
              <b-form-group
                label="End"
                label-for="end-date"
                :state="getValidationState(validationContext)"
              >
                <v-select
                  v-model="eventLocal.num_of_slots"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.slots"
                  label="label"
                  :reduce="(val) => val.id"
                  input-id="end"
                >
                  <template slot="option" slot-scope="option">
                    {{
                      $i18n.locale == "en"
                        ? option.regular_time_end
                        : option.regular_time_end
                    }}
                  </template>
                  <template #selected-option="{ regular_time_end }">
                    <div style="display: flex; align-items: baseline">
                      <div v-if="$i18n.locale == 'ar'">
                        {{ regular_time_end }}
                      </div>
                      <div v-else>{{ regular_time_end }}</div>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل تاريخ الانتهاء مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Instructors -->
            <!-- <validation-provider
              #default="validationContext"
              name="instructors"
              rules="required"
            > -->
            <b-form-group
              :label="$t('Global.instructors')"
              label-for="instructors"
            >
              <v-select
                v-if="lookups"
                v-model="eventLocal.instructors"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.instructors"
                multiple
                :reduce="(val) => val"
                label="label"
                input-id="instructor"
              >
                <template slot="option" slot-scope="option">
                  {{ $i18n.locale == "en" ? option.name : option.name_local }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div v-if="$i18n.locale == 'ar'">{{ name_local }}</div>
                  <div v-else>{{ name }}</div>
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
              <!-- <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback> -->
            </b-form-group>
            <!-- </validation-provider> -->

            <!-- Online -->
            <b-form-group label-for="online" class="mt-2">
              <b-form-checkbox v-model="eventLocal.online" value="1" plain>
                {{ $i18n.locale == "ar" ? "عن بعد" : "Online" }}
              </b-form-checkbox>
            </b-form-group>

            <!-- Location -->
            <validation-provider
              #default="validationContext"
              name="location"
              rules="required"
              v-if="!eventLocal.online"
            >
              <b-form-group
                :label="$i18n.locale == 'ar' ? 'الموقع' : 'Location'"
                label-for="location"
              >
                <v-select
                  v-if="lookups"
                  :filter="locationSearch"
                  v-model="eventLocal.extendedProps.location"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.locations"
                  label="label"
                  :reduce="(val) => val.id"
                  :disabled="eventLocal.online == 1"
                  input-id="location"
                >
                  <template slot="option" slot-scope="option">
                    {{
                      $i18n.locale == "en"
                        ? option.name 
                        : option.name_local 
                    }}
                  </template>
                  <template #selected-option="{ name }">
                    <div style="display: flex; align-items: baseline">
                      <div v-if="$i18n.locale == 'ar'">
                        {{ name }}
                      </div>
                      <div v-else>{{ name }}</div>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل الموقع مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Form Actions -->
            <div class="d-flex mt-5">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
              >
                {{
                  eventLocal.id
                    ? $i18n.locale == "ar"
                      ? "تعديل"
                      : "Update"
                    : $i18n.locale == "ar"
                    ? "اضافة"
                    : "Add"
                }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                {{ $i18n.locale == "ar" ? "إعادة ضبط" : "Reset" }}
              </b-button>
            </div>
          </b-form>
        </validation-observer>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar,
  BForm,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BAvatar,
  BFormTextarea,
  BButton,
  BFormInvalidFeedback,
} from "bootstrap-vue";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email, url } from "@validations";
import formValidation from "@core/comp-functions/forms/form-validation";
import { ref, toRefs } from "@vue/composition-api";
import useCalendarEventHandler from "./useCalendarEventHandler";

export default {
  components: {
    BButton,
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BFormTextarea,
    BAvatar,
    vSelect,
    flatPickr,
    ValidationProvider,
    BFormInvalidFeedback,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: "isEventHandlerSidebarActive",
    event: "update:is-event-handler-sidebar-active",
  },
  props: {
    isEventHandlerSidebarActive: {
      type: Boolean,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
    clearEventData: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      required,
      email,
      url,
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
  },
  setup(props, { emit }) {
    /*
     ? This is handled quite differently in SFC due to deadlock of `useFormValidation` and this composition function.
     ? If we don't handle it the way it is being handled then either of two composition function used by this SFC get undefined as one of it's argument.
     * The Trick:

     * We created reactive property `clearFormData` and set to null so we can get `resetEventLocal` from `useCalendarEventHandler` composition function.
     * Once we get `resetEventLocal` function which is required by `useFormValidation` we will pass it to `useFormValidation` and in return we will get `clearForm` function which shall be original value of `clearFormData`.
     * Later we just assign `clearForm` to `clearFormData` and can resolve the deadlock. 😎

     ? Behind The Scene
     ? When we passed it to `useCalendarEventHandler` for first time it will be null but right after it we are getting correct value (which is `clearForm`) and assigning that correct value.
     ? As `clearFormData` is reactive it is being changed from `null` to corrent value and thanks to reactivity it is also update in `useCalendarEventHandler` composition function and it is getting correct value in second time and can work w/o any issues.
    */
    const clearFormData = ref(null);

    const {
      eventLocal,
      resetEventLocal,
      calendarOptions,
      lookups,
      // UI
      onSubmit,
      guestsOptions,
    } = useCalendarEventHandler(toRefs(props), clearFormData, emit);

    const { refFormObserver, getValidationState, resetForm, clearForm } =
      formValidation(resetEventLocal, props.clearEventData);

    clearFormData.value = clearForm;

    return {
      // Add New Event
      eventLocal,
      calendarOptions,
      onSubmit,
      guestsOptions,
      lookups,

      // Form Validation
      resetForm,
      refFormObserver,
      getValidationState,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
