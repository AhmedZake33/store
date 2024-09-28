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
                  ? "تعديل ساعات العمل"
                  : "Update Office Houres"
                : $i18n.locale == "ar"
                ? "ساعات العمل"
                : "Office Houres"
            }}
          </h5>
          <div >
            <feather-icon
              v-if="eventLocal.id && (hasPermission('edit_officeHours'))"
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
            <!-- Location -->
            <b-form-group
              :label="$i18n.locale == 'ar' ? 'الموقع' : 'Location'"
              label-for="event-location"
            >
              <v-select
                v-model="eventLocal.extendedProps.location"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.locations"
                label="label"
                :reduce="(val) => val.id"
                input-id="end"
              >
                <template slot="option" slot-scope="option">
                  {{
                    $i18n.locale == "en"
                      ? option.name 
                      : option.name_local 
                  }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <div v-if="$i18n.locale == 'ar'">{{ name_local }}</div>
                    <div v-else>{{ name }}</div>
                  </div>
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-form-group>

            <!-- Day -->
            <validation-provider
              #default="validationContext"
              name="days"
              rules="required"
            >
              <b-form-group
                :label="$i18n.locale == 'ar' ? 'اليوم' : 'Day'"
                label-for="days"
              >
                <v-select
                  v-model="eventLocal.extendedProps.day"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="days"
                  :reduce="(days) => days.label"
                  label="label"
                  input-id="days"
                >
                  <template #option="{ label, label_local }">
                    <div
                      class="rounded-circle d-inline-block"
                      style="height: 10px; width: 10px"
                    />
                    <span>
                      {{ $i18n.locale == "ar" ? label_local : label }}</span
                    >
                  </template>

                  <template #selected-option="{ label, label_local }">
                    <div class="rounded-circle d-inline-block" />
                    <span>
                      {{ $i18n.locale == "ar" ? label_local : label }}</span
                    >
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
                      ? "حقل اليوم مطلوب"
                      : validationContext.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </validation-provider>

            <!-- Start Date -->
            <validation-provider
              #default="validationContext"
              name="start date"
              rules="required"
            >
              <b-form-group
                :label="$t('Global.start')"
                label-for="start"
                :state="getValidationState(validationContext)"
              >
                <flat-pickr
                  v-model="eventLocal.start"
                  class="form-control"
                  :config="{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                  }"
                />
                <b-form-invalid-feedback
                  :state="getValidationState(validationContext)"
                >
                  {{
                    $i18n.locale == "ar"
                      ? "حقل تاريخ البدء مطلوب"
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
                :label="$t('Global.end')"
                label-for="end-date"
                :state="getValidationState(validationContext)"
              >
                <flat-pickr
                  v-model="eventLocal.end"
                  class="form-control"
                  :config="{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: 'H:i',
                  }"
                />
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

            <!-- Form Actions -->
            <div class="d-flex mt-5" v-if="hasPermission('edit_officeHours')">
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
        { label: "Sunday", label_local: "الأحد" },
        { label: "Monday", label_local: "الأثنين" },
        { label: "Tuesday", label_local: "الثلاثاء" },
        { label: "Wednesday", label_local: "الأربعاء" },
        { label: "Thursday", label_local: "الخميس" },
        { label: "Friday", label_local: "الجمعة" },
        { label: "Saturday", label_local: "السبت" },
      ],
    };
  },
  mounted(){
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
