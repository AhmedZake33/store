<template>
  <div v-if="courseData" class="new_edit" :class="load_data ? 'disabled_all' : ''">
    <validation-observer ref="simpleForm">
      <b-form ref="form" @submit.stop.prevent="save">
        <ShowComponent
          v-show="tabNumber == 0"
          :data="courseData"
          :only="['name', 'id', 'name_local', 'code', 'faculty', 'bylaw', 'department', 'lecture_hours', 'tutorial_hours', 'clinical_hours', 'laboratory_hours', 'pre_requisites', 'co_requisites', 'exposed_requisites', 'min_level', 'min_ch_passed', 'removed', 'max_total', 'level', 'type','continous']"
          :loading="load"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_course')" />
            </div>
          </template>
          <template #code="{ data }">
            <!-- <th scope="row" :width="'20%'">
              {{ $t(`Global.code`) }}
            </th>
            <td>
              <b-form-group label-for="code-input">
                <validation-provider #default="{ errors }" name="code" rules="code|required">
                  <b-form-input :placeholder="$t('Global.code')" id="code-input" v-model="form.code" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :backend-errors="getBackendFieldError(errorsdata, 'code')" />
                </validation-provider>
              </b-form-group>
            </td> -->
          </template>
          <template #min_level="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.min_level`) }}
            </th>
            <td>
              <b-form-group label-for="min_level" invalid-feedback="lecture hours is required">
                <v-select :placeholder="$t('Global.min_level')" v-model="form.min_level" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="[1, 2, 3, 4, 5, 6]" input-id="core-input" :reduce="val => val">
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
              </b-form-group>
            </td>
          </template>
          <template #min_ch_passed="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.min_ch_passed`) }}
            </th>
            <td>
              <b-form-group label-for="min_ch_passed" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" rules="number" name="min_ch_passed">
                  <b-form-input :placeholder="$t('Global.min_ch_passed')" @keypress="sanitizePhone($event)" :state="errors.length > 0 ? false : null" id="min_ch_passed" v-model="form.min_ch_passed" />
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'min_ch_passed')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #laboratory_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.laboratory_hours`) }}
            </th>
            <td>
              <b-form-group label-for=" laboratory_hours-input" invalid-feedback="lecture hours is required">
                <b-form-input :placeholder="$t('Global.laboratory_hours')" id=" laboratory_hours-input" v-model="form.laboratory_hours" type="number" min="0" />
                <ValidationErrors default-message :backend-errors="getBackendFieldError(errorsdata, 'laboratory_hours')" />
              </b-form-group>
            </td>
          </template>
          <template #clinical_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.clinical_hours`) }}
            </th>
            <td>
              <b-form-group label-for="clinical_hours-input" invalid-feedback="clinical hours is required">
                <b-form-input :placeholder="$t('Global.clinical_hours')" id="clinical_hours-input" v-model="form.clinical_hours" type="number" min="0" />
                <ValidationErrors default-message :backend-errors="getBackendFieldError(errorsdata, 'clinical_hours')" />
              </b-form-group>
            </td>
          </template>
          <template #tutorial_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.tutorial_hours`) }}
            </th>
            <td>
              <b-form-group label-for=" tutorial_hours-input" invalid-feedback="lecture hours is required">
                <b-form-input :placeholder="$t('Global.tutorial_hours')" id=" tutorial_hours-input" v-model="form.tutorial_hours" type="number" min="0" />
                <ValidationErrors default-message :backend-errors="getBackendFieldError(errorsdata, 'tutorial_hours')" />
              </b-form-group>
            </td>
          </template>
          <template #lecture_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.lecture_hours`) }}
            </th>
            <td>
              <b-form-group label-for="lecture_hours-input" invalid-feedback="lecture hours is required">
                <b-form-input :placeholder="$t('Global.lecture_hours')" id="lecture_hours-input" v-model="form.lecture_hours" type="number" min="0" />
                <ValidationErrors default-message :backend-errors="getBackendFieldError(errorsdata, 'lecture_hours')" />
              </b-form-group>
            </td>
          </template>

          <template #co_requisites="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.core_requisites`) }}
            </th>
            <td>
              <b-form-group v-if="options" label-for="code-input">
                <v-select :placeholder="$t('Global.core_requisites')" :filter="fuseSearch" multiple v-model="form.co_requisites" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="core_requisites_courses" :clearable="true" input-id="core-input" :reduce="val => val.id">
                  <template v-slot:option="option"> {{ option.code }} - {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }} </template>
                  <template #selected-option="{ code, name, name_local }">
                    <div style="display: flex; align-items: baseline">
                      {{ code }} -
                      <strong v-if="$i18n.locale == 'ar'">{{ name_local || name }} </strong>
                      <strong v-else>{{ name || name_local }}</strong>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
              </b-form-group>
            </td>
          </template>
          <template #pre_requisites="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.pre_requisites`) }}
            </th>
            <td>
              <b-form-group v-if="options" label-for="code-input">
                <v-select :placeholder="$t('Global.prerequisites')" :filter="fuseSearch" multiple v-model="form.pre_requisites" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="exposed_requisites_courses" :clearable="true" input-id="core-input" :reduce="val => val.id">
                  <template v-slot:option="option"> {{ option.code }} - {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }} </template>
                  <template #selected-option="{ code, name, name_local }">
                    <div style="display: flex; align-items: baseline">
                      {{ code }} -
                      <strong v-if="$i18n.locale == 'ar'">{{ name_local || name }} </strong>
                      <strong v-else>{{ name || name_local }}</strong>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
              </b-form-group>
            </td>
          </template>

          <template #department="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.department`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="department_id" rules="required">
                  <v-select
                    @search="fetchDepartment"
                    :placeholder="$t('Global.search')"
                    v-model="form.department_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="departments ? departments : []"
                    :clearable="false"
                    :filterable="false"
                    input-id="code-input"
                    :reduce="val => val.id"
                  >
                    <template v-slot:option="option">
                      <span> {{ $i18n.locale == 'ar' ? option.faculty_name_local : option.faculty_name }} : </span>
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local, faculty_name_local, faculty_name }">
                      <div style="display: flex; align-itwkkxqr78tfq4pnujlfgkems: baseline">
                        <span> {{ $i18n.locale == 'ar' ? faculty_name_local : faculty_name }} : </span>
                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                        <strong v-else>{{ name }}</strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('search_input_text') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'department_id')" />
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
                  <b-form-input :placeholder="$t('Global.arabic_name')" @keypress="sanitizeArabic($event)" id="nameAr-input" v-model="form.name_local" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                </validation-provider>
              </b-form-group>
            </td>

            <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
            <td v-if="$i18n.locale == 'ar'">
              <b-form-group label-for="name-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="name" rules="english|required">
                  <b-form-input :placeholder="$t('Global.english_name')" @keypress="sanitizeEnglish($event)" id="name-input" v-model="form.name" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('en')" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
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
                  <b-form-input :placeholder="$t('Global.english_name')" @keypress="sanitizeEnglish($event)" id="name-input" v-model="form.name" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('en')" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')" />
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
                  <b-form-input :placeholder="$t('Global.arabic_name')" @keypress="sanitizeArabic($event)" id="nameAr-input" v-model="form.name_local" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #removed="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.stage`) }}
            </th>
            <td v-if="data.bylaw && data.bylaw.stage">
              <span v-if="$i18n.locale == 'ar'">
                <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name_local">
                    <b-form-input disabled :placeholder="$t('Global.stage')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="data.bylaw.stage.name_local" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  </validation-provider>
                </b-form-group>
              </span>
              <span v-else>
                <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name">
                    <b-form-input disabled :placeholder="$t('Global.stage')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="data.bylaw.stage.name" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  </validation-provider>
                </b-form-group>
              </span>
            </td>
            <td v-else>
              <template v-if="bylaw_stage">
                <span v-if="$i18n.locale == 'ar'">
                  <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                    <validation-provider #default="{ errors }" name="name_local">
                      <b-form-input disabled :placeholder="$t('Global.stage')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="bylaw_stage.name_local" />
                    </validation-provider>
                  </b-form-group>
                </span>
                <span v-else>
                  <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                    <validation-provider #default="{ errors }" name="name">
                      <b-form-input disabled :placeholder="$t('Global.stage')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="bylaw_stage.name" />
                    </validation-provider>
                  </b-form-group>
                </span>
              </template>
            </td>
          </template>
          <template #max_total="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.type`) }}
            </th>
            <td v-if="data.bylaw && data.bylaw.type">
              <span v-if="$i18n.locale == 'ar'">
                <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name_local">
                    <b-form-input disabled :placeholder="$t('Global.type')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="data.bylaw.type.name_local" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  </validation-provider>
                </b-form-group>
              </span>
              <span v-else>
                <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                  <validation-provider #default="{ errors }" name="name_local">
                    <b-form-input disabled :placeholder="$t('Global.type')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="data.bylaw.type.name" :state="errors.length > 0 ? false : null" @blur="checkIfArabic('ar')" />
                  </validation-provider>
                </b-form-group>
              </span>
            </td>
            <td v-else>
              <template v-if="bylaw_type">
                <span v-if="$i18n.locale == 'ar'">
                  <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                    <validation-provider #default="{ errors }" name="name_local">
                      <b-form-input disabled :placeholder="$t('Global.type')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="bylaw_type.name_local" />
                    </validation-provider>
                  </b-form-group>
                </span>
                <span v-else>
                  <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                    <validation-provider #default="{ errors }" name="name_local">
                      <b-form-input disabled :placeholder="$t('Global.type')" @keypress="sanitizeArabic($event)" id="nameAr-input" :value="bylaw_type.name" />
                    </validation-provider>
                  </b-form-group>
                </span>
              </template>
            </td>
          </template>
          <template #faculty="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.faculty`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                  <v-select
                    :placeholder="$t('Global.faculty')"
                    @input="changeFaculty"
                    :disabled="$route.params.faculty_id && $route.params.faculty_id != 0 ? true : false"
                    v-model="form.faculty_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="getOptions(options ? options.faculties : [], item && item.faculty ? item.faculty : moreFaculties)"
                    :filter="fuseSearch"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="val => val.id"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local || name }}</span>
                        <span v-else>{{ name || name_local }} </span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'faculty_id')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #bylaw="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.bylaw`) }}
            </th>
            <td>
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="bylaw_id" rules="required">
                  <v-select
                    :placeholder="$t('Global.bylaw')"
                    @input="changeFaculty"
                    :filter="fuseSearch"
                    v-model="form.bylaw_id"
                    :disabled="(id || ($route.params.bylaw_id && $route.params.bylaw_id != 0)) && !$route.params.id ? true : false"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="getOptions(options ? options.bylaws : [], item && item.bylaw ? item.bylaw : [])"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="val => val.id"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'bylaw_id')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #exposed_requisites="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.exposed_requisites`) }}
            </th>
            <td>
              <b-form-group v-if="options" label-for="code-input">
                <v-select :placeholder="$t('Global.exposed_requisites')" clearable multiple :filter="fuseSearch" v-model="form.exposed_requisites" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="exposed_requisites_courses" input-id="core-input" :reduce="val => val.id">
                  <template v-slot:option="option"> {{ option.code }} - {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name || option.name_local }} </template>
                  <template #selected-option="{ code, name, name_local }">
                    <div style="display: flex; align-items: baseline">
                      {{ code }} -
                      <strong v-if="$i18n.locale == 'ar'">{{ name_local || name }} </strong>
                      <strong v-else>{{ name || name_local }}</strong>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
              </b-form-group>
            </td>
          </template>
          <template #continous="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.continous`) }}
            </th>
            <td>
              <b-form-checkbox v-model="form.continous" style="margin-top: 6px" class="mt-0 custom-control-primary" />
            </td>
          </template>
        </ShowComponent>

        <ShowComponent v-show="tabNumber == 1" :data="courseData" :only="['id', 'description', 'description_local']" :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_course')" />
            </div>
          </template>
          <template #id="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.english_description`) }}
            </th>
            <td>
              <b-form-group label-for=" description-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" rules="address" name="description">
                  <b-form-textarea :placeholder="$t('Global.english_description')" @keypress="sanitizeEnglish($event)" id=" description-input" v-model="form.description" rows="3" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'description')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #description="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.description_local`) }}
            </th>
            <td>
              <b-form-group label-for=" description_local-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" rules="address" name="description">
                  <b-form-textarea :placeholder="$t('Global.arabic_description')" @keypress="sanitizeArabic($event)" id=" description_local-input" v-model="form.description_local" rows="3" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'description')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #description_local="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.description_local`) }}
            </th>
            <td>
              <b-form-group label-for=" description_local-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" rules="address" name="description">
                  <b-form-textarea :placeholder="$t('Global.arabic_description')" @keypress="sanitizeArabic($event)" id=" description_local-input" v-model="form.description_local" rows="3" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'description')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
        </ShowComponent>

        <ShowComponent v-show="tabNumber == 2" :data="courseData" :only="['credit_hours', 'equivalent_ects', 'required_swl']" :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_course')" />
            </div>
          </template>
          <template #credit_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.credit_hours`) }}
            </th>
            <td>
              <b-form-group v-if="data.term_type != 2 || !id" label-for=" credit_hours-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" rules="integer" name="credit_hours">
                  <b-form-input :placeholder="$t('Global.credit_hours')" :state="errors.length > 0 ? false : null" id="credit_hours-input" v-model="form.credit_hours" type="number" min="0" />
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'credit_hours')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #equivalent_ects="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t('Global.equivalent_ECTS') }}
            </th>
            <td>
              <b-form-group label-for=" equivalent_ECTS-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" name="equivalent_ECTS">
                  <b-form-input :placeholder="$t('Global.equivalent_ECTS')" :state="errors.length > 0 ? false : null" id="equivalent_ECTS-input" v-model="form.equivalent_ects" type="number" min="0" />
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'equivalent_ects')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #required_swl="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.required_SWL`) }}
            </th>
            <td>
              <b-form-group label-for=" required_SWL-input" invalid-feedback="lecture hours is required">
                <validation-provider #default="{ errors }" name="required_SWL">
                  <b-form-input :placeholder="$t('Global.required_SWL')" :state="errors.length > 0 ? false : null" id="required_SWL-input" v-model="form.required_swl" type="number" min="0" />
                  <ValidationErrors default-message :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'required_swl')" />
                </validation-provider>
              </b-form-group>
            </td>
          </template>
        </ShowComponent>

        <ShowComponent v-show="tabNumber == 3" :data="courseData" :only="['marks', 'pass_fail']" :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_course')" />
            </div>
          </template>
          <template #pass_fail="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.pass_fail`) }}
            </th>
            <td>
              <b-form-checkbox v-model="form.pass_fail" style="margin-top: 6px" class="mt-0 custom-control-primary" />
            </td>
          </template>
          <template #marks="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.marks`) }}
            </th>
            <td>
              <b-row v-for="(input, k) in form.marks" :key="k">
                <b-col lg="6" md="12">
                  <b-form-group label-for="mc-mark_category">
                    <validation-provider #default="{ errors }" name="mark_category" rules="required">
                      <v-select
                        :placeholder="$t('Global.mark_category')"
                        :class="errors.length > 0 ? 'custom_invalid' : ''"
                        @input="prop => updateCat(input, prop, k)"
                        :value="input.id"
                        :options="options ? options.mark_categories : []"
                        class="w-100"
                        :reduce="val => val.id"
                        :label="getSelectLabel()"
                      />
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <!-- <b-col md="4">
                                          <b-form-group :label="$t('Global.mark')" label-for="mc-mark">
                                            <validation-provider #default="{ errors }" name="mark" rules="required">
                                              <v-select :class="errors.length > 0 ? 'custom_invalid' : ''" @input="prop => updateMarks(input, prop, k)" :value="input.id" :disabled="!input.category_id" :options="marks[input.category_id]" class="w-100" :reduce="val => val.id" :label="getSelectLabel()" />
                                              <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                                            </validation-provider>
                                          </b-form-group>
                                        </b-col> -->
                <!-- Max Grade -->
                <b-col lg="5" md="12">
                  <b-form-group label-for="mc-max_mark">
                    <validation-provider #default="{ errors }" name="max_mark" rules="required">
                      <b-form-input :placeholder="$t('Global.max_mark')" :state="errors.length > 0 ? false : null" @input="prop => updateMax(input, prop, k)" :value="input.max" id="mc-max_mark" type="number" />
                      <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <!-- Remove Button -->
                <b-col lg="1" md="12" class="">
                  <b-button size="sm" v-ripple.400="'rgba(234, 84, 85, 0.15)'" variant="outline-danger" class="mt-0 float-right" @click="remove(k)">
                    <feather-icon icon="XIcon" />
                  </b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-button size="sm" v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="float-right mt-0" variant="primary" @click="addNewMark">
                    <feather-icon icon="PlusIcon" class="text-md-right" />
                  </b-button>
                </b-col>
              </b-row>
            </td>
          </template>
        </ShowComponent>


        <ShowComponent v-show="tabNumber == 4" :data="courseData" :only="['midterm_hours', 'finalexam_hours']" :loading="load">
          <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_course')" />
            </div>
          </template>
          <template #midterm_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Midterm Hours`) }}
            </th>
            <td>
              <b-form-group label-for="midterm-hours-input" invalid-feedback="midterm hours is required">
                <b-form-input :placeholder="$t('Midterm Hours')" id="midterm-hours-input" v-model="form.midterm_hours" type="number" min="0" />
                <ValidationErrors :backend-errors="getBackendFieldError(errorsdata, 'midterm_hours')" />
              </b-form-group>
            </td>
          </template>
          <template #finalexam_hours="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Final Exam Hours`) }}
            </th>
            <td>
              <b-form-group label-for="finalexam-hours-input" invalid-feedback="final exam hours is required">
                <b-form-input :placeholder="$t('Final Exam Hours')" id="finalexam-hours-input" v-model="form.finalexam_hours" type="number" min="0" />
                <ValidationErrors :backend-errors="getBackendFieldError(errorsdata, 'finalexam_hours')" />
              </b-form-group>
            </td>
          </template>
        </ShowComponent>
        <b-row :class="load_data || load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
              {{ $t('Global.save') }}
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="cancel(tabNumber)">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { BButton, BCard, BCol, BForm, BBadge, BFormCheckbox, BFormGroup, BFormInput, BRow, BFormTextarea } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import ShowComponent from '@/views/components/info/show';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { EventBus } from '../../../main';
export default {
  title: 'Edit',
  components: {
    // EditComponent,
    ShowComponent,
    BCard,
    BCol,
    BRow,
    BBadge,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    vSelect,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
  },
  directives: {
    Ripple,
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    courseData: { default: {}, type: [Array, Object] },
    tabNumber: Number,
  },
  computed: {
    ...mapGetters({
      item: 'courses/item',
      load: 'courses/load',
      options: 'app/lookups',
      bylaw_data: 'bylaws/item',
      load_data: 'app/load',
    }),
    departments() {
      let departments = this.$store.getters['app/indexLookups'] ? this.$store.getters['app/indexLookups'].departments : [];
      if (this.id && this.item.department && this.item.faculty) {
        this.item.department.faculty_name = this.item.faculty.name;
        this.item.department.faculty_name_local = this.item.faculty.name_local;
        let pos = departments.map(el => el.id).indexOf(this.item.department.id);
        if (pos == -1) {
          departments.push(this.item.department);
        }
      }
      return departments;
    },
    total() {
      // this.form.marks.return
    },
    id() {
      if (this.params && this.params.bylaw_id) return null;
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return (this.id && !this.params) || (this.params && this.params.status == 2) ? this.$t('Global.course_edit') : this.$t('Global.course_add');
    },
    query() {
      const data = {
        bylaws: this.form?.bylaw_id ? this.item?.bylaw_id : true,
        // departments: true,
        faculties: this.form?.faculty_id ? this.item?.faculty_id : true,
        faculty_id: this.item.faculty_id ? this.item.faculty_id : this.$route.params.faculty_id,
        bylaw_id: this.form.bylaw_id || this.item.bylaw_id || this.$route.params.bylaw_id,
        courses:  true,
        marks: true,
        // faculty_departments: true,
        mark_categories: true,
        lookup_from: 'courses',
      };
      return data;
    },
    gradeTotalValidate() {
      const totalGrade = (this.form.student_activities ? parseInt(this.form.student_activities) : 0) + (this.form.practical_exam ? parseInt(this.form.practical_exam) : 0) + (this.form.final_exam ? parseInt(this.form.final_exam) : 0);
      return totalGrade != 100;
    },
    core_requisites_courses() {
      if (this.options.courses) {
        return this.options.courses.filter(el => (el.bylaw_id = this.form.bylaw_id || !this.form.bylaw_id) && el.id != this.form.exposed_requisites && el.id != this.id);
      }
    },
    exposed_requisites_courses() {
      if (this.options.courses) {
        return this.options.courses.filter(el =>  (el.bylaw_id = this.form.bylaw_id || !this.form.bylaw_id) && el.id != this.form.co_requisites && el.id != this.id);
      }
    },
  },
  data() {
    return {
      rerender: true,
      moreFaculties: null,
      rerenderTotal: true,
      tabIndex: 0,
      passedData: {},
      valid: false,
      course_load: false,
      wizardRerender: true,
      startIndex: 4,
      bylaw_stage: null,
      bylaw_type: null,
      form: {
        min_level: 1,
        min_ch_passed: 1,
        pass_fail: false,
        marks: [
          {
            id: null,
            // category_id: null,
            max: 1,
          },
        ],
      },
      text: '',
      errors_data: {},
      term_types: [
        { id: 1, name: this.$t('Global.credit_hours') },
        { id: 2, name: this.$t('Global.semester_base') },
      ],
      errorsdata: {},
      marks: [],
    };
  },
  beforeMount() {
    if (this.$route.params.bylaw_type) {
      // this.$store.commit('app/SET_LOOKUPS', null);
      // this.$store.commit('courses/SET_ITEM', null);
    }
  },
  mounted() {
    this.init();
    // if (this.$route.query.tab) {
    //   this.$refs.wizard.changeTab(0, this.$route.query.tab);
    // }
    // if (this.$route.params.id) {
    //   var wizard = this.$refs.wizard;
    //   wizard.maxStep = wizard.tabs.length - 1;
    //   wizard.tabs.forEach(tab => {
    //     tab.checked = true;
    //   });
    // }
  },

  methods: {
    ...mapActions({
      getItem: 'courses/get',
      getBylaw: 'bylaws/get',
      lookups: 'app/GET_LOOKUPS',
      fetchDepartments: 'app/GET_INDEX_LOOKUPS',
      // fetchDepartments: 'departments/departments',
    }),
    // validateAsync: function (index) {
    //   if (this.$route.params.id) return true;
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.$refs.simpleForm.validate().then(success => {
    //         if (success) {
    //           resolve(true);
    //         } else {
    //           resolve(false);
    //         }
    //       });
    //     }, 1000);
    //   });
    // },
    changeTab(pre, next) {
      if (next == 3) {
        this.valid = true;
      } else {
        this.valid = false;
      }
      if (next == 2) {
        this.course_load = true;
      } else {
        this.course_load = false;
      }
    },
    checkValid(valid, tab) {
      if (tab == 3) {
        this.valid = true;
      }
    },
    updateCat(data, prop, index) {
      this.form.marks[index].id = prop;
      let mc = this.options.mark_categories.find(element => element.id == prop);
      if (mc) {
        this.marks[prop] = mc.marks;
      }
    },
    updateMax(data, prop, index) {
      this.form.marks[index].max = prop;
      // this.form.total = this.form.total + prop;
      let grades = this.form.marks.map(el => Number(el.max));
      const sum = grades.reduce((partialSum, a) => partialSum + a, 0);
      this.form.max_total = sum;
      this.rerenderTotal = false;
      setTimeout(() => {
        this.rerenderTotal = true;
      }, 50);
    },

    updateMarks(data, prop, index) {
      this.form.marks[index].id = prop;
    },

    addNewMark() {
      this.form.marks.push({
        id: null,
        // category_id: null,
        max: null,
      });
    },
    remove(index) {
      this.rerender = false;
      setTimeout(() => {
        this.rerender = true;
      }, 50);
      this.form.marks.splice(index, 1);
      let grades = this.form.marks.map(el => Number(el.max));
      const sum = grades.reduce((partialSum, a) => partialSum + a, 0);
      this.form.max_total = sum;
      this.rerenderTotal = false;
      setTimeout(() => {
        this.rerenderTotal = true;
      }, 50);
    },

    fetchDepartment(search, load) {
      if (search.length > 1) {
        load(true);
        let query = {
          lookups: [
            {
              table: 'departments',
              query: 'departments.removed = 0',
              joins: [
                {
                  table: 'faculties',
                  foreign_key: 'faculty_id',
                  key: 'id',
                  searchable: true,
                },
              ],
              columns: ['departments.id', 'departments.name', 'departments.name_local', 'faculties.name as faculty_name', 'faculties.name_local as faculty_name_local'],
              orderBy: 'faculties.order',
              keywords: search,
            },
          ],
        };
        this.fetchDepartments(query).then(_ => {
          load(false);
        });
      }
    },

    init() {
      if (this.tabNumber != 0 && this.tabNumber != 3) return;
      if (this.options) {
        if (this.id && this.item) {
          this.form = this.item;
          this.form.faculty_id = this.item?.faculty?.id;
          this.form.department_id = this.item?.department?.id;
          this.form.pass_fail = this.item.pass_fail ? true : false;
          this.form.marks.forEach((item, index) => {
            let mc = this.options.mark_categories.find(element => element.id == item.category_id);
            if (mc) {
              this.marks[item.id] = mc.marks;
            }
          });
          let grades = this.form.marks.map(el => Number(el.max));
          const sum = grades.reduce((partialSum, a) => partialSum + a, 0);
          this.form.max_total = sum;
        } else {
          if (this.tabNumber == 0) {
            this.lookups(this.query);
          }
          if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
            this.getBylaw(this.$route.params.bylaw_id).then(bylaw_response => {
              this.moreFaculties = this.bylaw_data.faculty;
              this.form.faculty_id = Number(this.$route.params.faculty_id);
              if (this.$route.params.bylaw_id) {
                this.bylaw_stage = bylaw_response?.data?.stage;
                this.bylaw_type = bylaw_response?.data?.type;
                this.form.bylaw_id = Number(this.$route.params.bylaw_id);
              }
            });
          }
          // this.form = {
          //   marks: [
          //     {
          //       id: null,
          //       category_id: null,
          //       max: 1,
          //     },
          //   ],
          // };
          if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
            this.moreFaculties = this.bylaw_data.faculty;
            if (this.$route.params.faculty_id) {
              this.form.faculty_id = Number(this.$route.params.faculty_id);
            }
            if (this.$route.params.bylaw_id) {
              this.form.bylaw_id = Number(this.$route.params.bylaw_id);
            }
          }
          // });
          // this.form = {
          //   marks: [
          //     {
          //       id: null,
          //       category_id: null,
          //       max: 1,
          //     },
          //   ],
          // };
        }
        if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
          this.moreFaculties = this.bylaw_data.faculty;
          if (this.$route.params.faculty_id) {
            this.form.faculty_id = Number(this.$route.params.faculty_id);
          }
          if (this.$route.params.bylaw_id) {
            this.form.bylaw_id = Number(this.$route.params.bylaw_id);
          }
        }
      } else {
        if (this.id) {
          this.getItem({ id: this.id, type: 4 }).then(response => {
            // this.query = {...this.query , bylaw_id: 11};
            this.lookups(this.query).then(_ => {
              if (this.id) {
                this.form.description = this.item?.description;
                this.form.description_local = this.item?.description_local;
                this.form = this.item;
                this.form.faculty_id = this.item?.faculty?.id;
                this.form.department_id = this.item?.department?.id;
                this.form.pass_fail = this.item.pass_fail ? true : false;
                this.form.marks.forEach((item, index) => {
                  let mc = this.options.mark_categories.find(element => element.id == item.category_id);
                  if (mc) {
                    this.marks[item.id] = mc.marks;
                  }
                });
                let grades = this.form.marks.map(el => Number(el.max));
                const sum = grades.reduce((partialSum, a) => partialSum + a, 0);
                this.form.max_total = sum;
              } else {
                this.form = {
                  marks: [
                    {
                      id: null,
                      category_id: null,
                      max: 1,
                    },
                  ],
                };
              }
              if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
                this.moreFaculties = this.bylaw_data.faculty;
                if (this.$route.params.faculty_id) {
                  this.form.faculty_id = Number(this.$route.params.faculty_id);
                }
                if (this.$route.params.bylaw_id) {
                  this.form.bylaw_id = Number(this.$route.params.bylaw_id);
                }
              }
            });
          });
        } else {
          this.lookups(this.query).then(_ => {
            // this.form = this.courseData;
            // this.form.description = '';
            // this.form.name = '';
            // this.form.name_local = '';
            // this.form.code = '';
            // this.form.faculty = '';
            // this.form.bylaw = '';
            // this.form.department = '';
            // this.form.lecture_hours = '';
            // this.form.tutorial_hours = '';
            // this.form.clinical_hours = '';
            // this.form.laboratory_hours = '';
            // this.form.pre_requisites = '';
            // this.form.co_requisites = '';
            // this.form.exposed_requisites = '';
            // this.form.min_level = '';
            // this.form.min_ch_passed = '';
            // this.form.removed = '';
            // this.form.max_total = '';
            // this.form.level = '';
            // this.form.type = '';
            // this.form.credit_hours = '';
            // this.form.equivalent_ects = '';
            // this.form.required_swl = '';
            // this.form.marks = '';
            // this.form.pass_fail = '';
            // this.form.midterm_hours = '';
            // this.form.finalexam_hours = '';

            if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
              this.getBylaw(this.$route.params.bylaw_id).then(bylaw_response => {
                this.moreFaculties = this.bylaw_data.faculty;
                this.form.faculty_id = Number(this.$route.params.faculty_id);
                if (this.$route.params.bylaw_id) {
                  this.bylaw_stage = bylaw_response?.data?.stage;
                  this.bylaw_type = bylaw_response?.data?.type;
                  this.form.bylaw_id = Number(this.$route.params.bylaw_id);
                }
              });
            }
            this.form = {
              marks: [
                {
                  id: null,
                  category_id: null,
                  max: 1,
                },
              ],
            };
            if (this.$route.params.bylaw_id && this.$route.params.bylaw_id != 0) {
              this.moreFaculties = this.bylaw_data.faculty;
              if (this.$route.params.faculty_id) {
                this.form.faculty_id = Number(this.$route.params.faculty_id);
              }
              if (this.$route.params.bylaw_id) {
                this.form.bylaw_id = Number(this.$route.params.bylaw_id);
              }
            }
          });
        }
      }
    },

    save() {
      this.$refs.simpleForm.validate().then(success => {
        if (success || this.$route.params.id) {
          let payload = {};
          payload = {
            id: this.id || null,
            query: this.form,
          };
          if (payload.query?.marks && payload.query?.marks?.length && payload.query?.marks[0].id != null) {
            this.$store
              .dispatch('courses/put', payload)
              .then(response => {
                if (!this.id) {
                  this.$router.push({ name: 'course', params: { id: response.data.id } });
                }
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                // this.$store.commit('app/SET_LOOKUPS', null);
                // this.init(response.data.id);
                this.$emit('refresh', response.data.id);
                // if (this.inline) {
                this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
                this.cancel();
                // }
              })
              .catch(error => {
                if (error.response) {
                  this.errorsdata = this.handleBackendError(data.error.response.errors);
                  // this.errorToast(this.$t('check_form_errors'))
                }
              });
          } else {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  icon: 'InfoIcon',
                  text: this.$t('Global.assessment_required'),
                  variant: 'danger',
                },
              },
              {
                position: 'top-right',
              }
            );
          }
        }
      });
    },

    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
        return this.$emit('hide');
      }
      // if(tabNumber == 1){
      //   this.form.description = null;
      //   this.form.description_local = null;
      // }
      // if (this.$route.params.id) {
      //   this.$router.push({ name: 'course', params: { id: this.$route.params.id } });
      // } else {
      //   this.$router.push({ name: 'courses' });
      // }
    },

    checkIfArabic(type) {
      const arabic = /[\u0600-\u06FF]/;
      if (type == 'en') {
        if (arabic.test(this.item.name)) {
          this.item.name = '';
        } else {
          return this.item.name;
        }
      } else if (type == 'ar') {
        if (!arabic.test(this.item.name_local)) {
          this.item.name_local = '';
        } else {
          return this.item.name_local;
        }
      }
    },
    changeFaculty() {
      this.lookups(this.query);
    },
  },
  destroyed() {
    // this.$store.commit('app/SET_LOOKUPS', null);
    // this.$store.commit('courses/SET_ITEM', null);
  },
  created() {
    EventBus.$on('errorForm', data => {
      this.errorsdata = this.handleBackendError(data.data.errors);
    });
  },
  watch: {
    form: {
      handler(val) {
        if (this.tabNumber == 0) {
          if (!this.id) {
            delete this.form['marks'];
          }
          EventBus.$emit('changeForm', this.form);
        }
        if (this.tabNumber == 1) {
          if (this.id) {
            delete this.form['marks'];
          }
          EventBus.$emit('changeContentTab', this.form);
        }
        if (this.tabNumber == 2) {
          if (!this.id) {
            delete this.form['marks'];
          }
          EventBus.$emit('changeLoadTab', this.form);
        }
        if (this.tabNumber == 3) {
          EventBus.$emit('changeMarksTab', this.form);
        }
        if (this.tabNumber == 4) {
          if (!this.id) {
            delete this.form['marks'];
          }
          EventBus.$emit('changeExamTab', this.form);
        }
      },
      immediate: true,
      deep: true,
    },
    // form: {
    //     handler(val) {
    //         // this.rerender = false;
    //         // setTimeout(() => {
    //         //     this.rerender = true;
    //         // }, 50);
    //         // this.form.markInputs.forEach((item, index) => {
    //         //   const mc = this.options.mark_categories.find(element => element.id == item.markCategoryId);
    //         //   if (mc) {
    //         //     this.marks[item.markCategoryId] = mc.marks;
    //         //   } else {
    //         //     this.marks[item.markCategoryId] = [];
    //         //   }
    //         // });
    //     },
    //     deep: true,
    // },
    // 'item.faculty_id': function (newVal,oldVal) {
    //   if (oldVal) {
    //     this.lookups(this.query);
    //   }
    // },
    // 'form.faculty_id': function (newVal,oldVal) {
    //   if (oldVal) {
    //   this.lookups(this.query);
    //   }
    // },
    'form.bylaw_id': function (newVal, oldVal) {
      // if (oldVal) {
        this.lookups(this.query);
      // }
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
