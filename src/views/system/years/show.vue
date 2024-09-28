<template>
  <div v-if="hasPermission('show_year')">
    <b-overlay :show="$store.getters['years/load']" rounded="sm">
      <b-card class="mb-0">
        <b-tabs @input="saveStatus" lazy vertical v-model="tabIndex" nav-wrapper-class="nav-hidden custom_drop_tabs" align="left">
          <div class="custom_drop mb-2" v-if="$store.getters['app/width'] < 982 && $store.getters['app/width'] != 0"
          :class="!rerender ? 'py-3' : ''">
          <b-dropdown block
            :text="$store.getters['app/updateSelectedTab'] ? $store.getters['app/updateSelectedTab'].name : ''"
            variant="primary">
            <b-dropdown-item :key="tab.id" @click="setSelectedTab(tab);
            tabIndex = tab.id;
                          " v-for="tab in  $store.getters['app/dropArray'] ">
              {{ tab.name }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
          <b-tab>
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t("Global.academic_calendar") }}</span></template
            >

            <edit
              v-if="edit"
              :item="item"
              @hide="cancel()"
              :inline="true"
              @refresh="init"
              class="mb-2"
            ></edit>
            <div v-else>
              <ShowComponent
                v-if="item"
                :data="item"
                :only="['name']"
                :loading="load"
              >
                <template #edit>
                  <div class="mb-2">
                    <feather-icon
                      @click="openEdit()"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3"
                      v-b-tooltip.hover="$t('Global.edit')"
                    />
                  </div>
                </template>
                <template #name="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.name`) }}
                  </th>
                  <td class="d-flex flex-wrap">
                    {{ data.name }}
                  </td>
                </template>
              </ShowComponent>
            </div>
            <terms
              :items="item ? item.terms : []"
              :fields="TERMFields"
              @update="updateTerm"
            ></terms>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t("Global.ug_allowable_students") }}</span></template
            >
            <TabTable
              no-details
              :table="0"
              class="mt-2"
              :loading="load"
              :title="$t('Global.allowable_students')"
              :fields="fields"
              settings
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'ADMISSION_SETTINGS'
                    )
                  : []
              "
              @add="updateStudentsFees(null, false)"
              @update="updateStudentsFees"
              @remove="remove"
            />
            <TabTable
              no-details
              :table="0"
              class="mt-2"
              :loading="load"
              :title="$t('Global.spring_ug_allowable_students')"
              :fields="fields"
              settings
              
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'SPRING_ADMISSION_SETTINGS'
                    )
                  : []
              "
              @add="updateStudentsFees(null, false,'SPRING')"
              @update="updateStudentsFees"
              @remove="remove"
            />

              <TabTable
              v-if="hasPermission('show_subjects')"
              no-details
              :table="0"
              class="mt-2"
              name
              add_subject
              :loading="load"
              :title="$t('Global.supplementary_subjects')"
              :fields="supplementarySubjectsFields"
              settings
              :items="
                item && item.supplementary_subjects
                  ? item.supplementary_subjects
                  : supplementarySubjectsTemp
              "
              @add="openSupplementarySubjects"
              @update="updateSupplementarySubjects"
              @remove="removeSupplementarySubjects"
            />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t("Global.pg_allowable_students") }}</span></template
            >
            <TabTable
              no-details
              is_pg
              :table="1"
              class="mt-2"
              :loading="load"
              :title="$t('Global.pg_allowable_students')"
              :fields="pg_fields"
              settings
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'PG_ADMISSION_SETTINGS'
                    )
                  : []
              "
              @add="updateStudentsPG(null, true)"
              @update="updateStudentsPG"
              @remove="remove"
            />
            <TabTable
              no-details
              is_pg
              :table="1"
              spring
              class="mt-2"
              :loading="load"
              :title="$t('Global.spring_pg_allowable_students')"
              :fields="pg_fields"
              settings
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'PG_SPRING_ADMISSION_SETTINGS'
                    )
                  : []
              "
              @add="updateStudentsPG(null, true,'SPRING')"
              @update="updateStudentsPG"
              @remove="remove"
            />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="SettingsIcon" />
              <span>{{ $t("Global.fall_enrollment_settings") }}</span></template
            >
            <TabTable
              no-details
              :table="4"
              class="mt-2"
              :loading="load"
              :title="$t('Global.fall_enrollment_settings')"
              :fields="enrollmentFields"
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'FALL_ENROLLMENT_SETTINGS'
                    )
                  : []
              "
              @add="updateEnrollmentSettings(null, 'FALL_ENROLLMENT_SETTINGS')"
              @update="updateEnrollmentSettings"
              settings
              @remove="remove"
            ></TabTable>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="SettingsIcon" />
              <span>{{
                $t("Global.spring_enrollment_settings")
              }}</span></template
            >
            <TabTable
              no-details
              :table="4"
              class="mt-2"
              :loading="load"
              :title="$t('Global.spring_enrollment_settings')"
              :fields="enrollmentFields"
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'SPRING_ENROLLMENT_SETTINGS'
                    )
                  : []
              "
              @add="
                updateEnrollmentSettings(null, 'SPRING_ENROLLMENT_SETTINGS')
              "
              @update="updateEnrollmentSettings"
              settings
              @remove="remove"
            ></TabTable>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="SettingsIcon" />
              <span>{{
                $t("Global.summer_enrollment_settings")
              }}</span></template
            >
            <TabTable
              no-details
              :table="4"
              class="mt-2"
              :loading="load"
              :title="$t('Global.summer_enrollment_settings')"
              :fields="enrollmentFields"
              :add="item ? true : false"
              :items="
                item
                  ? item.settings.filter(
                      (el) => el.name == 'SUMMER_ENROLLMENT_SETTINGS'
                    )
                  : []
              "
              @add="
                updateEnrollmentSettings(null, 'SUMMER_ENROLLMENT_SETTINGS')
              "
              @update="updateEnrollmentSettings"
              settings
              @remove="remove"
            ></TabTable>
          </b-tab>
        </b-tabs>
      </b-card>

   <b-modal
        id="modalPopover"
        v-model="SupplementarySubjectsDialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.supplementary_subjects')"
      >
        <validation-observer ref="simpleRulesSubjects">
          <b-form :class="load ? 'disabled_all' : ''">
            <div class="row">
             <b-col md="6">
                <b-form-group
                  :label="$t('Global.name_custom')"
                  label-for="name"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="english|required"
                  >
                    <b-form-input
                      v-model="subjectsForm.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
                <b-col md="6">
                <b-form-group
                  :label="$t('Global.name_local')"
                  label-for="name_local"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="arabic|required"
                  >
                    <b-form-input
                      v-model="subjectsForm.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitSubjecst"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-secondary"
                @click="SupplementarySubjectsDialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
      <b-modal
        id="modalPopover"
        v-model="enroll_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Enrollment Settings')"
      >
        <validation-observer ref="ruleForm">
          <b-form :class="load ? 'disabled_all' : ''">
            <div class="row">
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.faculty')"
                  label-for="code-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="faculty_id"
                    rules=""
                  >
                    <v-select
                      v-if="lookups"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      v-model="ruleForm.faculty_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.faculties"
                      :clearable="true"
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <span v-if="$i18n.locale == 'ar'">{{
                            name_local
                          }}</span>
                          <span v-else>{{ name }}</span>
                        </div>
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
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.bylaw')"
                  label-for="bylaw-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw_id"
                    rules=""
                  >
                    <v-select
                      v-if="lookups"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      v-model="ruleForm.bylaw_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.bylaws"
                      input-id="bylaw-input"
                      :reduce="(val) => val.id"
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12">
                <hr />
                <p>{{ $t("Registration") }}</p>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('From')"
                  label-for="registration-from-input"
                  :state="startDateState"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="registration_date_from"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="registration-from-input"
                      v-model="ruleForm.registration_date_from"
                      class="mb-1"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :max="maxDate"
                      :min="minDate"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('To')"
                  label-for="registration-to-input"
                  :state="endDateState"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="registration_date_to"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="registration-to-input"
                      v-model="ruleForm.registration_date_to"
                      class="mb-1"
                      :state="errors.length > 0 ? false : null"
                      :disabled="!ruleForm.registration_date_from"
                      :min="ruleForm.registration_date_from"
                      :max="maxDate"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12">
                <hr />
                <p>{{ $t("Add") }}</p>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('From')"
                  label-for="adddrop-from-input"
                  invalid-feedback="date is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="adddrop_date_from"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="adddrop-from-input"
                      v-model="ruleForm.adddrop_date_from"
                      class="mb-1"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :max="maxDate"
                      :min="minDate"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('To')" label-for="adddrop-to-input">
                  <validation-provider
                    #default="{ errors }"
                    name="adddrop_date_to"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="adddrop-to-input"
                      v-model="ruleForm.adddrop_date_to"
                      class="mb-1"
                      :disabled="!ruleForm.adddrop_date_from"
                      :min="ruleForm.adddrop_date_from"
                      :max="maxDate"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12">
                <hr />
                <p>{{ $t("Drop") }}</p>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('From')"
                  label-for="drop-from-input"
                  invalid-feedback="date is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="drop_date_from"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="drop-from-input"
                      v-model="ruleForm.drop_date_from"
                      class="mb-1"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :max="maxDate"
                      :min="minDate"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('To')" label-for="drop-to-input">
                  <validation-provider
                    #default="{ errors }"
                    name="drop_date_to"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="drop-to-input"
                      v-model="ruleForm.drop_date_to"
                      class="mb-1"
                      :disabled="!ruleForm.drop_date_from"
                      :min="ruleForm.drop_date_from"
                      :max="maxDate"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12">
                <hr />
                <p>{{ $t("Withdraw") }}</p>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('From')"
                  label-for="withdraw-from-input"
                  invalid-feedback="date is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="withdraw_date_From"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="withdraw-from-input"
                      v-model="ruleForm.withdraw_date_from"
                      class="mb-1"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('To')"
                  label-for="withdraw-to-input"
                  invalid-feedback="date is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="withdraw_date_to"
                    rules="required"
                  >
                    <b-form-datepicker
                      id="withdraw-to-input"
                      v-model="ruleForm.withdraw_date_to"
                      class="mb-1"
                      :max="maxDate"
                      :disabled="!ruleForm.withdraw_date_from"
                      :min="ruleForm.withdraw_date_from"
                      v-bind="labels[locale] || {}"
                      :locale="locale"
                      :start-weekday="weekday"
                      :show-decade-nav="showDecadeNav"
                      :hide-header="hideHeader"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitEnrollment"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-secondary"
                @click="enroll_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
      <b-modal
        v-model="students_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.ug_allowable_students')"
      >
        <validation-observer ref="simpleRules2">
          <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules2">
            <div class="row">
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.faculty')"
                  label-for="code-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="faculty_id"
                    rules="required"
                  >
                    <v-select
                      v-if="lookups"
                      v-model="form.faculty_id"
                      :filter="fuseSearch"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.faculties"
                      :clearable="false"
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        <strong>{{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}</strong>
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.bylaw')"
                  label-for="bylaw-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw_id"
                    rules=""
                  >
                    <v-select
                      v-if="lookups"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      v-model="form.bylaw_id"
                      :disabled="!form.faculty_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.bylaws"
                      input-id="bylaw-input"
                      :reduce="(val) => val.id"
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12" v-if="lookups">
                <b-form-group
                  :label="$t('Global.program')"
                  label-for="code-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider #default="{ errors }" name="program_id">
                    <v-select
                      v-model="form.program_id"
                      :filter="fuseSearch"
                      :disabled="!form.bylaw_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="
                        lookups && lookups.programs
                          ? lookups.programs.filter(
                              (el) => el.bylaw_id == form.bylaw_id
                            )
                          : []
                      "
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          option.name_local
                        }}</strong>
                        <strong v-else>{{ option.name }}</strong>
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <template>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.minimum_grade_current')"
                    label-for="first_instalment"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="first_instalment"
                      rules="required"
                    >
                      <b-form-input
                        type="number"
                        v-model="settingForm.minimum_grade"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.minimum_grade_prev')"
                    label-for="first_instalment"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="first_instalment"
                      rules="required"
                    >
                      <b-form-input
                        type="number"
                        v-model="settingForm.prev_minimum_grade"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.stem_grade')"
                    label-for="first_instalment"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="first_instalment"
                      rules="required"
                    >
                      <b-form-input
                        type="number"
                        v-model="settingForm.stem_minimum_grade"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.minimum_azhar')"
                    label-for="first_instalment"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="first_instalment"
                      rules="required"
                    >
                      <b-form-input
                        type="number"
                        v-model="settingForm.azhar_minimum_grade"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.student_quota')"
                    label-for="second_instalment"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="second_instalment"
                      rules="integer|required"
                    >
                      <b-form-input
                        type="number"
                        v-model="settingForm.quota"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <hr />
                  <h4 class="my-1">
                    {{ $t("Global.certificates") }}
                  </h4>
                </b-col>
                <b-col md="4">
                  <b-form-group
                    :label="$t('Global.certificate')"
                    label-for="mc-program"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="pre_university_certificate_groupe"
                    >
                      <v-select
                        :filter="fuseSearch"
                        v-model="settingForm.pre_university_certificate_groupe"
                        :options="certificate_sections"
                        :reduce="(el) => el.id"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        clearable
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
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group
                    :label="$t('Global.pre_university_certificate')"
                    label-for="mc-program"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="pre_university_certificate"
                    >
                      <v-select
                        v-model="settingForm.pre_university_certificate"
                        :options="certificates"
                        :filter="fuseSearch"
                        :reduce="(el) => el.id"
                        :disabled="
                          !settingForm.pre_university_certificate &&
                          !settingForm.pre_university_certificate_groupe
                        "
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        clearable
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
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group
                    :label="$t('Global.pre_university_certificate_type')"
                    label-for="mc-program"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="pre_university_certificate_type"
                    >
                      <v-select
                        v-model="settingForm.pre_university_certificate_type"
                        :options="certificate_types"
                        :filter="fuseSearch"
                        multiple
                        :disabled="
                          !settingForm.pre_university_certificate &&
                          !settingForm.pre_university_certificate_type
                        "
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        :label="getSelectLabel()"
                        class="w-100"
                        :reduce="(val) => val.id"
                        clearable
                      >
                        <!-- @option:selected="addGrades"
                                            @option:deselected="removeGrades" -->
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
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12" class="mt-2">
                  <hr />
                  <h4 class="my-1">{{ $t("Global.required_subjects") }}</h4>
                </b-col>
                <b-col md="12" class="mt-2">
                  <b-form-checkbox
                    :key="option.text"
                    v-for="option in options_langs"
                    :id="option.text"
                    v-model="settingForm[option.text]"
                    :name="option.text"
                    :value="true"
                    :unchecked-value="false"
                    >{{ $t(`Global.${option.text}`) }}
                  </b-form-checkbox>
                </b-col>
              </template>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitStudents"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-secondary"
                @click="students_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
      <b-modal
        v-model="students_pg_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.pg_allowable_students')"
      >
        <validation-observer ref="simpleRules2">
          <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules2">
            <div class="row">
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.faculty')"
                  label-for="code-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="faculty_id"
                    rules="required"
                  >
                    <v-select
                      v-if="lookups"
                      v-model="form.faculty_id"
                      :filter="fuseSearch"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.faculties"
                      :clearable="false"
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        <strong>{{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}</strong>
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.bylaw')"
                  label-for="bylaw-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw_id"
                    rules=""
                  >
                    <v-select
                      v-if="lookups"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      v-model="form.bylaw_id"
                      :disabled="!form.faculty_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups.bylaws"
                      input-id="bylaw-input"
                      :reduce="(val) => val.id"
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="8">
                <b-form-group
                  :label="$t('Global.program')"
                  label-for="code-input"
                  invalid-feedback="Name is required"
                >
                  <validation-provider #default="{ errors }" name="program_id">
                    <v-select
                      v-model="form.program_id"
                      :filter="fuseSearch"
                      :disabled="!form.bylaw_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="
                        lookups && lookups.programs
                          ? lookups.programs.filter(
                              (el) => el.bylaw_id == form.bylaw_id
                            )
                          : []
                      "
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          option.name_local
                        }}</strong>
                        <strong v-else>{{ option.name }}</strong>
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
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.student_quota')"
                  label-for="second_instalment"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="second_instalment"
                    rules="integer|required"
                  >
                    <b-form-input
                      type="number"
                      v-model="settingForm.quota"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitStudentsPG('SPRING')"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-secondary"
                @click="students_pg_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
      <b-modal
        v-model="term_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.term')"
      >
        <validation-observer ref="term_form">
          <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules2">
            <div class="row">
              <b-col md="6">
                <b-form-group
                  :state="startDateState"
                  :label="$t('Global.start_date')"
                  label-for="start-input"
                >
                  <validation-provider
                    rules="required"
                    #default="{ errors }"
                    name="Start DATE"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      class="top_100"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="start-input"
                      v-model="term_form.start_date"
                      :max="maxDate"
                      :min="minDate"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">
                      {{ validation(null, 0).message }}
                    </small>
                  </validation-provider>
                  <small
                    v-if="$i18n.locale == 'ar'"
                    class="danger"
                    style="color: red !important"
                  >
                    {{
                      errorsdata
                        ? errorsdata.code
                          ? errorsdata.code[0].ar
                          : ""
                        : ""
                    }}</small
                  >
                  <small v-else class="danger" style="color: red !important">
                    {{
                      errorsdata
                        ? errorsdata.code
                          ? errorsdata.code[0].en
                          : ""
                        : ""
                    }}
                  </small>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :state="endDateState"
                  :label="$t('Global.end_date')"
                  label-for="end-input"
                >
                  <validation-provider
                    rules="required"
                    #default="{ errors }"
                    name="end_date"
                  >
                    <b-form-datepicker
                      :label-no-date-selected="$t('Global.no_selected')"
                      class="top_100"
                      id="end-input"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      v-model="term_form.end_date"
                      :min="term_form.start_date"
                      :max="maxDate"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small v-if="errors.length" class="text-danger">
                      {{ validation(null, 0).message }}
                    </small>
                  </validation-provider>
                  <small
                    v-if="$i18n.locale == 'ar'"
                    class="danger"
                    style="color: red !important"
                  >
                    {{
                      errorsdata
                        ? errorsdata.end_date
                          ? errorsdata.end_date[0].ar
                          : ""
                        : ""
                    }}</small
                  >
                  <small v-else class="danger" style="color: red !important">
                    {{
                      errorsdata
                        ? errorsdata.end_date
                          ? errorsdata.end_date[0].en
                          : ""
                        : ""
                    }}
                  </small>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="saveTerm"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                type="reset"
                variant="outline-secondary"
                @click="term_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  BCard,
  BCol,
  BRow,
  BTab,
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BInputGroup,
  BFormCheckbox,
  BFormDatepicker,
  BTabs,
  BOverlay,
  BButton,
  BCardBody,
  BCardHeader,
  BDropdown,BDropdownItem,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import vSelect from "vue-select";
