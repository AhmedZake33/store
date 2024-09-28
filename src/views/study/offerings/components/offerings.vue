<template>
  <div>
    <DataTable
        :title="title"
        :total="total"
        :allow-search="true"
        :filter="filter"
        :loading="load['offerings']"
        @Refresh="refresh"
        @reset="reset"
        importBtn
        :default-filter="'term_id'"
        apiLink="offerings"
        exportPermission="export_offering"
    >
      <template v-if="lookups['offerings'] && !listed_only" #filter>
        <b-col cols="6" md="4">
          <v-select
              v-model="filter.term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['offerings'] && lookups['offerings'].terms"
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

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.faculty_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['offerings'] && lookups['offerings'].faculties"
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

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.bylaw_id"
              :disabled="filter.faculty_id == null"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="load['bylawslookup'] ? [] : dependentLookups['bylaws']"
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
              {{ load['bylawslookup'] ? $t('Global.inProgress') : $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.program_id"
              :disabled="filter.bylaw_id == null"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="load['programslookup'] ? [] : dependentLookups['programs']"
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
              {{ load['programslookup'] ? $t('Global.inProgress') : $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="6" md="4">
          <v-select
              v-model="filter.status"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['offerings'] && lookups['offerings'].status"
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
        <b-col cols="6" md="4">
          <v-select
              v-model="filter.stage_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['offerings'] && lookups['offerings'].stages"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.stage')"
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
        <b-col cols="6" md="4">
          <v-select
              v-model="filter.type_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['offerings'] && lookups['offerings'].types"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.type')"
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
      </template>
      <template #customTable>
        <b-table
            @sort-changed="sortingChanged"
            no-local-sorting
            class="position-relative font-small-2"
            :items="items"
            responsive
            :fields="fieldsData"
            primary-key="id"
            show-empty
            :empty-text="load['offerings'] ? $t('Global.inProgress') : $t('Global.empty_text')"
        >
          <template #cell(course)="data">
            <div class="d-flex" v-if="data.item.course">
              <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold custom_link h5"
                  :to="{ name: 'course', params: { id: data.item.course.id } }"
              >
                {{
                  data.item.course
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name}`
                      : '-'
                }}
              </b-link>
              <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold custom_link h5"
                  :to="{ name: 'course', params: { id: data.item.course.id } }"
              >
                {{
                  data.item.course
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name_local}`
                      : '-'
                }}
              </b-link>
            </div>

            <!-- count data -->
            <div class="d-flex" style="font-weight: bold">
              <span>
                {{ $t('Global.students_count') }}:
                {{ data.item.registrations_count }}
              </span>
              &ndash;
              <span v-if="$i18n.locale == 'en'">
                {{ $t('Global.Sections_Groups') }}:
                {{ data.item.sections_count }}/{{ data.item.groups_count }}
              </span>
              <span v-else>
                {{ $t('Global.Sections_Groups') }}:
                {{ data.item.sections_count }} / {{ data.item.groups_count }}
              </span>
            </div>
            <!-- faculty AND bylaw AND satge  -->
            <div>
              <div v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                <b-link
                    v-if="data.item.faculty"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'faculty',
                    params: { id: data.item.faculty.id },
                  }"
                >
                  {{ data.item.faculty.name }}
                </b-link>
                &nbsp; &ndash; &nbsp;
                <b-link
                    v-if="data.item.bylaw"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'bylaw',
                    params: { id: data.item.bylaw.id },
                  }"
                >
                  {{ data.item.bylaw.name }}
                </b-link>
                &nbsp; &ndash; &nbsp;
                <span
                    v-if="
                    data.item &&
                    data.item.bylaw &&
                    data.item.bylaw.stage
                  "
                    style="color: #054978; font-weight: bold"
                >
                  {{
                    data.item.bylaw.stage.code
                        ? data.item.bylaw.stage.code
                        : '-'
                  }}
                </span>
              </div>
              <div v-else class="d-flex flex-wrap">
                <b-link
                    v-if="data.item.faculty"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'faculty',
                    params: { id: data.item.faculty.id },
                  }"
                >
                  {{ data.item.faculty.name_local }}
                </b-link>
                &ndash;
                <b-link
                    v-if="data.item.bylaw"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'bylaw',
                    params: { id: data.item.bylaw.id },
                  }"
                >
                  {{ data.item.bylaw.name_local }}
                </b-link>
                &ndash;
                <span
                    v-if="
                    data.item &&
                    data.item.bylaw &&
                    data.item.bylaw.stage
                  "
                    style="color: #054978; font-weight: bold"
                >
                  {{
                    data.item.bylaw.stage.code
                        ? data.item.bylaw.stage.code
                        : '-'
                  }}
                </span>
              </div>
            </div>
            <!-- semester -->
            <div>
              <div v-if="$i18n.locale == 'en'" class="d-flex">
                <b-link
                    v-if="data.item.term"
                    class="font-weight-bold custom_link d-block"
                    :to="{ name: 'term', params: { id: data.item.term.id } }"
                >
                  {{ data.item.term ? data.item.term.name : '-' }}
                </b-link>
              </div>
              <div v-if="$i18n.locale == 'ar'" class="d-flex">
                <b-link
                    v-if="data.item.term"
                    class="font-weight-bold custom_link d-block"
                    :to="{ name: 'term', params: { id: data.item.term.id } }"
                >
                  {{ data.item.term ? data.item.term.name_local : '-' }}
                </b-link>
              </div>
            </div>
          </template>


          <template #cell(instructors)="data">
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
              >{{ $t('Global.coordinator') }}: &nbsp;
              </strong>
              <div
                  v-for="(coordinator, i) in (arrLength = coordinator(
                  data.item.instructors
                ))"
                  :key="i"
              >
                <b-link
                    v-if="$i18n.locale == 'en'"
                    :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >{{ $i18n.locale == 'en' ? coordinator.academic_name : coordinator.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1">
                    , &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.teacher') }}: &nbsp;</strong>
              <div
                  v-for="(teacher, i) in (arrLength = teacher(
                  data.item.instructors
                ))"
                  :key="i"
              >
                <b-link
                    v-if="$i18n.locale == 'en'"
                    :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
                <b-link
                    v-if="$i18n.locale == 'ar'"
                    :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.TeachingAssistantEdit') }}: &nbsp;</strong>
              <div
                  v-for="(TeachingAssistantEdit, i) in (arrLength =
                  TeachingAssistantEdit(data.item.instructors))"
                  :key="i"
              >
                <b-link
                    v-if="$i18n.locale == 'en'"
                    :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantEdit.id },
                  }"
                >{{ TeachingAssistantEdit.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
                <b-link
                    v-if="$i18n.locale == 'ar'"
                    :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantEdit.id },
                  }"
                >{{ TeachingAssistantEdit.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.TeachingAssistantView') }}: &nbsp;</strong>
              <div
                  v-for="(TeachingAssistantView, i) in (arrLength =
                  TeachingAssistantView(data.item.instructors))"
                  :key="i"
              >
                <b-link
                    v-if="$i18n.locale == 'en'"
                    :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantView.id },
                  }"
                >{{ TeachingAssistantView.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
                <b-link
                    v-if="$i18n.locale == 'ar'"
                    :to="{
                    name: 'user-show',
                    params: { id: TeachingAssistantView.id },
                  }"
                >{{ TeachingAssistantView.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <strong>{{ $t('Global.examinerCommittee') }}: &nbsp;</strong>
              <div
                  v-for="(examinationCommittee, i) in (arrLength =
                  examinationCommittee(data.item.instructors))"
                  :key="i"
              >
                <b-link
                    class="font-weight-bold"
                    v-if="$i18n.locale == 'en'"
                    :to="{
                    name: 'user-show',
                    params: { id: examinationCommittee.id },
                  }"
                >{{ examinationCommittee.academic_name }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >

                <b-link
                    class="font-weight-bold"
                    v-if="$i18n.locale == 'ar'"
                    :to="{
                    name: 'user-show',
                    params: { id: examinationCommittee.id },
                  }"
                >{{ examinationCommittee.academic_name_local }}
                  <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                  ></b-link
                >
              </div>
            </div>
          </template>


          <template #cell(status)="data">
            <b-badge
                pill
                :variant="getColor(data.item.status.name)"
                class="text-capitalize"
                v-if="$i18n.locale == 'en' && data.item.status"
            >
              {{ data.item.status.name }}
            </b-badge>
            <b-badge
                pill
                :variant="getColor(data.item.status.name)"
                class="text-capitalize"
                v-if="$i18n.locale == 'ar' && data.item.status"
            >
              {{ data.item.status.name_local }}
            </b-badge>
          </template>

          <template #cell(exams)="data">
            <div v-for="(exam, i) in data.item.exams" :key="i">
              <div v-if="$i18n.locale == 'en'" class="d-block">
                <span class="font-weight-bold">{{
                    $t('Global.exam_date')
                  }}</span>
                : {{ exam.exam_date }}
                <br/>
                <span class="font-weight-bold">{{ $t('Global.period') }}</span>
                :
                {{ exam.period || '-' }}
                <br/>
                <span class="font-weight-bold">{{
                    $t('Global.extended_periods')
                  }}</span>
                : {{ exam.extended_periods || '-' }}
                <br/>
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                      $t('Global.location')
                    }}</span>
                  :
                  {{
                    location
                        ? `${location.name} (${location.building && location.building.name})`
                        : '-'
                  }}
                </div>
              </div>
              <div v-if="$i18n.locale == 'ar'" class="d-block">
                <span class="font-weight-bold">{{
                    $t('Global.exam_date')
                  }}</span>
                : {{ exam.exam_date }}
                <br/>
                <span class="font-weight-bold">{{ $t('Global.period') }}</span>
                :
                {{ exam.period }}
                <br/>
                <span class="font-weight-bold">{{
                    $t('Global.extended_periods')
                  }}</span>
                : {{ exam.extended_periods }}
                <br/>
                <div v-for="(location, i) in exam.locations" :key="i">
                  <span class="font-weight-bold">{{
                      $t('Global.location')
                    }}</span>
                  :
                  {{
                    location
                        ? `${location.name_local} (${location.building && location.building.name_local})`
                        : '-'
                  }}
                </div>
              </div>
            </div>
          </template>


          <template #cell(id)="data">
            <div class="d-flex">
              <b-link :to="{ name: 'offering', params: { id: data.item.id } }">
                {{ data.item.id }}
              </b-link>
            </div>
          </template>
          <template #cell(actions)="data" v-if="!listed_only">
            <div
                v-if="
                hasPermission('access_offeringSchedule') &&
                $route.name == 'schedules'
              "
            >
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
              <b-link @click="openCalendar(data.item.id)">
                <feather-icon
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    class="text-primary"
                />
              </b-link>
            </div>
            <div>
              <b-link :to="{ name: 'offering', params: { id: data.item.id } }">
                <feather-icon
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    class="text-primary"
                />
              </b-link>
              <template v-if="data.item && data.item.status && data.item.status.name">
                <div
                    v-if="
                    (hasPermission('draft_show_barcode') &&
                      data.item.status.name == 'Draft') ||
                    (hasPermission('submit_show_barcode') &&
                      data.item.status.name == 'Submitted') ||
                    (hasPermission('review_show_barcode') &&
                      data.item.status.name == 'Reviewed') ||
                    (hasPermission('approve_show_barcode') &&
                      data.item.status.name == 'Approved') ||
                    (hasPermission('publish_show_barcode') &&
                      data.item.status.name == 'Published')
                  "
                >
                  <b-link
                      :to="{ name: 'barcode', params: { id: data.item.id } }"
                      v-b-tooltip.hover="$t('Global.barcode')"
                  >
                    <svg-icon type="mdi" :path="path" size="1em"></svg-icon>
                  </b-link>
                </div>
                <div v-else>
                  <b-link
                      v-b-tooltip.hover="$t('Global.barcode')"
                      class="text-secondary"
                      style="cursor: not-allowed"
                  >
                    <svg-icon type="mdi" :path="path" size="1em"></svg-icon>
                  </b-link>
                </div>
              </template>
              <b-link>
                <feather-icon
                    v-if="
                  data.item && data.item.status && data.item.status.name &&
                    data.item.removed == 0 &&
                    hasPermission('delete_offering') &&
                    data.item.status.name == 'Draft' &&
                    data.item.registrations_count == 0
                  "
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    class="text-danger"
                    @click="
                    deleteOffering(data.item.id, data.item.registrations_count)
                  "
                />
                <feather-icon
                    v-else
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    class="text-secondary"
                    style="cursor: not-allowed"
                />
              </b-link>
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
            </div>
          </template>
        </b-table>
      </template>
      <template #action v-if="!listed_only">
        <b-button
            v-if="hasPermission('add_offering')"
            v-b-tooltip.hover="$t('Global.add')"
            :to="{ name: 'add_offering' }"
            class="btn-icon"
            variant="primary"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <b-button
            v-else
            v-b-tooltip.hover="$t('Global.add')"
            class="btn-icon disabled_all"
            variant="primary"
            style="cursor: not-allowed"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <!--
                <b-button
                  v-if="hasPermission('export_offering')"
                  v-b-tooltip.hover="$t('Global.export_excel')"
                  class="btn-icon ml-1"
                  variant="primary"
                  @click="exportData"
                >
                  <feather-icon icon="FileTextIcon" />
                </b-button> -->
        <!-- <b-button
          v-else
          v-b-tooltip.hover="$t('Global.export_excel')"
          class="btn-icon ml-1 disabled_all"
          variant="primary"
          style="cursor: not-allowed"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button> -->
        <b-button
            v-b-tooltip.hover="$t('Global.exportMigrationDataTemplate')"
            :class="'mx-1'"
            class="btn-icon"
            variant="primary"
            @click="exportMigrationTemplate"
            v-if="hasPermission('export_offering')"
        >
          <feather-icon icon="DownloadCloudIcon"/>
        </b-button>
      </template>
    </DataTable>

    <Modal :hint="$t('Global.offeringsImportMessage')"
           :link="'/control/offerings/import_migrated_offerings_and_registrations'"
           :title="$t('Global.importMigrationData')" :show="importMigrationModal"
    ></Modal>


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
  BFormFile,
  BForm,

  BFormGroup,
  BAlert,
} from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'
import { EventBus } from '@/main'
import { mdiDataMatrix, mdiBarcode } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { getToken } from '@/utils/auth'
import { required } from '@validations'
import Modal from '@/views/components/common/Modal.vue'

