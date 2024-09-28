<template>
  <div>
   <b-overlay :show="overlay" rounded="sm" no-fade>
    <edit-component :name="name"  :status="2">
      <template v-if="item" #inputs>
        <validation-observer ref="simpleRules">
          <!-- {{item}} && data.item.status.name == 'Draft' && hasPermission('edit_offering') -->
          <b-form>
            <b-row>
              <b-col md="4">
                <b-form-group :label="$t('Global.term')" label-for="mc-term">
                  <validation-provider
                    #default="{ errors }"
                    name="term"
                    rules="required"
                  >
                    <v-select
                      id="mc-term"
                      v-model="form.term_id"
                      :filter="fuseSearch"
                      :options="[item.term]"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="(val) => val.id"
                      disabled
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.faculty')"
                  label-for="mc-faculty"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="faculty"
                    rules="required"
                  >
                    <v-select
                      id="mc-faculty"
                      v-model="form.faculty_id"
                      :filter="fuseSearch"
                      :options="[item.course.faculty]"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="(val) => val.id"
                      disabled
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group :label="$t('Global.bylaw')" label-for="mc-course">
                  <validation-provider
                    #default="{ errors }"
                    name="bylaw"
                    rules="required"
                  >
                    <v-select
                      id="mc-course"
                      v-model="form.bylaw_id"
                      :filter="fuseSearch"
                      :options="[item.course.bylaw]"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="(val) => val.id"
                      disabled
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.course')"
                  label-for="mc-course"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="term"
                    rules="required"
                  >
                    <v-select
                      id="mc-course"
                      v-model="form.course_id"
                      :filter="fuseSearch"
                      :options="[item.course]"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="(val) => val.id"
                      disabled
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadOfferings">
                          {{ $t("Global.loading") }}
                        </div>
                        <div v-else>
                          {{ $t("Global.search") }}
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{
                            option.name_local + "(" + option.code + ")" ||
                            option.name + "(" + option.code + ")"
                          }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                        <span v-else>
                          {{
                            option.name + "(" + option.code + ")" ||
                            option.name_local + "(" + option.code + ")"
                          }}
                          <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar"
                            ? option.name_local + "(" + option.code + ")" ||
                              option.name + "(" + option.code + ")"
                            : option.name + "(" + option.code + ")" ||
                              option.name_local + "(" + option.code + ")"
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
                  :label="$t('Global.linked_offering')"
                  label-for="mc-course"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="linked_offering"
                    rules=""
                  >
                    <v-select
                      id="mc-course"
                      v-model="form.linked_offering"
                      :options="FilteredLinkedOffering"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      :reduce="(val) => val.id"
                      clearable
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadOfferings">
                          {{ $t("Global.loading") }}
                        </div>
                        <div v-else>
                          {{ $t("Global.search") }}
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
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
              <!--   <b-col md="4">
                <b-form-group
                  :label="$t('Global.linked_exam_offering')"
                  label-for="mc-course"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="linked_exam_offering"
                    rules=""
                  >
                    <v-select
                      id="mc-course"
                      v-model="form.linked_exam_offering"
                      :options="offerings"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      clearable
                      :filterable="false"
                      :reduce="val => val.id"
                      @search="fetchOfferings"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadOfferings">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.course.name_local || option.course.name }}
                           {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} 
                        </span>
                        <span v-else>
                          {{ option.course.name || option.course.name_local }}
                           {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} 
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.course.name_local || option.course.name
                            : option.course.name || option.course.name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <!---
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.coordinator')"
                  label-for="mc-coordinators"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="coordinators"
                    rules=""
                  >
                    <v-select
                      id="mc-coordinators"
                      v-model="form.coordinators"
                      :options="instructors"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"

                      :filterable="false"
                      clearable
                      @search="fetchUsers"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadUsers">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.academic_name_local || option.academic_name }}
                           {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} 
                        </span>
                        <span v-else>
                          {{ option.academic_name || option.academic_name_local }}
                           {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} -
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.academic_name_local || option.academic_name
                            : option.academic_name || option.academic_name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  :label="$t('Global.teachers')"
                  label-for="mc-teachers"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="teachers"
                    rules=""
                  >
                    <v-select
                      id="mc-teachers"
                      v-model="form.teachers"
                      :options="instructors"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      multiple
                      clearable
                      :filterable="false"
                      @search="fetchUsers"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadUsers">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.academic_name_local || option.academic_name }}
                           {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} 
                        </span>
                        <span v-else>
                          {{ option.academic_name || option.academic_name_local }}
                           {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} 
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.name_local || option.academic_name
                            : option.academic_name_local || option.academic_name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.examinationCommittee')"
                  label-for="mc-examiners"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="examiners"
                    rules=""
                  >
                    <v-select
                      id="mc-examiners"
                      v-model="form.examiners"
                      :options="instructors"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      multiple
                      clearable
                      :filterable="false"
                      @search="fetchUsers"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadUsers">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.academic_name_local || option.academic_name }}
                           {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} 
                        </span>
                        <span v-else>
                          {{ option.academic_name || option.academic_name_local }}
                           {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} 
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.academic_name_local || option.academic_name
                            : option.academic_name || option.academic_name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group
                  :label="$t('Global.teachingAssistants')"
                  label-for="mc-teachingAssistant"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="teachingAssistant"
                    rules=""
                  >
                    <v-select
                      id="mc-teachingAssistant"
                      v-model="form.teachingAssistant"
                      :options="instructors"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      multiple
                      clearable
                      :filterable="false"
                      @search="fetchUsers"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadUsers">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.academic_name_local || option.academic_name }}
                           {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }}
                        </span>
                        <span v-else>
                          {{ option.academic_name || option.academic_name_local }}
                          {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} 
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.academic_name_local || option.academic_name
                            : option.academic_name || option.academic_name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="8">
                <b-form-group
                  :label="$t('Global.program')"
                  label-for="mc-program"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="programs"
                    rules="required"
                  >
                    <v-select
                      id="mc-program"
                      v-model="form.programs"
                      :options="options.programs"
                      :label="getSelectLabel()"
                      class="w-100"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :placeholder="$t('Global.search')"
                      multiple
                      :filterable="false"
                      clearable
                     
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    >
                      <template slot="no-options">
                        <div v-if="loadPrograms">
                          {{ $t('Global.loading') }}
                        </div>
                        <div v-else>
                          {{ $t('Global.search') }}
                        </div>
                      </template>
                      <template
                        slot="selected-option"
                        slot-scope="option"
                      >
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                         {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} 
                        </span>
                        <span v-else>
                          {{ option.name || option.name_local }}
                           {{ option.bylaw ? option.bylaw.name : '' }} -
                        {{ option.bylaw ? option.bylaw.faculty.name : '' }} 
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == 'ar'
                            ? option.name_local || option.name
                            : option.name || option.name_local
                        }}
                      </template>
                    <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                  </v-select>
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
            </b-row>

            <b-row>
              <!--   <b-col
                md="12"
                class="mt-2"
              >
                <h5>{{ $t('Global.offering_settings') }}</h5>
                <hr>
              </b-col> -->
              <!--  <b-col md="4">
                <b-form-group
                  :label="$t('Global.num_group')"
                  label-for="mc-group"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_groups"
                    rules="required"
                  >
                    <b-form-input
                      id="mc-group"
                      v-model="form.num_groups"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                      :readonly="disable_inputs"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <!--    <b-col md="4">
                <b-form-group
                  :label="$t('Global.num_section')"
                  label-for="mc-section"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_sections"
                    rules="required"
                  >
                    <b-form-input
                      id="mc-section"
                      v-model="form.num_sections"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group></b-col> -->
              <!-- <b-col
                v-if="!disable_inputs"
                md="4"
              >
                <b-form-group
                  :label="$t('Global.section_group')"
                  label-for="mc-section_group"
                >
                  <b-form-input
                    id="mc-section_group"
                    v-model="form.section_group"
                    type="number"
                    :readonly="disable_inputs"
                  />
                </b-form-group>
              </b-col> -->
              <!--    <b-col md="4">
                <b-form-group
                  :label="$t('Global.quota')"
                  label-for="mc-quota"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="section_quota"
                    rules="required"
                  >
                    <b-form-input
                      id="mc-quota"
                      v-model="form.section_quota"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <!-- <b-col md="4">
                <b-form-group
                  :label="$t('Global.over_quota')"
                  label-for="mc-over_quota"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="section_over_quota"
                    rules="required"
                  >
                    <b-form-input
                      id="mc-over_quota"
                      v-model="form.section_over_quota"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
            </b-row>
            <b-row>
              <b-col md="12" class="mt-2">
                <h5>
                  {{ $t("Global.mark_setup") }}
                  <b-badge variant="light-secondary">
                    ( {{ form.total_marks }} )
                  </b-badge>
                </h5>
                <hr />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div>
                  <b-row>
                    <b-col
                      md="12"
                      v-for="(input, k) in form.offeringMarks"
                      :key="k"
                    >
                      <b-col>
                        <b-row>
                          <h6>
                            {{ $t("Global.maximum") }} {{ input.sum }} /
                            {{ form.max_total }}
                          </h6>
                        </b-row>
                      </b-col>
                      <b-row>
                        <b-col md="8" lg="9" class="mr-1">
                          <b-form-group
                            :label="$t('Global.mark_category')"
                            label-for="mc-mark_category"
                          >
                            <validation-provider
                              #default="{ errors }"
                              name="mark_category"
                              rules="required"
                            >
                              <v-select
                                v-model="input.name"
                                class="w-100"
                                :reduce="(val) => val.id"
                                :label="getSelectLabel()"
                                disabled
                                @change="
                                  getMarksFromCategory(k, input.category_id)
                                "
                              />

                              <small v-if="errors.length" class="text-danger">{{
                                validation(null, 0).message
                              }}</small>
                            </validation-provider>
                          </b-form-group>

                          <b-row v-for="(mark, i) in input.marks" :key="i">
                            <b-col lg="4" md="12">
                              <b-form-group
                                :label="$t('Global.mark_name')"
                                label-for="mc-mark_name"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="mark_name"
                                  rules="english|required"
                                >
                                  <b-form-input
                                    id="mc-markId"
                                    v-model="mark.name"
                                    :state="errors.length > 0 ? false : null"
                                    type="text"
                                  />
                                  <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="
                                      getBackendFieldError(
                                        errorsdata,
                                        'mark_name'
                                      )
                                    "
                                  />
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                            <b-col lg="3" md="12">
                              <b-form-group
                                :label="$t('Global.short_name')"
                                label-for="mc-short_name"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="short_name"
                                  rules="english|required"
                                >
                                  <b-form-input
                                    id="mc-value"
                                    v-model="mark.short_name"
                                    :state="errors.length > 0 ? false : null"
                                    type="text"
                                  />
                                  <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="
                                      getBackendFieldError(
                                        errorsdata,
                                        'short_name'
                                      )
                                    "
                                  />
                                </validation-provider>
                              </b-form-group>
                            </b-col>
                            <b-col lg="2" md="12">
                              <b-form-group
                                :label="$t('Global.maximum')"
                                label-for="mc-value"
                              >
                                <validation-provider
                                  #default="{ errors }"
                                  name="value"
                                  rules="integer|required|positive"
                                >
                                  <b-form-input
                                    id="mc-value"
                                    v-model="mark.value"
                                    :state="errors.length > 0 ? false : null"
                                    type="text"
                                    @change="checkValue"
                                  />
                                  <ValidationErrors
                                    :frontend-errors="errors"
                                    :backend-errors="
                                      getBackendFieldError(errorsdata, 'value')
                                    "
                                  />
                                </validation-provider>
                              </b-form-group>
                            </b-col>

                            <b-col lg="3" md="12" class="mb-1">
                              <!--  <b-button 
                                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                                        variant="outline-secondary"
                                        class="mt-0 mt-md-2 float-right"
                                        style="cursor:default;"
                                      >
                                        <feather-icon icon="XIcon" />
                                      </b-button> -->
                              <b-button
                                v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                                variant="outline-danger"
                                class="mt-0 mt-md-1 float-right"
                                @click="remove(k, i)"
                              >
                                <feather-icon icon="XIcon" />
                              </b-button>
                            </b-col>
                          </b-row>
                        </b-col>

                        <b-col md="3" lg="2">
                          <!-- <b-button v-if="students_count > 0"
                                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                                  class="float-right mt-0 mt-md-2"
                                  variant="secondary"
                                  style="cursor:default;"
                                >
                                  <feather-icon
                                    icon="PlusIcon"
                                    class="text-md-right"
                                  />
                                </b-button> -->
                          <b-button
                            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                            class="float-right mt-0 mt-md-2 m-1"
                            variant="primary"
                            @click="addNewMark(k)"
                          >
                            <feather-icon
                              icon="PlusIcon"
                              class="text-md-right"
                            />
                          </b-button>
                        </b-col>
                        <b-col md="1">
                          <!--                                 <hr style="border-left: 1px solid; height: 100%; border-top:none;">
 -->
                        </b-col>
                      </b-row>
                      <!--                               <hr style="border-top :1px solid; ">
 -->
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>

      <template #footer>
        <template>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            @click="submit"
          >
            {{ $t("Global.save") }}
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="outline-secondary"
            @click="cancel"
          >
            {{ $t("Global.cancel") }}
          </b-button>
        </template>
      </template>
    </edit-component>
   </b-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BBadge,
  BOverlay,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: "Edit",
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ValidationObserver,
    ValidationProvider,
    localize,
    BBadge,
    ValidationErrors,
    BOverlay,
  },
  /*  props:{
    students_count:{
       type: Number,
    }
  }, */
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "offerings/item",
      //loadPrograms: 'programs/load',
      //loadUsers: 'users/load',
      loadOfferings: "offerings/load",
      options: "app/lookups",
      //filteredPrograms: 'programs/items',
      // users: 'users/items',
      offerings: "offerings/items",
      //instructors: 'instructors/items',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      if (this.$i18n.locale === "en") {
        return this.id
          ? `${this.$t("Global.edit_course_offering")}  ${this.course_code}  ${
              this.course_name
            } `
          : this.$t("Global.add_course_offering");
      }

      return this.id
        ? `${this.$t("Global.edit_course_offering")}  ${this.course_code}  ${
            this.course_name_local
          } `
        : this.$t("Global.add_course_offering");
    },
  },
  watch: {
    /* 'filter.faculty_id': function (newValue) {
      this.filter.bylaw_id = 0
      this.changedBylawId(0)
    },
    'filter.bylaw_id': function (newValue) {
      // this.form.program_id = null
      this.changedBylawId(null)
    }, */
    selected_programs(newValue) {
    },

    /* form: {
      handler(val) {
        const ob = this
        let counter = 0
        const last = val.markInputs.length - 1
        const lastCat = val.markInputs[last].markCategoryId
        const lastMark = val.markInputs[last].markId
        val.markInputs.forEach((item, index) => {
          counter += Number(item.markMax)

          const mc = this.lookups.mark_categories.find(element => element.id === item.markCategoryId)
          if (mc) {
           
            this.marks[item.markCategoryId] = mc.marks
          } else {
            this.marks[item.markCategoryId] = []
          }
        })
        this.count = counter
        for (let i = 0; i < last; i++) {
          if (val.markInputs[i].markId != null && val.markInputs[last].markId != null) {
            if ((val.markInputs[i].markId == val.markInputs[last].markId) && (val.markInputs[i].markCategoryId == val.markInputs[last].markCategoryId)) {
              this.$swal({
                icon: 'error',
                title: this.$i18n.locale === 'en' ? 'Wrong Mark Item' : 'خطا في الدرجة',
                text: this.$i18n.locale === 'en' ? 'This Mark Item is already exist' : 'هذه الدرجة موجودة بالفعل',
                showConfirmButton: false,
                timer: 3000,
              })
              val.markInputs[last].markId = null
            }
          }
        }
      },
      deep: true,

    },  */
    /*  'form.markInputs': function (newValue) {
      let counter = 0
      newValue.forEach(mark=>{
        if(mark.markMax)
        {
          count+=num(mark.markMax)
        }
      })
      this.count = counter
    }, */
    form: {
      handler(val) {
        const ob = this;
        let counter = 0;

        val.offeringMarks.forEach((item, index) => {
          //counter += Number(item.markMax)
          let count = 0;

          /*  if(this.students_count > 0 && (this.editable == "false") )
          {
            this.$swal({
              icon: 'error',
              title: this.$i18n.locale === 'en' ? 'You Can\'t Edit Mark' : 'لا يمكنك تعديل الدرجة ',
              text: this.$i18n.locale === 'en' ? 'This Offering Has Students, Please Remove thier marks first' : 'هذا المقرر به طلاب ، يرجى إزالة درجاتهم أولاً',
              showConfirmButton: false,
              timer: 3000,
            })
            
          } */

          if (item.marks.length > 0) {
            item.marks.forEach((mark) => {
              if (mark.value) {
                count += Number(mark.value);
              }
            });
          }
          item.sum = Number(count);
          /*  if(Number(count)> item.max_category)
          {
              this.$swal({
              icon: 'error',
              title: this.$i18n.locale === 'en' ? 'Wrong In Marks' : 'خطا في الدرجات',
              text: this.$i18n.locale === 'en' ? 'Total Marks Exceed Maximum Total' : 'مجموع الدرجات تخطي القيمة العظمة',
              showConfirmButton: false,
              timer: 3000,
            })
          } */
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      editable: "true",
      students_count: 0,
      marks: [],
      form: {
        total_marks: 0,
        linked_offering: null, // main offering
        linked_exam_offering: null,
        marks: [],
        course_id: null,
        faculty_id: null,
        bylaw_id: null,
        term_id: null,
        max_total: null,
        offeringMarks: [
          {
            pivot_id: null,
            category_id: null,
            max_category: null,
            name: null,
            sum: 0,
            marks: [
              {
                name: null,
                value: null,
                short_name: null,
              },
            ],
          },
        ],
      },
      filter: { bylaw_id: 0 },
      lookups: [],
      lookupModules: {
        bylaws: true,
        terms: true,
        faculties: true,
        linked_offerings: true,
      },
      form_submit: {},
      get_programs: [],
      init_programs: [],
      init_bylaws: null,
      init_terms: null,
      init_faculties: null,
      selected_programs: [],
      custom_label: null,
      disable_inputs: false,
      category_item_marks: null,
      term_id: null,
      load: false,
      form2: {}, // to concat data from offering details api and data from mark gatefories api
      count: 0,
      course_name: null,
      course_code: null,
      course_name_local: null,
      offeringGradesHeader: null,
      offeringStudentsGrades: null,
      errorsdata: {},
      FilteredLinkedOffering: [],
      overlay:true,
    };
  },
  mounted() {
    //this.getLookups(this.lookupModules)
    //this.getItem(this.id)
    this.init();

    //this.getOfferings({ query: '' })
    //this.form.max_total = this.item.course.max_total ? this.item.course.max_total : null
    //this.students_count = this.$route.query.students_count
    //this.editable = this.$route.query.editable
  },
  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
      getItem: "offerings/get",
      submitItem: "offerings/put",
      getOfferings: "offerings/offerings",
      //getPrograms: 'programs/programs',
      offering_mark: "offerings/offering_mark",
    }),
    linkedOffering(offering_id, linked_offering) {
      let data = [];
      linked_offering.map((item) => {
        if (item.id != offering_id) {
          let name = item.course.code + " " + item.course.name;
          let name_local = item.course.code + " " + item.course.name_local;
          let instance = {
            name: name,
            name_local: name_local,
            id: item.id,
          };
          data.push(instance);
        }
      });
      /*  let positive_array = linked_offering.filter(function (value) {
        return value.id != offering_id;
      }); */
      this.FilteredLinkedOffering = data;

    },
    getMarksFromCategory(index, category_id) {
    },
    checkValue() {

      if (this.students_count > 0 && this.editable == "false") {
        this.$swal({
          icon: "error",
          title:
            this.$i18n.locale === "en"
              ? "You Can't Edit Mark"
              : "لا يمكنك تعديل الدرجة ",
          text:
            this.$i18n.locale === "en"
              ? "This Offering Has Students, Please Remove thier marks first"
              : "هذا المقرر به طلاب ، يرجى إزالة درجاتهم أولاً",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
    addNewMark(index) {
      /*  this.form.markInputs.push({
        markId: null,
       // markCategoryId: null,
        markMax: null,
      }) */
      this.form.offeringMarks[index].marks.push({
        name: null,
        value: null,
      });
      // this.testCounter.push(1)
    },
    remove(k, index) {
      // this.form.markInputs.splice(index, 1)
      this.form.offeringMarks[k].marks.splice(index, 1);
    },
    // mergeData(event) {
    // },
    /*  fetchOptions(search) {
      let query
      if (search) {
        query = { keywords: search || '' }
      }
      this.getPrograms({ query })
    }, */

    fetchOfferings(search) {
      let query;
      if (search) {
        query = { keywords: search || "" };
      }
      this.$store.dispatch("offerings/offerings", { query });
    },
    /*  fetchUsers(search) {
      let query
      if (search) {
        query = { keywords: search || '' }
      }
      // this.$store.dispatch('users/users', { query })
      this.$store.dispatch('instructors/instructors', { query })
    }, */

    init() {
      this.load = true;
      //this.students_count = this.$route.query.students_count
      //this.editable = this.$route.query.editable
      //  this.fetchUsers('')
      this.getOfferings({ query: "" });
      if (this.id) {
        this.offering_mark(this.id).then((data) => {
          this.offeringGradesHeader = data.offeringGradesHeader;
          this.offeringStudentsGrades = data.offeringStudentsGrades;
          if (data.offeringStudentsGrades != null) {
            this.offeringStudentsGrades.forEach((element) => {

              if (element.registration_marks.length > 0) {

                element.registration_marks.forEach((el) => {
                  if (el.pivot.value != null) {
                    //so there is grade you can't edit marks
                    this.editable = "false";
                  }
                });
              }
            });
          }
        });

        this.getItem(this.id).then((value) => {
          this.lookupModules = {
            ...this.lookupModules,
            ...{ bylaw_id: this.item.course.bylaw_id },
          };
          this.overlay=false
          this.getLookups(this.lookupModules).then((data) => {
            this.lookups = data.success;
            this.linkedOffering(this.id, this.lookups.linked_offerings);
          });

          this.form.course_id = this.item.course.id;
          this.form.faculty_id = this.item.course.faculty.id;
          this.form.term_id = this.item.term.id;
          this.form.bylaw_id = this.item.course.bylaw.id;
          this.form.linked_offering = this.item.linked_offering
            ? this.item.linked_offering
            : null;
          this.form.linked_exam_offering = this.item.linked_offering
            ? this.item.linked_offering
            : null;

          this.course_name = this.item.course.name;
          this.course_name_local = this.item.course.name_local;
          this.faculty_name = this.item.course.faculty.name;
          this.faculty_name_local = this.item.course.faculty.name_local;
          this.course_code = this.item.course.code;

          this.students_count = this.item.students_count;

          this.from.max_total = this.item.max_total;

          this.term_id = this.item.term.id;
          this.load = false;



          //////////////////////////////////////
          
          if (this.item.markCategories != null) {
            let total_marks = 0;
            this.form.offeringMarks = [];
            this.item.markCategories.forEach((category) => {
              let db = {};
              db.pivot_id = category.pivot.id;
              db.category_id = category.id;
              db.name = this.$i18n.locale == "en" ? category.name : category.name_local;
              //db.max_category = category.pivot.max_category;
              db.marks = [];
              db.sum = 0;

              //total_marks += category.pivot.max_category;

              this.form.offeringMarks.push(db);
            });
            this.form.total_marks = total_marks;

            ///////loop
           /*  let grades = [];
            if (this.item.offeringMarkCategories != null) {
              this.item.offeringMarkCategories.forEach((categ) => {
                categ.offering_marks.forEach((e) => {
                  let db2 = {};
                  db2.name = e.name;
                  //db2.name_local=e.name_local
                  db2.short_name = e.short_name;
                  db2.value = e.max_mark;
                  db2.category_id = categ.mark_category_id;
                  grades.push(db2);
                });
              });
            }
            if (grades != null) {
              this.form.offeringMarks.forEach((mark) => {
                grades.forEach((grade) => {
                  if (mark.category_id == grade.category_id)
                    mark.marks.push(grade);
                });
              });
            } */
            ////////////////////
          }

          /*   if (this.item.instructors) {
              this.item.instructors.forEach(instructor => {
                if (instructor.role === 'teacher') {
                  this.form.teachers.push(instructor)
                } else if (instructor.role === 'teaching assistant') {
                  this.form.teachingAssistant.push(instructor)
                } else if (instructor.role === 'coordinator') {
                  this.form.coordinators.push(instructor)
                  // this.form.coordinators == this.item.instructors
                } else if (instructor.role === 'external committee') {
                  this.form.examiners.push(instructor)
                }
              })
            } */
        });
      }
      //to check if this offering's mark setup can be edited or not /////////////////////////////
      if (this.offeringStudentsGrades != null) {
        this.offeringStudentsGrades.forEach((element) => {

          if (element.registration_marks.length > 0) {

            element.registration_marks.forEach((el) => {
              if (el.pivot.value != null) {
                //so there is grade you can't edit marks
                this.editable = "false";
              }
            });
          }
        });
      }
      ////////////////////////////////////////////////////////

      /*  this.offering_marks(this.id).then(val => {
        this.offeringGradesHeader = val.offeringGradesHeader
        //this.form.markInputs = []
        this.offeringGradesHeader.forEach(e => {
          const db = {}
          //db.markId = e.mark.id
          //db.markCategoryId = e.mark.mark_category_id
          //db.markMax = e.max
          //this.count += e.max
          //this.form.markInputs.push(db)

          const data = {}
          //data.category_id = e.mark.mark_category_id
        })
      }) */
    },
    submit() {
      let offeringMarkInputs = [];
      let submit = false;

      //////////////////////////
      if (this.editable == "true") {
        if (this.form.offeringMarks) {
          this.form.offeringMarks.forEach((mark) => {
            mark.marks.forEach((element) => {
              const db = {};
              db.offering_mark_category_id = mark.pivot_id;
              db.name = element.name;
              db.short_name = element.short_name;
              db.max_mark = element.value;
              offeringMarkInputs.push(db);
            });
            if (mark.max_category < mark.sum) {
              submit = false;
              this.$swal({
                icon: "error",
                title:
                  this.$i18n.locale === "en"
                    ? "Wrong In Marks"
                    : "خطا في الدرجات",
                text:
                  this.$i18n.locale === "en"
                    ? "Total Marks Exceed Maximum Total"
                    : "مجموع الدرجات تخطي القيمة العظمي",
                showConfirmButton: false,
                timer: 3000,
              });
            } else if (mark.max_category > mark.sum) {
              submit = false;
              this.$swal({
                icon: "error",
                title:
                  this.$i18n.locale === "en"
                    ? "Wrong In Marks"
                    : "خطا في الدرجات",
                text:
                  this.$i18n.locale === "en"
                    ? "Total Marks less than Maximum Total"
                    : "مجموع الدرجات اقل من القيمة العظمي",
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              submit = true;
            }
          });
        }

        if (submit == true) {
          this.$refs.simpleRules.validate().then((success) => {
            if (success) {
              let query = {};
              query = {
                course_id: this.form.course_id,
                term_id: this.term_id,
                linked_offering_id: this.form.linked_offering
                  ? this.form.linked_offering
                  : null,
                linked_exam_offering_id: this.form.linked_offering
                  ? this.form.linked_offering
                  : null,
                offeringMarkInputs: JSON.stringify(offeringMarkInputs),
              };
              const payload = { id: this.id, query };
              this.overlay= true
              this.submitItem(payload).then((response) => {
                this.overlay = false
                if (response.status === "success") {
                  this.$swal({
                    icon: "success",
                    title:
                      this.$i18n.locale === "en"
                        ? "Offering Edited!"
                        : "تم تعديل المفرر ",
                    text:
                      this.$i18n.locale === "en"
                        ? "Offering Edited Successfully."
                        : "تم تعديل المقرر بنجاح",
                    showConfirmButton: false,
                    timer: 3000,
                  });
                  this.$router.push({
                    name: "offering",
                    params: { id: this.id },
                  });
                } else {
                }
              });
            } else {
            }
          });
        }
      } else if (submit == false && this.editable == "false") {
        this.$refs.simpleRules.validate().then((success) => {
          if (success) {
            let query = {};
            let offeringMarkInputs = [];
            query = {
              course_id: this.form.course_id,
              term_id: this.term_id,
              linked_offering_id: this.form.linked_offering
                ? this.form.linked_offering
                : null,
              linked_exam_offering_id: this.form.linked_offering
                ? this.form.linked_offering
                : null,
              offeringMarkInputs: JSON.stringify(offeringMarkInputs),
            };

            const payload = { id: this.id, query };
            this.submitItem(payload).then((response) => {
              if (response.status === "success") {
                this.$swal({
                  icon: "success",
                  title:
                    this.$i18n.locale === "en"
                      ? "Offering Edited!"
                      : "تم تعديل المفرر ",
                  text:
                    this.$i18n.locale === "en"
                      ? "Offering Edited Successfully."
                      : "تم تعديل المقرر بنجاح",
                  showConfirmButton: false,
                  timer: 3000,
                });
                this.$router.push({
                  name: "offering",
                  params: { id: this.id },
                });
              } else {
              }
            });
          } else {
          }
        });
      }
      /////////////////////////

      /*    if(submit == true){
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
           let query = {}
         if(this.editable == "true")
         {
            query = {
            course_id: this.form.course_id,
            term_id: this.term_id,        
            linked_offering_id: this.form.linked_offering ? this.form.linked_offering: null,
            linked_exam_offering_id: this.form.linked_offering ? this.form.linked_offering: null,           
            offeringMarkInputs : JSON.stringify(offeringMarkInputs),
          }

         }
         else if(this.editable == "false"){
          let offeringMarkInputs =[]
            query = {
            course_id: this.form.course_id,
            term_id: this.term_id,
            linked_offering_id: this.form.linked_offering ? this.form.linked_offering: null,
            linked_exam_offering_id: this.form.linked_offering ? this.form.linked_offering: null,
            offeringMarkInputs : JSON.stringify(offeringMarkInputs),
          
          }

         }
          const payload = { id: this.id, query }
          this.submitItem(payload).then(response => {
            if (response.status === 'success') {
              this.$swal({
                icon: 'success',
                title: 'Offering Edited!',
                text: 'Offering Edited Successfully.',
                showConfirmButton: false,
                timer: 3000,
              })
              this.$router.push({ name: 'offering', params: { id: this.id } })
            }
            else{
            }
          })
        }
        else { 
        }
      }) 
      } */
    },
    changedBylawId(program_id) {
      // this.item.program_id = program_id
      this.lookupModules = { ...this.lookupModules, ...this.filter };
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
        this.get_programs = data.success.programs;
        const ids = new Set(this.item.programs.map((d) => d.id));
        this.init_programs = [
          ...this.item.programs,
          ...this.lookups.programs.filter((d) => !ids.has(d.id)),
        ];
        // this.form.programs = this.get_programs
        this.get_programs.forEach((value) => {
          if (this.checkinlist(value, this.init_programs) === false) {
            this.form.programs.push(value);
          }
        });
      });
    },
    checkinlist(item, list) {
      let response = false;
      list.forEach((value) => {
        if (value.id === item.id) {
          response = true;
          return 0;
        }
      });
      return response;
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },

    cancel() {
      if (this.inline) {
        return this.$emit("hide");
      }
      this.$router.push({ name: "offerings" });
    },
  },
};
</script>

<style scoped></style>
