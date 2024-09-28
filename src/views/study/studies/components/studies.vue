<template>
  <div>
    <!-- <div id="sweetAlert">
      <span v-if="errors">{{ errors }}</span>
    </div> -->
    <DataTable
        :title="title"
        :total="total"
        :filter="filter"
        :loading="load"
        @Refresh="refresh"
        @Export="Export"
        @reset="reset"
        :default-filter="propOfferingId ? null : 'term_id'"
        :allow-reset="propOfferingId == null"
        :allow-search="!selectedSection && !selectedOffering && !propOfferingId"
    >
      <template #filter v-if="lookups && !selectedSection && !selectedOffering">
        <b-col cols="6" md="3">
          <v-select
              v-model="filter.term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.terms"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.term')"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="3">
          <v-select
              v-model="filter.faculty_id"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.faculties"
              class="w-100"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.faculty')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="3">
          <v-select
              :disabled="!filter.faculty_id"
              v-model="filter.bylaw_id"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.bylaws"
              class="w-100"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.bylaw')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ getEmptyListLabel }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="3">
          <v-select
              :disabled="!filter.bylaw_id"
              v-model="filter.program_id"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.programs"
              class="w-100"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.program')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong>{{ $i18n.locale == 'ar' ? name_local : name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ getEmptyListLabel }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="3">
          <v-select
              :disabled="!filter.bylaw_id"
              v-model="filter.level_number"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="levels"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.level_number"
              :placeholder="$t('Global.level')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ getEmptyListLabel }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="6" md="3">
          <v-select
              v-model="filter.course_id"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="searchedCoursesOptions"
              @search="fetchCourses"
              class="w-100"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.course')"
          >
            <template #no-options>
              {{ $t('type_to_search') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="3">
          <v-select
              v-model="filter.students_stage"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="
              lookups && lookups.students_stage ? lookups.students_stage : []
            "
              class="w-100"
              clearable
              label="name"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.stage')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{
                  option.name + ' ( ' + option.code ? option.code : '-' + ' )' || option.name_local
                }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == 'ar'
                    ? option.name_local
                    : option.name + ' ( ' + option.code ? option.code : '-' + ' )'
              }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="3">
          <v-select
              v-model="filter.study_type"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups && lookups.study_type ? lookups.study_type : []"
              class="w-100"
              clearable
              label="name"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.type')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{
                  option.name + ' ( ' + option.code ? option.code : '-' + ' )' || option.name_local
                }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == 'ar'
                    ? option.name_local
                    : option.name + ' ( ' + option.code ? option.code : '-' + ' )'
              }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="3">
          <v-select
              v-model="filter.registration_status_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.registration_statuses"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.registration_status')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong>{{ $i18n.locale == 'ar' ? name_local : name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="3">
          <v-select
              v-model="filter.offerings_control_status"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.control_statuses"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.control_status')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="3">
          <v-select
              v-model="filter.course_status_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.course_statuses"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Course Status')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong>{{ $i18n.locale == 'ar' ? name_local : name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="3">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.removed"
              :options="getStatusList()"
              class="w-100"
              :reduce="(val) => val.value"
              :placeholder="$i18n.locale == 'en' ? 'Status' : 'الحالة'"
          />
        </b-col>
      </template>
      <template #action>
        <b-button
            v-if="hasPermission('export_registration')"
            @click="filter.export = 1"
            class="btn-icon mr-1"
            v-b-tooltip.hover="$t('Global.export_excel')"
            variant="primary"
        >
          <feather-icon icon="FileTextIcon"/>
        </b-button>

        <b-button
            v-if="propOfferingId"
            @click="toggleEnrollModal"
            class="btn-icon mr-1"
            v-b-tooltip.hover="$t('Global.batch_enroll')"
            variant="primary"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <b-button
            v-if="propOfferingId && hasPermission('batch_delete_registration')"
            :disabled="(offering && offering.status.id !== 0)"
            @click="deleteRegistrations"
            class="btn-icon"
            v-b-tooltip.hover="$t('Global.deleteRegistrations')"
            variant="danger"
        >
          <feather-icon icon="TrashIcon"/> &nbsp;
          <b-badge class="p-0" v-if="selectedRegistrations.length" pill variant="danger">
            {{ selectedRegistrations.length }} {{ $t('Global.item') }}
          </b-badge>
          <b-badge v-else pill variant="danger" class="p-0">
            {{ $t('Global.all') }}
          </b-badge>
        </b-button>
      </template>
      <template #customTable>
        <b-table
            @sort-changed="sortingChanged"
            no-local-sorting
            class="position-relative"
            :items="items"
            responsive
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="$t('Global.empty_text')"
        >
          <template #cell(id)="data">
            <div v-if="data.item.student">
              <b-link
                  :to="{
                  name: 'advising_registration',
                  params: { id: data.item.student.id },
                }"
              >
                {{ data.item.id }}
              </b-link>
            </div>
          </template>
          <template #cell(user)="data">
            <div v-if="data.item && data.item.student">
              {{ data.item.student.user && data.item.student.user.code }}&nbsp
              <b-link
                  :to="{
                  name: 'student-show',
                  params: { id: data.item.student.id },
                }"
              >
                {{
                  $i18n.locale == 'ar'
                      ? data.item.student.user && data.item.student.user.name_local
                      : data.item.student.user && data.item.student.user.name
                }}
              </b-link>
            </div>
          </template>
          <template #cell(offering)="data">
            <div class="d-flex" v-if="data.item && data.item.offering">
              <p>
                {{ data.item.offering.course && data.item.offering.course.code }}&nbsp;
                <b-link
                    :to="{
                    name: 'offering',
                    params: { id: data.item.offering.id },
                  }"
                >
                  {{
                    $i18n.locale == 'ar'
                        ? data.item.offering.course && data.item.offering.course.name_local
                        : data.item.offering.course && data.item.offering.course.name
                  }}
                  ({{ data.item.offering.id }})
                </b-link
                >
                ,
                <span>
                  <b-badge
                      :variant="
                      getOfferingStatusBadgeColor(data.item.offering.status)
                    "
                  >
                    {{ getOfferingStatusLabel(data.item.offering.status) }}
                  </b-badge>
                </span>
              </p>
            </div>
          </template>
          <template #cell(study)="data">
            <div v-if="data.item.offering">
              {{ getTranslatedName(data.item.offering.term) }},
              <b-link
                  :to="{
                  name: 'faculty',
                  params: { id: data.item.student.program.bylaw.faculty.id },
                }"
              >
                {{
                  getTranslatedName(data.item.student.program.bylaw.faculty)
                }},
              </b-link>
              <b-link
                  :to="{
                  name: 'bylaw',
                  params: { id: data.item.student.program.bylaw.id },
                }"
              >
                {{ getTranslatedName(data.item.student.program.bylaw) }},
              </b-link>
              <b-link
                  :to="{
                  name: 'program',
                  params: { id: data.item.student.program.id },
                }"
              >
                {{ getTranslatedName(data.item.student.program) }},
              </b-link>
              <span v-if="data.item.section && data.item.section.group && data.item.section.group.name">
                G(<span>{{
                  getTranslatedName({
                    name: data.item.section.group.name,
                    name_local: data.item.section.group.name_local,
                  })
                }}</span
              >), S({{
                  getTranslatedName({
                    name: data.item.section.name,
                    name_local: data.item.section.name_local,
                  })
                }})
              </span>
              <br/>
              <span v-for="status in data.item.status" :key="status">
                <b-badge
                    :variant="getRegistrationStatusBadgeColor(status.id)"
                    style="margin-left: 3px"
                >
                  {{ $i18n.locale == 'en' ? status.name : status.name_local }}
                  <span
                      v-if="
                      status.id & RegistrationStatus.Improve ||
                      status.id & RegistrationStatus.Repeat
                    "
                  >
                    ({{
                      data.item.repeat_count
                          ? data.item.repeat_count
                          : data.item.improve_count
                    }})
                  </span>
                </b-badge>
              </span>
            </div>
          </template>

          <template #cell(actions)="data">
            <div>
              <b-link v-if="propOfferingId && hasPermission('batch_delete_registration')">
                <feather-icon
                    v-b-tooltip.hover="$t('Global.select')"
                    v-if="selectedRegistrations.includes(data.item.id)"
                    icon="CheckCircleIcon"
                    class="text-success"
                    @click="selectItem(data.item.id,selectedRegistrations.indexOf(data.item.id))"
                />
                <feather-icon
                    v-else
                    v-b-tooltip.hover="$t('Global.select')"
                    icon="CircleIcon"
                    class="text-primary"
                    @click="selectItem(data.item.id,selectedRegistrations.indexOf(data.item.id))"
                />
              </b-link>
              <b-link
                  v-if="hasPermission('access_registration') && propOfferingId"
                  :to="{
                  name: 'advising_registration',
                  params: { id: data.item.student.id },
                }"
              >
                <feather-icon
                    v-b-tooltip.hover="$t('Global.registrations')"
                    icon="EyeIcon"
                    style="cursor: pointer"
                />
              </b-link>

              <b-link
                  v-if="hasPermission('access_control') && propOfferingId"
                  :to="{
                  name: 'students_view',
                  params: {
                    student_id: data.item.student.id,
                    term_id: data.item.offering.term_id,
                  },
                }"
              >
                <feather-icon
                    v-b-tooltip.hover="$t('Global.Control')"
                    icon="CompassIcon"
                    style="cursor: pointer"
                />
              </b-link>

              <b-link
                  v-if="
                  (data.item.status.find((o) => o.id == 1048576) &&
                    hasPermission('remove_registration')) ||
                  hasPermission('removeRegistered_registration')
                "
                  :disabled="(offering && offering.status.id !== 0)"
                  @click="remove(data.item.id, $event)"
              >
                <feather-icon
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    :class="(offering && offering.status.id !== 0) ? 'text-muted' : 'text-danger'"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal
        no-close-on-backdrop
        ref="my-modal"
        v-model="show_modal"
        hide-footer
        :title="$t('Global.batch_enroll_students')"
    >
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <b-row>
          <!-- <b-col  cols="6" md="5">
            <b-form-checkbox v-model="auto_select_section" style="margin-top: 6px" class="mt-0 custom-control-primary">{{$t("Auto Select Section")}}</b-form-checkbox>

          </b-col> -->
          <b-col cols="12" md="12">
            <v-select
                v-model="batch_section_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="getSectionsLookups"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.section')"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            >
              <template v-slot:option="option">
                <span v-if="option.group">
                  <span v-if="$i18n.locale == 'ar'">
                    {{
                      option.name_local + '( ' + option && option.group
                          ? option.group.name_local
                          : '' + ' )'
                    }}
                  </span>
                  <span v-else>
                    {{
                      option.name + '( ' + option && option.group
                          ? option.group.name
                          : '' + ' )'
                    }}
                  </span>
                </span>
                <span v-else>
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </span>
              </template>
              <template #selected-option="{ name, name_local, group }">
                <div v-if="group" style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'"
                  >{{ name_local + '( ' + group.name_local || '' + ' )' }}
                  </strong>
                  <strong v-else
                  >{{ name + '( ' + group.name || '' + ' )' }}
                  </strong>
                </div>
                <div v-else style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                  <strong v-else>{{ name }} </strong>
                </div>
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>
          </b-col>
        </b-row>

        <validation-observer ref="simpleForm">
          <b-form @submit.stop.prevent="enrollStudents">
            <b-col cols="12" md="12">
              <b-form-group label-for="name-input">
                <validation-provider
                    #default="{ errors }"
                    name="codes"
                    rules="required"
                >
                  <b-form-textarea
                      id="name-input"
                      v-model="codes"
                      rows="5"
                      placeholder="Student Codes (Ex: 1234567, 2234567, 3234567, 4234567) (Hint: User comma or line break)"
                      :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <div class="mt-2" :class="load ? 'disabled_all' : ''">
              <b-col cols="12" md="12">
                <div class="d-flex justify-content-end">
                  <b-button type="submit" variant="primary" class="mr-1">
                    {{ $t('Global.enroll_students') }}
                  </b-button>
                  <b-button
                      type="reset"
                      variant="outline-primary"
                      @click="show_modal = false"
                  >
                    {{ $t('Global.cancel') }}
                  </b-button>
                </div>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
      </div>
    </b-modal>

    <b-modal
        no-close-on-backdrop
        ref="errors-model"
        v-model="errors_model"
        hide-footer
        :title="
        errors && errors.data && errors.data.success
          ? $t('Global.success')
          : $t('Global.failed')
      "
    >
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <b-alert
            show
            class="p-1"
            :variant="
            errors && errors.data && errors.data.success ? 'success' : 'danger'
          "
        >
          <span v-if="errors && errors.data && errors.data.msg">
            {{
              errors &&
              errors.data &&
              ($i18n.locale == 'en' ? errors.data.msg.en : errors.data.msg.ar)
            }}
          </span>
          <span v-else>
            {{ message }}
          </span>
        </b-alert>

        <div
            v-if="
            errors &&
            errors.data &&
            errors.data.failedResaonsArray &&
            errors.data.failedResaonsArray.length
          "
            variant="danger"
        >
          <b-badge
              variant="danger"
              class="custom_badge"
              :key="i"
              v-for="(error, i) in errors.data.failedResaonsArray"
          >
            <span>
              {{ error }}
            </span>
          </b-badge>
        </div>
        <div v-else>
          <div
              v-if="
              errors &&
              errors.data &&
              errors.data.enrollStatus &&
              errors.data.enrollStatus.failedResaonsArray &&
              errors.data.enrollStatus.failedResaonsArray.length
            "
          >
            <b-badge
                variant="danger"
                :key="i"
                v-for="(error, i) in errors.data.enrollStatus.failedResaonsArray"
            >
              <span>
                {{ error }}
              </span>
            </b-badge>
          </div>
        </div>

        <div class="mt-2" :class="load ? 'disabled_all' : ''">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button
                  type="reset"
                  variant="outline-primary"
                  @click="errors_model = false"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </div>
          </b-col>
        </div>
      </div>
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
  BAlert,
  BPopover,
  BForm,
  BFormGroup,
  BFormTextarea,
  BFormCheckbox,
} from 'bootstrap-vue'
import DataTable from '@/views/components/table/DataTable'
import { mapGetters, mapActions } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { RegistrationStatus } from '@/mixins/enums'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  name: 'registrations',
  components: {
    DataTable,
    BCard,
    BAlert,
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
    BForm,
    BFormGroup,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BFormCheckbox,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
    propOfferingId: null,
    offering: null,
  },
  data() {
    return {
      show_modal: false,
      errors_model: false,
      codes: '',
      errors: null,
      message: null,
      filterData: null,
      selectedRegistrations: [],
      levels: [],
      filter: {
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        level_number: null,
        program_id: null,
        course_id: null,
        section_id: null,
        offering_id: null,
        registration_status_id: null,
        course_status_id: null,
        offerings_control_status: null,
        students_stage: null,
        study_type: null,
        removed: 0,
        export: 0,
      },
      paramsLoaded: true,
      batch_section_id: 'selected',
      auto_select_section: true,
      searchedCoursesOptions: [],
      searchLoading: false,
    }
  },
  computed: {
    RegistrationStatus() {
      return RegistrationStatus
    },
    ...mapGetters({
      items: 'registrations/items',
      total: 'registrations/total',
      load: 'registrations/load',
      lookups: 'registrations/lookups',
      currentTerm: 'app/currentTerm',
    }),
    getSectionsLookups() {
      if (this.lookups && this.lookups.sections) {
        return [
          {
            id: 'selected',
            name: 'Auto select section',
            name_local: 'اخيار الفصل اوتوماتيكيا',
          },
        ].concat(this.lookups.sections)
      } else {
        return []
      }
    },
    selectedSection: function () {
      return this.$route.query.section_id
    },
    selectedOffering: function () {
      return this.$route.query.offering_id
    },
    fields: function () {
      let fields = [
        {
          key: 'id',
          label: this.$t('Registration ID'),
          sortable: true,
        },
        {
          key: 'user',
          label: this.$t('Global.student'),
          sortable: true,
        },
      ]

      if (!this.propOfferingId) {
        fields.push({
          key: 'offering',
          label: this.$t('Global.offering'),
          sortable: true,
        })
      }

      fields.push({
        key: 'study',
        label: this.$t('Global.study'),
        sortable: true,
      })

      fields.push({
        key: 'actions',
        label: this.$t('Global.actions'),
        thClass: 'customAction',
        tdClass: 'customWidth',
      })

      return fields
    },
    getEmptyListLabel() {
      return this.$i18n.locale == 'en'
          ? 'Sorry, No Matching Options.'
          : 'لاتوجد نتائج مطابقة للبحث.'
    },
  },
  methods: {
    ...mapActions({
      exportExcel: 'registrations/export',
      getLookups: 'app/GET_LOOKUPS',
    }),
    fetchCourses(search, loading) {

      let query = {
        search_courses_keyword: search,
      }

      if (search.length > 3 && !this.searchLoading) {
        this.searchLoading = true
        loading(true)
        this.getLookups(query)
            .then((res) => {
              this.searchedCoursesOptions = res.success.search_courses
              loading(false)
            })
            .catch((err) => {
              loading(false)
              this.searchLoading = false
            })
            .finally(() => {
              this.searchLoading = false
            })
      }
    },
    loadBylawLevels(bylawId, programId) {
      this.getLookups({
        bylaw_levels: bylawId,
        bylaw_levels_program_id: programId,
      })
          .then((response) => {
            this.levels = response.success.bylaw_levels
          })
    },
    refresh(query = null) {
      if (this.bylaw_id) {
        query = {
          ...query,
          bylaw_id: this.bylaw_id
        }
      }
      if (this.course_id) {
        query = {
          ...query,
          course_id: this.course_id
        }
      }

      if (this.level_number) {
        query = {
          ...query,
          level_number: this.level_number
        }
      }

      if (this.$route.query && this.$route.query.offering_id) {
        query = {
          ...query,
          offering_id: Number(this.$route.query.offering_id),
        }
      }
      if (this.$route.query && this.$route.query.section_id) {
        query = {
          ...query,
          section_id: Number(this.$route.query.section_id)
        }
      }

      if (this.propOfferingId) {
        query = {
          ...query,
          offering_id: Number(this.propOfferingId)
        }
      }
      this.$store.dispatch('registrations/registrations', { query: query })
    },
    open(id) {
      window.open(
          this.$router.resolve({
            name: 'edit_term',
            params: { id: id }
          }).href,
          '_blank'
      )
    },
    reset() {
      let terms = [
        'term_id',
        'admission_term_id',
        'admission_term_PG_id',
        'admission_term_UG_id',
        'control_term_id',
        'exam_term_id',
        'transfer_term_id',
      ]
      let query = { ...this.$route.query, ...{} }
      let currentTerm = terms.find((el) => {
        return Object.keys(query)
            .some((qu) => {
              return el == qu
            })
      })
      Object.keys(query)
          .forEach((key) => {
            if (key != currentTerm && key != 'removed' && key != 'export') {
              this.filter[key] = null
            }
          })
      this.resetFilterQueryParams(terms)
    },

    remove(id, $event) {
      // to check if he click on ctrl with click to skip confirm message
      if ($event.ctrlKey) {
        this.removeRequest(id, true)
      } else {
        this.$swal({
          title: this.$t('Global.deleteTitle'),
          text: this.$t('Global.deleteText'),
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: this.$t('Global.cancel'),
          confirmButtonText: this.$t('Global.deleteBtn'),
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        })
            .then((result) => {
              if (result.value) {
                this.removeRequest(id)
              }
            })
      }
    },
    removeRequest(id, disableSwal = false) {
      this.$store.dispatch('registrations/remove', id)
          .then((_) => {
            this.refresh()
            if (!disableSwal) {
              this.$swal({
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                title: this.$t('Global.deleted'),
              })
            }
          })
    },
    Export(query) {
      query = {
        ...query,
        language: this.$i18n.locale
      }
      this.exportExcel(query)
      this.filter.export = 0
    },
    toggleEnrollModal() {
      this.codes = ''
      this.batch_section_id = 'selected'
      this.auto_select_section = true
      this.errors = ''
      this.show_modal = !this.show_modal
    },
    enrollStudents() {
      let el = document.getElementById('sweetAlert')
      this.$refs.simpleForm.validate()
          .then((success) => {
            if (success) {
              // to send form data with files
              const formData = new FormData()
              formData.append('offering_id', this.propOfferingId)
              formData.append('codes', this.codes)
              formData.append(
                  'section_id',
                  this.batch_section_id == 'selected' ? 0 : this.batch_section_id
              )
              formData.append('lang', this.$i18n.locale)

              this.$store
                  .dispatch('registrations/enrollStudents', formData)
                  .then((response) => {
                    this.errors = response
                    if (response.data.success) {
                      if (response.data.enrollStatus) {
                        this.message =
                            this.$t('Global.existing_enrollments') +
                            ' ' +
                            response.data.enrollStatus.ignored +
                            ', ' +
                            this.$t('Global.invalid_enrollments') +
                            ' ' +
                            response.data.enrollStatus.invalid +
                            ', ' +
                            this.$t('Global.succeeded_to_enroll') +
                            ' ' +
                            response.data.enrollStatus.succeeded +
                            ' ' +
                            this.$t('Global.and_failed_to_enroll') +
                            ' ' +
                            response.data.enrollStatus.failed
                      } else {
                        this.message =
                            this.$i18n.locale == 'en'
                                ? response.data.msg.en
                                : response.data.msg.ar
                      }
                      this.errors_model = true
                      this.refresh()
                    } else {
                      this.errors_model = true
                      //   this.$swal({
                      //     icon: 'error',
                      //     html: `${response.data.msg}` +
                      // ` <strong><a href="ddd"> ${this.$t('Global.details')}</a> </strong>`,
                      //     title: `${this.$t('Global.failed')}`,
                      //     text: response.data.msg,
                      //     showConfirmButton: true,
                      //   })
                    }
                    this.codes = ''
                    this.show_modal = false
                  })
                  .catch((error) => {
                    this.$swal({
                      icon: 'error',
                      title: `${this.$t('Global.failed')}`,
                      text: error.message,
                      showConfirmButton: true,
                    })
                    this.codes = ''
                    this.show_modal = false
                  })
            }
          })
    },
    getOfferingStatusBadgeColor(status) {
      switch (status) {
        case 0: //submitted
          return 'light-warning'
        case 1: //submitted
          return 'light-info'
        case 2: //accepted
          return 'light-secondary'
        case 3: //approved
          return 'light-primary'
        case 4: //published
          return 'light-success'
        case 11: //frozen
          return 'light-success'
        default:
          return 'dark'
      }
    },
    getOfferingStatusLabel(status) {
      for (let i = 0; i < this.lookups.control_statuses.length; i++) {
        if (this.lookups.control_statuses[i].id == status) {
          if (this.$i18n.locale == 'en') {
            return this.lookups.control_statuses[i].name
          } else {
            return this.lookups.control_statuses[i].name_local
          }
        }
      }
    },
    selectItem(id, index) {
      if (!this.selectedRegistrations.includes(id)) {
        this.selectedRegistrations.push(id)
      } else {
        this.selectedRegistrations.splice(index, 1)
      }
    },
    deleteRegistrations() {
      let text = this.selectedRegistrations.length ? this.$t('Global.deleteAllSelectedRegistrationsText') : this.$t('Global.deleteAllRegistrationsText')
      this.$swal({
        title: this.$t('Global.deleteTitle'),
        text: text,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('Global.cancel'),
        confirmButtonText: this.$t('Global.deleteBtn'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
          .then((result) => {
            if (result.value) {
              this.$store.dispatch('registrations/deleteRegistrations', {
                offering_id: this.propOfferingId,
                registrations_ids: this.selectedRegistrations
              })
                  .then(_ => {
                    this.selectedRegistrations = []
                    this.paramsLoaded = false
                    this.refresh()
                    this.$toast({
                      component: ToastificationContent,
                      position: 'top-right',
                      props: {
                        title: 'Success',
                        variant: 'success',
                        text: `${this.$t('Global.successMessage')}`,
                      },
                    })
                  })
            }
          })
    }
  },
  watch: {
    auto_select_section: function (val) {
      if (this.auto_select_section == true) {
        this.batch_section_id = 0
      }
    },
    'filter.bylaw_id': function (newValue, oldValue) {
      this.loadBylawLevels(newValue, this.filter.program_id)
      if (this.filter.program_id && oldValue) {
        this.filter.program_id = null
      }

      if (this.filter.level_number && oldValue) {
        this.filter.level_number = null
      }
    },
  },
}
</script>
<style lang="scss">
.custom_badge {
  text-align: initial;
  white-space: normal;
  margin-bottom: 0.5rem;
}
</style>


