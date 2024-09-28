<template>
  <div>
    <statistics
      :items="item"
      :only="['students_count', 'offerings_count']"
    ></statistics>
    <b-card class="mb-0">
      <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <Edit
            v-if="edit"
            @hide="edit = false"
            :inline="true"
            @refresh="init"
          ></Edit>
          <div v-if="item && !edit">
            <ShowComponent
              :data="item"
              :only="[
                'name',
                'name_local',
                'id',
                'code',
                'year',
                'type',
                'current_admission',
                'current',
                'start_date',
                'end_date',
              ]"
              :loading="load"
            >
              <template #id="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                  {{ $t(`Global.name_local`) }}
                </th>
                <td class="d-flex flex-wrap" v-if="$i18n.locale == 'en'">
                  {{ data.name_local }}
                </td>

                <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">
                  الاسم بالانجليزية
                </th>
                <td class="d-flex flex-wrap" v-if="$i18n.locale == 'ar'">
                  {{ data.name }}
                </td>
              </template>

              <template #type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.type`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{
                    $i18n.locale == "en" ? data.type.name : data.type.name_local
                  }}
                </td>
              </template>

              <template #name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.name }}
                </td>
              </template>

              <template #start_date="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.start_date`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.start_date || "-" }}
                </td>
              </template>

              <template #end_date="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.end_date`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.end_date || "-" }}
                </td>
              </template>

              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.name_local }}
                </td>
              </template>
              <template #current_admission="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.current_admission`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div>
                    <span>
                      {{
                        $i18n.locale == "ar"
                          ? data.current_admission.name_local
                          : data.current_admission.name
                      }}
                    </span>
                  </div>
                </td>
              </template>
              <template #current="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.current`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div>
                    <span>
                      {{
                        $i18n.locale == "ar"
                          ? data.current.name_local
                          : data.current.name
                      }}
                    </span>
                  </div>
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <feather-icon
                    v-if="hasPermission('edit_term')"
                    @click="edit = true"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    v-b-tooltip.hover="$t('Global.edit')"
                  />
                </div>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="FileTextIcon" />
            <span>{{ $t("Global.offerings") }}</span></template
          >
          <Offerings :term_id="id"></Offerings>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="UserIcon" />
            <span>{{ $t("Global.students") }}</span></template
          >
          <Students noStatus :term_id="id"></Students>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="SettingsIcon" />
            <span>{{ $t("Enrollment Settings") }}</span></template
          >
          <TabTable
            no-details
            :table="4"
            class="mt-2"
            :loading="load"
            :title="$t('Enrollment Settings')"
            :fields="fields"
            add
            :items="settings"
            @add="updateEnrollmentSettings"
            @update="updateEnrollmentSettings"
            settings
            @remove="remove"
          >
          </TabTable>

          <b-modal
            id="modalPopover"
            v-model="dialog"
            no-close-on-backdrop
            size="lg"
            :title="$t('Enrollment Settings')"
          >
            <validation-observer ref="ruleForm">
              <b-form :class="load ? 'disabled_all' : ''">
                <div class="row">
                  <b-col md="6">
                    <b-form-group
                      :label="$t('Global.faculty')"
                      label-for="code-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="faculty_id"
                        rules=""
                      >
                        <v-select
                          v-if="lookups"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          v-model="ruleForm.faculty_id"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="lookups.faculties"
                          :clearable="true"
                          input-id="code-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{
                              $i18n.locale == "ar"
                                ? option.name_local
                                : option.name
                            }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <span v-if="$i18n.locale == 'ar'">{{
                                name_local
                              }}</span>
                              <span v-else>{{ name }}</span>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('Global.bylaw')"
                      label-for="bylaw-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="bylaw_id"
                        rules=""
                      >
                        <v-select
                          v-if="lookups"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          v-model="ruleForm.bylaw_id"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="lookups.bylaws"
                          input-id="bylaw-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{
                              $i18n.locale == "ar"
                                ? option.name_local
                                : option.name
                            }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong v-if="$i18n.locale == 'ar'">{{
                                name_local
                              }}</strong>
                              <strong v-else>{{ name }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <!--                  <b-col md="6">
                    <b-form-group :label="$t('Global.min_gpa')" label-for="min_gpa-input" invalid-feedback="Min GPA Must Between (1,4)">
                      <validation-provider #default="{ errors }" name="min_gpa" rules="">
                        <b-form-input id="name-input" v-model="ruleForm.min_gpa" :state="errors.length > 0 ? false : null" @keypress="writeNumber($event)" />
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>-->

                  <b-col md="12">
                    <hr />
                    <p>{{ $t("Registration") }}</p>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('From')"
                      label-for="registration-from-input"
                      :state="startDateState"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="registration_date_from"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="registration-from-input"
                          v-model="ruleForm.registration_date_from"
                          class="mb-1"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('To')"
                      label-for="registration-to-input"
                      :state="endDateState"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="registration_date_to"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="registration-to-input"
                          v-model="ruleForm.registration_date_to"
                          class="mb-1"
                          :state="errors.length > 0 ? false : null"
                          :disabled="!ruleForm.registration_date_from"
                          :min="ruleForm.registration_date_from"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="12">
                    <hr />
                    <p>{{ $t("Add Drop") }}</p>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('From')"
                      label-for="adddrop-from-input"
                      invalid-feedback="date is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="adddrop_date_from"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="adddrop-from-input"
                          v-model="ruleForm.adddrop_date_from"
                          class="mb-1"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('To')"
                      label-for="adddrop-to-input"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="adddrop_date_to"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="adddrop-to-input"
                          v-model="ruleForm.adddrop_date_to"
                          class="mb-1"
                          :disabled="!ruleForm.adddrop_date_from"
                          :min="ruleForm.adddrop_date_from"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="12">
                    <hr />
                    <p>{{ $t("Withdraw") }}</p>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('From')"
                      label-for="withdraw-from-input"
                      invalid-feedback="date is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="withdraw_date_From"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="withdraw-from-input"
                          v-model="ruleForm.withdraw_date_from"
                          class="mb-1"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('To')"
                      label-for="withdraw-to-input"
                      invalid-feedback="date is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="withdraw_date_to"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="withdraw-to-input"
                          v-model="ruleForm.withdraw_date_to"
                          class="mb-1"
                          :disabled="!ruleForm.withdraw_date_from"
                          :min="ruleForm.withdraw_date_from"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="12">
                    <hr />
                    <p>{{ $t("Drop") }}</p>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      :label="$t('From')"
                      label-for="drop-from-input"
                      invalid-feedback="date is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="drop_date_from"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="drop-from-input"
                          v-model="ruleForm.drop_date_from"
                          class="mb-1"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group :label="$t('To')" label-for="drop-to-input">
                      <validation-provider
                        #default="{ errors }"
                        name="drop_date_to"
                        rules="required"
                      >
                        <b-form-datepicker
                          id="drop-to-input"
                          v-model="ruleForm.drop_date_to"
                          class="mb-1"
                          :disabled="!ruleForm.drop_date_from"
                          :min="ruleForm.drop_date_from"
                          v-bind="labels[locale] || {}"
                          :locale="locale"
                          :start-weekday="weekday"
                          :show-decade-nav="showDecadeNav"
                          :hide-header="hideHeader"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </div>
              </b-form>
            </validation-observer>
            <template #modal-footer>
              <b-row :class="load ? 'disabled_all' : ''">
                <b-col md="12">
                  <b-button
                    type="submit"
                    variant="primary"
                    class="mr-1"
                    @click="submit"
                  >
                    {{ $t("Global.save") }}
                  </b-button>
                  <b-button
                    type="reset"
                    variant="outline-secondary"
                    @click="dialog = false"
                  >
                    {{ $t("Global.cancel") }}
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </b-modal>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
  <!--  <b-row>-->
  <!--    <b-col cols="12">-->
  <!--      <list :title="item.name" edit :data="item" :except="['name', 'id', 'removed', 'parent_id', 'alt_name', 'type']">-->
  <!--        <template #edit>-->
  <!--          <div class="mt-0">-->
  <!--            <b-button v-b-tooltip.hover title="Edit" style="width: 100px" to="" variant="primary"> Edit </b-button>-->
  <!--          </div>-->
  <!--        </template>-->
  <!--      </list>-->
  <!--    </b-col>-->
  <!--    <b-col cols="12" class="mt-3">-->
  <!--      <Offerings :term_id="id" :title="$t('offerings')"></Offerings>-->
  <!--    </b-col>-->
  <!--  </b-row>-->
</template>

<script>
import List from "@/views/components/info/list";
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BCol,
  BRow,
  BTab,
  BTabs,
  BButton,
  BModal,
  BForm,
  BFormGroup,
  BInputGroup,
  BFormDatepicker,
  BFormInput,
} from "bootstrap-vue";
import Offerings from "@/views/study/offerings/components/offerings";
import Students from "@/views/students/student/components/students";
import Edit from "@/views/study/terms/edit";
import Statistics from "@/views/components/info/statistics";
import TabTable from "@/views/students/student/components/TabTable";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import vSelect from "vue-select";
import ShowComponent from "@/views/components/info/show";
export default {
  name: "show",
  components: {
    Edit,
    ShowComponent,
    Statistics,
    Students,
    Offerings,
    List,
    BCard,
    BCol,
    BRow,
    BTab,
    BTabs,
    BButton,
    TabTable,
    BModal,
    ValidationProvider,
    ValidationObserver,
    localize,
    BForm,
    BFormGroup,
    BInputGroup,
    vSelect,
    BFormDatepicker,
    BFormInput,
  },
  computed: {
    ...mapGetters({
      item: "terms/item",
      load: "terms/load",
      settings: "settings/items",
      lookups: "app/lookups",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    locale() {
      return this.$i18n.locale == "ar" ? "ar-EG" : "en-US";
    },

    fields() {
      return [
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
          thStyle: { width: "10%" },
        },
        {
          key: "bylaw",
          label: this.$t("Global.bylaw"),
        },
        {
          key: "registration",
          label: this.$t("Global.registration"),
        },
        {
          key: "add_drop",
          label: this.$t("Global.Add_drop"),
        },
        {
          key: "withdraw",
          label: this.$t("Global.withdraw"),
        },
        {
          key: "drop",
          label: this.$t("Global.drop"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
  },
  data() {
    return {
      edit: false,
      ruleForm: {
        // min_gpa: null,
        registration_date_from: null,
        registration_date_to: null,
        adddrop_date_from: null,
        adddrop_date_to: null,
        withdraw_date_from: null,
        withdraw_date_to: null,
        drop_date_from: null,
        drop_date_to: null,
        faculty_id: null,
        bylaw_id: null,
      },
      dialog: false,
      settings_id: null,
      endDateState: null,
      startDateState: null,
      value: "",
      showDecadeNav: false,
      hideHeader: false,
      locales: [
        { value: "en-US", text: "English US (en-US)" },
        { value: "ar-EG", text: "Arabic Egyptian (ar-EG)" },
      ],
      weekday: 0,
      weekdays: [
        { value: 0, text: "Sunday" },
        { value: 1, text: "Monday" },
        { value: 6, text: "Saturday" },
      ],
      labels: {
        "ar-EG": {
          labelPrevDecade: "العقد السابق",
          labelPrevYear: "العام السابق",
          labelPrevMonth: "الشهر السابق",
          labelCurrentMonth: "الشهر الحالي",
          labelNextMonth: "الشهر المقبل",
          labelNextYear: "العام المقبل",
          labelNextDecade: "العقد القادم",
          labelToday: "اليوم",
          labelSelected: "التاريخ المحدد",
          labelNoDateSelected: "لم يتم اختيار تاريخ",
          labelCalendar: "التقويم",
          labelNav: "الملاحة التقويم",
          labelHelp: "استخدم مفاتيح المؤشر للتنقل في التواريخ",
        },
      },
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    "ruleForm.faculty_id": function (val) {
      this.getLookups({
        faculty_id: val,
        faculties: true,
        bylaws: true,
      });
    },
  },
  methods: {
    init() {
      this.getLookups({
        faculty_id: this.ruleForm.faculty_id,
        faculties: true,
        bylaws: true,
      }).then((_) => {
        if (this.id) {
          this.$store.dispatch("terms/get", this.id).then((_) => {});
        }
      });
      let payload = {
        query: {
          term_id: this.id,
          name: "ENROLLMENT_SETTINGS",
          no_lookup: false,
        },
      };
      this.getSetting(payload);
    },
    ...mapActions({
      getSetting: "settings/settings",
      getLookups: "app/GET_LOOKUPS",
      addSetting: "settings/enrollmentSetting",
      removeSetting: "settings/remove",
    }),
    updateEnrollmentSettings(data) {
      if (data) {
        this.ruleForm.faculty_id = data.faculty ? data.faculty.id : null;
        this.ruleForm.bylaw_id = data.bylaw ? data.bylaw.id : null;
        this.ruleForm.term_id = this.id;
        this.ruleForm.registration_date_from =
          data.value.registration_date_from;
        this.ruleForm.registration_date_to = data.value.registration_date_to;
        this.ruleForm.withdraw_date_from = data.value.withdraw_date_from;
        this.ruleForm.withdraw_date_to = data.value.withdraw_date_to;
        this.ruleForm.adddrop_date_from = data.value.adddrop_date_from;
        this.ruleForm.adddrop_date_to = data.value.adddrop_date_to;
        this.ruleForm.drop_date_from = data.value.drop_date_from;
        this.ruleForm.drop_date_to = data.value.drop_date_to;
        // this.ruleForm.min_gpa = data.value.min_gpa;
        this.ruleForm.name = data.name;
        this.settings_id = data.id;
      } else {
        this.ruleForm.faculty_id = null;
        this.ruleForm.bylaw_id = null;
        this.ruleForm.term_id = this.id;
        this.ruleForm.registration_date_from = null;
        this.ruleForm.registration_date_to = null;
        this.ruleForm.withdraw_date_from = null;
        this.ruleForm.withdraw_date_to = null;
        this.ruleForm.adddrop_date_from = null;
        this.ruleForm.adddrop_date_to = null;
        (this.ruleForm.drop_date_from = null),
          (this.ruleForm.drop_date_to = null),
          // this.ruleForm.min_gpa = null;
          (this.ruleForm.name = "ENROLLMENT_SETTINGS");
      }
      this.openDialog();
    },
    openDialog() {
      this.dialog = true;
    },
    submit() {
      this.$nextTick((_) => {
        this.$refs.ruleForm
          .validate()
          .then((success) => {
            if (success) {
              const payload = {
                faculty_id: this.ruleForm.faculty_id,
                bylaw_id: this.ruleForm.bylaw_id,
                term_id: this.$route.params.id,
                name: "ENROLLMENT_SETTINGS",
                value: {
                  registration_date_from: this.ruleForm.registration_date_from,
                  registration_date_to: this.ruleForm.registration_date_to,
                  adddrop_date_from: this.ruleForm.adddrop_date_from,
                  adddrop_date_to: this.ruleForm.adddrop_date_to,
                  withdraw_date_from: this.ruleForm.withdraw_date_from,
                  withdraw_date_to: this.ruleForm.withdraw_date_to,
                  drop_date_from: this.ruleForm.drop_date_from,
                  drop_date_to: this.ruleForm.drop_date_to,
                  // min_gpa: this.ruleForm.min_gpa,
                },
              };

              this.addSetting({
                id: this.settings_id || null,
                query: payload,
              })
                .then((_) => {
                  this.dialog = false;
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                  this.$swal({
                    icon: "error",
                    text: `${this.$t("Global.errorMessage")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.removeSetting(id).then((_) => {
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.Deleted"),
            });
            this.init();
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
