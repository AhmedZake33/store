<template>
  <div class="new_edit" :class="load_data ? 'disabled_all' : ''">
    <validation-observer ref="simpleRules">
      <b-form ref="form" @submit.stop.prevent="save">
        <ShowComponent
          v-if="tabNumber == 0"
          :data="data"
          :only="[
            'code',
            'name',
            'id',
            'name_local',
            'faculty',
            'bylaw',
            'parent',
            'level',
            'courses_count',
            'students_count',
            'graduating_program',
            'via_schedule',
            ...(checkPG ? ['program_type'] : []),
          ]"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.close')"
                style="cursor: pointer"
                icon="XCircleIcon"
                class="font-medium-3"
                @click="cancel()"
                v-if="hasPermission('edit_department')"
              />
            </div>
          </template>
          <template #students_count="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.type`) }}
            </th>
            <td>
              <div v-if="data.bylaw && data.bylaw.type">
                <span v-if="$i18n.locale == 'ar'">
                  {{ data.bylaw.type.name_local }}
                </span>
                <span v-if="$i18n.locale == 'en'">
                  {{ data.bylaw.type.name }}
                </span>
              </div>
              <div v-else>
                <template v-if="bylaw_type">
                  <span v-if="$i18n.locale == 'ar'">
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="name_local"
                      >
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.type')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_type.name_local"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                  <span v-if="$i18n.locale == 'ar'">
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="name_local"
                      >
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.type')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_type.name_local"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                  <span v-else>
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="name_local"
                      >
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.type')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_type.name"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                </template>
              </div>
            </td>
          </template>
          <template #courses_count="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.stage`) }}
            </th>
            <td>
              <div v-if="data.bylaw && data.bylaw.stage">
                <span v-if="$i18n.locale == 'ar'">
                  {{ data.bylaw.stage.name_local }}
                </span>
                <span v-if="$i18n.locale == 'en'">
                  {{ data.bylaw.stage.name }}
                </span>
              </div>
              <div v-else>
                <template v-if="bylaw_stage">
                  <span v-if="$i18n.locale == 'ar'">
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="name_local"
                      >
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.stage')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_stage.name_local"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                  <span v-if="$i18n.locale == 'ar'">
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="name_local"
                      >
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.stage')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_stage.name_local"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                  <span v-else>
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider #default="{ errors }" name="name">
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.stage')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_stage.name"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                  <span>
                    <b-form-group
                      label-for="nameAr-input"
                      invalid-feedback="Name is required"
                    >
                      <validation-provider #default="{ errors }" name="name">
                        <b-form-input
                          disabled
                          :placeholder="$t('Global.stage')"
                          @keypress="sanitizeArabic($event)"
                          id="nameAr-input"
                          :value="bylaw_stage.name"
                        />
                      </validation-provider>
                    </b-form-group>
                  </span>
                </template>
              </div>
            </td>
          </template>
          <template #faculty="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.faculty`) }}
            </th>
            <td>
              <b-form-group
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="faculty_id"
                  rules="required"
                >
                  <v-select
                    :disabled="
                      (id || $route.params.faculty_id) && !$route.params.id
                        ? true
                        : false
                    "
                    :placeholder="$t('Global.faculty')"
                    v-model="form.faculty_id"
                    :filter="fuseSearch"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options && options.faculties"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == 'ar' ? option.name_local : option.name
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
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
                <small
                  v-if="$i18n.locale == 'ar'"
                  class="danger"
                  style="color: red !important"
                  >{{
                    errorsdata
                      ? errorsdata.faculty_id
                        ? errorsdata.faculty_id[0].ar
                        : ''
                      : ''
                  }}</small
                >
                <small v-else class="danger" style="color: red !important">
                  {{
                    errorsdata
                      ? errorsdata.faculty_id
                        ? errorsdata.faculty_id[0].en
                        : ''
                      : ''
                  }}
                </small>
              </b-form-group>
            </td>
          </template>

          <template #bylaw="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.bylaw`) }}
            </th>
            <td>
              <b-form-group
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bylaw_id"
                  rules="required"
                >
                  <v-select
                    :filter="fuseSearch"
                    :placeholder="$t('Global.bylaw')"
                    :disabled="
                      (id || $route.params.bylaw_id) && !$route.params.id
                        ? true
                        : false
                    "
                    v-model="form.bylaw_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options && options.bylaws"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == 'ar' ? option.name_local : option.name
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
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
                <small
                  v-if="$i18n.locale == 'ar'"
                  class="danger"
                  style="color: red !important"
                  >{{
                    errorsdata
                      ? errorsdata.bylaw_id
                        ? errorsdata.bylaw_id[0].ar
                        : ''
                      : ''
                  }}</small
                >
                <small v-else class="danger" style="color: red !important">
                  {{
                    errorsdata
                      ? errorsdata.bylaw_id
                        ? errorsdata.bylaw_id[0].en
                        : ''
                      : ''
                  }}
                </small>
              </b-form-group>
            </td>
          </template>
          <template #parent>
            <th scope="row" :width="'20%'">
              {{ $t(`Global.parent_program`) }}
            </th>

            <td>
              <b-form-group
                v-if="!params || (params && !params.bylaw_id)"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider #default="{ errors }" name="parent_id">
                  <v-select
                    :filter="fuseSearch"
                    :placeholder="$t(`Global.parent_program`)"
                    :disabled="
                      (id || $route.params.bylaw_id) && !$route.params.id
                        ? true
                        : false
                    "
                    v-if="options"
                    v-model="form.parent_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options.available_parents_programs"
                    :clearable="true"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </span>
                      <span v-else>
                        {{ option.name || option.name_local }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == 'ar' ? option.name_local : option.name
                      }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
                <small
                  v-if="$i18n.locale == 'ar'"
                  class="danger"
                  style="color: red !important"
                  >{{
                    errorsdata
                      ? errorsdata.bylaw_id
                        ? errorsdata.bylaw_id[0].ar
                        : ''
                      : ''
                  }}</small
                >
                <small v-else class="danger" style="color: red !important">
                  {{
                    errorsdata
                      ? errorsdata.bylaw_id
                        ? errorsdata.bylaw_id[0].en
                        : ''
                      : ''
                  }}
                </small>
              </b-form-group>
            </td>
          </template>
          <template #code="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.code`) }}
            </th>

            <td>
              <b-form-group label-for="code-input">
                <validation-provider #default="{ errors }" name="code" rules="required">
                  <b-form-input :placeholder="$t('Global.code')" id="code-input" v-model="form.code"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata, 'code')"/>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="false" #courses="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.postgraduate_type`) }}
            </th>
            <td>
              <b-form-group label-for="code-input">
                <validation-provider
                  #default="{ errors }"
                  name="type_id"
                  rules="required"
                >
                  <v-select
                    v-if="types"
                    :placeholder="$t('Global.postgraduate_type')"
                    v-model="form.type_id"
                    :filter="fuseSearch"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="types"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == 'ar' ? option.name_local : option.name
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
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #name="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.name_custom`) }}
            </th>
            <td>
              <b-form-group
                label-for="name-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="english_name"
                  rules="english|required"
                >
                  <b-form-input
                    id="name-input"
                    :placeholder="$t('Global.english_name')"
                    v-model="form.name"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeNumber($event);
                      sanitizeEnglish($event);
                    "
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
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
                <validation-provider #default="{ errors }" name="name_local" rules="required|required|regex:^([a-zA-Z0-9]+)$">
                  <b-form-input
                    id="nameAr-input"
                    :placeholder="$t('Global.arabic_name')"
                    v-model="form.name_local"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeNumber($event);
                      sanitizeArabic($event);
                    "
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template #graduating_program="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.graduating_program`) }}
            </th>
            <td>
              <b-form-checkbox
                v-model="form.graduating_program"
                style="margin-top: 6px"
                class="mt-0 custom-control-primary"
              />
            </td>
          </template>
          <template #via_schedule="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.via_schedule`) }}
            </th>
            <td>
              <b-form-checkbox
                v-model="form.via_schedule"
                style="margin-top: 6px"
                class="mt-0 custom-control-primary"
              />
            </td>
          </template>
          <template #id="{ data }">
            <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
              {{ $t(`Global.name_local`) }}
            </th>
            <td v-if="$i18n.locale == 'en'">
              <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="name_local" rules="required|regex:^([\u0600-\u06FF _)(@./#&+-]+)$">
                  <b-form-input
                    id="nameAr-input"
                    :placeholder="$t('Global.arabic_name')"
                    v-model="form.name_local"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeNumber($event);
                      sanitizeArabic($event);
                    "
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </td>

            <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">
              الاسم بالانجليزية
            </th>
            <td v-if="$i18n.locale == 'ar'">
              <b-form-group label-for="name-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="english_name" rules="required|english">
                  <b-form-input
                    :placeholder="$t('Global.english_name')"
                    id="name-input"
                    v-model="form.name"
                    :state="errors.length > 0 ? false : null"
                    @keypress="
                      sanitizeNumber($event);
                      sanitizeEnglish($event);
                    "
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </td>
          </template>
          <template v-if="checkPG" #program_type="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.program_type`) }}
            </th>
            <td>
              <b-form-group
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="program_type"
                  rules="required"
                >
                  <v-select
                    :placeholder="$t('Global.program_type')"
                    v-if="options"
                    v-model="form.program_type"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options.program_types"
                    :clearable="true"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == 'ar' ? option.name_local : option.name
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
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
                <small
                  v-if="$i18n.locale == 'ar'"
                  class="danger"
                  style="color: red !important"
                  >{{
                    errorsdata
                      ? errorsdata.program_type
                        ? errorsdata.program_type[0].ar
                        : ''
                      : ''
                  }}</small
                >
                <small v-else class="danger" style="color: red !important">
                  {{
                    errorsdata
                      ? errorsdata.program_type
                        ? errorsdata.program_type[0].en
                        : ''
                      : ''
                  }}
                </small>
              </b-form-group>
            </td>
          </template>
        </ShowComponent>

        <ShowComponent
          v-if="tabNumber == 1"
          :data="data"
          :only="['students_count', 'courses_count', 'bylaw']"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.close')"
                style="cursor: pointer"
                icon="XCircleIcon"
                class="font-medium-3"
                @click="cancel()"
                v-if="hasPermission('edit_department')"
              />
            </div>
          </template>
          <template #students_count="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.program_description`) }}
            </th>
            <td>
              <b-form-group
                label-for="description-input"
                invalid-feedback="lecture hours is required"
              >
                <b-form-textarea
                  :placeholder="$t('Global.program_description')"
                  id=" description-input"
                  v-model="form.program_description"
                  rows="3"
                />
              </b-form-group>
            </td>
          </template>
          <template #courses_count="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.career_prospects`) }}
            </th>
            <td>
              <b-form-group
                label-for="description-input"
                invalid-feedback="lecture hours is required"
              >
                <b-form-textarea
                  :placeholder="$t('Global.career_prospects')"
                  id=" description-input"
                  v-model="form.career_prospects"
                  rows="3"
                />
              </b-form-group>
            </td>
          </template>
          <template #bylaw="{ data }">
            <th scope="row" :width="'20%'">
              {{ $t(`Global.program_concentrations`) }}
            </th>
            <td>
              <b-form-group
                label-for="description-input"
                invalid-feedback="lecture hours is required"
              >
                <b-form-textarea
                  :placeholder="$t('Global.program_concentrations')"
                  id=" description-input"
                  v-model="form.program_concentrations"
                  rows="3"
                />
              </b-form-group>
            </td>
          </template>
        </ShowComponent>

        <ShowComponent
          v-if="tabNumber == 2"
          :data="data"
          :only="['name', 'name_local']"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.close')"
                style="cursor: pointer"
                icon="XCircleIcon"
                class="font-medium-3"
                @click="cancel()"
                v-if="hasPermission('edit_program')"
              />
            </div>
          </template>
          <template #name="{ data }">
            <h4 class="mb-3 mx-1 d-flex align-items-center">
              {{ $t('Global.research_plan') }}
              {{ $t('Global.click_to_add') }}
              <feather-icon
                @click="
                  (e) => {
                    addCourse();
                  }
                "
                style="cursor: pointer"
                icon="PlusCircleIcon"
                class="font-medium-3 mx-1"
              />
            </h4>
            <b-row
              class="hover_delete position-relative pb-1 mb-1 border-bottom"
              :key="k"
              v-for="(item, k) in plansLookups && plansLookups.research_plans"
            >
              <feather-icon
                @click="
                  (e) => {
                    removeCourse(k, item);
                  }
                "
                style="cursor: pointer"
                icon="TrashIcon"
                class="font-medium-3 show_hover"
              />
              <b-col cols="12" lg="6" md="6" sm="12">
                <b-form-group
                  :label="$t('Global.name_custom')"
                  label-for="code-input"
                >
                  <validation-provider #default="{ errors }" name="name">
                    <b-form-input
                      @input="updateInput($event, 'name', k)"
                      id="code-input"
                      :value="item.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors
                      default-message
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'name')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col cols="12" lg="6" md="6" sm="12">
                <b-form-group
                  :label="$t('Global.arabic_name')"
                  label-for="code-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="arabic|required"
                  >
                    <b-form-input
                      @input="updateInput($event, 'name_local', k)"
                      id="name_local-input"
                      :value="item.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors
                      default-message
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'name_local')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
          </template>
        </ShowComponent>

        <b-row>
          <b-col md="12" :class="saveLoad ? 'disabled_all' : ''">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mr-1"
            >
              {{ $t('Global.save') }}
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
              @click="cancel"
            >
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
import {
  BButton,
  BCard,
  BCardGroup,
  BCardText,
  BCol,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BListGroup,
  BListGroupItem,
  BRow,
  BFormTextarea,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import draggable from 'vuedraggable';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required } from '@validations';