import ShowComponent from "@/views/components/info/show";
import Offerings from "@/views/study/offerings/components/offerings";
import Students from "@/views/students/student/components/students";
import Edit from "@/views/system/years/edit";
import Statistics from "@/views/components/info/statistics";
import TabTable from "@/views/students/student/components/TabTable";
import Terms from "@/views/system/years/components/terms";

export default {
  name: "Show",
  components: {
    Terms,
    TabTable,
    BDropdown,BDropdownItem,
    BFormDatepicker,
    Edit,
    BOverlay,
    Statistics,
    vSelect,
    BFormCheckbox,
    Students,
    Offerings,
    ShowComponent,
    BFormInput,
    BCard,
    BCol,
    BCardBody,
    BCardHeader,
    BModal,
    BForm,
    BFormGroup,
    BInputGroup,
    BRow,
    BTab,
    BTabs,
    BButton,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  computed: {
    ...mapGetters({
      item: "years/item",
      settings: "settings/items",
      // load: 'years/load',
      lookups: "app/lookups",
      load: "app/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },

    certificate_sections() {
      if (this.lookups && this.lookups.certificates) {
        return this.lookups.certificates;
      }
      return false;
    },
    certificates() {
      if (
        this.lookups &&
        this.lookups.certificates &&
        this.settingForm.pre_university_certificate_groupe
      ) {
        this.certificatesArray = this.lookups.certificates.find(
          (el) => el.id == this.settingForm.pre_university_certificate_groupe
        );
        return this.certificatesArray
          ? this.certificatesArray.pre_university_certificate
          : [];
      }
    },
    certificate_types() {
      if (
        this.lookups &&
        this.lookups.certificates &&
        this.settingForm.pre_university_certificate &&
        this.certificatesArray
      ) {
        const certificateTypeArray = this.certificates
          ? this.certificates.find(
              (el) => el.id == this.settingForm.pre_university_certificate
            )
          : {};
        return certificateTypeArray
          ? certificateTypeArray.pre_university_certificate_type
          : [];
      }
    },

    TERMFields() {
      return [
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "name",
          label: this.$t("Global.name"),
        },
        {
          key: "name_local",
          label: this.$t("Global.name_local"),
        },
        {
          key: "start_date",
          label: this.$t("Global.start_date"),
        },
        {
          key: "end_date",
          label: this.$t("Global.end_date"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    supplementarySubjectsFields(){
      return [
        {
          key: "name",
          label: this.$t("Global.name"),
        },
      ]
    },
    fields() {
      return [
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
        },
        {
          key: "program",
          label: this.$t("Global.program"),
        },
        {
          key: "minimum_grade",
          label: this.$t("Global.minimum_grade_current"),
        },
        {
          key: "prev_minimum_grade",
          label: this.$t("Global.minimum_grade_prev"),
        },
        {
          key: "stem_minimum_grade",
          label: this.$t("Global.stem_grade"),
        },
        {
          key: "azhar_minimum_grade",
          label: this.$t("Global.minimum_azhar"),
        },
        {
          key: "quota",
          label: this.$t("Global.student_quota"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    pg_fields() {
      return [
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
        },
        {
          key: "program",
          label: this.$t("Global.program"),
        },
        // {
        //     key: 'minimum_grade',
        //     label: this.$t('Global.minimum_grade_current'),
        // },
        {
          key: "quota",
          label: this.$t("Global.student_quota"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    enrollmentFields() {
      return [
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
          thStyle: { width: "10%" },
        },
        {
          key: "bylaw",
          label: this.$t("Global.bylaw"),
        },
        {
          key: "registration",
          label: this.$t("Global.registration"),
        },
        {
          key: "add_drop",
          label: this.$t("Global.add"),
        },
        {
          key: "drop",
          label: this.$t("Global.drop"),
        },
        {
          key: "withdraw",
          label: this.$t("Global.withdraw"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    locale() {
      return this.$i18n.locale == "ar" ? "ar-EG" : "en-US";
    },
    minDate() {
      return `${this.item.start_year}-01-01`;
    },
    maxDate() {
      return `${this.item.end_year}-12-30`;
    },
  },
  data() {
    return {
      type:'',
      subjectsForm:{
        name:null,
        name_local:null,
      },
      supplementarySubjectsTemp:[{id:1,name:'test',name_local:'اختبار'}],
      SupplementarySubjectsDialog:false,
      edit: false,
      dialog: false,
      tabIndex:0,
      term_dialog: false,
      students_pg_dialog: false,
      is_usd: 3,
      is_pg: false,
      enroll_dialog: false,
      pg_dialog: false,
      students_dialog: false,
      form: { faculty_id: null, bylaw_id: null, program_id: null },
      term_form: { start_date: null, end_date: null },
      certificatesArray: [],
      ruleForm: {
        // min_gpa: null,
        registration_date_from: null,
        registration_date_to: null,
        adddrop_date_from: null,
        adddrop_date_to: null,
        withdraw_date_from: null,
        withdraw_date_to: null,
        drop_date_from: null,
        drop_date_to: null,
        faculty_id: null,
        bylaw_id: null,
      },
      settingForm: {
        minimum_grade: null,
        azhar_minimum_grade:null,
        quota: null,
      },
      options_langs: [
        { text: "arabic", value: false },
        { text: "english", value: false },
        { text: "french", value: false },
        { text: "german", value: false },
        { text: "italy", value: false },
        { text: "math", value: false },
        { text: "advanced_math", value: false },
        { text: "biology", value: false },
        { text: "chemistry", value: false },
        { text: "physics", value: false },
      ],
      errorsdata: {},
      pgRuleForm: {
        total: 0,
        total_usd: 0,
        second_year: 0,
        first_year: 0,
        third_year: 0,
        second_usd_year: 0,
        first_usd_year: 0,
        third_usd_year: 0,
        degree: null,
        application_fess: null,
      },
      settings_id: null,
      term_id: null,
      endDateState: null,
      startDateState: null,
      value: "",
      showDecadeNav: false,
      hideHeader: false,
      locales: [
        { value: "en-US", text: "English US (en-US)" },
        { value: "ar-EG", text: "Arabic Egyptian (ar-EG)" },
      ],
      weekday: 0,
      weekdays: [
        { value: 0, text: "Sunday" },
        { value: 1, text: "Monday" },
        { value: 6, text: "Saturday" },
      ],
      labels: {
        "ar-EG": {
          labelPrevDecade: "العقد السابق",
          labelPrevYear: "العام السابق",
          labelPrevMonth: "الشهر السابق",
          labelCurrentMonth: "الشهر الحالي",
          labelNextMonth: "الشهر المقبل",
          labelNextYear: "العام المقبل",
          labelNextDecade: "العقد القادم",
          labelToday: "اليوم",
          labelSelected: "التاريخ المحدد",
          labelNoDateSelected: "لم يتم اختيار تاريخ",
          labelCalendar: "التقويم",
          labelNav: "الملاحة التقويم",
          labelHelp: "استخدم مفاتيح المؤشر للتنقل في التواريخ",
        },
      },
    };
  },
  watch: {
    "form.faculty_id": function (val) {
      this.getLookups({
        faculty_id: val,
        faculties: true,
        bylaws: true,
        faculty_id_programs_with_bylaw: true,
        pre_certificates: true,
      });
      // this.form.bylaw_id = null;
      // this.form.program_id = null;
    },
    // 'form.bylaw_id': function (val) {
    //     this.getLookups({
    //         bylaw_id: val,
    //         faculty_id: this.form.faculty_id,
    //         faculties: true,
    //         bylaws: true,
    //         programs: true,
    //         pre_certificates: true,
    //     });
    // },
    "ruleForm.faculty_id": function (val) {
      this.getLookups({
        faculty_id: val,
        faculties: true,
        bylaws: true,
      });
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      editTuitionFees: "settings/put",
      removeSetting: "settings/remove",
      getLookups: "app/GET_LOOKUPS",
      addSetting: "settings/enrollmentSetting",
      editSupplementarySubjects:'settings/editSupplementarySubjects'
    }),
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: true,
      });
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },

    getPrograms() {
      //     this.getLookups({
      //         bylaw_id:  this.form.bylaw_id,
      //         faculty_id: this.form.faculty_id,
      //         faculties: true,
      //         bylaws: true,
      //         programs: true,
      //         pre_certificates: true,
      //     });
      // if (this.form.faculty_id) {
      //     let selectedPrograms = this.item.settings.filter(el => el.faculty.id == this.form.faculty_id);
      //     let programList;
      //     if (this.lookups.programs && this.lookups.programs.length) {
      //         programList = this.lookups.programs.filter(program => {
      //             return selectedPrograms.every(f => {
      //                 return f?.program?.id != program.id;
      //             });
      //         });
      //     }
      //     return programList;
      // }
    },
    submitSubjecst(){
      this.$nextTick((_) => {
        this.$refs.simpleRulesSubjects
          .validate()
          .then((success) => {
            if (success) {
              const payload = {
                supplementary_subjects:this.subjectsForm
              };
              this.editSupplementarySubjects({
                id: this.$route.params.id || null,
                query: payload,
              })
                .then((_) => {
                  (this.SupplementarySubjectsDialog = false),
                    (this.students_dialog = false),
                    (this.grade_id = null);
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                  this.$swal({
                    icon: "error",
                    text: `${this.$t("Global.item_exist")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },
    submitStudents(type) {
      this.$nextTick((_) => {
        this.$refs.simpleRules2
          .validate()
          .then((success) => {
            if (success) {
              let type = {
                certificate_type:
                  this.settingForm?.pre_university_certificate_type,
              };
              delete this.ruleForm["pre_university_certificate_types"];
              delete this.ruleForm["pre_university_certificate_type"];
              const payload = {
                faculty_id: this.form.faculty_id,
                program_id: this.form.program_id,
                year_id: this.$route.params.id,
                name:this.type == 'SPRING' ? "SPRING_ADMISSION_SETTINGS" : "ADMISSION_SETTINGS",
                value: { ...this.settingForm, ...type },
              };
              this.editTuitionFees({
                id: this.settings_id || null,
                query: payload,
              })
                .then((_) => {
                  (this.dialog = false),
                    (this.students_dialog = false),
                    (this.grade_id = null);
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                  this.grade_id = null;
                  this.$swal({
                    icon: "error",
                    text: `${this.$t("Global.item_exist")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },
    submitStudentsPG(type) {
      this.$nextTick((_) => {
        this.$refs.simpleRules2
          .validate()
          .then((success) => {
            if (success) {
              const payload = {
                faculty_id: this.form.faculty_id,
                program_id: this.form.program_id,
                year_id: this.$route.params.id,
                name:this.type == 'SPRING' ? "PG_SPRING_ADMISSION_SETTINGS" : "PG_ADMISSION_SETTINGS",
                value: { ...this.settingForm },
              };
              this.editTuitionFees({
                id: this.settings_id || null,
                query: payload,
              })
                .then((_) => {
                  (this.dialog = false), (this.students_pg_dialog = false);
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                  this.grade_id = null;
                  this.$swal({
                    icon: "error",
                    text: `${this.$t("Global.item_exist")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },
    updateStudentsFees(data, is_pg = false,type = '') {
      if (data) {
        this.form.faculty_id = data.faculty?.id;
        this.form.bylaw_id = data.program?.bylaw_id;
        this.form.program_id = data.program?.id;
        this.settingForm.minimum_grade = data.data?.minimum_grade;
        this.settingForm.prev_minimum_grade = data.data?.prev_minimum_grade;
        this.settingForm.stem_minimum_grade = data.data?.stem_minimum_grade;
        this.settingForm.azhar_minimum_grade = data.data?.azhar_minimum_grade;
        this.settingForm.quota = data.data?.quota;
        this.settings_id = data.id;
        this.settingForm.pre_university_certificate_type =
          data?.data?.certificate_type;
        this.settingForm.pre_university_certificate_groupe =
          data?.data?.pre_university_certificate_groupe;
        this.settingForm.pre_university_certificate =
          data?.data?.pre_university_certificate;
        this.settingForm.arabic = data?.data?.arabic;
        this.settingForm.english = data?.data?.english;
        this.settingForm.french = data?.data?.french;
        this.settingForm.german = data?.data?.german;
        this.settingForm.math = data?.data?.math;
        this.settingForm.advanced_math = data?.data?.advanced_math;
        this.settingForm.biology = data?.data?.biology;
        this.settingForm.chemistry = data?.data?.chemistry;
        this.settingForm.physics = data?.data?.physics;
        this.settingForm.italy = data?.data?.italy;
      } else {
        this.form.faculty_id = null;
        this.form.bylaw_id = null;
        this.form.program_id = null;
        this.settingForm.quota = null;
        this.settings_id = null;
        this.settingForm.minimum_grade = null;
        this.settingForm.prev_minimum_grade = null;
      }
      this.is_pg = is_pg;
      if(data){
        this.openStudentDialog(data?.name == 'SPRING_ADMISSION_SETTINGS' ? 'SPRING' : type)
      }else{
        this.openStudentDialog(type);
      }
    },
    openStudentDialog(type) {
      this.students_dialog = true;
      this.type = type
    },
    updateStudentsPG(data, is_pg = false,type) {
      if (data) {
        this.form.faculty_id = data.faculty?.id;
        this.form.bylaw_id = data.program?.bylaw_id;
        this.form.program_id = data.program?.id;
        this.settingForm.quota = data.data?.quota;
        this.settings_id = data.id;
      } else {
        this.form.faculty_id = null;
        (this.form.bylaw_id = null), (this.form.program_id = null);
        this.settingForm.quota = null;
        this.settings_id = null;
      }
      if(data){
        this.openStudentPGDialog(data?.name == 'PG_SPRING_ADMISSION_SETTINGS' ? 'SPRING' : type)
      }else{
        this.openStudentPGDialog(type);
      }
    },
    openStudentPGDialog(type) {
      this.students_pg_dialog = true;
      this.type = type
    },
    openDialog() {
      this.dialog = true;
    },
    openEnrollDialog() {
      this.enroll_dialog = true;
    },

    openSupplementarySubjects() {
      this.SupplementarySubjectsDialog = true;
    },

    updateTerm(data) {
      this.term_form = {};
      if (data) {
        this.term_form.start_date = data.start_date;
        this.term_form.end_date = data.end_date;
        this.term_id = data.id;
      }
      this.openTermDialog();
    },

    openTermDialog() {
      this.term_dialog = true;
    },

    saveTerm() {
      this.$refs.term_form.validate().then((success) => {
        if (success) {
          const payload = { id: this.term_id, query: this.term_form };
          this.$store
            .dispatch("terms/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.term_dialog = false;
              this.init();
            })
            .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${error.response.data.errors[0].title}`,
              showConfirmButton: false,
              timer: 2000,
            });
            
            });
        }
      });
    },

    checkFaculty(faculty_id, program_id) {
      if (program_id) {
        return true;
      } else {
        if (faculty_id) {
          let selectedFaculties = this.item.payment_settings.find(
            (el) => el.faculty.id == faculty_id
          );
          if (selectedFaculties && selectedFaculties.program == null) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    submit() {
      this.$nextTick((_) => {
        this.$refs.simpleRules1
          .validate()
          .then((success) => {
            if (success) {
              // && this.checkFaculty(this.form.faculty_id, this.form.program_id)
              const payload = {
                faculty_id: this.form.faculty_id,
                program_id: this.form.program_id,
                year_id: this.$route.params.id,
                name: "ADMISSION_PAYMENTS_SETTINGS",
                value: {
                  ...this.ruleForm,
                  ...{ total: this.totalFees, total_usd: this.totalUsdFees },
                },
              };
              // delete payload['total'];
              // let query = {...payload,...{total:this.totalFees,total_usd:this.totalUsdFees}}
              this.editTuitionFees({
                id: this.settings_id || null,
                query: payload,
              })
                .then((_) => {
                  (this.dialog = false), (this.applicant_dialog = false);
                  this.students_dialog = false;
                  this.grade_id = null;
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                  this.grade_id = null;
                  this.$swal({
                    icon: "error",
                    text: `${this.$t("Global.item_exist")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.facultyExist")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },

    updateEnrollmentSettings(data, name) {
      if (data) {
        this.ruleForm.faculty_id = data.faculty ? data.faculty.id : null;
        this.ruleForm.bylaw_id = data.bylaw ? data.bylaw.id : null;
        this.ruleForm.term_id = this.id;
        this.ruleForm.registration_date_from =
          data.value.registration_date_from;
        this.ruleForm.registration_date_to = data.value.registration_date_to;
        this.ruleForm.withdraw_date_from = data.value.withdraw_date_from;
        this.ruleForm.withdraw_date_to = data.value.withdraw_date_to;
        this.ruleForm.adddrop_date_from = data.value.adddrop_date_from;
        this.ruleForm.adddrop_date_to = data.value.adddrop_date_to;
        this.ruleForm.drop_date_from = data.value.drop_date_from;
        this.ruleForm.drop_date_to = data.value.drop_date_to;
        this.ruleForm.name = data.name;
        this.settings_id = data.id;
      } else {
        this.ruleForm.faculty_id = null;
        this.ruleForm.bylaw_id = null;
        this.ruleForm.term_id = this.id;
        this.ruleForm.registration_date_from = null;
        this.ruleForm.registration_date_to = null;
        this.ruleForm.withdraw_date_from = null;
        this.ruleForm.withdraw_date_to = null;
        this.ruleForm.adddrop_date_from = null;
        this.ruleForm.adddrop_date_to = null;
        this.ruleForm.drop_date_from = null;
        this.ruleForm.drop_date_to = null;
        this.ruleForm.name = name;
      }
      this.openEnrollDialog();
    },
    submitEnrollment() {
      this.$nextTick((_) => {
        this.$refs.ruleForm
          .validate()
          .then((success) => {
            if (success) {
              const payload = {
                faculty_id: this.ruleForm.faculty_id,
                bylaw_id: this.ruleForm.bylaw_id,
                year_id: this.$route.params.id,
                name: this.ruleForm.name,
                value: { ...this.ruleForm },
              };

              this.addSetting({
                id: this.settings_id || null,
                query: payload,
              })
                .then((_) => {
                  this.enroll_dialog = false;
                  this.init();
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                })
                .catch((error) => {
                   this.$swal({
                  icon: "error",
                  text: `${error.response.data.errors[0].title}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
                });
            }
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 2000,
            });
          });
      });
    },
    supplementarySubjects(id) {
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
          this.removeSupplementarySubjects(id).then((_) => {
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
            this.init();
          });
        }
      });
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
          this.removeSetting(id).then((_) => {
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
            this.init();
          });
        }
      });
    },

    init() {
      this.getLookups({
        faculty_id: this.ruleForm.faculty_id,
        faculties: true,
        bylaws: true,
        pre_certificates: true,
        academic_years: true,
      }).then((_) => {
        this.$nextTick(_ => {
          this.setPageTabs();
        });
        if (this.id) {
          this.$store.dispatch("years/get", this.id).then((_) => {
            if (this.ruleForm.pre_university_certificate_type) {
              this.ruleForm.pre_university_certificate_type.forEach((el, i) => {
                this.item.data.pre_university_certificate_types.forEach(
                  (type) => {
                    if (el.id == type.certificate_type) {
                      this.grades[i] = {
                        certificate_type: type.certificate_type,
                        minimum_grade: type.minimum_grade,
                        name: el.name,
                        name_local: el.name_local,
                      };
                      this.types[i] = {
                        certificate_type: type.certificate_type,
                        minimum_grade: type.minimum_grade,
                      };
                    }
                  }
                );
              });
            }
            this.edit =
              this.$route.query.inline == "false"
                ? false
                : this.$route.query.inline;
          });
        } else {
          this.$store.commit("years/SET_ITEM", null);
          this.edit = true;
        }
      });
    },
  },
};
</script>

<style scoped></style>
