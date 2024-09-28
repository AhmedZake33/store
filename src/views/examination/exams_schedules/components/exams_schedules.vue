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
            :placeholder="$t('Global.exam')"
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
            :placeholder="$t('searchInOfferings')"
            :filterable="false"
            clearable
            :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
            :reduce="(val) => val.id"
            @search="fetchOfferings"

          >
            <template
              v-slot:option="option"
              v-if="$i18n.locale == 'ar'"
            >
              {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)
            </template>
            <template v-slot:option="option" v-else>
              {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
            </template>

            <template slot="selected-option" slot-scope="option">
              <span
                v-if="$i18n.locale == 'ar'"
              >
                {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)</span
              >
              <span
                v-else
              >
                {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
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
        <b-col cols="6" md="4">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date-input"
            v-model="filter.exam_date"
          />
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative font-small-2"
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
          <template #cell(id)="data">
            <div v-if="data.item.id">
              <b-link
                :to="{
                    name: 'exam_schedule',
                    params: { id: data.item.id },
                    query: {exam_id: data.item.exam.id}
                  }"
              >
                {{ data.item.id }}
              </b-link>
            </div>
          </template>
          <template #cell(course)="data">
            <div v-if="data.item.course">
              <div class="d-flex">
                <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold custom_link h5"
                  :to="{
                    name: 'offering',
                    params: { id: data.item.offering_id },
                  }"
                >
                  {{
                    data.item.course
                      ? `${data.item.course.code}: ${data.item.course.name}`
                      : "-"
                  }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold custom_link h5"
                  :to="{
                    name: 'offering',
                    params: { id: data.item.offering_id },
                  }"
                >
                  {{
                    data.item.course
                      ? `${data.item.course.code}: ${data.item.course.name_local}`
                      : "-"
                  }}
                </b-link>
              </div>
              <div class="d-flex">
                <strong>
                  {{
                    `${$t("Global.students")}: ${
                      data.item.students_per_offering
                        ? data.item.students_per_offering
                        : "_"
                    }`
                  }}
                </strong>
              </div>
              <div class="d-flex flex-wrap">
                <!-- <strong class="font-weight-bold">
                  {{ $t("Global.faculty") }}: &nbsp;
                </strong> -->
                <div v-if="data.item.offering.course.faculty">
                  <b-link
                    class="font-weight-bold custom_link"
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
                <div v-else>_</div>
              </div>
              <div class="d-flex flex-wrap">
                <div v-if="data.item.offering.course.faculty">
                  <b-link
                    class="font-weight-bold custom_link"
                    :to="{
                      name: 'bylaw',
                      params: { id: data.item.offering.course.bylaw.id },
                    }"
                  >
                    <span
                      v-if="$i18n.locale == 'en'"
                      class="font-weight-bold d-block"
                    >
                      {{ data.item.offering.course.bylaw.name + ' - ' + data.item.offering.course.bylaw.stage.code }}
                    </span>
                    <span
                      v-if="$i18n.locale == 'ar'"
                      class="font-weight-bold d-block"
                    >
                      {{ data.item.offering.course.bylaw.name_local + ' - ' + data.item.offering.course.bylaw.stage.code }}
                    </span>
                  </b-link>
                </div>
                <div v-else>_</div>
              </div>
            </div>
          </template>
          <template #cell(exam)="data">
            <div v-if="data.item.exam">
              <div class="d-flex">
                {{
                  $i18n.locale == "ar"
                    ? data.item.exam.name_local
                    : data.item.exam.name
                }}
              </div>
            </div>
          </template>
          <template #cell(exam_type)="data">
            <div v-if="data.item.exam.type">
              <div class="d-flex">
                {{
                  $i18n.locale == "ar"
                    ? data.item.exam.type.name_local
                    : data.item.exam.type.name
                }}
              </div>
            </div>
          </template>
          <template #cell(exam_date)="data">
            <div v-if="data.item.exam_date">
              <div class="d-flex">
                {{ data.item.exam_date }}
              </div>
            </div>
          </template>
          <template #cell(slots)="data">
            <div v-if="data.item.slots">
              <div class="d-flex">
                <div v-if="data.item.slots" class="with-comma">
                  <span
                    class="font-weight-bold"
                    v-for="slot in data.item.slots"
                    :key="slot.id"
                    >{{ $i18n.locale == "ar" ? slot.title : slot.title }}</span
                  >
                </div>
              </div>
            </div>
          </template>
          <template #cell(locations)="data">
            <div class="d-flex flex-wrap">
              <div v-if="data.item.locations" class="with-comma">
                <span
                  class="font-weight-bold d-block"
                  v-for="location in data.item.locations"
                  :key="location.id"
                >
                  <b-link
                      class="font-weight-bold custom_link"
                      :to="{
                        name: 'location',
                        params: { id: location.id },
                      }"
                    >
                      {{ $i18n.locale == "ar" ? `${location.name_local} ` : `${location.name} ` }}
                      {{$i18n.locale == "ar" ? `(${location.capacity}/${location.students_per_location} طالب)` : `(${location.students_per_location}/${location.capacity} Student)`}}
                  </b-link>
                </span>
              </div>
            </div>
          </template>
          <template v-if="!listed_only" #cell(actions)="data">
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
              <!-- <feather-icon
                v-b-tooltip.hover="$t('Global.exam_absence')"
                v-if="hasPermission('edit_examAbsence') && data.item.exam.canEditSchedules"
                icon="UserXIcon"
                style="cursor: pointer"
                class="text-primary"
                @click="examAbsence(data.item)"
              /> -->
              <!-- <feather-icon
                v-b-tooltip.hover="$t('Global.exam_investigations')"
                v-if="hasPermission('edit_examSpecification') && data.item.exam.canEditSchedules"
                icon="SlashIcon"
                style="cursor: pointer"
                class="text-primary"
                @click="examInvestigations(data.item)"
              /> -->
              <feather-icon
                v-b-tooltip.hover="$t('Global.exam_specifications')"
                v-if="hasPermission('edit_examSpecification') && data.item.exam.canEditSchedules"
                icon="FileTextIcon"
                style="cursor: pointer"
                class="text-primary"
                @click="examSpecifications(data.item)"
              />
              <feather-icon
                v-if="hasPermission('edit_examSchedule') && data.item.exam.canEditSchedules"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="open(data.item.exam.id, data.item.id)"
                class="text-primary"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                v-if="hasPermission('delete_examSchedule') && data.item.exam.canEditSchedules"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="deleteExam(data.item.id)"
              />
            </div>
          </template>
          <template #cell(paper_types)="data">
            <div v-if="data.item.paper_types">
              <div class="d-flex">
                <div v-if="data.item.paper_types">
                  <span
                    class="font-weight-bold"
                    v-for="type in data.item.paper_types"
                    :key="type.id"
                  >
                    <small>
                      <strong class="d-block">
                        {{ $i18n.locale == "ar" ? type.name_local : type.name }}
                      </strong>
                    </small>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="!listed_only && filter.exam_id != null" >
        <b-button
            v-if="hasPermission('print_exam_attendance_sheet')"
            v-b-tooltip.hover="$t('Print Attendance Sheet')"
            variant="primary"
            class="btn-icon mr-1"
            @click="openAttendanceSheetModal"
        >
            <feather-icon icon="PrinterIcon" />
        </b-button>
        <b-button
          v-if="hasPermission('add_examSchedule') && ifCanEdit"
          v-b-tooltip.hover="$t('Global.add')"
          :to="{ name: 'add_exam_schedule', query: { exam_id: exam_id_param } }"
          class="btn-icon"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
    </DataTable>
    <b-modal
      id="exam_specifications_modal"
      ref="exam_specifications_modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Global.exam_specifications')"
    >
      <validation-observer ref="simpleRules">
        <form ref="specifications_form">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                class="left_right"
                :label="$t('paper_types')"
                label-for="paper-types-input"
              >
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  :name="$t('Global.paper_types')"
                  v-if="lookups"
                >
                  <v-select
                    v-model="specifications_form.paper_types"
                    :label="getSelectLabel()"
                    :options="lookups.paper_types"
                    multiple
                    :reduce="(val) => val.id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
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
                    {{
                      $i18n.locale == "ar"
                        ? `حقل ${$t("Global.paper_types")} مطلوب`
                        : error
                    }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <b-form-group :label="$t('Global.minutes')" label-for="minutes">
                <validation-provider
                  :name="$t('Global.minutes')"
                  #default="{ errors }"
                  rules="required"
                >
                  <b-form-input
                    id="minutes"
                    v-model="specifications_form.minutes"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{
                      $i18n.locale == "ar"
                        ? `حقل ${$t("Global.minutes")} مطلوب`
                        : error
                    }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <b-form-group :label="$t('Global.notes')" label-for="notes">
                <validation-provider
                  #default="{ errors }"
                  name="notes"
                  rules="required"
                >
                  <b-form-textarea
                    id="notes"
                    v-model="specifications_form.notes"
                  />
                  <small
                    class="text-danger"
                    v-for="(error, index) in errors"
                    :key="index"
                  >
                    {{
                      $i18n.locale == "ar"
                        ? `حقل ${$t("Global.notes")} مطلوب`
                        : error
                    }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.exam_specifications_modal.hide()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal id="modal" @hidden="resetModal" ref="modal" no-close-on-backdrop size="lg" centered :title="modalTitle">
      <validation-observer ref="formsRules"  >
        <form ref="exam_absence">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-form-group
                  class="left_right"
                  label-for="students-input"
                  v-if="lookups"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="students"
                    rules="required"
                  >
                    <v-select
                      v-model="form.registrations_ids"
                      :options="searchStudents"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('students')"
                      :filterable="false"

                      multiple
                      :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                      :reduce="(val) => val.registration_id"
                      @search="fetchStudents"

                    >
                      <template v-slot:option="option" >
                          <option disabled value="" v-if="formType == 1 && option.absence == 1 ? true :  formType == 2 && option.investigation == 1 ? true : false " style="background: #054978; color: #fff; margin: -7px -20px !important; padding: 7px 20px">
                            <div v-if="$i18n.locale == 'ar'">
                              {{ option.student_code }}: {{ option.student_name_local }}
                            </div>
                            <div v-else>
                              {{ option.student_code }}: {{ option.student_name }}
                            </div>
                          </option>
                          <option v-else>
                            <div v-if="$i18n.locale == 'ar'">
                              {{ option.student_code }}: {{ option.student_name_local }}
                            </div>
                            <div v-else>
                              {{ option.student_code }}: {{ option.student_name }}
                            </div>
                          </option>
                      </template>

                      <template slot="selected-option" slot-scope="option">
                        <span
                          v-if="$i18n.locale == 'ar'"
                        >
                          {{ option.student_code }}: {{ option.student_name_local }}
                        </span>
                        <span
                          v-else
                        >
                          {{ option.student_code }}: {{ option.student_name }}
                        </span>
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
                          ? `حقل ${$t("Global.students")} مطلوب`
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
            </div>
          </div>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
            <b-col md="12">
                <b-button type="submit" variant="primary" class="mr-1" @click="submit_absence_investigations()">
                    {{ $t('Global.save') }}
                </b-button>
                <b-button type="reset" variant="outline-secondary" @click="$refs.modal.hide();">
                    {{ $t('Global.cancel') }}
                </b-button>
            </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal id="attendance_sheet_modal" ref="attendance_sheet_modal" no-close-on-backdrop size="lg" centered :title="$t('Attendance Sheet')">
      <validation-observer ref="attendance_sheet_form"  >
        <form ref="attendance_sheet">
          <div class="row">
            <div v-if="lookups" class="col">
              <b-col>
                <v-select
                  v-model="attendance_sheet.exam_id"
                  :filter="fuseSearch"
                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups.exams"
                  :label="getSelectLabel()"
                  class="w-100 mb-2"
                  :reduce="(val) => val.id"
                  :placeholder="$t('Global.exam')"
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
              <b-col>
                <v-select
                  v-model="attendance_sheet.offering_id"
                  :options="searchOfferings"
                  :label="getSelectLabel()"
                  class="w-100 mb-2"
                  :placeholder="$t('searchInOfferings')"
                  :filterable="false"
                  clearable
                  :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                  :reduce="(val) => val.id"
                  @search="fetchOfferings"

                >
                  <template
                    v-slot:option="option"
                    v-if="$i18n.locale == 'ar'"
                  >
                    {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)
                  </template>
                  <template v-slot:option="option" v-else>
                    {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
                  </template>

                  <template slot="selected-option" slot-scope="option">
                    <span
                      v-if="$i18n.locale == 'ar'"
                    >
                      {{ option.course.code }}: {{ option.course.name_local }} ({{ option.students_per_offering }} طالب)</span
                    >
                    <span
                      v-else
                    >
                      {{ option.course.code }}: {{ option.course.name }} ({{ option.students_per_offering }} Student)
                    </span>
                  </template>
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                </v-select>
              </b-col>
              <b-col>
                <b-form-datepicker
                  :label-no-date-selected="$t('Global.exam_date')"
                  :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                  id="exam-date-input"
                  v-model="attendance_sheet.exam_date"
                />
              </b-col>
            </div>
          </div>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
            <b-col md="12">
                <b-button type="submit" variant="primary" class="mr-1" @click="printData()">
                    {{ $t('Global.print') }}
                </b-button>
                <b-button type="reset" variant="outline-secondary" @click="$refs.attendance_sheet_modal.hide()">
                    {{ $t('Global.cancel') }}
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
    listedOnly: { type: Boolean, default: false },
  },
  mounted() {
    this.refresh();
  },
  data() {
    return {
      errorsdata: {},
      searchOfferings: [],
      searchLocations: [],
      searchStudents: [],
      formType: null,
      modalTitle: null,
      waitFetchOfferings: false,
      schedule_id: null,
      specifications_form: {
        paper_types: [],
        minutes: null,
        notes: null,
      },
      form:{
        registrations_ids : []
      },
      attendance_sheet:{
        exam_id: null,
        exam_date: null,
        offering_id: null
      },
      filter: {
        offering_id: null,
        term_id: null,
        faculty_id: null,
        exam_id: null,
        location_id: null,
        slot_id: null,
        exam_date: null,
        order_direction: true
      },
      paramsLoaded: true,
      ifCanEdit: null,
      listed_only: this.listedOnly,
    };
  },
  computed: {
    ...mapGetters({
      items: "examsSchedules/items",
      total: "examsSchedules/total",
      needDrop:'app/needDrop',
      load: "examsSchedules/load",
      customLoad: "examsSchedules/customLoad",
      lookups: "examsSchedules/lookups",
    }),
    exam_id_param() {
      return this.$route.query.exam_id ? this.$route.query.exam_id : null;
    },
    getEmptyListLabel() {
      return this.$i18n.locale === "en"
        ? "Sorry, No Matching Options."
        : "لاتوجد نتائج مطابقة للبحث.";
    },
    fieldsData() {
      let fields = [
        {
          key: "id",
          sortable: true,
          label: this.$t("Global.id"),
          // thStyle: { width: "30%" },
        },
        {
          key: "course",
          sortable: false,
          label: this.$t("Global.course"),
          // thStyle: { width: "25%" },
        },
        {
          key: "exam",
          sortable: false,
          label: this.$t("Global.exam"),
          // thStyle: { width: "15%" },
        },
        {
          key: "exam_type",
          sortable: false,
          label: this.$t("Global.exam_type"),
          // thStyle: { width: "15%" },
        },
        {
          key: "exam_date",
          sortable: true,
          label: this.$t("date"),
          thStyle: { width: "8%" },
        },
        {
          key: "slots",
          sortable: true,
          label: this.$t("Global.slots"),
          // thStyle: { width: "15%" },
        },
        {
          key: "locations",
          sortable: false,
          label: this.$t("Global.locations"),
          // thStyle: { width: "15%" },
        },
        {
          key: "paper_types",
          sortable: false,
          label: this.$t("Global.paper_types"),
          // thStyle: { width: "15%" },
        },
        {
          key: "minutes",
          sortable: true,
          label: this.$t("Global.minutes"),
          // thStyle: { width: "15%" },
        },
        {
          key: "notes",
          sortable: false,
          label: this.$t("Global.notes"),
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
      this.searchOfferings = []
      if (this.filter.bylaw_id) {
        this.filter.bylaw_id = null;
      }
    },
    "filter.exam_id": function (newValue) {
      this.attendance_sheet.exam_id = newValue
      this.ifCanEdit = this.lookups.exams.find(x => x.id === newValue).canEditSchedules
    },
    language: function (val) {
      this.language = val;
    },
    header: function (val) {
      this.header = val;
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'examsSchedules/GET_LOOKUPS',
      getStudentsRegistrations: 'examsSchedules/getStudentsRegistrations'
    }),
    editTab(offering_id) {
      this.$router.push({
        name: "offering",
        params: { id: offering_id },
        query: { inline: true },
      });
      this.updateFilterQueryParams({ tabNum: 1 });
    },
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
        if(this.filter.exam_id == null){
          this.$store.dispatch("examsSchedules/lookups", {
            query: { exams: "exams", faculties: "faculties", locations: "locations" , paper_types: "paper_types", terms: "terms", slots: "slots"},
          }).then(_=>{
            this.filter.exam_id = this.lookups.exams[0].id;
            this.attendance_sheet.exam_id = this.lookups.exams[0].id;
          });
        }else{
          this.$store
            .dispatch("examsSchedules/examsSchedules", {
              query: query,
              id: this.exam_id_param
            })
            .then((data) => {
              this.paramsLoaded = false;
          });
        }
    },
    deleteExam(id) {
      if (this.items) {
        this.$swal({
          title: `${this.$t("Global.deleteTitle")}`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: `${this.$t("Global.cancel")}`,
          confirmButtonText: "Yes, delete slot!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.popoverShow = false;
            this.$store
              .dispatch("examsSchedules/remove", id)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: this.$t("Global.Deleted"),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
          } else {
            this.$swal({
              icon: "error",
              title: this.$i18n.locale == "en" ? "Error!" : "خطا",
              text:
                this.$i18n.locale == "en"
                  ? "You Cannot Delete This Exam Schedule"
                  : "لا يمكنك مسح جدول الامتحان",
              customClass: {
                confirmButton: "btn btn-danger",
              },
            });
          }
        });
      }
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    fetchOfferings(search, load) {
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true;
        load(true)
        const query = {
          search_all_offerings_keyword: search,
          faculty_id: this.filter.faculty_id ? this.filter.faculty_id : null,
        }

        this.getLookups({query: query, id: this.exam_id_param }).then(response => {
          this.searchOfferings = response.data.all_offerings
          load(false)
          this.waitFetchOfferings = false;
        })
      }
    },
    fetchLocations(search, load) {
      this.searchLocations = []
      if (search.length >= 3 && !this.waitFetchOfferings) {
        this.waitFetchOfferings = true;
        load(true)
        const query = {
          search_locations: search,
        }
        this.getLookups({query: query, id: this.exam_id_param }).then(response => {
          this.searchLocations = response.data.locations
          console.log('response.data.locations -----------------------------------------------> ', response.data.locations);
          console.log('this.searchLocations -----------------------------------------------> ', this.searchLocations);
          load(false)
          this.waitFetchOfferings = false;
        })
      }
    },
    getColor(status) {
      if (status == "Draft") {
        return "light-warning";
      } else if (status == "Submitted") {
        return "light-success";
      } else if (status == "Accepted") {
        return "light-info";
      } else if (status == "Approved") {
        return "light-dark";
      } else if (status == "Published") {
        return "light-primary";
      }
    },
    open(examId, id) {
      this.$router.push({
        name: "edit_exam_schedule",
        params: { id : id},
        query:{exam_id: examId, inline: true}
      });
    },
    openCalendar(id) {
      if (this.$route.name == "offerings") {
        this.$router.push({
          name: "offering-schedule",
          params: {
            id,
          },
        });
      } else {
        this.$router.push({
          name: "course-schedule",
          params: {
            id,
          },
        });
      }
    },
    examSpecifications(item) {
      this.specifications_form.paper_types = [];
      if (item.paper_types) {
        item.paper_types.forEach((el) => {
          this.specifications_form.paper_types.push(el.id);
        });
      } else {
        this.specifications_form.paper_types = [];
      }
      this.specifications_form.minutes = item.minutes ? item.minutes : null;
      this.specifications_form.notes = item.notes ? item.notes : null;

      this.schedule_id = item.id;
      this.$refs.exam_specifications_modal.show();
    },
    submit() {
      // this.$refs.exam_specifications_modal.hide();
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = {
            id: this.schedule_id,
            query: this.specifications_form,
          };
          this.$store
            .dispatch("examsSchedules/specifications", payload)
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
              this.$refs.exam_specifications_modal.hide();
              this.refresh();
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
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
    offeringsSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: [
          "students_per_offering",
          "course.code",
          "course.name",
          "course.name_local",
        ],
        shouldSort: true,
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
        findAllMatches: true
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    },
    examAbsence(item){
      this.formType = 1
      this.schedule_id = item.id
      this.modalTitle = this.$t("Global.exam_absence")
      this.$refs.modal.show()
    },
    examInvestigations(item){
      this.formType = 2
      this.schedule_id = item.id
      this.modalTitle = this.$t("Global.exam_investigations")
      this.$refs.modal.show()
    },
    fetchStudents(search, load) {
      if (search.length >= 3 && !this.waitFetchStudents) {
        this.waitFetchStudents = true;
        load(true)
        const query = {
          exam_schedule_id: this.schedule_id,
          search_student_keyword: {search_student_keyword: search},
        }
        this.getStudentsRegistrations(query).then(response => {
          if(response.data.exam_registrations.length > 0){
            this.searchStudents.filter(e => e.registration_id == response.data.exam_registrations[0].registration_id).length > 0 ?
            false : this.searchStudents.push( ...response.data.exam_registrations.filter(x => !this.searchStudents.includes(x)) );
          }
          load(false)
          this.waitFetchStudents = false;
        })
      }
    },
    submit_absence_investigations(){
      // this.$refs.exam_specifications_modal.hide();
      this.$refs.formsRules.validate().then((success) => {
        if (success) {
          const payload = {
            id: this.schedule_id,
            query: this.form,
          };
          this.$store
            .dispatch(this.formType == 2 ? "examsSchedules/examInvestigations" : "examsSchedules/examAbsence", payload)
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
              this.form.registrations_ids = [] ;
              this.searchStudents = [];
              this.$refs.modal.hide();
              this.form.registrations_ids = null;
              this.refresh();
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
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
    openAttendanceSheetModal(){
      this.$refs.attendance_sheet_modal.show();
    },
    printData(){
      this.attendance_sheet.lang = this.$i18n.locale,
      this.$store.dispatch('examsSchedules/printPdf', {
        query: this.attendance_sheet
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("Global.saved")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
            showConfirmButton: false,
            timer: 1500,
          });
            const errors = [error.response.data.errors];
            errors.forEach((error, index) => {
            const error_data = Object.values(error)[index][0];
            this.errorsdata = error;
          });
      });
    },
    resetModal(){
      this.form.registrations_ids = [] ;
      this.searchStudents = []
    }
  },
};
</script>


<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
.with-comma span:not(:last-child)::after {
  content: ",";
  color: red;
  margin-right: 5px;
}
</style>

<style lang="css" scoped>
.per-page-selector {
  width: 90px;
}
</style>
