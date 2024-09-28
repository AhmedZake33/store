<template>
  <b-row class="new_edit" :class="load_data ? 'disabled_all' : ''">
    <b-col cols="12">
      <validation-observer ref="simpleForm">
        <b-form v-if="form" ref="form" @submit.stop.prevent="save">
          <b-card class="mb-0" :class="load_data ? 'disabled_all' : ''">
            <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left">
              <b-tab>
                <template #title>
                  <div id="personal_info">
                    <feather-icon icon="InfoIcon" />
                    <span>{{ $t('Global.personal_info') }}</span>
                  </div>
                </template>
                <ShowComponent :data="form" :loading="load" :only="['code', 'name', 'name_local', 'id', 'type', 'gender', 'birth_date', 'national_id', 'access', 'insurance_no']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #access="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.national_id`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-national-id">
                        <validation-provider #default="{ errors }" name="National ID" :rules="$route.params.id ? 'ssn' : 'ssn|required'">
                          <b-form-input :placeholder="$t('Global.national_id')" :state="errors.length > 0 ? false : null" type="number" id="vi-national-id" v-model="form.national_id" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'national_id')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #insurance_no="{ data }" v-if="type == 2">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.insurance_no`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-insurance_no">
                        <validation-provider #default="{ errors }" name="insurance_no">
                          <b-form-input @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-insurance_no" v-model="form.insurance_no" :placeholder="$t('Global.insurance_no')" />
                          <ValidationErrors default-message :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #name="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.name_custom`) }}
                    </th>
                    <td>
                      <b-form-group label-for="name-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name" rules="english|required">
                          <b-form-input
                            :placeholder="$t('Global.english_name')"
                            @keypress="
                              sanitizeEnglish($event);
                              sanitizeNumber($event);
                            "
                            id="name-input"
                            v-model="form.name"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #type="{ data }" v-if="$route.name == 'user-add'">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.type`) }}
                    </th>
                    <td>
                      <validation-provider #default="{ errors }" name="type" rules="required">
                        <b-form-group label-for="vi-gender">
                          <v-select :placeholder="$t('Global.type')" :disabled="type && id ? true : false" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="types" v-model="form.type" :reduce="val => val.type">
                            <template v-slot:option="option">
                              {{ option.label }}
                            </template>
                            <template #selected-option="{ name, name_local, label }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || label }}</span>
                                <span v-else>{{ name || label }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                        </b-form-group>
                        <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.gender'))" />
                      </validation-provider>
                    </td>
                  </template>
                  <template v-else #type="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.type`) }}
                    </th>
                    <td>
                      {{ $i18n.locale == 'en' ? data.type.name : data.type.name_local }}
                    </td>
                  </template>

                  <template #code>
                    <th scope="row" :width="'20%'">
                      {{ $t('Global.code') }}
                    </th>
                    <td>
                      <b-form-group v-if="codeKey" label-for="vi-code">
                        <validation-provider #default="{ errors }" name="Code" rules="code">
                          <b-form-input :disabled="canEditCode" :placeholder="$t('Global.code') + ` (${$t('Global.auto_generated')})`" :state="errors.length > 0 ? false : null" id="vi-code" v-model="form.code" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #birth_date="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.birth_date`) }}
                    </th>
                    <td>
                      <b-form-group label-for="birth_date">
                        <validation-provider #default="{ errors }" name="birth_date" :rules="$route.params.id ? '' : 'required'">
                          <b-form-datepicker :placeholder="$t('Global.birthdate')" id="example-datepicker" :max="maxDate" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :label-no-date-selected="$t('Global.no_selected')" v-model="form.birth_date" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #gender="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.gender`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-gender">
                        <validation-provider #default="{ errors }" name="gender" rules="required">
                          <v-select :placeholder="$t('Global.gender')" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="genders" v-model="form.gender" :reduce="val => val.id">
                            <template v-slot:option="option">
                              {{ option.label }}
                            </template>
                            <template #selected-option="{ label }">
                              <div style="display: flex; align-items: baseline">
                                <span>{{ typeof label == 'string' ? $t(`Global.${label}`) : label }} </span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.gender'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #name_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.arabic_name`) }}
                    </th>
                    <td>
                      <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                          <b-form-input
                            :placeholder="$t('Global.arabic_name')"
                            @keypress="
                              sanitizeArabic($event);
                              sanitizeNumber($event);
                            "
                            id="nameAr-input"
                            v-model="form.name_local"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #id="{ data }">
                    <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                      {{ $t(`Global.name_local`) }}
                    </th>
                    <td v-if="$i18n.locale == 'en'">
                      <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                          <b-form-input
                            :placeholder="$t('Global.arabic_name')"
                            @keypress="
                              sanitizeArabic($event);
                              sanitizeNumber($event);
                            "
                            id="nameAr-input"
                            v-model="form.name_local"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                        </validation-provider>
                      </b-form-group>
                    </td>

                    <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
                    <td v-if="$i18n.locale == 'ar'">
                      <b-form-group label-for="name-input" invalid-feedback="Name is required">
                        <validation-provider #default="{ errors }" name="name" rules="english|required">
                          <b-form-input
                            :placeholder="$t('Global.english_name')"
                            @keypress="
                              sanitizeEnglish($event);
                              sanitizeNumber($event);
                            "
                            id="name-input"
                            v-model="form.name"
                            :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-row>
                  <b-col md="12">
                    <b-button @click="save" variant="primary" class="mr-1">
                      {{ $t('Global.save') }}
                    </b-button>
                    <b-button type="reset" variant="outline-secondary" @click="cancel">
                      {{ $t('Global.cancel') }}
                    </b-button>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab v-if="form.type == 1" ref="show_1">
                <template #title>
                  <div id="academic_info">
                    <feather-icon icon="InfoIcon" />
                    <span>{{ $t('Global.academic_info') }}</span>
                  </div>
                </template>
                <ShowComponent :data="form" :loading="load" :only="['id', 'rank', 'department', 'employee_type', 'teacher_at', 'teaching_assistant_at', 'professor_at', 'seniority', 'msc_from', 'msc_from_local', 'phd_from', 'phd_from_local', 'phd_at', 'assistant_professor_at', 'emeritus_at']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>

                  <template #teacher_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.teacher_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-teacher_at-id">
                        <validation-provider #default="{ errors }" name="teacher_at">
                          <b-form-datepicker :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :placeholder="$t('Global.teacher_at')" id="example-teacher_at" :label-no-date-selected="$t('Global.no_selected')" v-model="form.teacher_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.teacher_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #teaching_assistant_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.teaching_assistant_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-teaching_assistant_at-id">
                        <validation-provider #default="{ errors }" name="teaching_assistant_at">
                          <b-form-datepicker
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            :placeholder="$t('Global.teaching_assistant_at')"
                            id="example-teaching_assistant_at"
                            :label-no-date-selected="$t('Global.no_selected')"
                            v-model="form.teaching_assistant_at"
                            :state="errors.length > 0 ? false : null"
                            class="mb-1"
                          />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.teaching_assistant_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #professor_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.professor_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-professor_at-id">
                        <validation-provider #default="{ errors }" name="professor_at">
                          <b-form-datepicker :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :placeholder="$t('Global.professor_at')" id="example-professor_at" :label-no-date-selected="$t('Global.no_selected')" v-model="form.professor_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.professor_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #seniority="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.seniority`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-seniority-id">
                        <validation-provider #default="{ errors }" name="seniority" rules="integer">
                          <b-form-input :placeholder="$t('Global.seniority')" :state="errors.length > 0 ? false : null" type="number" id="vi-seniority-id" v-model="form.seniority" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.seniority'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #msc_from="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.msc_from`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-msc_from-id">
                        <validation-provider #default="{ errors }" name="msc_from">
                          <b-form-input :placeholder="$t('Global.msc_from')" :state="errors.length > 0 ? false : null" id="vi-msc_from-id" v-model="form.msc_from" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.msc_from'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #msc_from_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.msc_from_local`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-msc_from_local-id">
                        <validation-provider #default="{ errors }" name="msc_from_local">
                          <b-form-input :placeholder="$t('Global.msc_from_local')" :state="errors.length > 0 ? false : null" id="vi-msc_from_local-id" v-model="form.msc_from_local" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.msc_from_local'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #phd_from="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.phd_from`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-phd_from-id">
                        <validation-provider #default="{ errors }" name="phd_from">
                          <b-form-input :placeholder="$t('Global.phd_from')" :state="errors.length > 0 ? false : null" id="vi-phd_from-id" v-model="form.phd_from" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.phd_from'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #phd_from_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.phd_from_local`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-phd_from_local-id">
                        <validation-provider #default="{ errors }" name="phd_from_local">
                          <b-form-input :placeholder="$t('Global.phd_from_local')" :state="errors.length > 0 ? false : null" id="vi-phd_from_local-id" v-model="form.phd_from_local" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.phd_from_local'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #phd_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.phd_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-phd_at-id">
                        <validation-provider #default="{ errors }" name="phd_at">
                          <b-form-datepicker :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :placeholder="$t('Global.phd_at')" id="example-phd_at" :label-no-date-selected="$t('Global.no_selected')" v-model="form.phd_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.phd_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #assistant_professor_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.assistant_professor_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-assistant_professor_at-id">
                        <validation-provider #default="{ errors }" name="assistant_professor_at">
                          <b-form-datepicker
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            :placeholder="$t('Global.assistant_professor_at')"
                            id="example-assistant_professor_at"
                            :label-no-date-selected="$t('Global.no_selected')"
                            v-model="form.assistant_professor_at"
                            :state="errors.length > 0 ? false : null"
                            class="mb-1"
                          />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.assistant_professor_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #emeritus_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.emeritus_at`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-emeritus_at-id">
                        <validation-provider #default="{ errors }" name="emeritus_at">
                          <b-form-datepicker :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" :placeholder="$t('Global.emeritus_at')" id="example-emeritus_at" :label-no-date-selected="$t('Global.no_selected')" v-model="form.emeritus_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.emeritus_at'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #rank="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.rank`) }}
                    </th>
                    <td>
                      <b-form-group>
                        <validation-provider #default="{ errors }" rules="required" name="rank">
                          <v-select
                            :placeholder="$t('Global.rank')"
                            :filter="fuseSearch"
                            v-model="form.rank_id"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            label="rank"
                            :reduce="re => re.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups ? lookups.ranks : []"
                            :clearable="false"
                          >
                            <template v-slot:option="option">
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                            </template>
                            <template #selected-option="{ name, name_local }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                                <span v-else>{{ name || name_local }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                          <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'rank')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #id="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.faculty`) }}
                    </th>

                    <td>
                      <b-form-group>
                        <validation-provider #default="{ errors }" rules="required" name="faculty_id">
                          <v-select
                            :placeholder="$t('Global.faculty')"
                            :filter="fuseSearch"
                            v-model="form.faculty_id"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :reduce="re => re.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups ? lookups.faculties : []"
                            :clearable="false"
                          >
                            <template v-slot:option="option">
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                            </template>
                            <template #selected-option="{ name, name_local }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                                <span v-else>{{ name || name_local }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>

                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #department="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.department`) }}
                    </th>

                    <td>
                      <b-form-group>
                        <validation-provider #default="{ errors }" rules="required" name="department_id">
                          <v-select
                            :placeholder="$t('Global.department')"
                            :filter="fuseSearch"
                            v-model="form.department_id"
                            :disabled="!form.faculty_id"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :reduce="re => re.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups ? lookups.faculty_departments : []"
                            :clearable="false"
                          >
                            <template v-slot:option="option">
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                            </template>
                            <template #selected-option="{ name, name_local }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                                <span v-else>{{ name || name_local }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>

                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #employee_type="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.Employment`) }}
                    </th>
                    <td>
                      <b-form-group>
                        <validation-provider #default="{ errors }" rules="required" name="employment_id">
                          <v-select
                            :placeholder="$t('Global.Employment')"
                            :filter="fuseSearch"
                            v-model="form.employment_id"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            label="rank"
                            :reduce="re => re.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups ? lookups.employee_types : []"
                            :clearable="false"
                          >
                            <template v-slot:option="option">
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                            </template>
                            <template #selected-option="{ name, name_local }">
                              <div style="display: flex; align-items: baseline">
                                <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                                <span v-else>{{ name || name_local }}</span>
                              </div>
                            </template>
                            <template #no-options>
                              {{ $t('noMatching') }}
                            </template>
                          </v-select>
                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template v-if="type == 1">
                    <!-- <b-col md="6">
                <b-form-group :label="$t('Global.graduation_from')" label-for="vi-graduation_from-id">
                  <validation-provider #default="{ errors }" name="graduation_from">
                    <b-form-input :state="errors.length > 0 ? false : null" id="vi-graduation_from-id" v-model="form.graduation_from" />
                    <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.graduation_from'))" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.graduation_from_local')" label-for="vi-graduation_from_local-id">
                  <validation-provider #default="{ errors }" name="graduation_from_local">
                    <b-form-input :state="errors.length > 0 ? false : null" id="vi-graduation_from_local-id" v-model="form.graduation_from_local" />
                    <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.graduation_from_local'))" />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group :label="$t('Global.graduation_at')" label-for="vi-graduation_at-id">
                  <validation-provider #default="{ errors }" name="graduation_at">
                    <b-form-datepicker id="example-datepicker" :label-no-date-selected="$t('Global.no_selected')" v-model="form.graduation_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                    <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.graduation_at'))" />
                  </validation-provider>
                </b-form-group>
              </b-col>


              <b-col md="6">
                <b-form-group :label="$t('Global.msc_at')" label-for="vi-msc_at-id">
                  <validation-provider #default="{ errors }" name="msc_at">
                    <b-form-datepicker id="example-datepicker" :label-no-date-selected="$t('Global.no_selected')" v-model="form.msc_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                    <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.msc_at'))" />
                  </validation-provider>
                </b-form-group>
              </b-col> -->

                    <!-- <b-col md="6">
                <b-form-group :label="$t('Global.demonstrator_at')" label-for="vi-demonstrator_at-id">
                  <validation-provider #default="{ errors }" name="demonstrator_at">
                    <b-form-datepicker id="example-datepicker" :label-no-date-selected="$t('Global.no_selected')" v-model="form.demonstrator_at" :state="errors.length > 0 ? false : null" class="mb-1" />
                    <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.demonstrator_at'))" />
                  </validation-provider>
                </b-form-group>
              </b-col> -->
                  </template>
                </ShowComponent>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-tab>
              <b-tab>
                <template #title>
                  <div id="contact_info">
                    <feather-icon icon="PhoneIcon" />
                    <span>{{ $t('Global.contact_info') }}</span>
                  </div>
                </template>
                <ShowComponent v-show="$route.name != 'user-show' || (tabNumber == 1 && type != 1) || (type == 1 && $route.name == 'user-show' && tabNumber == 1)" :data="form" :loading="load" :only="['email', 'personal_email', 'mobile', 'phone', 'internal_phone']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #email="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`academic_email`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-email">
                        <validation-provider #default="{ errors }" :rules="$route.params.id ? 'email' : 'email|required'" name="academic_email">
                          <b-form-input :disabled="canEditAcademicEmail" :placeholder="$t('academic_email')" :state="errors.length > 0 ? false : null" id="vi-email" type="email" v-model="form.email" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'email')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #mobile="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.mobile`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-mobile">
                        <validation-provider #default="{ errors }" rules="mobile" name="mobile">
                          <b-form-input :placeholder="$t('Global.mobile')" @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" id="vi-mobile" v-model="form.mobile" />
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #phone="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.phone`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-phone">
                        <validation-provider #default="{ errors }" rules="" name="phone">
                          <b-form-input :placeholder="$t('Global.phone')" @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-phone" v-model="form.phone" />
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #personal_email="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.personal_email`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-personal-email">
                        <validation-provider #default="{ errors }" :rules="$route.params.id ? 'email' : 'email'" name="email">
                          <b-form-input :state="errors.length > 0 ? false : null" id="vi-personal-email" type="email" v-model="form.personal_email" :placeholder="$t('Global.personal_email')" />
                          <ValidationErrors noAlert :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'personal_email')" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>

                  <template #internal_phone="{ data }" v-if="type == 2">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.internal_phone`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-internal_phone">
                        <validation-provider #default="{ errors }" name="internal_phone">
                          <b-form-input @keypress="writeNumber($event)" :state="errors.length > 0 ? false : null" type="tel" id="vi-internal_phone" v-model="form.internal_phone" :placeholder="$t('Global.internal_phone')" />
                          <ValidationErrors default-message :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="MapPinIcon" />
                  <span>{{ $t('Global.address_info') }}</span>
                </template>
                <ShowComponent :data="form" :loading="load" :only="['address', 'postal_code']">
                  <template #edit>
                    <div class="mb-2">
                      <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_users')" />
                    </div>
                  </template>
                  <template #address="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.address_info`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-address">
                        <validation-provider #default="{ errors }" name="Address" rules="address">
                          <b-form-input :state="errors.length > 0 ? false : null" id="vi-address" v-model="form.address" :placeholder="$t('Global.address')" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.address'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                  <template #postal_code="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.postal_code`) }}
                    </th>
                    <td>
                      <b-form-group label-for="vi-postal-code">
                        <validation-provider #default="{ errors }" name="Postal Code" rules="postal">
                          <b-form-input :placeholder="$t('Global.postal_code')" :state="errors.length > 0 ? false : null" id="vi-postal-code" v-model="form.postal_code" />
                          <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, $t('Global.postal_code'))" />
                        </validation-provider>
                      </b-form-group>
                    </td>
                  </template>
                </ShowComponent>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-tab>
            </b-tabs>
          </b-card>

          <!-- address -->

          <!-- academic -->

          <!-- social link -->

          <!-- account details tab -->
          <!--                    <tab-content :title="$t('acount_details')" icon="feather icon-file-text">-->
          <!--                        <b-row>-->
          <!--                            <b-col md="12">-->
          <!--                                <b-form-group :label="$t('email')" label-for="vi-email">-->
          <!--                                    <b-form-input id="vi-email" type="email" v-model="form.email"-->
          <!--                                                  placeholder="john.doe@email.com"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                            <b-col md="6">-->
          <!--                                <b-form-group :label="$t('Global.password')" label-for="vi-password">-->
          <!--                                    <b-form-input id="vi-password" type="password" v-model="form.password"-->
          <!--                                                  :placeholder="$t('Global.password')"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                            <b-col md="6">-->
          <!--                                <b-form-group :label="$t('Global.password_check')" label-for="vi-c-password">-->
          <!--                                    <b-form-input id="vi-c-password" type="password" v-model="form.confirm_password"-->
          <!--                                                  :placeholder="$t('Global.password_check')"/>-->
          <!--                                </b-form-group>-->
          <!--                            </b-col>-->
          <!--                        </b-row>-->
          <!--                    </tab-content>-->
        </b-form>
      </validation-observer>
    </b-col>
  </b-row>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard';
