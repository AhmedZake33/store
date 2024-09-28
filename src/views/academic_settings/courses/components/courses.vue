<template>
  <div>
    <add
      v-if="params.status == 4"
      :inline="true"
      :hid_courses="hide_courses"
      :params="params"
      @hide="hide()"
    />
    <edit
      v-else-if="params.status == 1 || params.status == 2"
      :inline="true"
      :params="params"
      @hide="hide()"
    />
    <DataTable
      v-else
      :tabNum="tabNum"
      :total="total"
      apiLink="courses"
      :allow-search="true"
      :bylaw_id ="bylaw_id"
      :queryCourse ="queryCourse"
      :filter="filter"
      :loading="load['courses']"
      @reset="reset"
      importBtn
      @Refresh="refresh"
      @Export="Export"
      exportPermission="export_course"
    >
      <template #action>
        <b-button
          v-if="
            !plus &&
            $route.name == 'program' &&
            (faculty_id || bylaw_id || program_id) &&
            hasPermission('add_course') &&
            inline
          "
          @click="
            params = {
              status: 4,
              faculty_id: faculty_id,
              bylaw_id: bylaw_id,
              program_id: program_id,
            }
          "
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
          class="btn-icon mr-1"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
        <template
          v-if="(!department_id && !faculty_id) || $route.name == 'bylaw'"
        >
          <b-button
            v-if="
              bylaw_id && !program_id && hasPermission('add_course') && inline
            "
            @click="
              params = {
                status: 3,
                faculty_id: faculty_id,
                bylaw_id: bylaw_id,
                program_id: program_id,
              }
            "
            v-b-tooltip.hover="$t('Global.add')"
            :to="{
              name: 'course_add',
              params: {
                bylaw_id: bylaw_id,
                faculty_id: faculty_id_course,
                department_id: department_id,
              },
              query: { bylaw_type: course_type, bylaw_stage: course_stage },
            }"
            variant="primary"
            class="btn-icon"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
          <b-button
            v-else-if="
              hasPermission('add_course') &&
              !faculty_id &&
              !program_id &&
              !department_id
            "
            v-b-tooltip.hover="$t('Global.add')"
            :to="{
              name: 'course_add',
              params: {
                bylaw_id: bylaw_id ? bylaw_id : 0,
                faculty_id: faculty_id ? faculty_id : 0,
                department_id: department_id ? department_id : 0,
              },
            }"
            variant="primary"
            class="btn-icon mr-1"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>
        <!-- <b-button
          v-b-tooltip.hover="$t('Global.export_excel')"
          :class="
            (!department_id && !faculty_id && $route.name != 'courses') ||
            $route.name == 'bylaw'
              ? 'ml-1'
              : ''
          "
          class="btn-icon"
          variant="primary"
          @click="filter.export = 1"
          v-if="hasPermission('export_course')"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button> -->

        <!--        <b-button v-b-tooltip.hover="$t('Global.exportMigrationDataTemplate')"
                          :class="'ml-1'"
                          class="btn-icon" variant="primary" @click="exportMigrationTemplate"
                          v-if="hasPermission('import_migrationData')">
                  <feather-icon icon="DownloadCloudIcon"/>
                </b-button>-->
      </template>
      <template v-if="lookups" #filter>
        <b-col
          v-if="!faculty_id && !department_id && !bylaw_id && !program_id"
          cols="6"
          md="4"
        >
          <v-select
            :filter="fuseSearch"
            v-model="filter.faculty_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups['courses'] && lookups['courses'].faculties"
            label="name"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <b-col v-if="!bylaw_id && !program_id" cols="6" md="4">
          <v-select
            :filter="fuseSearch"
            v-model="filter.bylaw_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="dependentLookups['bylaws']"
            :disabled="!faculty_id && !filter.faculty_id"
            label="name"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.bylaw')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{
                load["bylawslookup"]
                  ? $t("Global.inProgress")
                  : $t("noMatching")
              }}
            </template>
          </v-select>
        </b-col>

        <b-col v-if="!program_id" cols="6" md="4">
          <v-select
            :filter="fuseSearch"
            v-model="filter.program_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="dependentLookups['programs']"
            :disabled="!filter.bylaw_id"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.program')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{
                load["programslookup"]
                  ? $t("Global.inProgress")
                  : $t("noMatching")
              }}
            </template>
          </v-select>
        </b-col>

        <b-col
          v-if="department_id || faculty_id || bylaw_id || program_id"
          cols="6"
          md="4"
        >
          <v-select
            :filter="fuseSearch"
            v-model="filter.offered"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="offered_list"
            label="label"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.offered_now')"
          />
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.stage_id"
            :options="lookups['courses'] && lookups['courses'].stages"
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
                  option.name + " ( " + option.code + " )" || option.name_local
                }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local
                  : option.name + " ( " + option.code + " )"
              }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col
          v-if="
            (!program_id && hasPermission('restore_course')) ||
            hasPermission('delete_course')
          "
          cols="6"
          md="4"
        >
          <v-select
            v-model="filter.removed"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="getStatusList(true)"
            class="w-100"
            :reduce="(val) => val.value"
            :placeholder="$t('Global.status')"
          >
            <template slot="selected-option" slot-scope="option">
              <span>
                {{ $t(`Global.${option.label}`) }}
              </span>
            </template>
            <template v-slot:option="option">
              {{ $t(`Global.${option.label}`) }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #more>
        <b-button to="/settings/courses" class="ml-1" variant="primary"
          ><span class="align-middle">More</span>
        </b-button>
      </template>
      <template #customTable>
        <div
          class="bg-gray p-0 mb-1"
          style="padding-left: 0rem !important; padding-right: 0rem !important"
        >
          <div class="d-flex justify-content-between" v-if="title">
            <strong class="font-medium-3">
              {{ title }}
            </strong>

            <b-button
              v-if="
                $route.name == 'program' &&
                (faculty_id || bylaw_id || program_id) &&
                hasPermission('add_course') &&
                inline
              "
              @click="
                params = {
                  status: 4,
                  faculty_id: faculty_id,
                  bylaw_id: bylaw_id,
                  program_id: program_id,
                }
              "
              v-b-tooltip.hover="$t('Global.add')"
              variant="primary"
              class="btn-icon"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
          </div>
        </div>
        <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          :items="items"
          responsive
          striped
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="getLoadText(load['courses'])"
        >
          <template #cell(name)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              :to="{ name: 'course', params: { id: data.item.id } }"
              class="font-weight-bold"
            >
              {{
                data.item
                  ? data.item.name
                    ? data.item.name
                    : data.item.name_local
                  : "_"
              }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              :to="{ name: 'course', params: { id: data.item.id } }"
            >
              {{
                data.item
                  ? data.item.name_local
                    ? data.item.name_local
                    : data.item.name
                  : "_"
              }}
            </b-link>
          </template>
          <template #cell(bylaw)="data">
            <template v-if="faculty_id">
              <b-link
                :to="{
                  name: 'bylaw',
                  params: {
                    id:
                      data.item.bylaw && data.item.bylaw.id
                        ? data.item.bylaw.id
                        : null,
                  },
                }"
                class="font-weight-bold"
              >
                {{ data.item ? data.item.bylaw.code : "-" }}
              </b-link>
            </template>
            <template v-if="!faculty_id">
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{
                  name: 'bylaw',
                  params: {
                    id:
                      data.item.bylaw && data.item.bylaw.id
                        ? data.item.bylaw.id
                        : null,
                  },
                }"
                class="font-weight-bold"
              >
                {{
                  data.item
                    ? data.item && data.item.bylaw
                      ? data.item.bylaw.name
                      : "-"
                      ? shortMyText(
                          data.item && data.item.bylaw
                            ? data.item.bylaw.name
                            : "-"
                        )
                      : data.item && data.item.bylaw
                      ? data.item.bylaw.name_local
                      : "-"
                    : "_"
                }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{
                  name: 'bylaw',
                  params: {
                    id:
                      data.item.bylaw && data.item.bylaw.id
                        ? data.item.bylaw.id
                        : null,
                  },
                }"
              >
                {{
                  data.item
                    ? data.item && data.item.bylaw
                      ? data.item.bylaw.name_local
                      : "-"
                      ? shortMyText(
                          data.item && data.item.bylaw
                            ? data.item.bylaw.name_local
                            : "-"
                        )
                      : data.item && data.item.bylaw
                      ? data.item.bylaw.name_local
                      : "-"
                    : "_"
                }}
              </b-link>
            </template>
          </template>
          <template #cell(faculty)="data">
            <div v-if="data.item && data.item.bylaw">
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                class="font-weight-bold"
              >
                {{ data.item.faculty.name }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
              >
                {{ data.item.faculty.name_local }}
              </b-link>
            </div>
          </template>
          <template #cell(students_count)="data">
            {{ data.item.offerings_count ? data.item.offerings_count : 0 }}
          </template>
          <template #cell(department)="data">
            <div v-if="data.item.department">
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{
                  name: 'department',
                  params: { id: data.item.department.id },
                }"
                class="font-weight-bold"
              >
                {{ data.item.department.name }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{
                  name: 'department',
                  params: { id: data.item.department.id },
                }"
              >
                {{ data.item.department.name_local }}
              </b-link>
            </div>
          </template>
          <template #cell(stage)="data">
            <div v-for="stage in lookups.stages" :key="stage.id">
              <div
                v-if="data.item.bylaw && data.item.bylaw.stage_id == stage.id"
              >
                <span v-if="$i18n.locale == 'en'">
                  {{ stage.code }}
                </span>
                <span v-else>
                  {{ stage.name_local }}
                </span>
              </div>
            </div>
          </template>
          <template #cell(offered_now)="data">
            <b-badge
              pill
              variant="primary"
              v-if="data.item.current_offerings_count > 0"
            >
              {{ $t("Global.offered_now") }}
            </b-badge>
            <b-badge pill variant="warning" v-else>
              {{ $t("Global.not_offered") }}
            </b-badge>
          </template>
          <template #cell(course_level)="data">
            <div class="edit_hover">
              <span v-if="data.item.program_course">
                <div>
                  {{ data.item.program_course.semester }}
                </div>
              </span>
            </div>
          </template>

          <template #cell(actions)="data">
            <div v-if="program_id && data.item.level">
              <feather-icon
                v-b-tooltip.hover="$t('Global.change_semester')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="openDialog(data.item.level)"
                v-if="hasPermission('edit_course')"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger mr-1"
                @click="trash(data.item.level.id)"
                v-if="
                  hasPermission('delete_course') &&
                  data.item.level.mandatory == 0
                "
              />
              <div class="text-danger mr-2" v-else></div>
            </div>
            <!-- data.item.offered_now == 1 -->
            <div
              v-else
              :class="data.item.offered_now == 1 ? 'disabled_with_tooltip' : ''"
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
              <!-- <b-link
                :to="
                  data.item.offered_now == 1
                    ? ''
                    : {
                        name: 'course',
                        params: { id: data.item.id },
                        query: { inline: true },
                      }
                "
              >
                <feather-icon
                  v-b-tooltip.hover="
                    data.item.offered_now == 1
                      ? $t('Global.not_editing')
                      : $t('Global.edit')
                  "
                  icon="EditIcon"
                  style="cursor: pointer"
                  v-if="hasPermission('edit_course')"
                />
              </b-link> -->
              <feather-icon
                @click="openEditModal(data.item)"
                v-b-tooltip.hover="
                  data.item.offered_now == 1
                    ? $t('Global.not_editing')
                    : $t('Global.edit')
                "
                icon="EditIcon"
                style="cursor: pointer"
                v-if="hasPermission('edit_course')"
              />

              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer; margin-top: 4.5px"
                class="text-danger"
                @click="data.item.offered_now == 1? '' : remove(data.item.id)"
                v-if="hasPermission('delete_course') && !program_id"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer; margin-top: 4.5px"
                class="text-danger"
                @click="deleteProgramCourse(data.item.id)"
                v-if="hasPermission('delete_course') && program_id"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
    <b-modal
      no-close-on-backdrop
      ref="my-modal"
      v-model="levelModal"
      hide-footer
      :title="$t('Global.semester')"
    >
      <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.semester')" label-for="semester">
                <validation-provider
                  #default="{ errors }"
                  name="semester"
                  :rules="'required'"
                >
                  <v-select
                    v-model="form.semester"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    class="w-100 mb-2"
                    :reduce="(val) => val"
                    >\
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
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2" :class="loading ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
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
              variant="outline-primary"
              @click="levelModal = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>

    <Modal
      :hint="$t('Global.departmentsImportMessage')"
      :link="'/courses/import_migrated_courses'"
      :title="$t('Global.importMigrationData')"
      :show="importMigrationModal"
    ></Modal>

    <b-modal
      no-close-on-backdrop
      ref="edit-modal"
      v-model="editModal"
      hide-footer
      :title="$t('Global.edit')"
      @hide="resetEditModal()"
    >
      <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.course')" label-for="mc-course">
                <validation-provider
                  #default="{ errors }"
                  name="course_id"
                  rules="required"
                >
                  <v-select
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    v-model="input.course_id"
                    :filter="fuseSearch"
                    :options="options.courses"
                    disabled
                    :reduce="(val) => val.id"
                    class="w-100"
                  >
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.code + ":" + option.name_local
                          : option.code + ":" + option.name
                      }}
                    </template>
                    <template #selected-option="{ name, name_local, code }">
                      <div style="display: flex; align-items: baseline">
                        <div v-if="$i18n.locale == 'ar'">{{
                          code + ":" + name_local || code + ":" + name
                        }}</div>
                        <div v-else>{{
                          code + ":" + name || code + ":" + name_local
                        }}</div>
                      </div>
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.semester')" label-for="semester">
                <validation-provider
                  #default="{ errors }"
                  name="semester"
                  :rules="'required'"
                >
                  <v-select
                    v-model="input.semester"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    class="w-100 mb-2"
                    :reduce="(val) => val"
                    >\
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
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2" :class="loading ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="editCourseSemester()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-primary"
              @click="resetEditModal()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </div>
        </b-col>
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
  BFormFile,
  BForm,
  BAlert,
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
  BTr,
  BTh,
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import Edit from "@/views/academic_settings/courses/edit";
import Add from "@/views/academic_settings/programs/add_courses";
import TableFilters from "@/views/components/common/TableFilters";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { required, email } from "@validations";
import { EventBus } from "../../../../main";
import { getToken } from "@/utils/auth";
import Modal from "@/views/components/common/Modal.vue";
export default {
  name: "Courses",
  components: {
    Add,
    TableFilters,

    DataTable,
    Modal,
    BCard,
    vSelect,
    BTr,
    BTh,
    BRow,
    BCol,
    Edit,
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
    BFormFile,
    BForm,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BFormGroup,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    excel_name: null,
    hide_courses: [],
    bylaw_id: Number,
    program_id: Number,
    faculty_id: Number,
    department_id: Number,
    faculty_dep_id: Number,
    faculty_id_course: Number,
    noStatus: Boolean,
    inline: false,
    tabNum: Number,
    plus: Boolean,
    course_type: Number,
    course_stage: Number,
    fromCoursesPage: false,
  },
  data() {
    return {
      levelModal: false,
      editModal: false,
      program_course_id: null,
      queryCourse:null,
      filter: {
        export: 0,
        removed: 0,
        faculty_id: this.faculty_id ? this.faculty_id : null,
        bylaw_id: null,
        program_id: null,
        offered: null,
        department_id: null,
      },
      params: {},
      id: null,
      form: {
        level_id: null,
        semester: null,
      },
      input:{
        course_id: null,
        semester: null,
      },
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  computed: {
    ...mapGetters({
      items: "courses/items",
      total: "courses/total",
      load: "app/generalLoad",
      loading: "app/load",
      lookups: "app/stateLookups",
      dependentLookups: "app/dependentLookups",
      options: "students/lookups",
      needDrop: "app/needDrop",
    }),
    fieldsData() {
      let fields = [
        {
          key: "code",
          label: this.$t("Global.code"),
          sortable: true,
          thStyle: { width: "3%" },
        },
        {
          key: "name",
          label: this.$t("Global.name"),
          sortable: true,
          thStyle: { width: "15%" },
        },
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
          sortable: true,
          thStyle: { width: "25%" },
        },
        {
          key: "department",
          label: this.$t("Global.department"),
          sortable: true,
          thStyle: { width: "30%" },
        },
        {
          key: "bylaw",
          label: this.faculty_id
            ? this.$t("Global.bylaw_code")
            : this.$t("Global.bylaw"),
          sortable: true,
          thStyle: { width: "12%" },
        },

        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      if (this.noStatus) {
        fields = fields.filter(
          (obj) => !["status", "credit_hours"].includes(obj.key)
        );
      }
      if (this.faculty_id && !this.bylaw_id) {
        fields = fields.filter(
          (obj) => !["faculty", "actions"].includes(obj.key)
        );
      }
      if (this.bylaw_id) {
        fields = fields.filter(
          (obj) => !["bylaw", "level", "faculty", "stage"].includes(obj.key)
        );
      }
      if (this.program_id) {
        return [
          {
            key: "code",
            label: this.$t("Global.code"),
            sortable: true,
          },
          {
            key: "name",
            label: this.$t("Global.name"),
            sortable: true,
          },
          // {
          //     key: 'faculty',
          //     label: this.$t('Global.faculty'),
          //     sortable: true,
          // },
          {
            key: "course_level",
            label: this.$t("Global.semester"),
            sortable: true,
          },
          {
            key: "offered_now",
            label: this.$t("Global.offered_now"),
            sortable: true,
          },
          {
            key: "students",
            label: this.$t("Global.students"),
            sortable: true,
          },
          {
            key: "department_id",
            label: this.$t("Global.department"),
            sortable: true,
          },
          {
            key: "status",
            label: this.$t("Global.status"),
          },
          {
            key: "actions",
            label: this.$t("Global.actions"),
            thClass: "customAction",
            tdClass: "customWidth",
          },
        ];
      }
      if (this.department_id) {
        fields = fields.filter(
          (obj) => !["department", "faculty", "actions"].includes(obj.key)
        );
      }
      return fields;
    },
    offered_list() {
      return [
        { id: 2, label: this.$t("Global.not_offered") },
        { id: 1, label: this.$t("Global.offered_now") },
      ];
    },
   
  },
  methods: {
    ...mapActions({
      exportTemplate: "courses/exportMigrationTemplate",
      lookupsApi: "students/lookup",
      saveData: "programs/sync",
      update: "programs/update",
      coursesLookups: 'students/lookup',
      updateRequirements: 'programs/updateRequirements'
    }),
    hide() {
      this.params["status"] = 3;
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
    changeParams() {
      EventBus.$emit("changeIt", this.params);
    },
    openDialog(data) {
      this.form.level_id = data?.level?.id;
      this.id = data.id;
      this.form.semester = data.semester;
      this.levelModal = true;
    },
    deleteProgramCourse(course_id){
      // deletePorgramCourse
      console.log("entered",this.program_id);

      const query = {program_id:this.program_id,course_id:course_id};

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
        this.$store.dispatch("programs/deletePorgramCourse", query).then((_) => {
              this.refresh(this.filter);
              this.$swal({
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                title: this.$t("Global.deleted"),
              });
            });
        });
    },
    submit() {
      this.$refs.simpleForm.validate().then((success) => {
        if (success) {
          const payload = {
            id: this.id,
            query: this.form,
          };
          this.update(payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.levelModal = false;
              this.refresh();
            })
            .catch((error) => {});
        }
      });
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id, mandatory: true };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.department_id) {
        query = { ...query, department_id: this.department_id };
      }
      
    
      this.queryCourse = { ...query};

      if ('limit' in this.queryCourse) {
          // If it does, remove it from the copied object
          delete this.queryCourse.limit;
      }
      
      this.$store.dispatch("courses/courses", { query });
    },
    open(id) {
      window.open(
        this.$router.resolve({ name: "course_edit", params: { id } }).href
      );
    },
    remove(id) {
      let passFilter = {};
      if (this.$route.query.page || this.$route.query.perPage) {
        passFilter = {
          ...this.filter,
          limit: this.$route.query.perPage || 10,
          offset:
            (Number(this.$route.query.page) - 1) *
            (Number(this.$route.query.perPage) || 10),
        };
      } else {
        passFilter = this.filter;
      }
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
          this.$store.dispatch("courses/remove", id).then((_) => {
            this.refresh(passFilter);
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    trash(id) {
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
          this.$store.dispatch("programs/delete", id).then((_) => {
            this.refresh(this.filter);
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    Export(query) {
      query = {
        ...query,
        language: this.$i18n.locale,
        excel_name: this.excel_name,
      };
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.department_id) {
        query = { ...query, department_id: this.department_id };
      }
      this.$store.dispatch("courses/export", query).then((_) => {
        this.filter.export = 0;
      });
    },

    exportMigrationTemplate() {
      this.exportTemplate();
    },
    async uploadMigrationData() {
      this.$refs.importForm.validate().then((success) => {
        if (success) {
          this.$swal({
            title: "Are you sure?",
            text: `${this.$t("Global.confirmUpload")}`,
            icon: "warning",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: `${this.$t("Global.cancel")}`,
            confirmButtonText: `${this.$t("Global.yes_import")}`,
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
          }).then(async (result) => {
            if (result.value) {
              this.total_message = "";
              this.status_messages = [];
              this.statusModal = true;
              this.showCloseButton = false;

              const data = new FormData();
              for (let i = 0; i < this.migrationFiles.length; i++) {
                let file = this.migrationFiles[i];
                data.append("files[" + i + "]", file);
              }
              let url =
                process.env.VUE_APP_BASE_URL +
                "/courses/import_migrated_courses";
              const response = await fetch(url, {
                headers: {
                  Authorization: "Bearer " + getToken(),
                },
                method: "POST",
                body: data,
              });
              let isDone = false;
              const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();
              while (!isDone) {
                const { value, done } = await reader.read();
                if (done || isDone) {
                  this.migrationFiles = [];
                  this.toggleMigrationModal();
                  this.refresh();
                  this.showCloseButton = true;
                  this.$swal({
                    icon: "success",
                    title: this.$t("Global.success"),
                    showConfirmButton: true,
                    text: this.$t("Global.import_done_successfully"),
                  });
                  break;
                }

                let allObjects =
                  typeof value !== "undefined" ? value.split("}") : {};
                if (allObjects.length) {
                  for (let i = 0; i < allObjects.length; i++) {
                    if (allObjects[i].trim() !== "" && allObjects[i].trim()) {
                      let object = allObjects[i] + "}";
                      object = JSON.parse(object);
                      if (object.done === false && object.failed === false) {
                        this.setStatusesMessages(object);
                      } else if (
                        object.done === true &&
                        object.failed === false
                      ) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "success",
                          title: this.$t("Global.success"),
                          showConfirmButton: true,
                          text: this.$t("Global.import_done_successfully"),
                        });
                      } else if (object.failed === true) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "error",
                          title: this.$t("Global.failed"),
                          showConfirmButton: true,
                          text: object.message,
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
    setStatusesMessages(object) {
      if (typeof object.done !== undefined) {
        let status_message = {};
        status_message.status = object.status;
        status_message.class = object.status ? "success" : "danger";
        status_message.message = object.message;
        this.status_messages.push(status_message);
      }
      return true;
    },
    openEditModal(item) {
      let query = { courses: true, levels: true, bylaw_id: item.bylaw.id };
      this.coursesLookups(query).then(_=>{
        this.input.course_id = item.id
        this.input.semester = item.program_course.semester;
        this.id = item.id
        this.program_course_id = item.program_course.id
      }).finally(_=>{
        this.editModal = true;
      });
    },
    editCourseSemester(){
      this.$refs.simpleForm.validate().then((success) => {
        if (success) {
          const payload = {
            program_id: this.$route.params.id,
            type: 'program_course',
            id: this.program_course_id,
            query: this.input,
          };
          this.updateRequirements(payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.resetEditModal();
              this.refresh();
            })
            .catch((error) => {});
        }
      });
    },
    resetEditModal(){
      this.input = {
        course_id: null,
        semester: null,
      },
      this.id = null;
      this.editModal = false;
      this.program_course_id = null;
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

.edit_hover {
  position: relative;

  .icon_hover {
    position: absolute;
    top: -7px;
    right: 0;
    display: none;
  }
}

.edit_hover:hover {
  .icon_hover {
    display: block;
  }
}
</style>