import EditComponent from '@/views/components/table/Edit';
import faculty from '@/api/academic_settings/faculities/faculty';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import ShowComponent from '@/views/components/info/show';
import { EventBus } from '../../../main';
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  title: 'Edit',
  components: {
    BCard,
    BCol,
    ShowComponent,
    ValidationErrors,
    FormWizard,
    TabContent,
    BCardText,
    BFormTextarea,
    BCardGroup,
    BListGroup,
    BListGroupItem,
    BRow,
    draggable,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ToastificationContent,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'programs/item',
      load: 'programs/load',
      saveLoad: 'app/load',
      options: 'app/lookups',
      bylaw_data: 'bylaws/item',
      load_data: 'app/load',
      plansLookups: 'theses/lookups',
    }),
    checkPG() {
      if (this.form.bylaw_id) {
        let bylaw = this.options && this.options.bylaws.filter(
          (x) => x.id == this.form.bylaw_id
        );
        if (bylaw.length > 0) {
          return bylaw[0].stage_id == 2 ? true : false;
        }
        return false;
      }
      if (this.data != {}) {
        return this.data.bylaw && this.data.bylaw.stage_id == 2 ? true : false;
      }
      return false;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return (this.id && !this.params) ||
        (this.params && this.params.status == 2)
        ? this.$t('Global.program_edit')
        : this.$t('Global.program_add');
    },
    query() {
      const data = {
        bylaws: true,
        faculties: true,
        faculty_id: this.$route.params.faculty_id
          ? this.$route.params.faculty_id
          : this.form.faculty_id,
        bylaw_id: this.form.bylaw_id,
        courses: true,
        program_types: true,
        get_program_available_parents: this.$route.params.id,
        get_program_available_courses: this.$route.params.id,
      };
      return data;
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    data: { default: {}, type: [Array, Object] },
    tabNumber: Number,
  },
  data() {
    return {
      tabIndex: 0,
      description_show: false,
      bylaw_stage: null,
      bylaw_type: null,
      ruleForm: [],
      deletedIds: [],
      form: {
        code: null,
        name: null,
        name_local: null,
        faculty_id: null,
        bylaw_id: null,
        parent_id: null,
        // type_id:null,
        courses_ids: [],
        program_description: null,
        career_prospects: null,
        program_concentrations: null,
        graduating_program: true,
        via_schedule: true,
        program_type: null,
      },
      faculties: {},
      levels: [],
      programs: [],
      available_program_parents: [],
      // types:[{name:'Diploma',name_local:'دبلوم',id:1},{name:'Master',name_local:'ماجستير',id:2},{name:'PHD',name_local:'الدكتوراه',id:3}],
      errorsdata: {},
    };
  },
  async mounted() {
    await this.init();
    this.ruleForm = this.plansLookups && this.plansLookups.research_plans;
  },

  methods: {
    ...mapActions({
      getItem: 'programs/get',
      getBylaw: 'bylaws/get',
      lookups: 'app/GET_LOOKUPS',
      saveData: 'programs/put',
      saveResearchPlan: 'programs/saveResearchPlan',
    }),
    updateInput(value, prop, k) {
      this.ruleForm[k][prop] = value;
    },
    addCourse() {
      this.ruleForm.push({
        id: null,
        name: '',
        name_local: '',
      });
    },
    removeCourse(i, item) {
      this.ruleForm.splice(i, 1);
      this.deletedIds.push(item.id);
    },
    changeTab(pre, next) {
      if (next == 1) {
        this.description_show = true;
      } else {
        this.description_show = false;
      }
    },
    validateAsync: function (index) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$refs.simpleRules.validate().then((success) => {
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
      var query = {
        bylaws: true,
        lookup_from: 'programs',
        program_types: true,
        get_program_available_parents: this.$route.params.id,
        get_program_available_courses: this.$route.params.id,
      };

      if (this.$route.params && this.$route.params.faculty_id) {
        query = {
          ...query,
          faculties: true,
          faculty_id: this.$route.params.faculty_id,
          faculty_departments: true,
        };
      } else {
        query = { ...query, defaultBylaws: true, faculties: true };
      }
      this.$store.commit('app/UPDATE_PAGE_DETAILS', null, { root: true });
      this.lookups(query).then((response) => {
        this.available_program_parents =
          response.success.available_parents_programs;
      });
      if (this.$route.params.bylaw_id) {
        this.$store.commit('app/UPDATE_PAGE_DETAILS', null, { root: true });
        this.getBylaw(this.$route.params.bylaw_id).then((bylaw_response) => {
          this.faculties = this.bylaw_data.faculty;
          if (this.$route.params.faculty_id) {
            this.form.faculty_id = Number(this.$route.params.faculty_id);
          }
          if (this.$route.params.bylaw_id) {
            this.form.bylaw_id = Number(this.$route.params.bylaw_id);
            this.bylaw_stage = bylaw_response?.data?.stage;
            this.bylaw_type = bylaw_response?.data?.type;
          }
          this.$store.commit('app/UPDATE_PAGE_DETAILS', null, { root: true });
        });
      }
      // if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
      // this.getItem(this.id).then(res => {
      if (this.id) {
        this.form.code = this.data.code;
        this.form.name = this.data.name;
        this.form.name_local = this.data.name_local;
        this.form.faculty_id = this.data.faculty_id;
        this.form.bylaw_id = this.data.bylaw_id;
        this.form.parent_id = this.data.parent_id;
        this.form.program_type = this.data.program_type;
        this.form.courses_ids = this.data.courses_ids;
        this.form.program_description = this.data.program_description;
        this.form.program_concentrations = this.data.program_concentrations;
        this.form.career_prospects = this.data.career_prospects;
        this.form.graduating_program = this.data.graduating_program
          ? true
          : false;
        this.form.via_schedule = this.data.via_schedule ? true : false;
      }
      // });
      // }
    },
    save() {
      if (this.$route.query.tabNum == 6) {
        const payload = {
          id: this.id || null,
          query: { deleted: this.deletedIds, data: this.ruleForm },
        };
        this.saveResearchPlan(payload).then((_) => {
          this.$swal({
            icon: 'success',
            title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.$emit('refresh');
        });
      } else {
        this.$refs.simpleRules.validate().then((success) => {
          if (success) {
            if (!this.id) {
              this.$emit('save');
            } else {
              const payload = {
                id: this.id || null,
                query: this.form,
              };
              this.$emit('save', payload);
            }
          }
        });
      }
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: false,
        });
        return this.$emit('hide');
      }
      // if (this.$route.params.id) {
      //   this.$router.push({ name: 'program', params: { id: this.$route.params.id } });
      // } else {
      //   this.$router.push({ name: 'programs' });
      // }
    },
  },
  created() {
    EventBus.$on('errorsdata', (data) => {
      this.errorsdata = data;
    });
  },
  watch: {
    //               form: {
    //   handler(val) {
    //     const ob = this
    //     this.form.levelInputs.forEach((item, index) => {
    //       const mc = this.options.mark_categories.find(element => element.id == item.markCategoryId)
    //       if (mc) {
    //         this.marks[item.markCategoryId] = mc.marks
    //       } else {
    //         this.marks[item.markCategoryId] = []
    //       }
    //     })
    //   },
    //   deep: true,
    // },
    form: {
      handler(val) {
        if (this.tabNumber == 0) {
          EventBus.$emit('changeProgramForm', this.form);
        }
        if (this.tabNumber == 1) {
          EventBus.$emit('changeDescriptionTab', this.form);
        }
      },
      immediate: true,
      deep: true,
    },

    'form.faculty_id': function (newVal, oldVal) {
      if (oldVal) {
        this.form.bylaw_id = null;
        this.lookups(this.query);
      }
    },

    getPrograms() {},
    // 'form.bylaw_id': function (newVal,oldVal) {
    //   if(oldVal){
    //   let queryData = this.query;
    //   if (this.params && this.params.faculty_id) {
    //     queryData.faculty_id = this.params.faculty_id;
    //   }
    //   this.lookups(queryData).then(value => {
    //     if (this.id == null) {
    //       this.courses = value.success.courses;
    //     }
    //   });
    // }
    // },
    // 'form.name_local': function (newValue, oldValue) {
    //   const arabic = /[\u0600-\u06FF]/;
    //   if (!arabic.test(newValue) && newValue !== oldValue) {
    //     this.form.name_local = '';
    //   } else {
    //     return newValue;
    //   }
    // },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '@core/scss/vue/libs/vue-select.scss';
.show_hover {
  display: none;
  position: absolute;
  top: -10px;
  left: -10px;
  background: #f8f8f8;
  border-radius: 50%;
}
.hover_delete {
  border: 1px solid transparent;
  padding: 5px;
  &:hover {
    border: 1px solid #ddd;
    padding: 5px;
    .show_hover {
      display: block;
    }
  }
}
.wizard-btn,
.wizard-icon-container {
  background-color: #054978 !important;
  border-color: #054978 !important;
}

.stepTitle.active {
  color: #054978 !important;
}
</style>