import vSelect from 'vue-select';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import { required, email, digits, length } from '@validations';
import { BRow, BCol, BOverlay, BCard, BTab, BTabs, BForm, BFormGroup, BFormInput, BFormDatepicker, BFormTextarea } from 'bootstrap-vue';
import { localize, ValidationObserver, ValidationProvider } from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { mapActions, mapGetters } from 'vuex';
import ShowComponent from '@/views/components/info/show';
var tempData = Object.freeze({
  name: '',
  name_local: '',
  code: '',
  phone: '',
  id: '',
  insurance_no: '',
  type: '',
  national_id: '',
  gender: '',
  birth_date: '',
  address: '',
  postal_code: '',
  email: '',
  personal_email: '',
  mobile: '',
  internal_phone: '',
  teaching_assistant_at: '',
  professor_at: '',
  teacher_at: '',
  seniority: '',
  access: '',
  msc_from: '',
  msc_from_local: '',
  phd_from: '',
  phd_from_local: '',
  assistant_professor_at: '',
  phd_at: '',
  emeritus_at: '',
  rank: '',
  department: '',
  employee_type: '',
});
export default {
  components: {
    ShowComponent,
    FormWizard,
    BOverlay,
    TabContent,
    BRow,
    BFormDatepicker,
    BCol,
    BForm,
    BFormGroup,
    BCard,
    BFormInput,
    vSelect,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    localize,
    BTabs,
    BTab,
    ValidationErrors,
  },
  computed: {
    ...mapGetters({
      lookups: 'app/lookups',
      user: 'users/item',
      load: 'users/load',
      load_data: 'app/load',
    }),
    canEditCode() {
      if ((this.form.type === 1 && this.hasPermission('edit_code_instructor')) ||
          (this.form.type === 2 && this.hasPermission('edit_code_employee')) ||
          (this.form.type === 3 && this.hasPermission('edit_code_student'))) {
        return false;
      }
      return true;
    },
    canEditAcademicEmail() {
      if ((this.form.type === 1 && this.hasPermission('edit_email_instructor')) ||
          (this.form.type === 2 && this.hasPermission('edit_email_employee')) ||
          (this.form.type === 3 && this.hasPermission('edit_email_student')) || !this.id) {
        return false;
      }
      return true;
    },
    id() {
      return this.$route.params && this.$route.params.id ? this.$route.params.id : null;
    },
    types() {
      return [
        { type: 1, label: this.$t('Global.instructor') },
        { type: 2, label: this.$t('Global.employee') },
        { type: 3, label: this.$t('Global.student') },
      ];
    },
    genders() {
      return [
        { id: 1, label: this.$t('Global.male') },
        { id: 2, label: this.$t('Global.female') },
      ];
    },
  },
  props: {
    type: Number,
    tabNumber: Number,
    userData: { default: {}, type: [Array, Object] },
    // instructorData: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      errorsdata: {},
      academic_info: false,
      address: false,
      contact: false,
      codeKey: true,
      form: Object.assign({}, tempData),
      query: {
        ranks: true,
        faculties: true,
        employee_types: true,
        faculty_departments: true,
      },
      maxDate: null,
    };
  },

  mounted() {
    this.init();
    let now = new Date()
    this.maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  },
  watch: {
    'form.faculty_id'(val, old) {
      if (old) {
        this.form.department_id = null;
      }
      this.query.faculty_id = val;
      this.getLookups(this.query);
    },
    'form.phone'(val) {
      this.form.phone = val ? val.toString().replace(/[^0-9]/g, '') : null;
    },
    'form.code'(val) {
      if (this.form.code.length > 8) {
        this.form.code = this.form.code.slice(0, -1);
        this.codeKey = false;
        setTimeout(() => {
          this.codeKey = true;
        }, 10);
      }
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      saveUser: 'users/put',
    }),
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
      return this.$emit('hideEdit');
      // if (this.$route.params.id) {
      //   this.$router.push({ name: 'program', params: { id: this.$route.params.id } });
      // } else {
      //   this.$router.push({ name: 'programs' });
      // }
    },
    // changeTab(pre, next) {
    //   if (next == 1) {
    //     this.academic_info = true;
    //   } else {
    //     this.academic_info = false;
    //   }
    //   if ((this.type == 1 && next == 2) || (this.type != 1 && next == 1)) {
    //     this.contact = true;
    //   } else {
    //     this.contact = false;
    //   }
    //   if ((this.type == 1 && next == 3) || (this.type != 1 && next == 2)) {
    //     this.address = true;
    //   } else {
    //     this.address = false;
    //   }
    // },

    validateAsync: function (index) {
      if (this.$route.params.id && this.type == 1) return true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$refs.simpleForm.validate().then(success => {
            if (success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }, 1000);
      });
    },

    init() {
      this.getLookups(this.query).then(_ => {
        // this.form = { type: this.type };
        if (this.id) {
          // this.$store.dispatch('users/get', this.id).then(_ => {
          // if (this.$route.params.id && this.type == 1) {
          //   var wizard = this.$refs.wizard;
          //   wizard.maxStep = wizard.tabs.length - 1;
          //   wizard.tabs.forEach(tab => {
          //     tab.checked = true;
          //   });
          // }
          // if (this.userData) {
          //   if (this.userData.instructor_data) {
          //     this.form = { ...this.userData, ...this.userData.instructor_data };
          //   } else if (this.userData.employee_data) {
          //     this.form = { ...this.userData, ...this.userData.employee_data };
          //   } else {
          //     this.form = Object.assign({}, this.userData);
          //   }
          //   // this.form.name_local = this.user.name_local;
          //   // this.form.name = this.user.name;
          //   if (this.userData && this.userData.type && this.userData.type.type) {
          //     this.form.type = this.userData?.type?.type;
          //   }
          //   if (this.userData && this.userData.gender && this.userData.gender.id) {
          //     this.form.gender = this.userData?.gender?.id;
          //   }
          // }
          // });
        }
      });
    },

    save() {
      this.$refs.simpleForm.validate().then(success => {
        if (success) {
          // delete this.form['department'];
          // delete this.form['rank'];
          // delete this.form['employee_type'];
          delete this.form['id'];
          this.$store
            .dispatch('users/put', { id: this.id, query: this.form })
            .then(response => {
              this.$emit('refresh', response.data.id);
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.$route.params.id) {
              } else {
                window.location.href = window.location.origin + `/users/${response.data.id}`;
                return this.$emit('hide');
              }
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
              this.form['id'] = '';

              let spacificErrors = [];
              Object.keys(this.$refs.simpleForm.errors).forEach(key => {
                if (this.$refs.simpleForm.errors[key].length) {
                  spacificErrors.push(key);
                }
              });
              this.errorToast(this.$t('check_form_errors') + ' ' + '(' + spacificErrors.map(el => this.$t(`Global.${el}`)) + ')');

              if (this.type == 1) {
                if (this.errorsdata.code) {
                  document.getElementById('personal_info').click();
                }
                if (this.errorsdata.email) {
                  document.getElementById('contact_info').click();
                }
              }
            });
        } else {
          let spacificErrors = [];
          Object.keys(this.$refs.simpleForm.errors).forEach(key => {
            if (this.$refs.simpleForm.errors[key].length) {
              spacificErrors.push(key);
            }
          });
          this.errorToast(this.$t('check_form_errors') + ' ' + '(' + spacificErrors.map(el => this.$t(`Global.${el}`)) + ')');
          if (!this.tabNum && this.$route.name == 'user-add' && this.form.code && this.form.name && this.form.name_local && this.form.national_id && this.form.gender && this.form.birth_date) {
            document.getElementById('contact_info').click();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '@core/scss/vue/libs/vue-select.scss';

.wizard-btn,
.wizard-icon-container {
  background-color: #054978 !important;
  border-color: #054978 !important;
}

.stepTitle.active {
  color: #054978 !important;
}
</style>
