<template>
  <DataTable
    :title="title"
    :total="total"
    :allow-search="true"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
    :paramsLoaded="paramsLoaded"
  >
    <template v-if="lookups && !listed_only" #filter>
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.term_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.offering_terms"
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
          v-model="filter.bylaw_id"
          :disabled="filter.faculty_id == null"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.bylaws"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.bylaw')"
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
            {{ getEmptyListLabel }}
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>

      <b-col cols="6" md="4">
        <v-select
          v-model="filter.program_id"
          :disabled="filter.bylaw_id == null"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.programs"
          :label="getSelectLabel()"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.program')"
        >
          <template #no-options>
            {{ getEmptyListLabel }}
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>

      <b-col cols="6" md="4">
        <v-select
          v-model="filter.status"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.offering_status_control"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.control_status')"
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
          v-model="filter.stages"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.stages"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.stage')"
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
        :items="items"
        responsive
        :fields="fieldsData"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <!--   <template #cell(max_total)="data">
            <span>
              {{ data.item.max_total || '-' }}
            </span>
          </template> -->
        <template #cell(term_id)="data">
          <b-link
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block"
            :to="{ name: 'term', params: { id: data.item.term.id } }"
          >
            {{ data.item.term ? data.item.term.name : "-" }}
          </b-link>
          <b-link
            v-if="$i18n.locale == 'ar'"
            class="font-small-4"
            :to="{ name: 'term', params: { id: data.item.term.id } }"
          >
            {{
              data.item.term && $i18n.locale == "ar"
                ? data.item.term.name_local
                : "-"
            }}
          </b-link>
        </template>

        <template #cell(control_status)="data">
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

        <template #cell(registrations_count)="data">
          <div class="d-flex">
            <strong>
              {{ data.item.students_count ? data.item.students_count : 0 }}
            </strong>
          </div>
        </template>

        <template #cell(instructors_count)="data">
          <div class="d-flex flex-wrap">
            <strong style="padding: 1px"
              >{{ $t("Global.coordinator") }}: &nbsp;
            </strong>
            <div
              v-for="(coordinator, i) in (arrLength = coordinator(
                data.item.instructors
              ))"
              :key="i"
            >
              <b-link
                style="font-weight-bold;"
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >{{ coordinator.academic_name }}
                <small class="text-danger" v-if="i < arrLength.length - 1">
                  , &nbsp;</small
                ></b-link
              >
              <!--  <b-link
                  v-if="$i18n.locale == 'en'"
                  class="custom_link"
                  :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >

                </b-link> -->
              <b-link
                style="font-weight-bold;"
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >{{ coordinator.academic_name_local }}
                <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                ></b-link
              >

              <!--  <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="custom_link"
                  :to="{ name: 'user-show', params: { id: coordinator.id } }"
                >
                </b-link> -->
            </div>
          </div>
          <div class="d-flex flex-wrap">
            <strong>{{ $t("Global.teacher") }}: &nbsp;</strong>
            <div
              v-for="(teacher, i) in (arrLength = teacher(
                data.item.instructors
              ))"
              :key="i"
            >
              <b-link
                class="font-weight-bold"
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name }}
                <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                ></b-link
              >
              <b-link
                class="font-weight-bold"
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'user-show', params: { id: teacher.id } }"
                >{{ teacher.academic_name_local }}
                <small class="text-danger" v-if="i < arrLength.length - 1"
                  >, &nbsp;</small
                ></b-link
              >

              <!-- <b-link
                  v-if="$i18n.locale == 'en'"
                  class="custom_link"
                >
                </b-link> -->
              <!-- <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="custom_link"
                  :to="{ name: 'user-show', params: { id: teacher.id } }"
                >
                </b-link> -->
            </div>
          </div>
          <div class="d-flex flex-wrap">
            <strong>{{ $t("Global.TeachingAssistantEdit") }}: &nbsp;</strong>
            <div
              v-for="(TeachingAssistantEdit, i) in (arrLength =
                TeachingAssistantEdit(data.item.instructors))"
              :key="i"
            >
              <b-link
                class="font-weight-bold"
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
                class="font-weight-bold"
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
            <strong>{{ $t("Global.TeachingAssistantView") }}: &nbsp;</strong>
            <div
              v-for="(TeachingAssistantView, i) in (arrLength =
                TeachingAssistantView(data.item.instructors))"
              :key="i"
            >
              <b-link
                class="font-weight-bold"
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
                class="font-weight-bold"
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
            <strong>{{ $t("Global.examinerCommittee") }}: &nbsp;</strong>
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

        <template #cell(exams)="data">
          <div v-for="(exam, i) in data.item.exams" :key="i">
            <div v-if="$i18n.locale == 'en'" class="d-block">
              <span class="font-weight-bold">{{ $t("Global.exam_date") }}</span>
              : {{ exam.exam_date }}
              <br />
              <span class="font-weight-bold">{{ $t("Global.period") }}</span> :
              {{ exam.period }}
              <br />
              <span class="font-weight-bold">{{
                $t("Global.extended_periods")
              }}</span>
              : {{ exam.extended_periods }}
              <br />
              <div v-for="(location, i) in exam.locations" :key="i">
                <span class="font-weight-bold">{{
                  $t("Global.location")
                }}</span>
                :
                {{
                  location
                    ? `${location.name} (${location.building.name})`
                    : "-"
                }}
              </div>
            </div>
            <div v-if="$i18n.locale == 'ar'" class="d-block">
              <span class="font-weight-bold">{{ $t("Global.exam_date") }}</span>
              : {{ exam.exam_date }}
              <br />
              <span class="font-weight-bold">{{ $t("Global.period") }}</span> :
              {{ exam.period }}
              <br />
              <span class="font-weight-bold">{{
                $t("Global.extended_periods")
              }}</span>
              : {{ exam.extended_periods }}
              <br />
              <div v-for="(location, i) in exam.locations" :key="i">
                <span class="font-weight-bold">{{
                  $t("Global.location")
                }}</span>
                :
                {{
                  location
                    ? `${location.name} (${location.building.name})`
                    : "-"
                }}
              </div>
            </div>
          </div>
        </template>

        <template #cell(course)="data">
          <div class="d-flex">
            <b-link
              v-if="$i18n.locale == 'en'"
              class="font-weight-bold custom_link h5"
              :to="{ name: 'course', params: { id: data.item.course.id } }"
            >
              {{
                data.item.course
                  ? `${data.item.course.code}  &nbsp; ${data.item.course.name}`
                  : "-"
              }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              class="font-weight-bold custom_link h5"
              :to="{ name: 'course', params: { id: data.item.course.id } }"
            >
              {{
                data.item.course
                  ? `${data.item.course.code}  &nbsp; ${data.item.course.name_local}`
                  : "-"
              }}
            </b-link>
          </div>
          <!-- <div class="d-flex">
              <strong>
                {{
                  `${$t("Global.students")} : ${
                    data.item.students_count ? data.item.students_count : "_"
                  }`
                }}
              </strong>
            </div> -->
          <!--  <div class="d-flex flex-wrap">
              <strong> {{ $t("Global.programs") }} : </strong>
              <div
                v-if="data.item.programs"
                v-for="(program, i) in data.item.programs"
                :key="i"
              >
                <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold d-block"
                   :to="{ name: 'program', params: { id: program.id } }"
                >
                  {{
                    ` ${program.name}  (${
                      program.bylaw ? `${program.bylaw.name} ` : "_"
                    })`
                  }}
                  <small class="text-danger" v-if="i < data.item.programs.length-1">,</small>
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold d-block"
                   :to="{ name: 'program', params: { id: program.id } }"
                >
                  {{
                    ` ${program.name_local} (${
                      program.bylaw ? `${program.bylaw.code} ` : "_"
                    })`
                  }}
                  <small class="text-danger" v-if="i < data.item.programs.length-1">,</small>
                </b-link>
              </div>
            </div> -->
          <div class="d-flex flex-wrap">
            <!--             <strong> {{ $t("Global.faculty") }} : </strong>
   -->
            <div v-if="data.item.course.faculty">
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-block"
                :to="{
                  name: 'faculty',
                  params: { id: data.item.course.faculty.id },
                }"
              >
                {{ data.item.course.faculty.name }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold d-block"
                :to="{
                  name: 'faculty',
                  params: { id: data.item.course.faculty.id },
                }"
              >
                {{ data.item.course.faculty.name_local }}
              </b-link>
            </div>
          </div>
          <div class="d-flex flex-wrap">
            <!--             <strong> {{ $t("Global.faculty") }} : </strong>
   -->
            <div v-if="data.item.course.bylaw">
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-block"
                :to="{
                  name: 'bylaw',
                  params: { id: data.item.course.bylaw.id },
                }"
              >
                {{ data.item.course.bylaw.name }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold d-block"
                :to="{
                  name: 'bylaw',
                  params: { id: data.item.course.bylaw.id },
                }"
              >
                {{ data.item.course.bylaw.name_local }}
              </b-link>
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
              <!-- <feather-icon
                    v-b-tooltip.hover="$t('Global.schedule')" icon="CalendarIcon" style="cursor: pointer"
                /> -->
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

            <!-- <b-link
                target="_blank"
                v-if="
                  data.item.status.name == 'Draft' &&
                  hasPermission('edit_offering')
                "
                :to="`/offering/${data.item.id}?inline=true&tabNum=1`"
                @click="emit_edit()"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="text-primary"
                />
              </b-link>
              <b-link v-else>
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="text-secondary"
                  style="cursor: not-allowed"
                />
              </b-link> -->
            <b-link>
              <feather-icon
                v-if="
                  data.item.removed == 0 &&
                  hasPermission('delete_offering') &&
                  data.item.status.name == 'Draft' &&
                  data.item.students_count == 0
                "
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                class="text-danger"
                @click="deleteOffering(data.item.id, data.item.students_count)"
              />
              <feather-icon
                v-else
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                class="text-secondary"
                style="cursor: not-allowed"
              />
            </b-link>
          </div>
        </template>
        <template #cell(stage)="data">
          <div class="d-flex">
            <span
              v-if="
                data.item.course &&
                data.item.course.bylaw &&
                data.item.course.bylaw.stage
              "
            >
              {{
                data.item.course.bylaw.stage.code
                  ? data.item.course.bylaw.stage.code
                  : "-"
              }}
            </span>
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
        <feather-icon icon="PlusIcon" />
      </b-button>
      <b-button
        v-else
        v-b-tooltip.hover="$t('Global.add')"
        class="btn-icon disabled_all"
        variant="primary"
        style="cursor: not-allowed"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>

      <b-button
        v-if="hasPermission('export_offering')"
        v-b-tooltip.hover="$t('Global.export_excel')"
        class="btn-icon ml-1"
        variant="primary"
        @click="exportData"
      >
        <feather-icon icon="FileTextIcon" />
      </b-button>
      <b-button
        v-else
        v-b-tooltip.hover="$t('Global.export_excel')"
        class="btn-icon ml-1 disabled_all"
        variant="primary"
        style="cursor: not-allowed"
      >
        <feather-icon icon="FileTextIcon" />
      </b-button>
    </template>
  </DataTable>
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
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import { EventBus } from "@/main";
import { mdiDataMatrix, mdiBarcode } from "@mdi/js";
import SvgIcon from "@jamescoyle/vue-icon";