export default {
  name: 'Offerings',
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    Modal,
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
    SvgIcon,
    BFormFile,
    BForm,
    BFormGroup,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    listed_only: {
      type: Boolean,
      default: false
    },
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    return {
      loaded: false,
      oldTerm: false,
      filter: {
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        stage_id: null,
        type_id: null,
        export: 0,
        removed: 0,
      },
      path: mdiBarcode,
      paramsLoaded: true,

      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    }
  },
  computed: {
    ...mapGetters({
      items: 'offerings/items',
      total: 'offerings/total',
      load: 'app/generalLoad',
      lookups: 'app/stateLookups',
      dependentLookups: 'app/dependentLookups',
      currentTerm: 'app/currentTerm',
      needDrop: 'app/needDrop',
    }),
    fieldsData() {
      let fields = [
        {
          key: 'id',
          label: this.$t('Global.id'),
          sortable: true,
        },
        {
          key: 'course',
          label: this.$t('Global.course'),
          thStyle: { width: '25%' },
          sortable: false,
        },
        {
          key: 'instructors',
          label: this.$t('Global.instructors'),
          sortable: false,
        },
        {
          key: 'status',
          label: this.$t('Global.control_status'),
          thStyle: { width: '10%' },
          sortable: false,
        },
        {
          key: 'exams',
          label: this.$t('Global.exam'),
          thStyle: { width: '10%' },
          sortable: false,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
      return fields
    },
    language: function () {
      localStorage.setItem('mylang', this.$i18n.locale)
      return this.$i18n.locale
    },
    header: function () {
      localStorage.setItem('headers', false)
      return false
    },
  },
  methods: {
    ...mapActions({
      exportExcel: 'offerings/exportData',
      updateCurrentTerms: 'app/getTerms',
      exportTemplate: 'offerings/exportMigrationTemplate',
    }),
    emit_edit(offering_id) {
      let changeName = 'edit_course_offering'
      EventBus.$emit('changeIt', changeName)
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
    coordinator(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Course Coordinator'
        )
      }
    },
    examinationCommittee(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Examination Committee'
        )
      }
    },
    teacher(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Teacher')
      }
    },
    TeachingAssistantEdit(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Teaching Assistant (Editor)'
        )
      }
    },
    TeachingAssistantView(data) {
      if (data) {
        return data.filter(
            (el) => el.role && el.role.name == 'Teaching Assistant (Viewer)'
        )
      }
    },
    refresh(query) {
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
      if (this.program_id) {
        query = {
          ...query,
          program_id: this.program
        }
      }
      if (this.status) {
        query = {
          ...query,
          status: this.status
        }
      }
      if (this.stages) {
        query = {
          ...query,
          stages: this.stages
        }
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = {
          ...query,
          faculty_id: this.$route.query.faculty_id
        }
      }
      if (this.$route.query && this.$route.query.bylaw_id) {
        query = {
          ...query,
          bylaw_id: this.$route.query.bylaw_id
        }
      }
      if (this.$route.query && this.$route.query.program_id) {
        query = {
          ...query,
          program_id: this.$route.query.program_id
        }
      }
      if (this.$route.query && this.$route.query.status) {
        query = {
          ...query,
          status: this.$route.query.status
        }
      }
      if (this.$route.query && this.$route.query.stages) {
        query = {
          ...query,
          stages: this.$route.query.stages
        }
      }
      this.$store.dispatch('offerings/offerings', { query })
    },
    deleteOffering(id, student_count) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
          .then((result) => {
            if (result.value && student_count == 0) {
              this.$store.dispatch('offerings/remove', id)
                  .then((response) => {
                    if (response.status == 'success') {
                      this.refresh()
                      this.$swal({
                        icon: 'success',
                        title: `${this.$t('Global.saved')}`,
                        showConfirmButton: false,
                        timer: 1500,
                      })
                    } else {
                      this.$swal({
                        icon: 'error',
                        title: this.$i18n.locale == 'en' ? 'Error!' : 'خطا',
                        text:
                            this.$i18n.locale == 'en'
                                ? 'You Cannot Delete This Offering'
                                : 'لا يمكنك مسح هذا المقرر',
                        customClass: {
                          confirmButton: 'btn btn-danger',
                        },
                      })
                    }
                  })
            }
          })
    },
    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local'
    },
    exportData() {
      this.exportExcel({
        lang: this.$i18n.locale,
        query: this.filter
      })
    },

    getColor(status) {
      if (status == 'Draft') {
        return 'light-warning'
      } else if (status == 'Submitted') {
        return 'light-success'
      } else if (status == 'Reviewed') {
        return 'light-info'
      } else if (status == 'Approved') {
        return 'light-dark'
      } else if (status == 'Published') {
        return 'light-primary'
      }
    },
    openCalendar(id) {
      this.$router.push({
        name: 'offering-schedule',
        params: {
          id,
        },
      })
    },

    exportMigrationTemplate() {
      this.exportTemplate()
    },
    async uploadMigrationData() {
      this.$refs.importForm.validate()
          .then((success) => {
            if (success) {
              this.$swal({
                title: 'Are you sure?',
                text: `${this.$t('Global.confirmUpload')}`,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: `${this.$t('Global.cancel')}`,
                confirmButtonText: `${this.$t('Global.yes_import')}`,
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-outline-danger ml-1',
                },
                buttonsStyling: false,
              })
                  .then(async (result) => {
                    if (result.value) {
                      this.total_message = ''
                      this.status_messages = []
                      this.statusModal = true
                      this.showCloseButton = false

                      const data = new FormData()
                      for (let i = 0; i < this.migrationFiles.length; i++) {
                        let file = this.migrationFiles[i]
                        data.append('files[' + i + ']', file)
                      }
                      let url = process.env.VUE_APP_BASE_URL +
                          '/control/offerings/import_migrated_offerings_and_registrations'

                      const response = await fetch(url, {
                        headers: {
                          Authorization: 'Bearer ' + getToken(),
                        },
                        method: 'POST',
                        body: data,
                      })
                      let isDone = false
                      const reader = response.body
                          .pipeThrough(new TextDecoderStream())
                          .getReader()
                      while (!isDone) {
                        const {
                          value,
                          done
                        } = await reader.read()
                        if (done || isDone) {
                          this.migrationFiles = []
                          this.toggleMigrationModal()
                          this.refresh()
                          this.showCloseButton = true
                          this.$swal({
                            icon: 'success',
                            title: this.$t('Global.success'),
                            showConfirmButton: true,
                            text: this.$t('Global.import_done_successfully'),
                          })
                          break
                        }

                        let allObjects =
                            typeof value !== 'undefined' ? value.split('}') : {}
                        if (allObjects.length) {
                          for (let i = 0; i < allObjects.length; i++) {
                            if (allObjects[i].trim() !== '' && allObjects[i].trim()) {
                              let object = allObjects[i] + '}'
                              object = JSON.parse(object)
                              if (object.done === false && object.failed === false) {
                                this.setStatusesMessages(object)
                              } else if (
                                  object.done === true &&
                                  object.failed === false
                              ) {
                                isDone = true
                                this.showCloseButton = true
                                this.migrationFiles = []
                                this.toggleMigrationModal()
                                this.refresh()
                                this.$swal({
                                  icon: 'success',
                                  title: this.$t('Global.success'),
                                  showConfirmButton: true,
                                  text: this.$t('Global.import_done_successfully'),
                                })
                              } else if (object.failed === true) {
                                isDone = true
                                this.showCloseButton = true
                                this.migrationFiles = []
                                this.toggleMigrationModal()
                                this.refresh()
                                this.$swal({
                                  icon: 'error',
                                  title: this.$t('Global.failed'),
                                  showConfirmButton: true,
                                  text: object.message,
                                })
                              }
                            }
                          }
                        }
                      }
                    }
                  })
            }
          })
    },
    setStatusesMessages(object) {
      if (typeof object.done !== undefined) {
        let status_message = {}
        status_message.status = object.status
        status_message.class = object.status ? 'success' : 'danger'
        status_message.message = object.message
        this.status_messages.push(status_message)
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
