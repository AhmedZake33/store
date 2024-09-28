<template>
  <div>
    <b-col cols="12" xl="12" lg="12" md="12">
      <div class="custom_actions">
        <b-dropdown
          :text="$t('Global.more')"
          right
          size="sm"
          variant="outline-primary"
        >
          <b-dropdown-item @click="extractData">
            <a href="#">
              <feather-icon icon="DownloadCloudIcon" />
              <span class="align-middle ml-50">{{
                $t("Extract students data")
              }}</span>
            </a>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-col>
    <DataTable
      apiLink="students"
      importBtn
      :total="total"
      :loading="load['students']"
      :default-filter="'term_id'"
      :allow-search="true"
      :filter="filter"
      :tab-num="tabNum"
      @reset="reset"
      @Refresh="refresh"
      @Export="Export"
      exportPermission="export_student"
    >
      <template #action>
        <b-button
          v-b-tooltip.hover="$t('Clear Tags')"
          :class="
            selected.length ? 'btn-icon mr-1' : 'btn-icon mr-1 disabled_all'
          "
          variant="primary"
          @click="clearTags()"
          v-if="hasPermission('delete_tags')"
        >
          <feather-icon icon="DeleteIcon" />
        </b-button>
        <b-button
          v-b-tooltip.hover="$t('Assign Tags')"
          :class="
            selected.length ? 'btn-icon mr-1' : 'btn-icon mr-1 disabled_all'
          "
          variant="primary"
          @click="openTagsModal"
          v-if="hasPermission('edit_tags')"
        >
          <feather-icon icon="TagIcon" />
        </b-button>
        <!-- <b-button
          v-b-tooltip.hover="$t('Global.export_excel')"
          class="btn-icon"
          variant="primary"
          @click="filter.export = 1"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button> -->
      </template>

      <template #filter>
          <b-col cols="12" md="4">
            <v-select
              v-model="filter.term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['students'] && lookups['students'].terms"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
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
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <b-col v-if="!faculty_id && !bylaw_id && !program_id" cols="12" md="4">
            <v-select
              v-model="filter.faculty_id"
              :filter="fuseSearch"
              :clearable="true"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['students'] && lookups['students'].faculties"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.faculty')"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col v-if="!bylaw_id" cols="12" md="4">
            <v-select
              v-model="filter.bylaw_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="load['bylawslookup'] ? [] : dependentLookups['bylaws']"
              class="w-100 mb-2"
              :clearable="true"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.bylaw')"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :disabled="filter.faculty_id == null && !faculty_id && !program_id"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ load['bylawslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <b-col v-if="!program_id" cols="12" md="4">
            <v-select
              v-model="filter.program_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="load['programslookup'] ? [] : dependentLookups['programs']"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.program')"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              :disabled="filter.bylaw_id == null"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ load['programslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <b-col cols="6" md="4">
            <v-select
              v-model="filter.level_id"
              :disabled="!filter.bylaw_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="load['levelslookup'] ? [] : dependentLookups['levels']"
              :label="getSelectLabel()"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.level')"
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
                {{ load['levelslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <b-col cols="12" md="4">
            <v-select
              v-model="filter.stage_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="
                lookups['students'] && lookups['students'].stages
                  ? lookups['students'].stages
                  : []
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

          <b-col cols="12" md="4">
            <Multiselect
              v-if="lookups['students'] && lookups['students'].tags"
              :placeholder="$t('Tags')"
              :filter="filter.status"
              @addStatus="addStatus"
              @remove="remove"
              :options="
                makeCategory((lookups['students'] && lookups['students'].tags))
              "
            ></Multiselect>
          </b-col>

          <b-col cols="12" md="4">
            <v-select
              v-model="filter.type_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="(lookups['students'] && lookups['students'].types) || []"
              class="w-100"
              clearable
              label="name"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.type')"
            >
              <template slot="selected-option" slot-scope="option">
                <span v-if="$i18n.locale == 'ar'">
                  {{ option.name_local || option.name }}
                </span>
                <span v-else>
                  {{
                    option.name + " ( " + option.code + " )" || option.name_local
                  }}
                </span>
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

          <b-col v-if="!faculty_id && !bylaw_id && !program_id" cols="12" md="4">
            <v-select
              v-model="filter.student_first_term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups['students'] && lookups['students'].addmision_terms"
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.first_term')"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <b-col cols="12" md="4">
            <v-select
              v-model="filter.first_term_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="
                lookups['students'] && lookups['students'].terms
                  ? lookups['students'].terms
                  : []
              "
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.Start_Term')"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4">
            <b-form-datepicker
              :label-no-date-selected="$t('Global.no_selected')"
              :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
              id="last_control_finish_at"
              ref="last_control_finish_at"
              v-model="filter.last_control_finish_at"
              :placeholder="$t('Last Finish At')"
            />
          </b-col>
          <b-col cols="12" md="4">
            <b-form-input
              id="warnings"
              v-model="filter.warnings"
              :placeholder="$i18n.locale == 'ar' ? 'ادخال مجموع التحذيرات' : 'Enter Total Warnings'"
              autofocus
              type="number"
            />
          </b-col>
      </template>
      <template #customTable>
        <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          :items="items"
          :fields="fields"
          responsive
          striped
          primary-key="id"
          show-empty
          :empty-text="load['students'] ? $t('Global.inProgress') : $t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle" />
            </div>
          </template>
          <template #head(code)="data">
            <div class="d-inline-flex align-items-center">
              <b-form-checkbox
                v-model="selectAll"
                style="margin-top: 6px"
                class="mt-0 custom-control-primary"
              />
              <span>{{ $t("Global.student_code") }}</span>
            </div>
          </template>
          <template #cell(name)="data">
            <b-media
              v-if="data.item.id"
              vertical-align="center"
              class="d-inline-flex align-items-center"
            >
              <template #aside>
                <b-avatar
                  size="32"
                  :text="avatarText(data.item.name)"
                  :src="user_photo(data.item.id)"
                />
              </template>
              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold d-inline-block"
                :to="{ name: 'student-show', params: { id: data.item.id } }"
              >
                {{
                  data.item && data.item.name_local
                    ? data.item.name_local
                    : "-"
                }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-inline-block"
                :to="{ name: 'student-show', params: { id: data.item.id } }"
              >
                {{
                  data.item && data.item.name
                    ? data.item.name
                    : "-"
                }}
              </b-link>
            </b-media>
          </template>
          <template #cell(code)="data">
            <div class="d-flex">
              <div>
                <b-form-checkbox v-model="selected" :value="data.item.id" />
              </div>
              <div>
                {{
                  data.item && data.item.code
                    ? data.item.code
                    : "-"
                }}
              </div>
            </div>
          </template>
          <template #cell(tags)="data">
            <div v-if="data.item.tags">
              <span v-for="(tag, index) in data.item.tags" :key="tag.id">
                <b-badge pill :variant="getTagColor(index)">
                  <!-- light-primary -->
                  {{ $i18n.locale == "ar" ? tag.name_local : tag.name }}
                </b-badge>
              </span>
            </div>
          </template>
          <template #cell(term)="data">
            <div v-if="data.item.term">
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-block"
              >
                {{ data.item.term ? data.item.term.name : "_" }}
              </b-link>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item.term ? data.item.term.name_local : "_" }}
              </span>
            </div>
          </template>
          <!-- <template #cell(stage)="data">
            <div
              v-if="
                data.item.program &&
                data.item.program.bylaw &&
                data.item.program.bylaw.stage
              "
            >
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.program.bylaw.stage.name_local }}
              </div>
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.program.bylaw.stage.code }}
              </div>
            </div>
          </template> -->
          <template #cell(level)="data">
            <div
              v-if="
                data.item && data.item.level
              "
            >
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.level.name_local }}
              </div>
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.level.name }}
              </div>
            </div>
          </template>
          <template #cell(type)="data">
            <div
              v-if="
                data.item.program &&
                data.item.program.bylaw &&
                data.item.program.bylaw.type
              "
            >
              <div v-if="$i18n.locale == 'ar'">
                {{ data.item.program.bylaw.type.name_local }}
              </div>
              <div v-if="$i18n.locale == 'en'">
                {{ data.item.program.bylaw.type.code }}
              </div>
            </div>
          </template>
          <template #cell(program)="data">
            <div v-if="data && data.item && data.item.faculty">
              <!-- <span v-if="data && data.item && data.item.term">
                <b-link class="font-weight-bold">
                  {{
                    data.item && $i18n.locale == "en"
                      ? data.item.term.name
                      : data.item.term.name_local
                  }}</b-link
                >
              </span> -->
              <span
                v-if="data && data.item && data.item.term && data.item.faculty"
                class="text-danger"
                style="margin: 0 2px !important"
              >
                ,
              </span>
              <!--            -->
              <span
                v-if="
                  data &&
                  data.item &&
                  data.item.faculty &&
                  !faculty_id &&
                  !bylaw_id
                "
              >
                <b-link
                  :to="{
                    name: 'faculty',
                    params: { id: data.item.faculty.id },
                  }"
                  class="font-weight-bold"
                >
                  {{
                    data.item && $i18n.locale == "en"
                      ? data.item.faculty.name || data.item.faculty.name_local
                      : data.item.faculty.name_local || data.item.faculty.name
                  }}
                </b-link>
              </span>
              <span
                v-if="
                  data &&
                  data.item &&
                  data.item.faculty &&
                  data.item.program &&
                  !faculty_id &&
                  !bylaw_id
                "
                class="text-danger"
                style="margin: 0 2px !important"
              >
                ,
              </span>
              <span
                v-if="
                  data &&
                  data.item &&
                  data.item.program &&
                  data.item.bylaw &&
                  !bylaw_id
                "
              >
                <b-link
                  :to="{
                    name: 'bylaw',
                    params: { id: data.item.bylaw.id },
                  }"
                  class="font-weight-bold"
                >
                  {{
                    data.item && $i18n.locale == "en"
                      ? data.item.bylaw.name ||
                        data.item.bylaw.name_local
                      : data.item.bylaw.name_local ||
                        data.item.bylaw.name_
                  }}
                </b-link>
              </span>
              <span
                v-if="data && data.item && data.item.program && !bylaw_id"
                class="text-danger"
                style="margin: 0 2px !important"
              >
                ,
              </span>
              <b-link
                v-if="data.item.program"
                :to="{ name: 'program', params: { id: data.item.program.id } }"
                class="font-weight-bold"
              >
                {{
                  data.item && $i18n.locale == "en"
                    ? data.item.program.name || data.item.program.name_local
                    : data.item.program.name_local || data.item.program.name_
                }}
              </b-link>
            </div>
          </template>
          <template #cell(status)="data">
            <div>
              <span
                v-for="(status, index) in data.item.status"
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold text-primary"
                :key="index"
              >
                <b-badge class="mx-1" pill :variant="getTagColor(index)">
                  {{ status ? status.name : "-" }}
                </b-badge>
              </span>
              <span
                v-for="(status, index) in data.item.status"
                v-if="$i18n.locale == 'ar'"
                class="text-primary"
                :key="index"
              >
                <b-badge class="mx-1" pill :variant="getTagColor(index)">
                  {{ status ? status.name_local : "-" }}
                </b-badge>
              </span>
            </div>
          </template>
          <template #cell(actions)="data">
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
                v-if="
                  hasPermission('access_offeringSchedule') &&
                  $route.name == 'schedules'
                "
                @click="openCalendar(data.item.id)"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
            </div>
            <div v-if="$route.name != 'schedules'">
              <b-link
                v-if="hasPermission('edit_student')"
                v-b-tooltip.hover="$t('Global.edit')"
                :to="{ name: 'student-edit', params: { id: data.item.id } }"
                class="mx-1"
              >
                <feather-icon icon="EditIcon" />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <Modal
      :hint="$t('Global.studentsImportMessage')"
      :link="'/students/import_migrated_students'"
      :title="$t('Global.importMigrationData')"
      :show="importMigrationModal"
    ></Modal>

    <b-modal
      ref="my-modal"
      size="lg"
      v-model="statusModal"
      hide-footer
      :title="$t(`Global.${modalTitle}`)"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col
            cols="12"
            md="12"
            class="height-250 overflow-y-scroll"
            v-if="status_messages.length"
          >
            <div
              class="bg-gray"
              v-for="(status_message, index) in status_messages"
              :key="index"
              v-if="typeof status_message.class !== undefined"
            >
              <b-alert :variant="status_message.class" show>
                <div class="alert-body">
                  <span>
                    {{ index + 1 + "- " + status_message.message }}
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
              {{ $t("Global.close") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
    <b-modal
      id="tags-modal"
      v-model="tagsModal"
      ref="tags-modal"
      :title="$t('Assign Tags')"
      size="lg"
      no-close-on-backdrop
      @hidden="resetTagsModal"
    >
      <b-overlay :show="load['students']" rounded="sm">
        <validation-observer ref="simpleTagsRules">
          <b-form :class="load['students'] ? 'disabled_all' : ''">
            <div class="row">
              <b-col md="12">
                <b-form-group label-for="tags" v-if="lookups">
                  <v-select
                    v-model="tagForm.tags"
                    :filter="fuseSearch"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.tags"
                    multiple
                    class="w-100 my-2"
                    :clearable="true"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Tags')"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
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
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
      </b-overlay>
      <template #modal-footer>
        <b-button
          type="submit"
          variant="primary"
          class="mr-1"
          @click="bulkTags()"
        >
          {{ $t("Global.save") }}
        </b-button>
        <b-button
          type="reset"
          variant="outline-secondary"
          @click="resetTagsModal()"
        >
          {{ $t("Global.cancel") }}
        </b-button>
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
  BSpinner,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BFormCheckbox,
  BFormCheckboxGroup,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormDatepicker,
  BFormFile,
  BForm,
  BFormGroup,
  BAlert,
  BFormSelect,
  BFormSelectOption,
  BFormSelectOptionGroup,
} from "bootstrap-vue";
import Modal from "@/views/components/common/Modal.vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import { getToken } from "@/utils/auth";
import { required } from "@validations";
import Multiselect from "@/views/components/common/Multiselect.vue";
export default {
  components: {
    Modal,
    DataTable,
    Multiselect,
    BFormSelect,
    BFormSelectOption,
    BFormSelectOptionGroup,
    BCard,
    vSelect,
    BRow,
    BSpinner,
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
    BFormDatepicker,
    BFormCheckbox,
    BFormCheckboxGroup,
    BFormFile,
    BForm,
    BFormGroup,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    program_id: null,
    faculty_id: null,
    tabNum: null,
    schedule: null,
  },
  data() {
    return {
      firstTime: true,
      selectAll: false,
      query: false,
      run: false,
      tempColorId: 0,
      levels: [],
      selected: [],
      status: null,
      tagForm: {
        students: [],
        tags: [],
      },
      tagsModal: false,
      filter: {
        export: 0,
        removed: 0,
        term_id:null,
        faculty_id:null,
        bylaw_id:null,
        program_id:null,
        level_id:null,
        stage:null,
        status:[],
        type:null,
        student_first_term_id:null,
        first_term_id:null,
        last_control_finish_at:null,
      },
      paramsLoaded: true,
      baseUrl: process.env.VUE_APP_BASE_URL,
      modalTitle: "import_progress",
      // importMigrationModal: false,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  computed: {
    ...mapGetters({
      items: "students/items",
      total: "students/total",
      needDrop: "app/needDrop",
      load: "app/generalLoad",
      lookups: "app/stateLookups",
      dependentLookups:"app/dependentLookups",
      generalLookups: "lookups/lookups",
      optionsLookups: "courses/lookups",
      currentTerm: "app/currentTerm",
      studentsOptions: "students/options",
      currentAdmissionTerm: "app/currentAdmissionTerm",
    }),
    fields() {
      let fields = [
        {
          key: "code",
          sortable: true,
          label: this.$t("Global.code"),
        },
        {
          key: "name",
          label: this.$t("Global.name"),
          sortable: true,
        },
        // {
        //   key: 'faculty',
        //   label: this.$t('Global.faculty'),
        //   sortable: true,
        //   thStyle: { width: '20%' },
        // },
        {
          key: "level",
          label: this.$t("Global.level"),
          sortable: false,
          thStyle: {width: '5%'},
        },
        // {
        //   key: "type",
        //   label: this.$t("Global.study_type"),
        //   sortable: false,
        //   //thStyle: {width: '5%'},
        // },
        // {
        //   key: 'bylaw',
        //   label: this.$t('Global.bylaw'),
        //   sortable: true,
        //   thStyle: { width: '20%' },
        // },

        {
          key: "program",
          label: this.$t("Global.program"),
          sortable: false,
        },
        // {
        //   key: 'term',
        //   sortable: true,
        //   label: this.$t('Global.term'),
        //   thStyle: { width: '5%' },
        // },
        {
          key: "tags",
          label: this.$t("Tags"),
          sortable: false,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: false,
          thStyle: { width: "15%" },
        },
      ];
      if (this.schedule) {
        const action = {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        };
        fields.push(action);
      }
      if (this.noStatus) {
        fields = fields.filter((obj) => !["status"].includes(obj.key));
      }
      if (this.program_id) {
        fields = fields.filter(
          (obj) => !["program", "level", "term", "actions"].includes(obj.key)
        );
      }
      if (this.faculty_id) {
        fields = fields.filter((obj) => !["term", "actions"].includes(obj.key));
      }
      if (this.bylaw_id) {
        fields = fields.filter((obj) => !["term", "level"].includes(obj.key));
      }
      return fields;
    },
  },
  watch: {
    selectAll(val) {
      if (val) {
        let mappedItems = this.items.map((item) => item.id);
        this.selected = mappedItems;
      } else {
        this.selected = [];
      }
    },
  },
  methods: {
    ...mapActions({
      assignTags: "students/assignTags",
      removeTags: "students/removeTags",
      exportExcel: "students/export",
      exportTemplate: "students/exportMigrationTemplate",
      getLookups: "app/lookupsAction",
    }),
    setStatus(data) {
      if (this.$route.query.status && data && !this.run) {
        if (this.$route.query.status.length) {
          this.status = data.filter((x) =>
            this.$route.query.status.includes(String(x.id))
          );
        } else {
          this.status = data.filter((x) => this.$route.query.status == x.id);
        }
        this.run = true;
      }
    },
    addStatus(value) {
      let ids = Array.from(value, (item) => item.id);
      this.filter.status = ids.filter((n) => n);
    },
    remove(removedOption) {
      const objWithIdIndex = this.filter.status.findIndex(
        (obj) => obj === removedOption.id
      );
      if (objWithIdIndex > -1) {
        this.filter.status.splice(objWithIdIndex, 1);
      }
    },
    refresh(query) {
      if (this.type) {
        query = { ...query, type: this.type };
      }

      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      this.$store.dispatch("students/students", { query });
    },
    Export(query) {
      const payload = { ...query, language: this.$i18n.locale };
      this.$store.dispatch("students/export", payload).then((res) => {
        this.filter.export = 0;
      });
    },
    reset() {
      this.firstTime = true;
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
    openCalendar(id) {
      this.$router.push({
        name: "student-schedule",
        params: {
          id,
        },
      });
    },
    extractData() {
      this.modalTitle = "extract_progress";
      if (!this.filter.faculty_id) {
        this.$swal({
          icon: "warning",
          title: `${this.$t("Global.warning")}`,
          text: `${this.$t("Global.you_must_select_faculty_at_least")}`,
          showConfirmButton: false,
          showCloseButton: true,
        });

        return;
      }

      this.$swal({
        title: "Are you sure?",
        text: `${this.$t("Global.confirmExtractData")}`,
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.yes")}`,
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

          let query = this.filter;
          if (this.$route.query && this.$route.query.search) {
            query = {
              ...query,
              keywords: this.$route.query.search,
            };
          }

          let url =
            process.env.VUE_APP_BASE_URL + "/users/extract_data/students";
          const response = await fetch(url, {
            headers: {
              Authorization: "Bearer " + getToken(),
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            method: "POST",
            body: JSON.stringify(query),
          });
          let isDone = false;
          const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();
          while (!isDone) {
            const { value, done } = await reader.read();
            if (done || isDone) {
              this.refresh();
              this.showCloseButton = true;
              this.$swal({
                icon: "success",
                title: this.$t("Global.success"),
                showConfirmButton: true,
                text: this.$t("Global.extract_done_successfully"),
              });
              break;
            }

            let allObjects =
              typeof value !== "undefined" ? value.split("}") : {};
            if (allObjects.length) {
              for (let i = 0; i < allObjects.length; i++) {
                if (allObjects[i].trim() != "" && allObjects[i].trim()) {
                  let object = allObjects[i] + "}";
                  object = JSON.parse(object);
                  if (typeof object.done === "undefined") {
                    this.setStatusesMessages(object);
                  } else if (typeof object.done !== "undefined") {
                    isDone = true;
                    this.showCloseButton = true;
                    this.$swal({
                      icon: "success",
                      title: this.$t("Global.success"),
                      showConfirmButton: true,
                      text: this.$t(
                        "Done. Please check archive folder 'ID Files/Students'"
                      ),
                    });
                  }
                }
              }
            }
          }
        }
      });
    },
    // toggleMigrationModal() {
    //   this.modalTitle = "import_progress";
    //   this.importMigrationModal = !this.importMigrationModal;
    // },
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
                "/students/import_migrated_students";
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
    openTagsModal() {
      this.tagsModal = true;
    },
    resetTagsModal() {
      this.tagForm = {
        students: [],
        tags: [],
      };
      this.tagsModal = false;
    },
    bulkTags() {
      this.$swal({
        title: `${this.$t("Assign Tags")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.tagForm.students = this.selected;
          this.assignTags({ query: this.tagForm }).then((_) => {
            this.selected = [];
            this.selectAll = false;
            this.tagForm = {
              students: [],
              tags: [],
            };
            this.$store
              .dispatch("students/students", this.query)
              .then((res) => {
                this.paramsLoaded = false;
              });
            this.resetTagsModal();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: `${this.$t("Global.saved")}`,
            });
          });
        }
      });
    },
    clearTags() {
      this.$swal({
        title: `${this.$t("confirmMessage")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.removeTags({ query: { students: this.selected } }).then((_) => {
            this.selected = [];
            this.selectAll = false;
            this.$store
              .dispatch("students/students", this.query)
              .then((res) => {
                this.paramsLoaded = false;
              });
            this.resetTagsModal();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: `${this.$t("Global.saved")}`,
            });
          });
        }
      });
    },
    getTagColor(index) {
      const colors = [
        "warning",
        "primary",
        "success",
        "secondary",
        "dark",
        "danger",
        "light-warning",
        "light-primary",
        "light-success",
        "light-danger",
      ];
      if (index < colors.length) {
        return colors[index];
      } else {
        let i = index % colors.length;
        return colors[i];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