export default {
  name: "my_courses_workspace",
  components: {
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
    SvgIcon,
  },
  directives: {
    "b-modal": VBModal,
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
    return {
      filter: {
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        stages: null,
      },
      path: mdiBarcode,
      paramsLoaded: true,
    };
  },
  beforeMount() {
    this.filter = {
      term_id: this.currentTerm || null,
      faculty_id: null,
      bylaw_id: null,
      program_id: null,
      status: null,
    };
  },
  computed: {
    ...mapGetters({
      items: "myOfferings/items",
      total: "myOfferings/total",
      load: "myOfferings/load",
      needDrop:'app/needDrop',
      lookups: "myOfferings/lookups",
      currentTerm: "app/currentTerm",
    }),

    getEmptyListLabel() {
      return this.$i18n.locale === "en"
        ? "Sorry, No Matching Options."
        : "لاتوجد نتائج مطابقة للبحث.";
    },
    fieldsData() {
      let fields = [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: true,
        },
        {
          key: "course",
          label: this.$t("Global.course"),
          thStyle: { width: "35%" },
          sortable: false,
        },
        {
          key: "stage",
          label: this.$t("Global.stage"),
          sortable: false,
        },

        {
          key: "instructors_count",
          label: this.$t("Global.instructors"),
          thStyle: { width: "30%" },
          sortable: false,
        },
        {
          key: "term_id",
          label: this.$t("Global.semester"),
          thStyle: { width: "10%" },

          sortable: false,
        },
        /*  {
            key: "students_count",
            label: this.$t("Global.students_count"),
            thStyle: { width: "5%" },
            sortable: true,
          }, */
        {
          key: "registrations_count",
          label: this.$t("Global.students_count"),
          thStyle: { width: "5%" },
          sortable: true,
        },
        /* {
            key: "instructors_count",
            label: this.$t("Global.instructors_count"),
            thStyle: { width: "5%" },
            sortable: true,
          }, */
        {
          key: "control_status",
          label: this.$t("Global.control_status"),
          thStyle: { width: "5%" },
          sortable: false,
        },
        {
          key: "exams",
          label: this.$t("Global.exam"),
          thStyle: { width: "30%" },
          sortable: false,
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
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
    /*   "filter.bylaw_id": function (newValue) {
        if (this.filter.program_id) {
          this.filter.program_id = null;
        }
      },
      "filter.faculty_id": function (newValue) {
        if (this.filter.bylaw_id) {
          this.filter.bylaw_id = null;
        }
      }, */
    language: function (val) {
      this.language = val;
    },
    header: function (val) {
      this.header = val;
    },
  },
  methods: {
    ...mapActions({
      exportExcel: "myOfferings/exportData",
    }),
    emit_edit(offering_id) {
        /*this.$router.push({
          name: "offering",
          params: { id: offering_id },
          query: { inline: true },
        });
        this.updateFilterQueryParams({ tabNum: 1 }); */
      let changeName = "edit_course_offering";
      EventBus.$emit("changeIt", changeName);
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
        return data.filter((el) => el.role && el.role.name == 'Course Coordinator');
      }
    },
    examinationCommittee(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Examination Committee');
      }
    },
    teacher(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Teacher');
      }
    },
    TeachingAssistantEdit(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Teaching Assistant (Editor)');
      }
    },
    TeachingAssistantView(data) {
      if (data) {
        return data.filter((el) => el.role && el.role.name == 'Teaching Assistant (Viewer)');
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
      if (this.stages) {
        query = { ...query, stages: this.stages };
      }

      if (this.$route.query && this.$route.query.term_id) {
        query = { ...query, term_id: this.$route.query.term_id };
      }
      if (this.$route.query && this.$route.query.faculty_id) {
        query = { ...query, faculty_id: this.$route.query.faculty_id };
      }
      if (this.$route.query && this.$route.query.bylaw_id) {
        query = { ...query, bylaw_id: this.$route.query.bylaw_id };
      }
      if (this.$route.query && this.$route.query.program_id) {
        query = { ...query, program_id: this.$route.query.program_id };
      }
      if (this.$route.query && this.$route.query.status) {
        query = { ...query, status: this.$route.query.status };
      }
      if (this.$route.query && this.$route.query.stages) {
        query = { ...query, stages: this.$route.query.stages };
      }
      this.$store.dispatch("myOfferings/offerings", { query }).then((data) => {
        this.paramsLoaded = false;
      });
    },
    deleteOffering(id, student_count) {
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
        if (result.value && student_count == 0) {
          this.$store.dispatch("myOfferings/remove", id).then((response) => {
            if (response.status == "success") {
              this.refresh();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              this.$swal({
                icon: "error",
                title: this.$i18n.locale == "en" ? "Error!" : "خطا",
                text:
                  this.$i18n.locale == "en"
                    ? "You Cannot Delete This Offering"
                    : "لا يمكنك مسح هذا المقرر",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              });
            }
          });
        }
      });
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    exportData() {
      this.exportExcel({ lang: this.$i18n.locale, query: this.filter });
    },
    getColor(status) {
      if (status == "Draft") {
        return "light-warning";
      } else if (status == "Submitted") {
        return "light-success";
      } else if (status == "Reviewed") {
        return "light-info";
      } else if (status == "Approved") {
        return "light-dark";
      } else if (status == "Published") {
        return "light-primary";
      }
    },
    openCalendar(id) {
      this.$router.push({
        name: "offering-schedule",
        params: {
          id,
        },
      });
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
