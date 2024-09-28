<template>
  <div>
    <DataTable
      :title="title"
      :total="total"
      :allow-search="true"
      :filter="filter"
      :loading="customLoad"
      @Refresh="refresh"
      @reset="reset"
      :paramsLoaded="paramsLoaded"
    >
      <template v-if="lookups && !listed_only" #filter>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.faculty_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.faculties"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.exam_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.exams"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.exam_type')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.offering_id"
            :options="searchOfferings"
            :label="getSelectLabel()"
            class="w-100"
            :placeholder="$t('offerings')"
            :filterable="false"
            clearable
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :reduce="(val) => val.id"
            @search="fetchOfferings"
          >
            <template v-slot:option="option" v-if="$i18n.locale == 'ar'">
              {{ option.course.code }}: {{ option.course.name_local }} ({{
                option.students_per_offering
              }}
              طالب)
            </template>
            <template v-slot:option="option" v-else>
              {{ option.course.code }}: {{ option.course.name }} ({{
                option.students_per_offering
              }}
              Student)
            </template>

            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">
                {{ option.course.code }}: {{ option.course.name_local }} ({{
                  option.students_per_offering
                }}
                طالب)</span
              >
              <span v-else>
                {{ option.course.code }}: {{ option.course.name }} ({{
                  option.students_per_offering
                }}
                Student)
              </span>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.location_id"
            :label="getSelectLabel()"
            :options="searchLocations"
            clearable
            :reduce="(val) => val.id"
            :placeholder="$t('Global.location')"
            @search="fetchLocations"
            class="w-100"
            :filterable="false"
            :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
          >
            <template slot="option" slot-scope="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local
                  : option.name
              }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local
                  : option.name
              }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.slot_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.slots"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.slot')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.title : option.title }}
            </template>
            <template #selected-option="{ title }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ title }} </strong>
                <strong v-else>{{ title }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(code)="data">
            <div v-if="data.item.student.code">
              <div class="d-flex">
                {{
                  $i18n.locale == "ar"
                    ? data.item.student.code
                    : data.item.student.code
                }}
              </div>
            </div>
          </template>
          <template #cell(name)="data">
            <div v-if="data.item.student">
              <b-link
                :to="{
                  name: 'student-show',
                  params: { id: data.item.student.id },
                }"
                v-b-tooltip.hover="
                  $i18n.locale == 'ar'
                    ? data.item.student.name_local
                    : data.item.student.name
                "
              >
                <div class="d-flex">
                  {{
                    $i18n.locale == "ar"
                      ? data.item.student.name_local
                      : data.item.student.name
                  }}
                </div>
              </b-link>
            </div>
          </template>
          <template #cell(exam)="data">
            <div v-if="data.item.offering_exam">
              <div class="d-flex">
                {{
                  $i18n.locale == "ar"
                    ? data.item.offering_exam.exam.name_local
                    : data.item.offering_exam.exam.name
                }}
              </div>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(offering)="data">
            <div v-if="data.item.offering">
              <div class="d-flex">
                <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold custom_link h7"
                  :to="{
                    name: 'offering',
                    params: { id: data.item.offering.id },
                  }"
                >
                  {{
                    data.item.offering.course
                      ? `${data.item.offering.course.code}: ${data.item.offering.course.name}`
                      : "-"
                  }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold custom_link h7"
                  :to="{
                    name: 'offering',
                    params: { id: data.item.offering.id },
                  }"
                >
                  {{
                    data.item.offering.course
                      ? `${data.item.offering.course.code}: ${data.item.offering.course.name_local}`
                      : "-"
                  }}
                </b-link>
              </div>
              <!-- <div class="d-flex">
                <strong>
                  {{
                    `${$t("Global.students")} : ${
                      data.item.offering.students_per_offering
                        ? data.item.offering.students_per_offering
                        : "_"
                    }`
                  }}
                </strong>
              </div> -->
              <div class="d-flex flex-wrap">
                <div v-if="data.item.offering.course.faculty">
                  <b-link
                    class="font-weight-bold custom_link h7"
                    :to="{
                      name: 'faculty',
                      params: { id: data.item.offering.course.faculty.id },
                    }"
                  >
                    <span
                      v-if="$i18n.locale == 'en'"
                      class="font-weight-bold d-block"
                    >
                      {{ data.item.offering.course.faculty.name }}
                    </span>
                    <span
                      v-if="$i18n.locale == 'ar'"
                      class="font-weight-bold d-block"
                    >
                      {{ data.item.offering.course.faculty.name_local }}
                    </span>
                  </b-link>
                </div>
              </div>
              <div class="d-flex flex-wrap">
                <div v-if="data.item.offering.course.bylaw">
                  <b-link
                    class="font-weight-bold custom_link h7"
                    :to="{
                      name: 'bylaw',
                      params: { id: data.item.offering.course.bylaw.id },
                    }"
                  >
                    <span
                      v-if="$i18n.locale == 'en'"
                      class="font-weight-bold d-block"
                    >
                      {{
                        data.item.offering.course.bylaw.name +
                        " - " +
                        data.item.offering.course.bylaw.stage.code
                      }}
                    </span>
                    <span
                      v-if="$i18n.locale == 'ar'"
                      class="font-weight-bold d-block"
                    >
                      {{
                        data.item.offering.course.bylaw.name_local +
                        " - " +
                        data.item.offering.course.bylaw.stage.code
                      }}
                    </span>
                  </b-link>
                </div>
                <div v-else>_</div>
              </div>
            </div>
          </template>
          <template #cell(reported_by)="data">
            <div v-if="data.item.absence_reported_by">
              <div class="d-flex h7">
                <b-link
                  :to="{
                    name: 'user-show',
                    params: { id: data.item.absence_reported_by.id },
                  }"
                  v-b-tooltip.hover="
                    $i18n.locale == 'ar'
                      ? data.item.absence_reported_by.name_local
                      : data.item.absence_reported_by.name
                  "
                >
                  {{
                    $i18n.locale == "ar"
                      ? data.item.absence_reported_by.name_local
                      : data.item.absence_reported_by.name
                  }}
                </b-link>
              </div>
            </div>
          </template>
          <template #cell(reported_at)="data">
            <div v-if="data.item.absence_reported_at">
              <div class="d-flex">
                {{ data.item.absence_reported_at }}
              </div>
            </div>
          </template>
          <template #cell(actions)="data">
            <div v-if="data">
              <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                v-if="hasPermission('delete_examAbsence')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="deleteAbsence(data.item.barcode)"
              />
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button
          v-if="hasPermission('edit_examAbsence')"
          @click="openModal()"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
    </DataTable>
    <b-modal
      id="modal"
      ref="modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="modalTitle"
      @hide="clear()"
    >
      <b-overlay :show="load" rounded="sm">
        <validation-observer ref="simpleRules">
          <form ref="form">
            <div class="row">
              <div class="col">
                <b-form-group
                  :label="$t('Global.search_with')"
                  label-for="barcode"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.search_with')"
                    rules="required"
                  >
                    <v-select
                      v-model="searchWith"
                      :options="searchOptions"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('search_with')"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :reduce="(val) => val.id"
                    >
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? `هذا الحقل مطلوب` : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
            </div>
            <div class="row" v-if="searchWith == 1">
              <div class="col-12">
                <b-form-group :label="$t('Global.barcode')" label-for="barcode">
                  <validation-provider
                    #default="{ errors }"
                    name="barcode"
                    rules="required"
                  >
                    <b-form-input
                      id="barcode"
                      type="number"
                      v-model="form.barcode"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.barcode")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
              <div class="col-12">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.term')"
                  label-for="term"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="term"
                    rules="required"
                  >
                    <b-form-input
                      id="term"
                      v-model="form.term"
                      :disabled="true"
                      :state="errors.length > 0 ? false : null"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.term")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
              <div class="col-12">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.student')"
                  label-for="student"
                >
                  <validation-provider
                    #default="{ errors }"
                    rules="required"
                    name="student"
                  >
                    <b-form-input
                      id="student"
                      v-model="form.student"
                      :disabled="true"
                      :state="errors.length > 0 ? false : null"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.student")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
              <div class="col-12">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.offering')"
                  label-for="offering"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="offering"
                    rules="required"
                  >
                    <b-form-input
                      id="offering"
                      v-model="form.offering"
                      :disabled="true"
                      :state="errors.length > 0 ? false : null"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.offering")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
            </div>
            <div class="row" v-if="searchWith == 2">
              <b-col cols="12">
                <b-form-group
                  :label="$t('Global.student_information')"
                  label-for="student_information"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.student_information')"
                    rules="required"
                  >
                    <v-select
                      id="student_information"
                      v-model="form.user_id"
                      :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
                      @search="fetchOptions"
                      :options="studentData"
                      :filterable="false"
                      :reduce="(val) => val.id"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    >
                      <template slot="no-options">
                        {{
                          $i18n.locale == "en"
                            ? "Type Student Code or Name to search"
                            : "أكتب كود الطالب او اسمه للبحث"
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <div v-if="$i18n.locale == 'ar'">
                            {{ name_local }}
                          </div>
                          <div v-else>{{ name }}</div>
                        </div>
                      </template>
                      <template slot="option" slot-scope="option">
                        <div class="d-center">
                          {{
                            $i18n.locale == "en"
                              ? option.name
                                ? option.name
                                : option.name_local
                              : option.name_local
                              ? option.name_local
                              : option.name
                          }}
                        </div>
                      </template>
                    </v-select>
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.student_information")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <div class="col-12">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.term')"
                  label-for="term"
                >
                  <validation-provider #default="{ errors }" name="term">
                    <v-select
                      v-model="form.term"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :disabled="!form.user_id"
                      :options="lookups.exam_term"
                      :label="getSelectLabel()"
                      class="w-100 mb-2"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.term')"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <div v-if="$i18n.locale == 'ar'">
                            {{ name_local }}
                          </div>
                          <div v-else>{{ name }}</div>
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.term")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
              <b-col cols="12">
                <b-form-group
                  :label="$t('Global.offerings')"
                  label-for="exam_schedule"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.exam_schedule')"
                    rules="required"
                  >
                    <v-select
                      v-model="form.registeration_id"
                      :options="schedules"
                      label="course_name"
                      :disabled="schedules.length <= 0"
                      class="w-100"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :reduce="(val) => val"
                      :filter="schedulesSearch"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar"
                            ? `${option.course_code}: ${option.course_name_local} | ${option.exams_name_local} | ${option.location_num == 0 ? '' : option.location_name_local + ' | '} ${option.exam_date}`
                            : `${option.course_code}: ${option.course_name} | ${option.exam_name} | ${option.location_num == 0 ? '' : option.location_name + ' | '} ${option.exam_date}`
                        }}
                      </template>

                      <template
                        #selected-option="{
                          course_code,
                          course_name,
                          course_name_local,
                          location_name,
                          location_name_local,
                          location_num,
                          exam_date,
                          exam_name,
                          exams_name_local,
                        }"
                      >
                        <div style="display: flex; align-items: baseline">
                          <div>
                            {{
                              $i18n.locale == "ar"
                                ? `${course_code}: ${course_name_local} | ${exams_name_local} | ${location_num == 0 ? '' : location_name_local + ' | '} ${exam_date}`
                                : `${course_code}: ${course_name} | ${exam_name} | ${location_num == 0 ? '' : location_name + ' | '} ${exam_date}`
                            }}
                          </div>
                        </div>
                      </template>

                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? `حقل ${$t("Global.exam_schedule")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </form>
        </validation-observer>
      </b-overlay>
      <template #modal-footer>
        <b-row>
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit(false)"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit(true)"
            >
              {{ $t("Global.save_and_close") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="cancel()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormGroup,
  BFormTextarea,
  BFormDatepicker,
} from "bootstrap-vue";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required } from "@validations";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import Fuse from "fuse.js";
export default {
  name: "Offerings",

  components: {
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize,
    required,
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
    BFormGroup,
    BFormTextarea,
    BFormDatepicker,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: { type: Boolean, default: false },
    exam_id: null,
    course_id: null,
    term_id: null,
    status: null,
  },
  data() {
    return {
      modalTitle: null,
      errorsdata: {},
      schedules: [],
      searchLocations: [],
      studentsOptions: [],
      searchOfferings: [],
      current_exam_term: null,
      waitFetchOfferings: false,
      searchWith: null,
      searchOptions: [
        { id: 2, name_local: "معلومات الطالب", name: "Student Information" },
        { id: 1, name_local: "باركود الطالب", name: "Student Barcode" },
      ],
      form: {
        barcode: null,
        term: null,
        user_id: null,
        offering: null,
        registeration_id: null,
      },
      filter: {
        offering_id: null,
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        exam_id: null,
        location_id: null,
        slot_id: null,
        order_direction: "DESC",
      },
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "examsAbsences/items",
      total: "examsAbsences/total",
      load: "examsAbsences/load",
      needDrop:'app/needDrop',
      customLoad: "examsAbsences/customLoad",
      lookups: "examsAbsences/lookups",
      student_info: "examsAbsences/student_info",
    }),
    exam_id_param() {
      return this.$route.query.exam_id ? this.$route.query.exam_id : null;
    },
    studentData: function () {
      return this.studentsOptions;
    },
    fieldsData() {
      let fields = [
        {
          key: "code",
          sortable: true,
          label: this.$t("Global.code"),
          // thStyle: { width: "30%" },
        },
        {
          key: "name",
          sortable: true,
          label: this.$t("Global.student"),
          // thStyle: { width: "30%" },
        },
        {
          key: "exam",
          sortable: false,
          label: this.$t("Global.exam_type"),
          // thStyle: { width: "15%" },
        },
        {
          key: "offering",
          sortable: false,
          label: this.$t("Global.offering"),
          // thStyle: { width: "15%" },
        },
        {
          key: "reported_by",
          sortable: true,
          label: this.$t("Global.reported_by"),
          // thStyle: { width: "15%" },
        },
        {
          key: "reported_at",
          sortable: true,
          label: this.$t("Global.reported_at"),
          // thStyle: { width: "15%" },
        },
        {
          key: "actions",
          // thStyle: { width: '12%' },
          thClass: "customAction",
          tdClass: "customWidth",
          label: this.$i18n.locale === "en" ? "Actions" : "الإجراءات",
        },
      ];
      return fields;
    },
    language: function () {
      localStorage.setItem("mylang", this.$i18n.locale);
      return this.$i18n.locale;
    },
    header: function () {
      localStorage.setItem("headers", false);
      return false;
    },
  },
  watch: {
    "filter.bylaw_id": function (newValue) {
      if (this.filter.program_id) {
        this.filter.program_id = null;
      }
    },
    "filter.faculty_id": function (newValue) {
      if (this.filter.bylaw_id) {
        this.filter.bylaw_id = null;
      }
    },
    language: function (val) {
      this.language = val;
    },
    header: function (val) {
      this.header = val;
    },
    "form.user_id"(val) {
      if (val || val == null) {
        this.form.term = null;
        this.form.registeration_id = null;
      }
    },
    "form.term"(val) {
      this.form.registeration_id = null;
      this.$store
        .dispatch("examsAbsences/get_student_info", {
          query: { user_id: this.form.user_id, term_id: this.form.term },
        })
        .then((res) => {
          this.schedules = res.data ? res.data : null;
          // this.form.term = res.data ? ( this.$i18n.locale == 'ar' ? res.data[0].term_name_local:  res.data[0].term_name ): null
        });
    },
    "form.barcode": function (newValue) {
      this.$store
        .dispatch("examsAbsences/get_student_info", {
          query: { barcode: newValue },
        })
        .then((_) => {
          this.form.term =
            this.$i18n.locale == "ar"
              ? this.student_info.term.name_local
              : this.student_info.term.name;
          this.form.offering =
            this.$i18n.locale == "ar"
              ? this.student_info.offering.course.name_local
              : this.student_info.offering.course.name;
          this.form.student =
            this.$i18n.locale == "ar"
              ? this.student_info.student.name_local
              : this.student_info.student.name;
        });
    },
  },
  methods: {
    ...mapActions({
      lookupsMethod: "students/lookup",
      getLookups: 'examsSchedules/GET_LOOKUPS',
      // getLookups: "app/GET_LOOKUPS",
      getTerms: "app/getTerms",
    }),
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    refresh(query) {
      if (this.exam_id) {
        query = { ...query, exam_id: this.exam_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id };
      }
      if (this.status) {
        query = { ...query, status: this.status };
      }
      if (this.$route.query && this.$route.query.term_id) {
        query = { ...query, term_id: this.$route.query.term_id };
      }
      this.$store
        .dispatch("examsAbsences/examsAbsences", { query: query })
        .then((data) => {
          this.paramsLoaded = false;
          this.searchLocations = this.lookups.locations
          // this.$route.query.exam_id == null ? this.filter.exam_id = this.lookups.exams[0].id : false;
        });
    },
    openModal() {
      this.modalTitle = this.$t("Global.add_exam_absence");
      // this.getTerms().then(res=>{
      //   this.current_exam_term = res.current_exam_term
      // })
      this.$refs.modal.show();
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        examStudents: search,
        type: "exam_absence",
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.studentsOptions = res.success.students;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    fetchOfferings(search, load) {
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true;
        load(true);
        const query = {
          search_all_offerings_keyword: search,
        };

        this.getLookups(query).then((response) => {
          this.searchOfferings = response.success.all_offerings;
          load(false);
          this.waitFetchOfferings = false;
        });
      }
    },
    clear() {
      this.form = {
        barcode: null,
        term: null,
        user_id: null,
        offering: null,
      };
      this.schedules = [];
    },
    fetchLocations(search, load) {
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true;
        load(true)
        const query = {
          search_locations: search,
        }
        this.getLookups({query: query, id: this.exam_id_param }).then(response => {
          this.searchLocations = response.data.locations
          load(false)
          this.waitFetchOfferings = false;
        })
      }
    },
    deleteAbsence(id) {
      if (this.items) {
        this.$swal({
          title: `${this.$t("Global.deleteTitle")}`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: `${this.$t("Global.cancel")}`,
          confirmButtonText: `${this.$t("Global.yes")}`,
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.popoverShow = false;
            this.$store
              .dispatch("examsAbsences/remove", id)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: this.$t("Global.Deleted"),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
          }
        });
      }
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    submit(save_and_close) {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = {
            barcode: this.form.barcode,
            reg_id: this.form.registeration_id.regId,
          };
          this.$store
            .dispatch("examsAbsences/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              save_and_close
                ? this.$refs.modal.hide()
                : this.$refs.modal.show();
              this.form = {
                barcode: null,
                term: null,
                user_id: null,
                offering: null,
                registeration_id: null,
              };
              this.refresh();
            })
            .catch((error) => {
              let message = error ? this.$i18n.locale == 'ar' ? error.response.data.errors[0].title.ar : error.response.data.errors[0].title.en : this.$t("errorMessage");
              this.$swal({
                icon: "error",
                text: message,
                showConfirmButton: false,
                timer: 3000,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    schedulesSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: [
          "course_code",
          "course_name",
          "course_name_local",
          "location_name",
          "location_name_local",
          "exam_date",
        ],
        shouldSort: true,
        isCaseSensitive: true,
        includeScore: true,
        findAllMatches: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    locationsSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ["name", "name_local"],
        shouldSort: true,
        isCaseSensitive: true,
        includeScore: true,
        findAllMatches: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    cancel() {
      this.$refs.modal.hide();
      this.form = {
        barcode: null,
        term: null,
        user_id: null,
        offering: null,
        registeration_id: null,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
<style lang="css" scoped>
.per-page-selector {
  width: 90px;
}
</style>