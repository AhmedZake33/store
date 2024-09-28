<template>
  <b-overlay rounded="sm">
    <title-card
      v-if="hasPermission('access_report_students')"
      :title="$t('students')"
    >
      <template #content>
        <report-card
          @setLang="setLang"
          :filters="filter"
          @reset="reset()"
          v-if="hasPermission('access_students_reports')"
          :title="$t('Global.student_report')"
          link="students"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.students &&
                  reportLookups.students.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.students &&
                  reportLookups.students.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.students &&
                      reportLookups.students.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.students &&
                  reportLookups.students.languages
                "
                class="w-100 bg-white"
                label="name"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{
                      $store.state.appConfig.layout.isRTL == "rtl"
                        ? option.name_local
                        : option.name
                    }}
                  </span>
                </template>
                <template #selected-option="{ name, name_local }">
                  {{
                    $store.state.appConfig.layout.isRTL == "rtl"
                      ? name_local
                      : name
                  }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>

        <report-card
          @setLang="setLang()"
          :filters="filter"
          @reset="reset()"
          :title="$t('Global.student_nationality_report')"
          v-if="hasPermission('access_students_nationality_reports')"
          link="nationalities"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.nationalities &&
                  reportLookups.nationalities.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.nationalities &&
                  reportLookups.nationalities.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.nationalities &&
                      reportLookups.nationalities.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.nationalities &&
                  reportLookups.nationalities.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>

        <!-- <report-card :filters="filter" @reset="reset()" :title="$t('Global.Graduates_report')" link="graduates">
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id" :options="reportLookups && reportLookups.graduates && reportLookups.graduates.stages"
                class="w-100 bg-white" clearable label="start_year" :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')">
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id" :options="reportLookups && reportLookups.graduates && reportLookups.graduates.types"
                class="w-100 bg-white" clearable label="type" :reduce="(val) => val.id" :placeholder="$t('Global.type')">
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <Multiselect :options="makeCategory(reportLookups && reportLookups.graduates && reportLookups.graduates.tags)"
                @addStatus="addStatus" @remove="remove"></Multiselect>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language" :options="reportLookups && reportLookups.graduates && reportLookups.graduates.languages"
                class="w-100 bg-white" label="language" :reduce="(val) => val.code" :placeholder="$t('Language')">
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id" :options="reportLookups && reportLookups.graduates && reportLookups.graduates.years"
                class="w-100 bg-white" clearable label="start_year" :reduce="(val) => val.start_year"
                :placeholder="$t('Global.year')">
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year+'/'+option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year,end_year }">
                  {{ start_year+'/'+end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id" :options="reportLookups && reportLookups.graduates && reportLookups.graduates.terms"
                class="w-100 bg-white" clearable label="start_year" :reduce="(val) => val.start_year"
                :placeholder="$t('Global.term')">
                <template v-slot:option="option">
                  <span>
                    {{ option.name}}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

          
          
          </template>
        </report-card> -->

        <report-card
          @setLang="setLang"
          :filters="filter"
          @reset="reset()"
          :title="$t('Global.registrations')"
          link="registrations"
          v-if="hasPermission('access_registrations_reports')"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.registrations &&
                  reportLookups.registrations.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.registrations &&
                  reportLookups.registrations.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.registrations &&
                      reportLookups.registrations.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.registrations &&
                  reportLookups.registrations.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <!-- <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id"
                :options="reportLookups && reportLookups.registrations && reportLookups.registrations.terms"
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.semester')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col> -->
          </template>
        </report-card>
      </template>
    </title-card>

    <title-card
      v-if="hasPermission('access_report_Graduate')"
      :title="$t('Graduates')"
    >
      <template #content>
        <report-card
          @setLang="setLang"
          :filters="filter"
          @reset="reset()"
          v-if="hasPermission('access_graduates_reports')"
          :title="$t('Global.Graduates_report')"
          link="graduates"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.graduates &&
                  reportLookups.graduates.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.graduates &&
                  reportLookups.graduates.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.graduates &&
                      reportLookups.graduates.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.graduates &&
                  reportLookups.graduates.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id"
                :options="
                  reportLookups &&
                  reportLookups.graduates &&
                  reportLookups.graduates.terms
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.semester')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.graduates &&
                  reportLookups.graduates.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
      </template>
    </title-card>
    <title-card
      v-if="hasPermission('access_report_applicants')"
      :title="$t('applicants')"
    >
      <template #content>
        <report-card
          @setLang="setLang"
          :filters="filter"
          @reset="reset()"
          v-if="hasPermission('access_applicants_reports')"
          :title="$t('Global.applicants')"
          link="applicants"
        >
          <template #filters>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants &&
                  reportLookups.applicants.stages
                "
                class="w-100 bg-white"
                clearable
                label="stage_id"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants &&
                  reportLookups.applicants.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.applicants &&
                      reportLookups.applicants.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants &&
                  reportLookups.applicants.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants &&
                  reportLookups.applicants.terms
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.semester')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.applicants &&
                  reportLookups.applicants.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>

        <report-card
          :filters="filter"
          @setLang="setLang"
          @reset="reset()"
          :title="$t('Global.certificates')"
          v-if="hasPermission('access_certificates_reports')"
          link="applicants_certificates"
        >
          <template #filters>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_certificates &&
                  reportLookups.applicants_certificates.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_certificates &&
                  reportLookups.applicants_certificates.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.applicants_certificates &&
                      reportLookups.applicants_certificates.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_certificates &&
                  reportLookups.applicants_certificates.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_certificates &&
                  reportLookups.applicants_certificates.terms
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.semester')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.applicants_certificates &&
                  reportLookups.applicants_certificates.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>

        <report-card
          :filters="filter"
          @reset="reset()"
          @setLang="setLang"
          :title="$t('Global.types')"
          v-if="hasPermission('access_types_reports')"
          link="applicants_types"
        >
          <template #filters>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_types &&
                  reportLookups.applicants_types.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_types &&
                  reportLookups.applicants_types.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.applicants_types &&
                      reportLookups.applicants_types.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_types &&
                  reportLookups.applicants_types.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.term_id"
                :options="
                  reportLookups &&
                  reportLookups.applicants_types &&
                  reportLookups.applicants_types.terms
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.semester')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.applicants_types &&
                  reportLookups.applicants_types.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
      </template>
    </title-card>
    <title-card
      v-if="hasPermission('access_report_AcademicStaff')"
      :title="$t('instructors')"
    >
      <template #content>
        <report-card
          :filters="filter"
          @setLang="setLang"
          @reset="reset()"
          :title="$t('Global.instructors')"
          v-if="hasPermission('access_instructors_reports')"
          link="instructors"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.instructors &&
                  reportLookups.instructors.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
      </template>
    </title-card>
    <title-card
      v-if="hasPermission('access_report_financials')"
      :title="$t('financial')"
    >
      <template #content>
        <report-card
          :filters="filter"
          @setLang="setLang"
          @reset="reset()"
          :title="$t('Global.Financial By Program')"
          v-if="hasPermission('access_financial_program_reports')"
          link="financial_by_program"
        >
          <template #filters>
            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_program &&
                  reportLookups.financial_by_program.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_program &&
                  reportLookups.financial_by_program.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.financial_by_program &&
                      reportLookups.financial_by_program.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              >
              </Multiselect>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_program &&
                  reportLookups.financial_by_program.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.currency_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_program &&
                  reportLookups.financial_by_program.currency
                "
                class="w-100 bg-white"
                clearable
                label="currency"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.currency')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_program &&
                  reportLookups.financial_by_program.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
        <report-card
          :filters="filter"
          @setLang="setLang"
          @reset="reset()"
          :title="$t('Global.Financial By Level')"
          v-if="hasPermission('access_financial_level_reports')"
          link="financial_by_level"
        >
          <template #filters>
            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_level &&
                  reportLookups.financial_by_level.stages
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_level &&
                  reportLookups.financial_by_level.types
                "
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>

            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="
                  makeCategory(
                    reportLookups &&
                      reportLookups.financial_by_level &&
                      reportLookups.financial_by_level.tags
                  )
                "
                @addStatus="addStatus"
                @remove="remove"
              >
              </Multiselect>
            </b-col>

            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_level &&
                  reportLookups.financial_by_level.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.currency_id"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_level &&
                  reportLookups.financial_by_level.currency
                "
                class="w-100 bg-white"
                clearable
                label="currency"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.currency')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.financial_by_level &&
                  reportLookups.financial_by_level.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
        <report-card
          :filters="filter"
          @setLang="setLang"
          @reset="reset()"
          :title="$t('Global.payments_accounts')"
          v-if="hasPermission('access_payments_accounts_reports')"
          link="payments_accounts"
        >
          <template #filters>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.year_id"
                :options="
                  reportLookups &&
                  reportLookups.payments_accounts &&
                  reportLookups.payments_accounts.years
                "
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.year')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.start_year + "/" + option.end_year }}
                  </span>
                </template>
                <template #selected-option="{ start_year, end_year }">
                  {{ start_year + "/" + end_year }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col class="mt-2" cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.currency_id"
                :options="
                  reportLookups &&
                  reportLookups.payments_accounts &&
                  reportLookups.payments_accounts.currency
                "
                class="w-100 bg-white"
                clearable
                label="currency"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.currency')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="6" class="mt-2">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.language"
                :options="
                  reportLookups &&
                  reportLookups.payments_accounts &&
                  reportLookups.payments_accounts.languages
                "
                class="w-100 bg-white"
                label="language"
                :reduce="(val) => val.code"
                :placeholder="$t('Language')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
          </template>
        </report-card>
      </template>
    </title-card>
  </b-overlay>
</template>

<script>
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import ReportCard from "@/views/reports/components/cards/ReportCard.vue";
import TitleCard from "@/views/reports/components/cards/TitleCard.vue";
import Multiselect from "@/views/components/common/Multiselect.vue";
import { mapGetters, mapActions } from "vuex";
import {
  BFormInput,
  BAlert,
  BFormCheckbox,
  BSpinner,
  BCol,
  BForm,
  BModal,
  VBModal,
  BFormFile,
  BButton,
  BRow,
  BOverlay,
  BFormGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
export default {
  name: "Show",
  components: {
    ReportCard,
    TitleCard,
    Multiselect,
    BOverlay,
    BFormGroup,
    vSelect,
    BFormInput,
    BAlert,
    BFormCheckbox,
    BSpinner,
    BCol,
    BForm,
    BModal,
    VBModal,
    BFormFile,
    BButton,
    BRow,
  },
  data() {
    return {
      faculties: "",
      facultiesPG: "",
      facultiesUG: "",
      nonEgyptians: "",
      totalPG: "",
      status: null,
      totalUG: "",
      totalNEUG: "",
      loadNEGU: "",
      lookups: {},
      NationalityUG: [],
      nationalityload: false,
      types: [],
      currency: [],
      year: [],
      nationliaties: [],
      nationality: "",
      type: "",
      natType: "",
      toggleFilter: false,
      // load: true,
      filter: {},
      applicantsStage: null,
    };
  },
  mounted() {
    // console.log(this.getReportsLookups.then(res => console.log(res)));
  },
  computed: {
    ...mapGetters({
      load: "Report/load",
      reportLookups: "Report/reportLookups",
    }),
  },
  methods: {
    ...mapActions({
      getReportsLookups: "Report/getReportsLookups",
    }),
    setLang() {
      this.filter = {
        language: this.$i18n.locale.toLowerCase(),
      };
      // this.filter['language'] = this.$i18n.locale.toLowerCase();
      console.log("this.filter.language", this.filter);
    },
    reset() {
      this.filter = {};
    },
    addStatus(value) {
      let ids = Array.from(value, (item) => item.id);
      this.filter.tags = ids.filter((n) => n);
    },
    remove(removedOption) {
      const objWithIdIndex = this.filter.status.findIndex(
        (obj) => obj === removedOption.id
      );
      if (objWithIdIndex > -1) {
        this.filter.status.splice(objWithIdIndex, 1);
      }
    },
    slideToggle() {
      $(".years").slideToggle();
    },
    downloadPDF(lang) {
      this.$toast(
        {
          component: ToastificationContent,
          props: {
            icon: "FileTextIcon",
            text: this.$t("Global.downloading_report_in_progress"),
            variant: "info",
          },
        },
        {
          position: "top-center",
          timeout: false,
          closeOnClick: false,
          draggable: false,
        }
      );

      request
        .get(`/reports/students-pdf?lang=${lang}`, { responseType: "blob" })
        .then((res) => {
          fileDownload(res, "Students Report.pdf");
        })
        .catch((err) => {})
        .finally(() => {
          document.querySelector(".toastification-close-icon").click();
        });
    },

    resetNat() {
      this.natType = null;
    },
  },
};
</script>

<style lang="scss">
.unicon {
  align-items: center;
  cursor: pointer;

  svg {
    fill: #054978;
    width: 15px;
    height: 15px;
    margin-top: 4px;
  }
}

.Vue-Toastification__container.top-center
  .Vue-Toastification__toast.Vue-Toastification__toast--default
  .Vue-Toastification__toast-component-body {
  .toastification small.text-body {
    color: darkred !important;
  }
}
</style>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";

.tab-content.col {
  overflow: auto;
}

.toastification-close-icon {
  visibility: hidden !important;
}
</style>
