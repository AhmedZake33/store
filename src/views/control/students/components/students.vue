<template>
  <div>
    <DataTable
      :title="title"
      :total="total"
      :allow-search="true"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @reset="reset"
      default-filter="control_term_id"
    >
      <template v-if="lookups && !listed_only" #filter>
        <b-col v-if="lookups && lookups.offering_terms" cols="6" md="3">
          <v-select
            :clearable="false"
            v-model="filter.control_term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.offering_terms"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
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
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.faculties"
            :label="getSelectLabel()"
            class="w-100 mb-2"
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
            v-model="filter.bylaw_id"
            :disabled="!filter.faculty_id || load"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.bylaws"
            :label="getSelectLabel()"
            class="w-100 mb-2"
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
            v-model="filter.program_id"
            :disabled="!filter.bylaw_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.programs"
            :label="getSelectLabel()"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.program')"
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
            v-model="filter.level_id"
            :disabled="!filter.bylaw_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="levels"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
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
            v-model="filter.type"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.study_types"
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
                  option.name + ' ( ' + option.code + ' )' || option.name_local
                }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == 'ar'
                  ? option.name_local
                  : option.name + ' ( ' + option.code + ' )'
              }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="3">
          <v-select
            v-model="filter.registration_status_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.registration_statuses"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.registration_status')"
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
            v-model="filter.students_grade_terms"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.students_grade_terms"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.grades_status')"
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
            v-model="filter.offerings_control_status"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.offerings_control_statuses"
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
            v-model="filter.students_status"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="(lookups && lookups.students_status) || []"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.Enrollment Status')"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                <strong v-else>{{ name }}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col md="3">
          <b-form-group>
            <b-form-datepicker
              reset-button
              :placeholder="$t('Global.from_date')"
              v-model="filter.from_date"
              class="mb-1"
              :max="fromMaxDate"
            />
          </b-form-group>
        </b-col>

        <b-col md="3">
          <b-form-group>
            <b-form-datepicker
              reset-button
              :placeholder="$t('Global.to_date')"
              v-model="filter.to_date"
              class="mb-1"
              :min="toMinDate"
              :max="toMaxDate"
            />
          </b-form-group>
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
              <span v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </span>
              <span v-else>
                {{
                  option.name + ' ( ' + option.code + ' )' || option.name_local
                }}
              </span>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == 'ar'
                    ? option.name_local
                    : option.name + ' ( ' + option.code + ' )'
              }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <!-- <b-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList()"
          class="w-100"
          :reduce="val => val.value"
          placeholder="Users Status"
        />
      </b-col> -->
      </template>
      <template #customTable>
        <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          class="position-relative font-small-2"
          responsive
          :items="items"
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(code)="data">
            <span>
              {{ data.item.user.code }}
            </span>
          </template>
          <template #cell(program)="data">
            <b-link
              v-if="$i18n.locale == 'en' && data.item.program"
              :to="{ name: 'program', params: { id: data.item.program.id } }"
            >
              {{
                data.item.program.name
                  ? data.item.program.name
                  : data.item.program.name_local
              }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar' && data.item.program"
              :to="{ name: 'program', params: { id: data.item.program.id } }"
            >
              {{
                data.item.program.name_local
                  ? data.item.program.name_local
                  : data.item.program.name
              }}
            </b-link>
          </template>
          <template #cell(term)="data">
            <span v-if="$i18n.locale == 'en' && data.item.term">
              {{
                data.item.term.name
                  ? data.item.term.name
                  : data.item.term.name_local
              }}
            </span>
            <span v-if="$i18n.locale == 'ar' && data.item.term">
              {{
                data.item.term.name_local
                  ? data.item.term.name_local
                  : data.item.term.name
              }}
            </span>
          </template>

          <template #cell(name)="data">
            <b-link
              v-if="$i18n.locale == 'ar'"
              class="font-weight-bold d-inline-block"
              :to="{ name: 'student-show', params: { id: data.item.id } }"
            >
              {{
                data.item.user && data.item.user.name_local
                  ? data.item.user.name_local
                  : '-'
              }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold d-inline-block"
              :to="{ name: 'student-show', params: { id: data.item.id } }"
            >
              {{
                data.item.user && data.item.user.name
                  ? data.item.user.name
                  : '-'
              }}
            </b-link>
          </template>
          <template #cell(registration_status)="data">
            <div style="display: inline-block">
              <b-badge
                variant="light-success"
                class="mr-1 mb-1"
                v-if="data.item.Registered_count > 0"
              >
                {{ data.item.Registered_count }} {{ $t('Global.registered') }}
              </b-badge>
              <b-badge
                variant="light-danger"
                class="mr-1 mb-1"
                v-if="data.item.Absent_count > 0"
              >
                {{ data.item.Absent_count }} {{ $t('Global.absent') }}
              </b-badge>
              <b-badge
                variant="light-warning"
                class="mr-1 mb-1"
                v-if="data.item.Repeat_count > 0"
              >
                {{ data.item.Repeat_count }} {{ $t('Global.repeat') }}
              </b-badge>
              <b-badge
                variant="light-info"
                class="mr-1"
                v-if="data.item.Excused_count > 0"
              >
                {{ data.item.Excused_count }} {{ $t('Global.excused') }}
              </b-badge>
            </div>
          </template>

          <template #cell(grades_status)="data">
            <div style="display: inline-block">
              <b-badge
                :variant="checkFinishStatus(data.item).status"
                class="mr-1 mb-1"
              >
                {{ checkFinishStatus(data.item).name }}
              </b-badge>
            </div>
          </template>

          <template #cell(control_status)="data">
            <div style="display: inline-block">
              <div style="display: inline-block">
                <b-badge
                  variant="light-warning"
                  class="mr-1 mb-1"
                  v-if="data.item.Draft_count > 0"
                >
                  {{ data.item.Draft_count }} {{ $t('Global.draft') }}
                </b-badge>
                <b-badge
                  variant="light-info"
                  class="mr-1 mb-1"
                  v-if="data.item.Submitted_count > 0"
                >
                  {{ data.item.Submitted_count }} {{ $t('Global.Submitted') }}
                </b-badge>
                <b-badge
                  variant="light-secondary"
                  class="mr-1 mb-1"
                  v-if="data.item.Accepted_count > 0"
                >
                  {{ data.item.Accepted_count }} {{ $t('Global.Accepted') }}
                </b-badge>
                <b-badge
                  variant="light-primary"
                  class="mr-1 mb-1"
                  v-if="data.item.Approved_count > 0"
                >
                  {{ data.item.Approved_count }} {{ $t('Global.approved') }}
                </b-badge>
                <b-badge
                  variant="light-success"
                  class="mr-1 mb-1"
                  v-if="data.item.Published_count > 0"
                >
                  {{ data.item.Published_count }} {{ $t('Global.Published') }}
                </b-badge>
                <b-badge
                  variant="light-danger"
                  class="mr-1"
                  v-if="data.item.Frozen_count > 0"
                >
                  {{ data.item.Frozen_count }} {{ $t('Global.Frozen') }}
                </b-badge>
              </div>
            </div>
          </template>

          <template #cell(actions)="data" v-if="!listed_only">
            <div>
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
              <b-link
                :to="{
                  name: 'students_view',
                  params: {
                    student_id: data.item.id,
                    term_id: data.item.term_id,
                  },
                }"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
      <!--TODO Enable finish button Later-->
      <template
        #action
        v-if="!listed_only && hasPermission('finish_controlAction')"
      >
        <b-dropdown right v-if="hasPermission('skip_next_summer_controlAction') && nextSummerTerm" variant="primary">
          <template #button-content>
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="btn-icon p-0">
              <feather-icon icon="CheckSquareIcon" />
              {{ $t('Global.finish') }}
            </b-button>
          </template>
          <b-dropdown-item @click="confirmFinish(false)">
            {{ $t('Global.Normal') }}
          </b-dropdown-item>
          <b-dropdown-item @click="confirmFinish(true)">
            {{ $t('Global.SkipSummer') + "(" + (getTranslatedName(nextSummerTerm)) + ")" }}
          </b-dropdown-item>
        </b-dropdown>
        <b-button v-else
          v-b-tooltip.hover="$t('Global.finish')"
          class="btn-icon"
          variant="primary"
          @click="confirmFinish(false)"
        >
          <feather-icon icon="CheckSquareIcon" />
          {{ $t('Global.finish') }}
        </b-button>
      </template>
    </DataTable>

    <!-- <Modal :show="statusModal" :title="$t('Global.finish_progress')" :size="'lg'"></Modal> -->

    <b-modal
      ref="my-modal"
      size="lg"
      v-model="statusModal"
      hide-footer
      :title="$t('Global.finish_progress')"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col cols="12" md="12" v-if="total_message">
            <div class="bg-gray">
              <b-alert variant="info" show>
                <div class="alert-body">
                  <span> {{ total_message }}</span>
                </div>
              </b-alert>
            </div>
          </b-col>
          <b-col
            cols="12"
            md="12"
            class="height-250 overflow-y-scroll"
            v-if="status_messages.length"
          >
            <div
              class="bg-gray"
              v-for="status_message in status_messages"
              :key="status_message.studentId"
            >
              <b-alert :variant="status_message.class" show>
                <div class="alert-body">
                  <span
                    v-if="
                      status_message.status &&
                      status_message.offering_id == undefined
                    "
                  >
                    {{ status_message.count + ' - ' + $t('Global.finished') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >
                  </span>
                  <span
                    v-else-if="
                      status_message.status &&
                      status_message.offering_id != undefined
                    "
                  >
                    {{ status_message.count + ' - ' + $t('Global.finished') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >, {{ $t('Global.course') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'offering',
                        params: { id: status_message.offering_id },
                        query: { tabNum: 5 },
                      }"
                      >{{
                        $i18n.locale == 'en'
                          ? status_message.course_name
                          : status_message.course_name_local
                      }}</b-link
                    >
                    {{ $t('Global.is_not_approved_published') }}
                  </span>
                  <span
                    v-else-if="
                      !status_message.status && status_message.offering_id
                    "
                  >
                    {{ status_message.count + ' - ' + $t('Global.failed') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >
                    {{ $t('Global.has_a_not_approved') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'offering',
                        params: { id: status_message.offering_id },
                        query: { tabNum: 5 },
                      }"
                      >{{
                        $i18n.locale == 'en'
                          ? status_message.course_name
                          : status_message.course_name_local
                      }}</b-link
                    >
                  </span>
                  <span
                    v-else-if="!status_message.status && status_message.msg"
                  >
                    {{ status_message.count + ' - ' + $t('Global.failed') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >
                    {{ status_message.msg }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'offering',
                        params: { id: status_message.offering_id },
                        query: { tabNum: 5 },
                      }"
                      >{{
                        $i18n.locale == 'en'
                          ? status_message.course_name
                          : status_message.course_name_local
                      }}</b-link
                    >
                  </span>
                  <span
                    v-else-if="!status_message.status && status_message.msg"
                  >
                    {{ status_message.count + ' - ' + $t('Global.failed') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >
                    {{ status_message.msg }}
                  </span>
                  <span v-else>
                    {{ status_message.count + ' - ' + $t('Global.failed') }}:
                    {{ $t('Global.student') }}
                    <b-link
                      style="text-decoration: underline !important"
                      :class="'text-' + status_message.class"
                      :to="{
                        name: 'students_view',
                        params: {
                          student_id: status_message.studentId,
                          term_id: filter.control_term_id,
                        },
                      }"
                      >{{ status_message.studentCode }}</b-link
                    >
                  </span>
                </div>
              </b-alert>
            </div>
          </b-col>
        </b-form>
      </div>
      <div class="mt-2" v-if="showCloseButton">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
              type="reset"
              variant="outline-primary"
              @click="statusModal = false"
            >
              {{ $t('Global.close') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BAlert,
  BAvatar,
  BBadge,
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BDropdown,
  BDropdownItem,
  BForm,
  BFormDatepicker,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BLink,
  BMedia,
  BModal,
  BOverlay,
  BPagination,
  BPopover,
  BRow,
  BTable,
  VBModal,
} from 'bootstrap-vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Modal from '@/views/components/common/Modal.vue';
import DataTable from '@/views/components/table/DataTable';
import Statistics from '@/views/components/info/statistics';
import { getToken } from '@/utils/auth';

export default {
  name: 'Students',
  components: {
    DataTable,
    Modal,
    BFormDatepicker,
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
    BForm,
    BFormTextarea,
    BAlert,
    BFormGroup,
    VBModal,
    BPopover,
    Statistics,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: { type: Boolean, default: false },
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDate = new Date(today);

    return {
      nextSummerTerm: {},
      showCloseButton: false,
      statusModal: false,
      total_message: '',
      status_messages: [],
      finishStatusBadge: '',
      levels: [],
      filter: {
        type: null,
        control_term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        level_id: null,
        status: null,
        students_grade_terms: null,
        offerings_control_status: null,
        registration_status_id: null,
        control_types: null,
        from_date: null,
        to_date: null,
        students_status: null,
        keywords: '',
      },
      toMaxDate: maxDate,
      toMinDate: null,
      fromMaxDate: maxDate,
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "controlStudents/items",
      total: "controlStudents/total",
      load: "controlStudents/load",
      needDrop:'app/needDrop',
      lookups: "controlStudents/lookups",
      currentControlTerm: "app/currentControlTerm",
    }),
    getEmptyListLabel() {
      return this.$i18n.locale === 'en'
        ? 'Sorry, No Matching Options.'
        : 'لاتوجد نتائج مطابقة للبحث.';
    },
    fieldsData() {
      let fields = [
        /*  {
          key: 'id',
          label:this.$t('Global.id'),
          sortable: true,
        }, */
        {
          key: 'code',
          label: this.$t('Global.code'),
          thStyle: { width: '7%' },
          sortable: true,
        },

        {
          key: 'name',
          label: this.$t('Global.name'),
          thStyle: { width: '20%' },
          sortable: true,
        },
        {
          key: 'program',
          label: this.$t('Global.program'),
          thStyle: { width: '15%' },

          sortable: true,
        },
        {
          key: 'term',
          label: this.$t('Global.term'),
          thStyle: { width: '10%' },

          sortable: true,
        },
        {
          key: 'registration_status',
          label: this.$t('Global.registration_status'),
          thStyle: { width: '21%' },
          sortable: false,
        },
        {
          key: 'grades_status',
          label: this.$t('Global.grades_status'),
          thStyle: { width: '5%' },
          sortable: false,
        },
        {
          key: 'control_status',
          label: this.$t('Global.control_status'),
          thStyle: { width: '20%' },
          sortable: false,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      return fields;
    },
    language: function () {
      localStorage.setItem('mylang', this.$i18n.locale);
      return this.$i18n.locale;
    },
    header: function () {
      localStorage.setItem('headers', false);
      return false;
    },
  },
  watch: {
    // currentControlTerm: function (newVal) {
    //   if (this.$route.query.control_term_id){
    //     this.filter.control_term_id = this.$route.query.control_term_id;
    //   }else{
    //     if(this.lookups && this.lookups.offering_terms){
    //       this.filter.control_term_id = newVal;
    //     }
    //   }
    // },
    'lookups.next_summer_term': function (newValue, oldValue) {
      this.nextSummerTerm = newValue;
    },
    'filter.bylaw_id': function (newValue, oldValue) {
      this.loadBylawLevels(newValue, this.filter.program_id);
      if (this.filter.program_id && oldValue) {
        this.filter.program_id = null;
      }

      if (this.filter.level_id && oldValue) {
        this.filter.level_id = null;
      }
    },
    'filter.faculty_id': function (newValue, oldValue) {
      if (this.filter.bylaw_id && oldValue) {
        this.filter.bylaw_id = null;
      }
    },
    'filter.from_date': function (newValue) {
      this.toMinDate = newValue;
      this.checkDateRange();
    },
    'filter.to_date': function (newValue) {
      this.checkDateRange();
      this.fromMaxDate = newValue;
    },
    'filter.program_id': function (newValue) {
      this.loadBylawLevels(this.filter.bylaw_id, newValue);
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
      getLookups: 'app/GET_LOOKUPS',
      updateCurrentTerms: 'app/getTerms',
      // exportStudentGradesPDF: "courseOfferings/exportPDF", // pdf
    }),
    checkFinishStatus(data) {
      if (data.finished_count != data.total_registrations_count) {
        // this.finishStatusBadge = 'light-danger'
        // return this.$t('Global.not_finished')
        return { name: this.$t('Global.not_finished'), status: 'light-danger' };
      } else {
        // this.finishStatusBadge = 'light-success';
        return { name: this.$t('Global.finished'), status: 'light-success' };
      }
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
    coordinator(data) {
      if (data) {
        return data.filter((el) => el.role.name == 'Coordinator');
      }
    },
    externalCommittee(data) {
      if (data) {
        return data.filter((el) => el.role.name == 'External Committee');
      }
    },
    teacher(data) {
      if (data) {
        return data.filter((el) => el.role.name == 'Teacher');
      }
    },
    teachingAssistant(data) {
      if (data) {
        return data.filter((el) => el.role.name == 'Teaching Assistant');
      }
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program };
      }
      if (this.status) {
        query = { ...query, status: this.status };
      }
      if (this.$route.query && this.$route.query.control_term_id) {
        query = {
          ...query,
          control_term_id: this.$route.query.control_term_id,
        };
      }
      if (this.$route.query && this.$route.query.search) {
        query = {
          ...query,
          keywords: this.$route.query.search,
        };
      }
      this.$store.dispatch('controlStudents/students', { query });
    },

    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local';
    },

    getColor(status) {
      if (status == 'Draft') {
        return 'light-warning';
      } else if (status == 'Submitted') {
        return 'light-success';
      } else if (status == 'Accepted') {
        return 'light-info';
      } else if (status == 'Approved') {
        return 'light-dark';
      } else if (status == 'Published') {
        return 'light-primary';
      }
    },
    exportPDF(offering_id) {
      /*   */
    },
    checkDateRange() {
      let fromDate = new Date(this.filter.from_date);
      let toDate = new Date(this.filter.to_date);
      if (fromDate > toDate) {
        this.filter.from_date = null;
      }
    },
    loadBylawLevels(bylawId, programId) {
      this.getLookups({
        bylaw_levels: bylawId,
        bylaw_levels_program_id: programId,
      }).then((response) => {
        this.levels = response.success.bylaw_levels;
      });
    },
    async confirmFinish(skipSummer = false) {
      this.$swal({
        title: 'Are you sure?',
        text: `${this.$t('Global.confirmFinish')}`,
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: 'Yes, Finish!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          this.total_message = '';
          this.status_messages = [];
          this.statusModal = true;
          this.showCloseButton = false;
          let query = {
            ...this.filter,
            skip_summer: skipSummer
          };

          if (this.$route.query && this.$route.query.search) {
            query = {
              ...query,
              keywords: this.$route.query.search,
            };
          }
          let url = process.env.VUE_APP_BASE_URL + '/control/students/finish';
          const response = await fetch(url, {
            headers: {
              Authorization: 'Bearer ' + getToken(),
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(query),
          });
          let isDone = false;
          const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();
          while (!isDone) {
            const { value, done } = await reader.read();
            if (done || isDone) {
              this.refresh(query);
              break;
            }

            let allObjects =
              typeof value !== 'undefined' ? value.split('}') : {};
            if (allObjects.length) {
              for (let i = 0; i < allObjects.length; i++) {
                if (allObjects[i].trim() != '' && allObjects[i].trim()) {
                  let object = allObjects[i] + '}';
                  object = JSON.parse(object);

                  if (typeof object.studentId !== 'undefined') {
                    this.setStatusesMessages(object);
                  } else if (typeof object.allPassed !== 'undefined') {
                    isDone = true;
                    this.showCloseButton = true;
                    if (object.allPassed) {
                      this.$swal({
                        icon: 'success',
                        title: this.$t('Global.success'),
                        showConfirmButton: true,
                        text: this.$t('Global.finished_done_successfully'),
                      });
                    } else {
                      this.$swal({
                        icon: 'warning',
                        title: this.$t('Global.warning'),
                        showConfirmButton: true,
                        text: this.$t('Global.failedToFinish'),
                      });
                    }
                  }
                }
              }
            }
          }
        }
      });
    },
    setStatusesMessages(object) {
      let status_message = {};
      if (object.passed) {
        status_message.status = true;
        status_message.class = 'success';
        if (object.offering_id) {
          status_message.class = 'warning';
          status_message.offering_id = object.offering_id;
          status_message.course_name = object.course_name;
          status_message.course_name_local = object.course_name_local;
        }
      } else {
        status_message.status = false;
        status_message.class = object.type == 'warning' ? 'warning' : 'danger';
        if(object.offering_id) {
          status_message.offering_id = object.offering_id;
          status_message.course_name = object.course_name;
          status_message.course_name_local = object.course_name_local;
        } else {
          status_message.msg = object.msg;
        }
      }

      status_message.studentCode = object.studentCode;
      status_message.studentId = object.studentId;
      status_message.count = object.count;

      this.total_message =
        this.$t('Global.finish_progress') +
        ': ' +
        object.count +
        ' / ' +
        object.studentsCount;
      this.status_messages.push(status_message);

      /*this.$nextTick(() => {
        this.$refs.bottomStatusMessage?.scrollIntoView({behavior: 'smooth'})
      })*/

      return true;
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
