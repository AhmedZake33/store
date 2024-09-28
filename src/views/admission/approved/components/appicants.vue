<template>
  <div>
    <b-overlay :show="load" rounded="sm">
      <statistics
        :loading="load"
        v-if="details"
        :items="details"
        :widths="[2, 2, 2, 2, 2, 2, 3, 3, 3, 3]"
        :only="[
          'INCOMPLETE',
          'SUBMITTED',
          'FEEDBACK',
          'UPDATED',
          'REVIEWED',
          'DISTRIBUATION_REQUIRED',
          'REJECTED',
          'FINAL_FEES_REQUIRED',
          'APPROVED',
          'total',
        ]"
        :icon="'TrendingUpIcon'"
      ></statistics>
      <DataTable
        :total="total"
        :allow-search="true"
        :paramsLoaded="paramsLoaded"
        :default-filter="$route.name.includes('_applicants_pg') ? 'admission_term_PG_id' :'admission_term_UG_id'"
        :filter="filter"
        @reset="reset"
        @Refresh="refresh"
        @Export="Export"
      >
        <template v-if="lookups" #filter>
          <b-col cols="12" md="4">
            <v-select
            v-if="$route.name.includes('_applicants_pg')"
            :filter="fuseSearch"
            v-model="filter.admission_term_PG_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
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
          <v-select
            v-else
            :filter="fuseSearch"
            v-model="filter.admission_term_UG_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
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
          <b-col md="4">
            <b-form-group label-for="mc-program">
              <v-select
                v-model="filter.pre_university_certificate_groupe"
                :placeholder="$t('Global.certificate_country')"
                :options="certificate_sections"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :reduce="(el) => el.id"
                :clearable="false"
                :label="getSelectLabel()"
                class="w-100"
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
                  {{
                    $i18n.locale == "ar"
                      ? option.name_local || option.name
                      : option.name || option.name_local
                  }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label-for="mc-program">
              <v-select
                v-model="filter.pre_university_certificate"
                :placeholder="$t('Global.pre_university_certificate')"
                :options="certificates"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :reduce="(el) => el.id"
                :clearable="false"
                :disabled="
                  !filter.pre_university_certificate &&
                  !filter.pre_university_certificate_groupe
                "
                :label="getSelectLabel()"
                class="w-100"
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
                  {{
                    $i18n.locale == "ar"
                      ? option.name_local || option.name
                      : option.name || option.name_local
                  }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label-for="mc-program">
              <v-select
                v-model="filter.pre_university_certificate_type"
                :placeholder="$t('Global.pre_university_certificate_type')"
                :options="certificate_types"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :disabled="
                  !filter.pre_university_certificate &&
                  !filter.pre_university_certificate_type
                "
                :label="getSelectLabel()"
                :clearable="false"
                :reduce="(el) => el.id"
                class="w-100"
              >
                <template slot="selected-option" slot-scope="option">
                  <strong v-if="$i18n.locale == 'ar'">
                    {{ option.name_local || option.name }}
                  </strong>
                  <strong v-else>
                    {{ option.name || option.name_local }}
                    <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                                  {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                  </strong>
                </template>
                <template v-slot:option="option">
                  {{
                    $i18n.locale == "ar"
                      ? option.name_local || option.name
                      : option.name || option.name_local
                  }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="4">
            <v-select
              v-model="filter.country_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="appLookups.countries"
              class="w-100 mb-2"
              label="name"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.country')"
            >
              <template v-slot:option="option">
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4">
            <v-select
              v-model="filter.year"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="admission_years"
              label="name"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.year')"
            >
              <template slot="selected-option" slot-scope="option">
                <strong v-if="$i18n.locale == 'ar'">
                  {{ option.name_local || option.name }}
                </strong>
                <strong v-else>
                  {{ option.name || option.name_local }}
                  <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                            {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                </strong>
              </template>
              <template v-slot:option="option">
                {{
                  $i18n.locale == "ar"
                    ? option.name_local || option.name
                    : option.name || option.name_local
                }}
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4">
            <v-select
              v-model="filter.faculty_reference_id"
              :filter="fuseSearch"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.faculties"
              label="name"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.faculty_preference')"
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
                {{
                  $i18n.locale == "ar"
                    ? option.name_local || option.name
                    : option.name || option.name_local
                }}
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4">
            <v-select
              :disabled="!filter.faculty_reference_id"
              :filter="fuseSearch"
              v-model="filter.program_reference_id"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.programs_references"
              label="name"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.programs_references')"
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
                {{
                  $i18n.locale == "ar"
                    ? option.name_local || option.name
                    : option.name || option.name_local
                }}
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4" v-if="lookups">
            <v-select
              v-model="filter.tags"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.tags"
              multiple
              :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Tags')"
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
          
          <b-col md="2">
            <b-form-group label-for="from" invalid-feedback="from">
              <b-form-input
                @keydown.enter.native="setFilter()"
                type="number"
                :placeholder="$t('Global.from_mark%')"
                @keypress="writeNumber($event)"
                id="from"
                v-model="enterFilter.from"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label-for="to" invalid-feedback="to">
              <b-form-input
                @keydown.enter.native="setFilter()"
                type="number"
                :placeholder="$t('Global.to_mark%')"
                :disabled="!enterFilter.from"
                @keypress="writeNumber($event)"
                id="to"
                v-model="enterFilter.to"
              />
            </b-form-group>
          </b-col>

          <b-col cols="12" md="4">
            <v-select
              v-model="filter.egyptian"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :options="lookups.egyptians_nonegyptians"
              label="name"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('Egyptians / Non-Egyptians')"
            >
              <template slot="selected-option" slot-scope="option">
                <span v-if="$i18n.locale == 'ar'">
                  {{ option.name_local || option.name }}
                </span>
                <span v-else>
                  {{ option.name || option.name_local }}
                  <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                </span>
              </template>
              <template v-slot:option="option">
                {{
                  $i18n.locale == "ar"
                    ? option.name_local || option.name
                    : option.name || option.name_local
                }}
              </template>
              <template #no-options>
                {{ $t("noMatching") }}
              </template>
            </v-select>
          </b-col>

          <!-- <b-col cols="12" md="4" class="mb-1">
            <b-form-datepicker
              :label-no-date-selected="$t('Global.no_selected')"
              :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
              id="date_applied_from"
              ref="date_applied_from"
              reset-button
              v-model="filter.date_applied_from"
              :placeholder="$t('date_from')"
            />
          </b-col>
          <b-col cols="12" md="4" class="mb-1">
            <b-form-datepicker
              :label-no-date-selected="$t('Global.no_selected')"
              :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
              id="date_applied_to"
              ref="date_applied_to"
              reset-button
              v-model="filter.date_applied_to"
              :placeholder="$t('date_to')"
            />
          </b-col> -->
        </template>
        <template #customTable>
          <b-table :busy="load"           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative" :items="items" responsive :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
            <template #table-busy>
              <div class="text-center text-black my-2">
                <b-spinner class="align-middle" />
              </div>
            </template>
            <template #head(name)="data">
              <div class="d-inline-flex align-items-center">
                <b-form-checkbox
                  v-model="selectAll"
                  v-b-tooltip.hover="
                    filter.faculty_reference_id
                      ? ''
                      : $t('Global.assign_program_message')
                  "
                  :disabled="!filter.faculty_reference_id"
                  style="margin-top: 6px"
                  class="mt-0 custom-control-primary"
                />
                <span>{{ $t("Global.student") }}</span>
              </div>
            </template>
            <template #cell(tags)="data">
              <div v-if="data.item.tags">
                <span v-for="(tag,index) in data.item.tags" :key="tag.id">
                  <b-badge
                    pill
                    :variant="getTagColor(index)"
                  >
                  <!-- light-primary -->
                    {{ $i18n.locale == 'ar' ? tag.name_local : tag.name }}
                  </b-badge>
                </span>
              </div>
            </template>
            <template #cell(certificate)="data">
              <div>
                <div v-if="$i18n.locale == 'en'">
                  <span v-if="data.item.pre_university_certificate">
                    {{
                      data.item.pre_university_certificate.name ||
                      data.item.pre_university_certificate.name_local
                    }},
                  </span>
                  <span v-if="data.item.pre_university_certificate_type">
                    {{
                      data.item.pre_university_certificate_type.name ||
                      data.item.pre_university_certificate_type.name_local
                    }}
                  </span>
                  <span v-if="data.item.qualification_country">
                    {{
                      data.item.qualification_country.name ||
                      data.item.qualification_country.name_local
                    }}
                  </span>
                </div>
                <div v-if="$i18n.locale == 'ar'">
                  <span v-if="data.item.pre_university_certificate">
                    {{
                      data.item.pre_university_certificate.name_local ||
                      data.item.pre_university_certificate.name
                    }},
                  </span>
                  <span v-if="data.item.pre_university_certificate_type">
                    {{
                      data.item.pre_university_certificate_type.name_local ||
                      data.item.pre_university_certificate_type.name
                    }}
                  </span>
                  <span v-if="data.item.qualification_country">
                    {{
                      data.item.qualification_country.name_local ||
                      data.item.qualification_country.name
                    }}
                  </span>
                </div>
              </div>
            </template>
            <template #cell(country)="data">
              <div v-if="data.item.birth_country">
                <div v-if="$i18n.locale == 'en'">
                  {{ data.item.birth_country.name }}
                </div>
                <div v-if="$i18n.locale == 'ar'">
                  {{ data.item.birth_country.name_local }}
                </div>
              </div>
            </template>
            <template #cell(year)="data">
              <div v-if="data.item">
                <!--                            {{ toLocalYear(data.item.qualification_date)}}-->
                {{ data.item.year }}
              </div>
            </template>
            <template #cell(faculty_id)="data">
              <div v-if="data.item.student">
                <b-link
                  v-if="$i18n.locale == 'en'"
                  :to="{
                    name: 'faculty',
                    params: { id: data.item.student.faculty.id },
                  }"
                  class="font-weight-bold"
                >
                  {{ data.item ? data.item.student.faculty.name : "_" }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  :to="{
                    name: 'faculty',
                    params: { id: data.item.student.faculty.id },
                  }"
                  class="font-weight-bold"
                >
                  {{ data.item ? data.item.student.faculty.name_local : "_" }}
                </b-link>
                <span v-if="data.item.student.program">
                  <strong class="text-danger">,</strong>
                  <b-link
                    v-if="$i18n.locale == 'en'"
                    :to="{
                      name: 'program',
                      params: { id: data.item.student.program.id },
                    }"
                    class="font-weight-bold"
                  >
                    {{ data.item ? data.item.student.program.name : "_" }}
                  </b-link>
                  <b-link
                    v-if="$i18n.locale == 'ar' && data.item.program"
                    :to="{
                      name: 'program',
                      params: { id: data.item.student.program.id },
                    }"
                  >
                    {{ data.item ? data.item.student.program.name_local : "_" }}
                  </b-link>
                </span>
              </div>
            </template>
            <template #cell(name)="data">
              <b-media
                vertical-align="center"
                class="d-inline-flex align-items-center"
              >
                <template v-if="data.item.name" #aside>
                  <b-form-checkbox
                    v-model="selected"
                    v-b-tooltip.hover="
                      filter.faculty_reference_id
                        ? ''
                        : $t('Global.assign_program_message')
                    "
                    :disabled="!filter.faculty_reference_id"
                    style="margin-top: 6px"
                    :value="data.item.id"
                    class="d-flex align-items-center custom-control-primary"
                  />
                  <b-avatar
                    size="35"
                    :text="avatarText(data.item.name)"
                    v-if="data.item.photo_url"
                    :src="data.item.photo_url"
                  />
                  <b-avatar
                    size="35"
                    :text="avatarText(data.item.name)"
                    v-else
                  />
                </template>
                <div v-if="data.item.user">
                  <b-link
                    v-if="$i18n.locale == 'ar'"
                    class="font-weight-bold d-inline-block"
                    :to="{
                      name: 'student-show',
                      params: { id: data.item.user.id },
                    }"
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
                    :to="{
                      name: 'student-show',
                      params: { id: data.item.user.id },
                    }"
                  >
                    {{ data.item && data.item.name ? data.item.name : "-" }}
                  </b-link>
                </div>
                <br />
              </b-media>
            </template>
            <template #cell(certificate_degree)="data">
              <div class="text-bold text-dark">
                {{ data.item.certificate_degree }} %
              </div>
            </template>
            <template #cell(created_at)="data">
              <div v-if="data.item.created_at">
                {{
                  toLocalDatetime(
                    data.item.created_at,
                    $i18n.locale,
                    true,
                    false
                  )
                }}
              </div>
            </template>
            <template #cell(status)="data">
              <b-badge
                v-if="$i18n.locale == 'ar'"
                pill
                :variant="
                  getStatus(data.item.status ? data.item.status.id : 0).color
                "
                class="text-capitalize"
              >
                {{ data.item.status.name_local }}
              </b-badge>
              <b-badge
                v-if="$i18n.locale == 'en'"
                pill
                :variant="
                  getStatus(data.item.status ? data.item.status.id : 0).color
                "
                class="text-capitalize"
              >
                {{ data.item.status.name }}
              </b-badge>
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
                <a v-if="data.item.secret && hasPermission('edit_applicant')" :href="data.item.link" target="_blank">
                  <feather-icon icon="EditIcon" style="cursor: pointer" />
                </a>
                <a>
                  <feather-icon
                    v-if="hasPermission('delete_applicant')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="remove(data.item.id)"
                  />
                </a>
              </div>
            </template>
          </b-table>
        </template>
        <template #action>
          <b-button
            v-b-tooltip.hover="$t('Clear Tags')"
            :class="selected.length ? 'btn-icon mr-1' : 'btn-icon mr-1 disabled_all'"
            variant="primary"
            @click="clearTags()"
            v-if="hasPermission('delete_tags')"
          >
            <feather-icon icon="DeleteIcon" />
          </b-button>
          <b-button
            v-b-tooltip.hover="$t('Assign Tags')"
            :class="selected.length ? 'btn-icon mr-1' : 'btn-icon mr-1 disabled_all'"
            variant="primary"
            @click="openTagsModal"
            v-if="hasPermission('edit_tags')"
          >
            <feather-icon icon="TagIcon" />
          </b-button>
          <b-button
            v-b-tooltip.hover="$t('Global.export_excel')"
            v-if="hasPermission('export_applicant')"
            class="btn-icon"
            variant="primary"
            @click="filter.export = 1"
          >
            <feather-icon icon="FileTextIcon" />
          </b-button>
          <b-button
            v-if="hasPermission('assign_applicant')"
            @click="openAssignModel"
            :disabled="selected.length < 1"
            v-b-tooltip.hover="$t('Global.assign_to_program')"
            variant="primary"
            class="btn-icon ml-1"
          >
            <span> + {{ $t("Global.assign_to_program") }}</span>
            <b-badge v-if="selected.length" class="m-0 py-0" variant="dark">
              {{ selected.length }}
            </b-badge>

            <!--                        <feather-icon v-else icon="CommandIcon"/>-->
          </b-button>
          <input ref="refInputEl" type="file" class="d-none" @change="upload" />
        </template>
      </DataTable>
      <b-modal
        ref="my-modal"
        v-model="assignModal"
        hide-footer
        :title="$t('Global.assign_to_program')"
      >
        <div class="demo-vertical-spacing">
          <validation-observer ref="ruleForm">
            <b-form>
              <b-col cols="12" md="12">
                <b-form-group
                  :label="$t('Global.program')"
                  label-for="Message"
                  v-if="lookups"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Message"
                    :rules="'required'"
                  >
                    <v-select
                      v-model="form.program_id"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.programs_references"
                      class="w-100 mb-2"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.program')"
                    >
                      <template slot="selected-option" slot-scope="option">
                        <span>
                          {{
                            $i18n.locale == "ar"
                              ? option.name_local
                              : option.name
                          }}
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
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
            </b-form>
          </validation-observer>
        </div>
        <div class="mt-2">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="bulk"
              >
                {{ $t("Global.ok") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-primary"
                @click="assignModal = false"
              >
                {{ $t("Global.cancel") }}
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
        <b-overlay
          :show="load"
          rounded="sm"
        >
          <validation-observer ref="simpleTagsRules">
            <b-form :class="load ? 'disabled_all' : ''">
              <div class="row">
                <b-col md="12">
                  <b-form-group
                    label-for="tags"
                    v-if="lookups"
                  >
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
    </b-overlay>
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
  BFormCheckbox,
  BFormCheckboxGroup,
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
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormDatepicker
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { avatarText } from "@core/utils/filter";
import DataTable from "@/views/components/table/DataTable";
import Statistics from "@/views/components/info/statistics";
import { required, email, regex } from "@validations";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  components: {
    Statistics,
    DataTable,
    BCard,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    BRow,
    BSpinner,
    BCol,
    BOverlay,
    BCardHeader,
    BFormCheckbox,
    BFormCheckboxGroup,
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
    BFormDatepicker
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      link: "",
      tagsModal: false,
      tagForm:{
        applicants:[],
        tags:[]
      },
      filter: {
        removed: 0,
        export: 0,
        admission_term_UG_id: null,
        admission_term_PG_id:null,
        pre_university_certificate_groupe: null,
        faculty_reference_id: null,
        year: null,
        country_id: null,
        pre_university_certificate_type: null,
        pre_university_certificate: null,
      },
      selected: [],
      selectAll: false,
      pre_university_certificate_groupe: null,
      pre_university_certificate: null,
      pre_university_certificate_type: null,
      pre_university_certificate_types: [],
      appLookups: null,
      form: {},
      enterFilter: {},
      paramsLoaded: true,
      assignModal: false,
      lookupModules: {
        countries: true,
        pre_certificates: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: 'applicants/items',
      total: 'applicants/total',
      load: 'applicants/load',
      lookups: 'applicants/lookups',
      details: 'applicants/details',
      currentAdmissionTerm: 'app/currentAdmissionTerm',
      currentAdmissionTermPG: 'app/currentAdmissionTermPG',
      needDrop:'app/needDrop',
    }),
    admission_years() {
      let current_year = new Date().getFullYear();
      let pre_year = Number(current_year) - 1;
      return [
        { id: current_year, name: current_year },
        { id: pre_year, name: pre_year },
      ];
    },
    certificate_sections() {
      if (this.appLookups && this.appLookups.certificates) {
        return this.appLookups.certificates;
      }
      return false;
    },
    certificates() {
      if (
        this.appLookups &&
        this.appLookups.certificates &&
        this.filter.pre_university_certificate_groupe
      ) {
        this.certificatesArray = this.appLookups.certificates.find(
          (el) => el.id == this.filter.pre_university_certificate_groupe
        );
        return this.certificatesArray
          ? this.certificatesArray.pre_university_certificate
          : [];
      }
    },
    certificate_types() {
      if (
        this.appLookups &&
        this.appLookups.certificates &&
        this.filter.pre_university_certificate &&
        this.certificatesArray
      ) {
        const certificateTypeArray = this.certificates
          ? this.certificates.find(
              (el) => el.id == this.filter.pre_university_certificate
            )
          : {};
        return certificateTypeArray
          ? certificateTypeArray.pre_university_certificate_type
          : [];
      }
    },
    fields() {
      const fields = [
        {
          key: "name",
          label: this.$t("Global.name"),
          sortable: true,
          thStyle: { width: "20%" },
        },
        {
          key: "certificate",
          label: this.$t("Global.pre_certificate"),
          sortable: true,
        },
        {
          key: "country",
          label: this.$t("Global.country"),
        },
        {
          key: "year",
          label: this.$t("Global.year"),
          sortable: true,
        },
        {
          key: "certificate_degree",
          label: this.$t("Global.percentage"),
          sortable: true,
        },
        {
          key: "faculty_id",
          label: this.$t("Global.faculty"),
          sortable: true,
          thStyle: { width: "30%" },
        },
        // {
        //     key: 'created_at',
        //     label: this.$t('Global.created_at'),
        //     sortable: true,
        // },
        // {
        //     label: this.$t('Global.type'),
        //     key: 'admission_type',
        //     sortable: true
        // },

        // {
        //     label: this.$t('Global.status'),
        //     key: 'status',
        //     sortable: true,
        // },
        {
          label: this.$t('Tags'),
          key: 'tags',
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
  },
  methods: {
    ...mapActions({
      removeApplicant: "applicants/remove",
      exportExcel: "applicants/export",
      getLookups: "app/GET_LOOKUPS",
      updateCurrentTerms: "app/getTerms",
      assignTags: 'applicants/assignTags',
      removeTags: 'applicants/removeTags'
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
    openAssignModel() {
      this.form = {};
      this.assignModal = true;
    },
    refresh(query) {
      // this.updateCurrentTerms().then((res) => {
      //   if (!this.filter.admission_term_id) {
      //     this.filter.admission_term_id =
      //       this.$route.name != "accepted_applicants_pg"
      //         ? res.current_admission_term
      //         : res.current_admission_term_PG;
      //   }
      // });
      if(this.$route.query['admission_term_UG_id']){
        query["admission_term_id"] = this.$route.query['admission_term_UG_id'];
        delete query["admission_term_UG_id"];
      }
      if(this.$route.query['admission_term_PG_id']){
        if(this.$route.name.includes('_applicants_pg')){
          query["admission_term_id"] = this.$route.query['admission_term_PG_id'];
          delete query["admission_term_PG_id"];
        }else if( this.$route.query['admission_term_PG_id']){
          delete query["admission_term_PG_id"];
        }
      }
      if (this.appLookups) {
        query = { ...query, status: 11, showTransfer: true };
        let payload = {
          query: query,
        };
        if (!this.$route.name.includes("_pg")) {
          payload = { ...payload, applicant_type: 1 };
        }

        this.$store.dispatch("applicants/applicants", { payload }).then((_) => {
          this.paramsLoaded = false;
        });
      } else {
        this.getLookups(this.lookupModules).then((data) => {
          this.appLookups = data.success;
          query = { ...query, status: 11, showTransfer: true };
          let payload = {
            query: query,
          };
          if (!this.$route.name.includes("_pg")) {
            payload = { ...payload, applicant_type: 1 };
          }
          this.selectAll = false;
          this.$store
            .dispatch("applicants/applicants", { payload })
            .then((_) => {
              this.paramsLoaded = false;
            });
        });
      }
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
          this.removeApplicant(id).then((_) => {
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
    bulk() {
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
          let query = this.form;
          query.applicant_ids = this.selected;
          this.$store
            .dispatch("applicants/bulkAssignProgram", { query: query })
            .then((_) => {
              this.selected = [];
              this.refresh(this.filter);
              // this.filter = { from: null, to: null, export: 0 };
              this.assignModal = false;
              this.selectAll = false;
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
      });
    },
    openTagsModal(){
      this.tagsModal = true
    },
    resetTagsModal(){
      this.tagForm = {
        applicants:[],
        tags:[]
      }
      this.tagsModal = false
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
          this.tagForm.applicants = this.selected
          this.assignTags({query: this.tagForm})
            .then((_) => {
              this.selected = [];
              this.selectAll = false;
              this.tagForm = {
                applicants:[],
                tags:[]
              }
              this.refresh(this.filter)
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
    clearTags(){
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
          this.removeTags({ query: {applicants: this.selected} })
            .then((_) => {
              this.selected = [];
              this.selectAll = false;
              this.refresh(this.filter)
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
    getTagColor(index){
      const colors = ['warning','primary','success','secondary','dark','danger','light-warning','light-primary','light-success','light-danger']
      if(index < colors.length ){
        return colors[index]
      }else{
        let i = index % colors.length
        return colors[i]
      }
    },
    upload(e) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      this.$store
        .dispatch("applicants/upload", { resource: data })
        .then((_) => {
          this.refresh();
        });
    },

    Export(query) {
      let flag = null;
      if (this.$route.name != "accepted_applicants_pg") {
        flag = "ug";
      } else {
        flag = "pg";
      }
      query = {
        ...query,
        status: 11,
        withPaymentDetail: true,
        language: this.$i18n.locale,
        flag: flag,
      };
      this.exportExcel(query);
      this.filter.export = 0;
    },
    setFilter() {
      if (
        (this.enterFilter.from && this.enterFilter.to) ||
        (!this.enterFilter.from && !this.enterFilter.to)
      ) {
        if (Number(this.enterFilter.from) > Number(this.enterFilter.to)) {
          this.enterFilter.to = null;
        } else {
          this.filter.from = Number(this.enterFilter.from);
          this.filter.to = Number(this.enterFilter.to);
          let query = this.clean(this.filter);
          this.refresh(query);
        }
      }
    },
  },
  watch: {
    "$route.name"(val) {
      this.refresh();
    },
    "filter.faculty_reference_id"(val, old) {
      if (!val) {
        this.filter.program_reference_id = null;
      }
    },
    selectAll(val) {
      if (val) {
        let mappedItems = this.items.map((item) => item.id);
        this.selected = mappedItems;
      } else {
        this.selected = [];
      }
    },
    "enterFilter.from"(val, old) {
      if (!val) {
        this.enterFilter.to = null;
      }
      if (val > 100) {
        this.enterFilter.from = null;
      }
    },
    "enterFilter.to"(val) {
      if (val > 100) {
        this.enterFilter.to = null;
      }
    },
    "filter.pre_university_certificate_groupe": function (newVal, oldVal) {
      if (oldVal) {
        this.pre_university_certificate = null;
        this.pre_university_certificate_type = null;
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

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
