<template>
  <div>
    <statistics
        :name="item.faculty"
        title="faculty"
        :items="itemData"
        :only="[
        'courses_count',
        'programs_count',
        'current_count',
        'graduated_count',
      ]"
    />
    <!-- <Courses v-if="paramsCourse" :editParams="paramsCourse"  no-status :bylaw_id="id" :inline="true" /> -->
    <b-card class="mb-0 custom_margin">
      <!-- <div v-if="edit">
                      <b-card-header class="flex-wrap text-initial mx-1_3" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; padding-left: 0rem">
                        <div v-if="edit" class="d-flex align-items-center">
                          <feather-icon icon="EditIcon" size="16" />
                          <strong class="mx-1">
                            {{ $t('Global.bylaw_edit') }}
                          </strong>
                          <slot name="status" />
                        </div>
                      </b-card-header>
                      <hr class="mt-0" />
                    </div> -->
      <b-tabs
          v-model="tabIndex"
          @input="saveStatus"
          vertical
          nav-wrapper-class="nav-hidden"
          align="left"
      >
        <div
            class="custom_drop mb-2"
            v-if="
            $store.getters['app/width'] < 982 &&
            $store.getters['app/width'] != 0
          "
            :class="!rerender ? 'py-3' : ''"
        >
          <b-dropdown
              block
              :text="
              $store.getters['app/updateSelectedTab']
                ? $store.getters['app/updateSelectedTab'].name
                : ''
            "
              variant="primary"
          >
            <b-dropdown-item
                :key="tab.id"
                @click="
                setSelectedTab(tab);
                tabIndex = tab.id;
              "
                v-for="tab in $store.getters['app/dropArray']"
            >
              {{ tab.name }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <b-tab :class="saveLoad ? 'disabled_all' : ''">
          <template #title>
            <feather-icon icon="InfoIcon"/>
            <span> {{ $t("Global.basic_info") }} </span>
          </template>
          <Edit
              v-if="edit"
              :data="
              id
                ? item
                : {
                    code: '',
                    name_local: '',
                    name: '',
                    id: '',
                    start_year: '',
                    faculty: '',
                    flag: '',
                    types: '',
                    stage: '',
                    type: '',
                    training_required: '',
                  }
            "
              :inline="true"
              @hide="cancel()"
              @refresh="init"
          />
          <div v-else>
            <ShowComponent
                v-if="item"
                :data="item"
                :only="[
                'code',
                'name_local',
                'name',
                'id',
                'start_year',
                'faculty',
                'flag',
                'types',
                'stage',
                'type',
                'training_required',
              ]"
                :loading="load"
            >
              <template #edit>
                <div class="mb-2 d-flex justify-content-between w-100">
                  <div>
                    <b-form-checkbox
                        v-if="hasPermission('add_to_admission_bylaw')"
                        v-model="addToAdmission"
                        name="check-button"
                        switch
                    >
                      {{ $t("Global.add_to_admission") }}
                    </b-form-checkbox>
                  </div>

                  <feather-icon
                      v-b-tooltip.hover="$t('Global.edit')"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3"
                      @click="openEdit()"
                      v-if="!edit && hasPermission('edit_bylaw')"
                  />
                </div>
              </template>
              <template #stage="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.stage`) }}
                </th>
                <td>
                  <div>
                    <span>
                      {{
                        $i18n.locale == "ar"
                            ? data.stage.name_local
                            : data.stage.name
                      }}
                    </span>
                  </div>
                </td>
              </template>
              <template #type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.type`) }}
                </th>
                <td>
                  <div>
                    <span>
                      {{
                        $i18n.locale == "ar"
                            ? data.type.name_local
                            : data.type.name
                      }}
                    </span>
                  </div>
                </td>
              </template>
              <!--                            <template #types="{ data }">-->
              <!--                                <th scope="row" :width="'20%'">-->
              <!--                                    {{ $t(`Global.type`) }}-->
              <!--                                </th>-->
              <!--                                <td >-->
              <!--                                    <div v-for="type in data.types" :key="type">-->
              <!--                                        <span> {{ $i18n.locale == 'ar' ? type.name_local : type.name }} , </span>-->
              <!--                                    </div>-->
              <!--                                </td>-->
              <!--                            </template>-->
              <!-- <template #levels="{ data }">
                                                  <th scope="row" :width="'20%'">
                                                    {{ $t(`Global.levels`) }}
                                                  </th>
                                                  <td >
                                                    <div v-for="level in data.levels" :key="level">
                                                      <span>
                                                        {{ $i18n.locale == 'ar' ? level.name_local : level.name }} </span
                                                      >,
                                                    </div>
                                                  </td>
                                                </template> -->
              <template #faculty="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.faculty`) }}
                </th>

                <td>
                  <b-link
                      target="_blank"
                      v-if="data.faculty"
                      :to="{ name: 'faculty', params: { id: data.faculty.id } }"
                      class="font-weight-bold d-block"
                  >
                    {{
                      $i18n.locale == "en"
                          ? data.faculty.name
                          : data.faculty.name_local
                    }}
                  </b-link>
                </td>
              </template>
              <template #code="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.code`) }}
                </th>

                <td>
                  {{ data.code }}
                </td>
              </template>
              <template #name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>

                <td>
                  {{ data.name }}
                </td>
              </template>
              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td>
                  {{ data.name_local }}
                </td>
              </template>
              <template #id="{ data }">
                <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                  {{ $t(`Global.name_local`) }}
                </th>

                <td v-if="$i18n.locale == 'en'">
                  {{ data.name_local }}
                </td>

                <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">
                  الاسم بالانجليزية
                </th>
                <td v-if="$i18n.locale == 'ar'">
                  {{ data.name }}
                </td>
              </template>
              <template #start_year="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.start_year`) }}
                </th>

                <td>
                  <span>{{ data.start_year }}</span>
                </td>
              </template>
              <template #training_required="{ data }" v-if="checkChAndUG">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.training_required`) }}
                </th>
                <td>
                  {{ data.training_required ? "true" : "false" }}
                </td>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
        <b-tab v-if="item.type_id != 2 && id">
          <template #title>
            <feather-icon icon="SettingsIcon"/>
            <span>{{ $t("Global.ch_settings") }}</span>
          </template>
          <template>
            <edit-setting
                v-if="setting_edit"
                :data="
                id
                  ? item
                  : {
                      min_percentage_final_exam: '',
                      min_training_weeks: '',
                      max_warnings: 1,
                      min_gpa_for_graduation: '',
                    }
              "
                :inline="true"
                @hide="cancelSetting()"
                @refresh="init"
            ></edit-setting>
            <div v-else>
              <ShowComponent
                v-if="item"
                :data="item"
                :only="[
                  'min_percentage_final_exam',
                  'min_training_weeks',
                  'warning_type',
                  'max_warnings',
                  'min_gpa_for_graduation',
                  'max_grade_after_improve',
                  'last_or_highest_improve_grade',
                  'failure_overwrites_success',
                ]"
                :loading="load"
              >
                <template #edit>
                  <div class="mb-2">
                    <feather-icon
                        v-b-tooltip.hover="$t('Global.edit')"
                        style="cursor: pointer"
                        icon="EditIcon"
                        class="font-medium-3"
                        @click="openSettingEdit()"
                        v-if="!setting_edit && hasPermission('edit_bylaw')"
                    />
                  </div>
                </template>
                <template #min_percentage_final_exam="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.min_percentage_final_exam`) }}
                  </th>
                  <td>
                    <div>
                      <span> {{ data.min_percentage_final_exam }} </span>
                    </div>
                  </td>
                </template>
                <template #min_training_weeks="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.min_training_weeks`) }}
                  </th>
                  <td>
                    <div>
                      <span> {{ data.min_training_weeks }} </span>
                    </div>
                  </td>
                </template>
                <template #min_gpa_for_graduation="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.min_gpa_for_graduation`) }}
                  </th>
                  <td>
                    <div>
                      <span> {{ data.min_gpa_for_graduation }} </span>
                    </div>
                  </td>
                </template>
                <template #warning_type="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.warning_type`) }}
                  </th>
                  <td>
                    <div>
                      <span>
                          {{
                          data.warning_type
                            ? $i18n.locale == "ar"
                              ? data.warning_type.name_local
                              : data.warning_type.name
                            : ""
                              }}
                        </span>
                    </div>
                  </td>
                </template>
                <template #max_warnings="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.max_warnings`) }}
                  </th>
                  <td>
                    <div>
                      <span>
                        {{ data.max_warnings }} ({{
                          $t("Global.max_warnings_hint")
                        }})
                      </span>
                    </div>
                  </td>
                </template>
                <template #max_grade_after_improve="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.max_grade_after_improve`) }}
                  </th>
                  <td>
                    <div>
                      <span> {{
                          data.max_grade_after_improve ? getTranslatedName(data.max_grade_after_improve) : ""
                        }}</span>
                    </div>
                  </td>
                </template>
                <template #last_or_highest_improve_grade="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.last_or_highest_improve_grade`) }}
                  </th>
                  <td>
                    <div>
                      <span> {{
                          data.last_or_highest_improve_grade ? getTranslatedName(data.last_or_highest_improve_grade)
                            : ""
                        }}</span>
                    </div>
                  </td>
                </template>
                <template #failure_overwrites_success="{ data }">
                  <th scope="row" :width="'40%'">
                    {{ $t(`Global.failure_overwrites_success`) }}
                  </th>
                  <td>
                    <div>
                      <span>
                        {{
                          data.failure_overwrites_success
                            ? $t("Global.yes")
                            : $t("Global.no")
                        }}</span
                      >
                    </div>
                  </td>
                </template>
              </ShowComponent>
            </div>

            <TabTable
              no-details
              head
              class="mt-2"
              @add="addSuccess"
              :title2="$t('Global.grade_scheme')"
              :loading="load"
              :fields="grade_scheme_fields"
              :customName="true"
              :grade_scheme="true" :items="item.grads_types" @update="updateGrades"
                      @refresh="init">
              <template #name>
                <div class="mx-2 my-1">
                  {{ item.grads_types.name }}
                </div>
              </template>
              <template #action>
                <!-- <strong>{{ $t('Global.add_grade') }}</strong> -->
                <b-button
                    v-b-tooltip.hover="$t('Global.add')"
                    v-if="hasPermission('edit_bylaw')"
                    variant="primary"
                    class="btn-icon"
                    @click="openDialog()"
                >
                  <feather-icon icon="PlusIcon"/>
                </b-button>
                <!--                                </div>-->
              </template>
            </TabTable>
            <template v-for="(gradeType, index) in item.other_grade_types">
              <b>{{ gradeType.name }}:</b> {{ regMap[gradeType.code] }}
              {{ index + 1 < item.other_grade_types.length ? ", " : "" }}
            </template>
            <TabTable
                no-details
                head_grade
                settings
                :title2="$t('Global.credit_hours_message')"
                class="mt-2"
                :loading="load"
                :fields="cardinals_fields"
                :items="item.ranges"
                @update="updateGradesRange"
                @refresh="init"
                @remove="removeRange"
            >
              <template #action>
                <div
                    class="px-2 w-50"
                    v-b-tooltip.hover="
                    $t('Global.semester_to_start_applying_this_rule')
                  "
                >
                  <b-form-group label-for="grade">
                    <v-select
                        :placeholder="
                        $t('Global.semester_to_start_applying_this_rule')
                      "
                        :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                        v-model="gradesSemesterForm.grades_semester"
                        :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        class="w-100"
                        clearable
                        :reduce="(val) => val"
                    >
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                  </b-form-group>
                </div>
                <div>
                  <b-button
                      v-b-tooltip.hover="$t('Global.add')"
                      v-if="hasPermission('edit_bylaw')"
                      variant="primary"
                      class="btn-icon"
                      @click="openRangeDialog()"
                  >
                    <feather-icon icon="PlusIcon"/>
                  </b-button>
                </div>
              </template>
            </TabTable>

            <TabTable
                no-details
                head
                class="mt-2"
                remove_grades
                :title2="$t('Global.success_mix_grade')"
                :loading="load"
                :fields="grades_fields"
                :items="item.success_grades"
                @refresh="init"
                @update="openSuccessDialog"
                @minus_grades="removeSuccess"
            >
              <template #action>
                <div
                  v-if="item.success_grades && item.success_grades.length <= 1"
                >
                  <b-button
                    v-b-tooltip.hover="$t('Global.add')"
                    v-if="hasPermission('edit_bylaw')"
                    variant="primary"
                    class="btn-icon"
                    @click="openSuccessDialog()"
                  >
                    <feather-icon icon="PlusIcon" />
                  </b-button>
                </div>
              </template>
            </TabTable>

            <TabTable
                no-details
                head
                settings
                class="mt-2"
                :title2="$t('Global.student_levels')"
                :loading="load"
                :fields="level_fields"
                :items="item.levels"
                @refresh="init"
                @update="openLevelDialog"
                @remove="removeLevel"
            >
              <template #action>
                <div>
                  <b-button
                      v-b-tooltip.hover="$t('Global.add')"
                      v-if="hasPermission('edit_bylaw')"
                      variant="primary"
                      class="btn-icon"
                      @click="openLevelDialog(null)"
                  >
                    <feather-icon icon="PlusIcon"/>
                  </b-button>
                </div>
              </template>
            </TabTable>
          </template>
        </b-tab>

        <b-tab v-if="item.type_id == 2 && id">
          <template #title>
            <feather-icon icon="SettingsIcon"/>
            <span>{{ $t("Global.grades_settings") }}</span>
          </template>
          <!--          <div class="d-flex justify-content-end align-items-center">-->
          <!--            &lt;!&ndash; <strong>{{ $t('Global.add_grade') }}</strong> &ndash;&gt;-->
          <!--            <b-button v-b-tooltip.hover="$t('Global.add')" v-if="hasPermission('edit_bylaw')" variant="primary" class="btn-icon" @click="openDialog()">-->
          <!--              <feather-icon icon="PlusIcon" />-->
          <!--            </b-button>-->
          <!--          </div>-->

          <edit-setting
              v-if="setting_edit"
              :data="
              id
                ? item
                : { min_percentage_final_exam: '', max_courses_for_fail: '' }
            "
              :inline="true"
              @hide="cancelSetting()"
              @refresh="init"
          ></edit-setting>
          <div v-else>
            <ShowComponent
                v-if="item"
                :data="item"
                :only="[
                'min_percentage_final_exam',
                ...(item.type_id == 2 ? ['max_courses_for_fail'] : []),
              ]"
                :loading="load"
            >
              <template #edit>
                <div class="mb-2">
                  <feather-icon
                      v-b-tooltip.hover="$t('Global.edit')"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3"
                      @click="openSettingEdit()"
                      v-if="!setting_edit && hasPermission('edit_bylaw')"
                  />
                </div>
              </template>
              <template #min_percentage_final_exam="{ data }">
                <th scope="row" :width="'40%'">
                  {{ $t(`Global.min_percentage_final_exam`) }}
                </th>
                <td>
                  <div>
                    <span> {{ data.min_percentage_final_exam }} </span>
                  </div>
                </td>
              </template>
              <template #max_courses_for_fail="{ data }">
                <th scope="row" :width="'40%'">
                  {{ $t(`Global.max_courses_for_fail`) }}
                </th>
                <td>
                  <div>
                    <span> {{ data.max_courses_for_fail }} </span>
                  </div>
                </td>
              </template>
            </ShowComponent>
          </div>
          <TabTable
              no-details
              head
              class="mt-2"
              @add="addSuccess"
              :title2="$t('Global.grade_scheme')"
              :loading="load"
              :fields="grades_fields.filter((x) => x.key != 'gpa')"
              :items="item.grads_types"
              @update="updateGrades"
              @refresh="init"
          />

          <TabTable
              no-details
              head
              settings
              class="mt-2"
              :title2="$t('Global.student_levels')"
              :loading="load"
              :fields="
              level_fields.filter(
                (x) => x.key == 'level_name' || x.key == 'actions'
              )
            "
              :items="item.levels"
              @refresh="init"
              @update="openLevelDialog"
              @remove="removeLevel"
          >
            <template #action>
              <div>
                <b-button
                    v-b-tooltip.hover="$t('Global.add')"
                    v-if="hasPermission('edit_bylaw')"
                    variant="primary"
                    class="btn-icon"
                    @click="openLevelDialog(null)"
                >
                  <feather-icon icon="PlusIcon"/>
                </b-button>
              </div>
            </template>
          </TabTable>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="ListIcon"/>
            <span>{{ $t("Global.courses") }}</span></template
          >
          <template>
            <Courses
                :course_stage="item.stage_id"
                :course_type="item.type_id"
                :tabNum="3"
                no-status
                :bylaw_id="id"
                :excel_name="item.name"
                :faculty_id="faculty_id"
                :faculty_id_course="item.faculty_id"
                :inline="true"
            />
          </template>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="CommandIcon"/>
            <span>{{ $t("Global.university_requirements") }}</span></template
          >
          <template>
            <div>
              <div
                  class="bg-gray p-1"
                  style="
                  background-color: #f3f2f7 !important;
                  padding-left: 2rem !important;
                  padding-right: 2rem !important;
                "
              >
                <div class="d-flex justify-content-between">
                  <strong class="font-medium-3">
                    {{ $t("Global.mandatory_courses") }}
                  </strong>

                  <div v-if="hasPermission('edit_bylaw')">
                    <feather-icon
                        v-if="
                        item.university_requirements &&
                        item.university_requirements.length > 0
                      "
                        icon="EditIcon"
                        @click="
                        openMandatoryCourses(item.university_requirements, 1)
                      "
                        class="text-primary mx-1 font-medium-2"
                        style="cursor: pointer"
                    />

                    <b-button
                        v-else
                        v-b-tooltip.hover="$t('Global.mandatory_courses')"
                        @click="
                        openMandatoryCourses(item.university_requirements, 1)
                      "
                        variant="primary"
                        class="btn-icon"
                    >
                      <feather-icon icon="PlusIcon"/>
                    </b-button>
                  </div>
                </div>
              </div>
              <b-table
                  outlined
                  :empty-text="$t('Global.empty_text')"
                  show-empty
                  :items="item.university_requirements"
                  :fields="fields"
                  striped
                  responsive="sm"
              >
                <template #cell(name)="data">
                  <b-link
                      :to="{ name: 'course', params: { id: data.item.id } }"
                  >
                    {{
                      $i18n.locale == "ar"
                          ? data.item.name_local
                          : data.item.name
                    }}
                  </b-link>
                </template>
                <template #cell(pre_requisites)="data">
                  <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                    {{ item.code }}
                    <strong class="text-danger">,</strong>
                  </div>
                </template>
              </b-table>
            </div>
            <div>
              <div
                  class="bg-gray p-1 mb-1 mt-3"
                  style="
                  background-color: #f3f2f7 !important;
                  padding-left: 2rem !important;
                  padding-right: 2rem !important;
                "
              >
                <div class="d-flex justify-content-between align-items-center">
                  <strong class="font-medium-3">
                    {{ $t("Global.pool_of_electives") }}
                  </strong>

                  <b-button
                      v-b-tooltip.hover="$t('Global.pool_of_electives')"
                      @click="openPoolDialog(null, 1)"
                      variant="primary"
                      class="btn-icon"
                  >
                    <feather-icon icon="PlusIcon"/>
                  </b-button>
                </div>
              </div>
              <div :key="i" v-for="(pool, i) in item.university_pools">
                <b-table
                    outlined
                    :empty-text="$t('Global.empty_text')"
                    show-empty
                    :items="pool.courses"
                    :fields="fields"
                    striped
                    responsive="sm"
                >
                  <template #thead-top="data">
                    <b-tr>
                      <b-th variant="warning" colspan="8">
                        <!--                                        <feather-icon icon="StarIcon" class="m-0"/>-->
                        <strong class="text-primary font-medium-2 pb-1">
                          {{
                            $i18n.locale == "ar" ? pool.name_local : pool.name
                          }}
                        </strong>

                        <strong class="mx-3">
                          {{ $t("Global.max_selected_courses") }}
                          ({{ pool.max }})
                        </strong>
                        <strong class="mx-3">
                          {{ $t("Global.min_ch") }}
                          ({{ pool.min_ch }})
                        </strong>
                      </b-th>
                      <b-th
                          variant="warning"
                          colspan="1"
                          class="d-flex justify-content-end"
                      >
                        <div class="mx-1 pb-1">
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.edit')"
                              icon="EditIcon"
                              class="text-primary mx-1 font-medium-2"
                              style="cursor: pointer"
                              v-if="hasPermission('edit_bylaw')"
                              @click="openPoolDialog(pool)"
                          />
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.delete')"
                              icon="Trash2Icon"
                              class="text-danger font-medium-2"
                              style="cursor: pointer"
                              v-if="hasPermission('edit_bylaw')"
                              @click="delete_pool(pool.id)"
                          />
                        </div>
                      </b-th>
                    </b-tr>
                  </template>
                  <template #cell(name)="data">
                    <b-link
                        :to="{ name: 'course', params: { id: data.item.id } }"
                    >
                      {{
                        $i18n.locale == "ar"
                            ? data.item.name_local
                            : data.item.name
                      }}
                    </b-link>
                  </template>
                  <template #cell(pre_requisites)="data">
                    <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                      {{ item.code }}
                      <strong class="text-danger">,</strong>
                    </div>
                  </template>
                </b-table>
              </div>
            </div>
          </template>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="ColumnsIcon"/>
            <span>{{ $t("Global.faculty_requirements") }}</span></template
          >
          <template>
            <div>
              <div
                  class="bg-gray p-1"
                  style="
                  background-color: #f3f2f7 !important;
                  padding-left: 2rem !important;
                  padding-right: 2rem !important;
                "
              >
                <div class="d-flex justify-content-between">
                  <strong class="font-medium-3">
                    {{ $t("Global.mandatory_courses") }}
                  </strong>

                  <div v-if="hasPermission('edit_bylaw')">
                    <feather-icon
                        v-if="
                        item.faculty_requirements &&
                        item.faculty_requirements.length > 0
                      "
                        icon="EditIcon"
                        @click="
                        openMandatoryCourses(item.faculty_requirements, 2)
                      "
                        class="text-primary mx-1 font-medium-2"
                        style="cursor: pointer"
                    />

                    <b-button
                        v-else
                        v-b-tooltip.hover="$t('Global.mandatory_courses')"
                        @click="
                        openMandatoryCourses(item.faculty_requirements, 2)
                      "
                        variant="primary"
                        class="btn-icon"
                    >
                      <feather-icon icon="PlusIcon"/>
                    </b-button>
                  </div>
                </div>
              </div>
              <b-table
                  outlined
                  :empty-text="$t('Global.empty_text')"
                  show-empty
                  :items="item.faculty_requirements"
                  :fields="fields"
                  striped
                  responsive="sm"
              >
                <template #cell(name)="data">
                  <b-link
                      :to="{ name: 'course', params: { id: data.item.id } }"
                  >
                    {{
                      $i18n.locale == "ar"
                          ? data.item.name_local
                          : data.item.name
                    }}
                  </b-link>
                </template>
                <template #cell(pre_requisites)="data">
                  <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                    {{ item.code }}
                    <strong class="text-danger">,</strong>
                  </div>
                </template>
              </b-table>
            </div>
            <!--                        ////-->
            <div>
              <div
                  class="bg-gray p-1 mb-1"
                  style="
                  background-color: #f3f2f7 !important;
                  padding-left: 2rem !important;
                  padding-right: 2rem !important;
                "
              >
                <div class="d-flex justify-content-between">
                  <strong class="font-medium-3">
                    {{ $t("Global.pool_of_electives") }}
                  </strong>

                  <b-button
                      v-b-tooltip.hover="$t('Global.pool_of_electives')"
                      @click="openPoolDialog(null, 2)"
                      variant="primary"
                      class="btn-icon"
                  >
                    <feather-icon icon="PlusIcon"/>
                  </b-button>
                </div>
              </div>
              <div :key="i" v-for="(pool, i) in item.faculty_pools">
                <b-table
                    outlined
                    :empty-text="$t('Global.empty_text')"
                    show-empty
                    :items="pool.courses"
                    :fields="fields"
                    striped
                    responsive="sm"
                >
                  <template #thead-top="data">
                    <b-tr>
                      <b-th variant="warning" colspan="8">
                        <!--                                        <feather-icon icon="StarIcon" class="m-0"/>-->
                        <strong class="text-primary font-medium-2 pb-1">
                          {{
                            $i18n.locale == "ar" ? pool.name_local : pool.name
                          }}
                        </strong>

                        <strong class="mx-3">
                          {{ $t("Global.max_selected_courses") }}
                          ({{ pool.max }})
                        </strong>
                        <strong class="mx-3">
                          {{ $t("Global.min_ch") }}
                          ({{ pool.min_ch }})
                        </strong>
                      </b-th>
                      <b-th
                          variant="warning"
                          colspan="2"
                          class="d-flex justify-content-end"
                      >
                        <div class="mx-1 pb-1">
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.edit')"
                              icon="EditIcon"
                              class="text-primary mx-1 font-medium-2"
                              style="cursor: pointer"
                              v-if="hasPermission('edit_bylaw')"
                              @click="openPoolDialog(pool)"
                          />
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.delete')"
                              icon="Trash2Icon"
                              class="text-danger font-medium-2"
                              style="cursor: pointer"
                              v-if="hasPermission('edit_bylaw')"
                              @click="delete_pool(pool.id)"
                          />
                        </div>
                      </b-th>
                    </b-tr>
                  </template>
                  <template #cell(name)="data">
                    <b-link
                        :to="{ name: 'course', params: { id: data.item.id } }"
                    >
                      {{
                        $i18n.locale == "ar"
                            ? data.item.name_local
                            : data.item.name
                      }}
                    </b-link>
                  </template>
                  <template #cell(pre_requisites)="data">
                    <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                      {{ item.code }}
                      <strong class="text-danger">,</strong>
                    </div>
                  </template>
                </b-table>
              </div>
            </div>
          </template>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="FileTextIcon"/>
            <span>{{ $t("Global.programs") }}</span></template
          >
          <Programs
              :excel_name="item.name"
              :tabNum="4"
              no-status
              :faculty="item.faculty"
              :bylaw_id="id"
              :faculty_id_course="item.faculty_id"
              :inline="true"
          />
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="UserIcon"/>
            <span>{{ $t("Global.students") }}</span></template
          >
          <Students
              v-if="checkTabVisited(6)"
              :tabNum="5"
              no-status
              :bylaw_id="id"
          />
        </b-tab>
        <!-- <b-tab v-if="id">
          <template #title>
            <feather-icon icon="GitPullRequestIcon" />
            <span>{{ $t('Global.programs_tree') }}</span>
          </template>
          <div class="mb-2 text-right">
            <feather-icon
              v-b-tooltip.hover="$t('Global.edit')"
              style="cursor: pointer"
              icon="EditIcon"
              class="font-medium-3"
              @click="openEdit()"
              v-if="!edit && hasPermission('edit_bylaw')"
            />

            <feather-icon
              v-b-tooltip.hover="$t('Global.close')"
              style="cursor: pointer"
              icon="XCircleIcon"
              v-else-if="edit && hasPermission('edit_bylaw')"
              class="font-medium-3"
              @click="cancel"
            />
          </div>
          <BylawProgramsTree :allow-edit="edit" @closeEdit="cancel" />
        </b-tab> -->
        <!-- start new program tree -->
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="GitPullRequestIcon"/>
            <span>{{ $t("Global.programs_tree") }}</span>
          </template>

          <NewProgramsTree/>
          <BylawProgramsTree :allow-edit="edit" @closeEdit="cancel" />
        </b-tab>
        <!-- End New Program Tree -->
        <b-tab v-if="emtyaz" lazy @bv::before="beforeEmtyazTabActivate">
          <template #title>
            <feather-icon icon="BookOpenIcon"/>
            <span>{{ $t("Global.emtyaz") }}</span>
          </template>
          <div>
            <Emtyaz :tabNum="8"></Emtyaz>
          </div>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="ListIcon"/>
            <span>{{ $t("Global.specializations") }}</span></template
          >
          <template>
            <specializations :course_stage="item.stage_id" :course_type="item.type_id" :tabNum="9" no-status
                             :bylaw_id="id" :excel_name="item.name" :faculty_id="faculty_id"
                             :faculty_id_course="item.faculty_id"
                             :inline="true"/>
          </template>
        </b-tab>
        <b-tab v-if="id && item && item.type && item.type.id == 1">
          <template #title>
            <feather-icon icon="EyeIcon" />
            <span>{{ $t("Global.grades_visibility") }}</span>
          </template>
          <div class="mb-2 text-right">
            <feather-icon
              v-b-tooltip.hover="$t('Global.edit')"
              style="cursor: pointer"
              icon="EditIcon"
              class="font-medium-3"
              @click="openEdit()"
              v-if="!edit && hasPermission('edit_bylaw')"
            />

            <feather-icon
              v-b-tooltip.hover="$t('Global.close')"
              style="cursor: pointer"
              icon="XCircleIcon"
              v-else-if="edit && hasPermission('edit_bylaw')"
              class="font-medium-3"
              @click="cancel"
            />
          </div>
          <GradesVisibility :allow-edit="edit" @closeEdit="cancel" />
        </b-tab>
      </b-tabs>
    </b-card>

    <b-modal
        id="modal_success"
        v-model="dialog_success"
        no-close-on-backdrop
        size="sm"
        :title="$t('Global.add_success_grade')"
    >
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group
                  :label="$t('Global.grade')"
                  label-for="grade"
                  invalid-feedback="Name is required"
              >
                <validation-provider #default="{ errors }" name="stage_id">
                  <v-select
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    v-if="item"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="success_form.grade_id"
                    :options="item.grads_types"
                    class="w-100"
                    clearable
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.grade')"
                    :selectable="(val) => !val.disable"
                  >
                    <template v-slot:option="option">
                      {{ option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong>{{ name }}</strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                      default-message
                      :frontend-errors="errors"
                      :backend-errors="
                      getBackendFieldError(errorsdata, 'grade_id')
                    "
                  />
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
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="addSuccess"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="dialog_success = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        id="modalPopover"
        v-model="dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.add_grade')"
    >
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.english_name')" label-for="name">
                <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="english"
                >
                  <b-form-input
                      id="name"
                      v-model="ruleForm.name"
                      :state="errors.length > 0 ? false : null"
                      @keypress="sanitizeEnglish($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6" v-if="item.type_id == 2">
              <b-form-group
                  class="right_left"
                  :label="$t('Global.arabic_name')"
                  label-for="name_local"
              >
                <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="arabic"
                >
                  <b-form-input
                      id="name_local"
                      v-model="ruleForm.name_local"
                      :state="errors.length > 0 ? false : null"
                      @keypress="sanitizeArabic($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6" v-if="item.type_id != 2">
              <b-form-group :label="$t('Global.points')" label-for="GPA">
                <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="between:0,4"
                >
                  <b-form-input
                      id="gpa"
                      v-model="ruleForm.gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.from')"
                  label-for="course_min_percentage"
              >
                <validation-provider
                    #default="{ errors }"
                    name="percentage"
                    rules="between:0,100"
                >
                  <b-form-input
                      id="course_min_percentage"
                      v-model="ruleForm.course_min_percentage"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <!--                        <b-col md="6">-->
            <!--                            <b-form-group :label="$t('Global.to')" label-for="course_max_percentage">-->
            <!--                                <validation-provider #default="{ errors }" name="percentage" rules="between:0,100">-->
            <!--                                    <b-form-input id="course_max_percentage" v-model="ruleForm.course_max_percentage"-->
            <!--                                                  type="number" :state="errors.length > 0 ? false : null"/>-->
            <!--                                    <ValidationErrors :frontend-errors="errors"/>-->
            <!--                                </validation-provider>-->
            <!--                            </b-form-group>-->
            <!--                        </b-col>-->
            <!--            <b-col md="6">-->
            <!--              <b-form-group :label="$t('Global.term_min_percentage')" label-for="term_min_percentage">-->
            <!--                <validation-provider #default="{ errors }" name="percentage" rules="required|between:0,100">-->
            <!--                  <b-form-input id="term_min_percentage" v-model="ruleForm.term_min_percentage" type="number" :state="errors.length > 0 ? false : null" />-->
            <!--                  <ValidationErrors :frontend-errors="errors" />-->
            <!--                </validation-provider>-->
            <!--              </b-form-group>-->
            <!--            </b-col>-->
            <!--            <b-col md="6">-->
            <!--              <b-form-group :label="$t('Global.term_max_percentage')" label-for="term_max_percentage">-->
            <!--                <validation-provider #default="{ errors }" name="percentage" rules="required|between:0,100">-->
            <!--                  <b-form-input id="term_max_percentage" v-model="ruleForm.term_max_percentage" type="number" :state="errors.length > 0 ? false : null" />-->
            <!--                  <ValidationErrors :frontend-errors="errors" />-->
            <!--                </validation-provider>-->
            <!--              </b-form-group>-->
            <!--            </b-col>-->
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
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
                @click="dialog = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        id="modalRange"
        v-model="dialog_range"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.add_Range')"
    >
      <validation-observer ref="range_form">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.min_gpa')" label-for="GPA">
                <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="between:0,4"
                >
                  <b-form-input
                      id="gpa"
                      v-model="rangeForm.min_gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.max_gpa')" label-for="GPA">
                <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="between:0,4"
                >
                  <b-form-input
                      id="gpa"
                      v-model="rangeForm.max_gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.max_ch_value')"
                  label-for="max_ch_value"
              >
                <validation-provider
                    #default="{ errors }"
                    name="max_ch_value"
                    rules="between:0,300"
                >
                  <b-form-input
                      id="max_ch_value"
                      v-model="rangeForm.max_ch_value"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.max_courses')"
                  label-for="max_courses"
              >
                <validation-provider
                    #default="{ errors }"
                    name="max_courses"
                    rules="between:0,30"
                >
                  <b-form-input
                      id="max_courses"
                      v-model="rangeForm.max_courses"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.max_summer_ch_value')"
                  label-for="max_summer_ch_value"
              >
                <validation-provider
                    #default="{ errors }"
                    name="max_summer_ch_value"
                    rules="between:0,300"
                >
                  <b-form-input
                      id="max_summer_ch_value"
                      v-model="rangeForm.max_summer_ch_value"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.max_summer_courses')"
                  label-for="max_summer_courses"
              >
                <validation-provider
                    #default="{ errors }"
                    name="percentage"
                    rules="between:0,30"
                >
                  <b-form-input
                      id="max_summer_courses"
                      v-model="rangeForm.max_summer_courses"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
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
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitSettings"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="dialog_range = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        v-model="level_dialog"
        no-close-on-backdrop
        size="lg"
        :title="
        levelForm && levelForm.name
          ? $t('Global.level_edit')
          : $t('Global.level_add')
      "
    >
      <validation-observer ref="level_form">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.english_name')" label-for="name">
                <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="required|english"
                >
                  <b-form-input
                      v-model="levelForm.name"
                      :state="errors.length > 0 ? false : null"
                      @keypress="isEnglishLettersAndSpace($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  class="right_left"
                  :label="$t('Global.arabic_name')"
                  label-for="name_local"
              >
                <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="required|arabic"
                >
                  <b-form-input
                      v-model="levelForm.name_local"
                      :state="errors.length > 0 ? false : null"
                      @keypress="isArabicLettersAndSpace($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="4" v-if="item.type_id != 2">
              <b-form-group
                  :label="$t('Global.level_number')"
                  label-for="level_number"
              >
                <validation-provider
                    #default="{ errors }"
                    name="level_number"
                    rules="between:0,7"
                >
                  <b-form-input
                      id="level_number"
                      v-model="levelForm.level_number"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="4" v-if="item.type_id != 2">
              <b-form-group :label="$t('Global.from_ch')" label-for="GPA">
                <validation-provider #default="{ errors }" name="GPA">
                  <b-form-input
                      id="gpa"
                      v-model="levelForm.from_ch"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="4" v-if="item.type_id != 2">
              <b-form-group :label="$t('Global.to_ch')" label-for="GPA">
                <validation-provider #default="{ errors }" name="GPA">
                  <b-form-input
                      id="gpa"
                      v-model="levelForm.to_ch"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12" v-if="item.type_id != 2">
              <b-form-group
                  :label="$t('Global.programs')"
                  label-for="grade"
                  invalid-feedback="Name is required"
              >
                <validation-provider #default="{ errors }" name="program_ids">
                  <v-select
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      v-if="item"
                      multiple
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      v-model="levelForm.program_ids"
                      :options="options.programs"
                      class="w-100"
                      clearable
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.programs')"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong>{{
                            $i18n.locale == "ar" ? name_local : name
                          }}</strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                      default-message
                      :frontend-errors="errors"
                      :backend-errors="
                      getBackendFieldError(errorsdata, 'grade_id')
                    "
                  />
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
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="addLevel"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="level_dialog = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        id="modal_pool"
        v-model="pool_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.pool_of_electives')"
    >
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.english_name')" label-for="name">
                <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="english|required"
                >
                  <b-form-input
                      id="name"
                      v-model="poolForm.name"
                      :state="errors.length > 0 ? false : null"
                      @keypress="sanitizeEnglish($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  class="right_left"
                  :label="$t('Global.arabic_name')"
                  label-for="name_local"
              >
                <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="arabic|required"
                >
                  <b-form-input
                      id="name_local"
                      v-model="poolForm.name_local"
                      :state="errors.length > 0 ? false : null"
                      @keypress="sanitizeArabic($event)"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                  :label="$t('Global.max_selected_courses')"
                  label-for="max_selected_courses"
              >
                <validation-provider
                    :name="$t('Global.max_selected_courses')"
                    #default="{ errors }"
                    :rules ="maxSelectedCoursesRules"
                >
                  <b-form-input
                      :disabled="maxDisabled"
                      id="max_selected_courses"
                      v-model="poolForm.max"
                      :state="errors.length > 0 ? false : null"

                  />
                      <!-- @input="calcSemester" -->
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.min_ch')" label-for="min_ch">
                <validation-provider
                    :name="$t('Global.min_ch')"
                    #default="{ errors }"
                    :rules="minSelectedCoursesRules"
                >
                  <b-form-input
                      :disabled="minDisabled"
                      id="min_ch"
                      v-model="poolForm.min_ch"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.number_of_semester')" label-for="no_semester">
                <validation-provider :name="$t('Global.number_of_semester')" #default="{ errors }" :rules="minSelectedCoursesRules">
                  <b-form-input
                                :disabled="minDisabled"
                                id="semester"
                                v-model="poolForm.no_semester"
                                type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <!-- <b-col md="6">
              <b-form-group :label="$t('Global.credit_hours')" label-for="min_equivalent_ects">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="ch"
                                v-model="poolForm.credit_hour" type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.equivalent_ECTS')" label-for="min_equivalent_ects">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_equivalent_ects"
                                v-model="poolForm.min_equivalent_ects" type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.required_SWL')" label-for="min_swl">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_swl" v-model="poolForm.min_swl"
                                type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.lecture_hours')" label-for="min_lecture">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_lecture" v-model="poolForm.min_lecture"
                                type="number" :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.tutorial_hours')" label-for="min_tutorial">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_tutorial" v-model="poolForm.min_tutorial"
                                type="number" :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.laboratory_hours')" label-for="min_lab">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_lab" v-model="poolForm.min_lab"
                                type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.clinical_hours')" label-for="min_clinical">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="min_clinical" v-model="poolForm.min_clinical"
                                type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col> -->



            <b-col md="12">
              <b-form-group :label="$t('Global.courses')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                      v-if="options"
                      :filter="fuseSearch"
                      multiple
                      v-model="poolForm.courses"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="
                      options.courses.filter(
                        (el) => el.faculty_university_requirement == null
                      )
                    "
                      class="w-100"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.courses')"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ option.code }} :
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                        <!--                                            {{ $t(`Global.${option.label}`) }}-->
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ option.code }} :
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- <div v-if="render" style="display: contents">
              <b-col md="4" :key="i" v-for="(item, i) in poolForm.semesters">
                <b-form-group
                    :label="`${$t('Global.elective_semester')}#${i + 1}`"
                    label-for="semesters"
                >
                  <validation-provider
                      :name="'semesters'"
                      #default="{ errors }"
                      rules="required"
                  >
                    <v-select
                        :placeholder="`${$t('Global.elective_semester')}#${
                        i + 1
                      }`"
                        :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                        v-model="poolForm.semesters[i]"
                        :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                        class="w-100"
                        :reduce="(val) => val"
                    >
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                                                           <b-form-input v-model="ruleForm.semesters[i]" type="number"
                                                                         :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div> -->
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="save_pool"
                :disabled="buttonDisabled"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="pool_dialog = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
        id="modal_requirement"
        v-model="requirement_dialog"
        no-close-on-backdrop
        size="lg"
        :title="$t('Global.mandatory_courses')"
    >
      <validation-observer ref="mandatory_courses">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group v-if="options" :label="$t('Global.courses')">
                <validation-provider #default="{ errors }" rules="">
                  <v-select
                      :filter="fuseSearch"
                      multiple
                      v-model="requirementForm.courses"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="
                      courses_data.filter(
                        (el) =>
                          el.faculty_university_requirement == null ||
                          el.faculty_university_requirement ==
                            requirementForm.type
                      )
                    "
                      class="w-100"
                      :reduce="(val) => val.id"
                      label="name"
                      :placeholder="$t('Global.courses')"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ option.code }} :
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ option.code }} :
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors"/>
                  <ValidationErrors :frontend-errors="errors"/>
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
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="saveRequirement"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="requirement_dialog = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {
  BTab,
  BTabs,
  BCard,
  BLink,
  BCol,
  BRow,
  BAvatar,
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BTable,
  BTr,
  BTh,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import {ValidationProvider, ValidationObserver, localize} from "vee-validate";
import {required, email, regex, between} from "@validations";
import ShowComponent from "@/views/components/info/show";
import TabTable from "@/views/students/student/components/TabTable";
import Programs from "@/views/academic_settings/programs/components/programs";
import Courses from "@/views/academic_settings/courses/components/courses";
import Statistics from "@/views/components/info/statistics";
import Edit from "@/views/academic_settings/bylaws/edit";
import Students from "@/views/students/student/components/students";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import {EventBus} from "../../../main";
import vSelect from "vue-select";
import EditSetting from "@/views/academic_settings/bylaws/components/editSetting";
import BylawProgramsTree from "@/views/academic_settings/bylaws/components/BylawProgramsTree";
import NewProgramsTree from "@/views/academic_settings/bylaws/components/NewProgramsTree";
import GradesVisibility from "@/views/academic_settings/bylaws/components/GradesVisibility";
import Emtyaz from "@/views/emtyaz/training/index.vue";
import specializations from "@/views/academic_settings/bylaws/components/specializations";

export default {
  name: "Show",
  components: {
    EditSetting,
    ValidationErrors,
    Students,
    TabTable,
    BFormCheckbox,
    GradesVisibility,
    BForm,
    BDropdown,
    BDropdownItem,
    BLink,
    BFormInput,
    BFormGroup,
    Edit,
    Statistics,
    Courses,
    Programs,
    ShowComponent,
    BTab,
    BTable,
    BTr,
    BTh,
    BTabs,
    BCard,
    BModal,
    BCol,
    BRow,
    BAvatar,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    BylawProgramsTree,
    NewProgramsTree,
    Emtyaz,
    specializations,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "bylaws/item",
      load: "bylaws/load",
      options: "lookups/lookups",
      saveLoad: "app/load",
    }),
    minSelectedCoursesRules() {
      const rules = ['between:0,1000'];

      // Add 'required' rule dynamically based on a condition
      if ((!this.minDisabled && !this.maxDisabled) || this.maxDisabled) {
        rules.unshift('required');
      }

      return rules.join('|');
    },
    maxSelectedCoursesRules() {
      const rules = ['between:0,1000'];

      // Add 'required' rule dynamically based on a condition
      if ((!this.minDisabled && !this.maxDisabled) || this.minDisabled) {
        rules.unshift('required');
      }

      return rules.join('|');
    },
    emtyaz() {
      this.activeTab = 1;
      return this.item.emtyaz == 1 ? true : false;
    },
    courses_data() {
      let courses = [];
      let pool_courses = [];
      if (
          this.item &&
          this.item.faculty_pools &&
          this.item.faculty_pools.length > 0
      ) {
        this.item.faculty_pools.forEach((el) => {
          pool_courses.push(...Array.from(el.courses, (el) => el.id));
        });
      }

      if (
          this.item &&
          this.item.university_pools &&
          this.item.university_pools.length > 0
      ) {
        this.item.university_pools.forEach((el) => {
          pool_courses.push(...Array.from(el.courses, (el) => el.id));
        });
      }
      if (this.options) {
        this.options.courses.forEach((el) => {
          let pos = pool_courses.indexOf(el.id);
          if (pos == -1) {
            courses.push({
              id: el.id,
              code: el.code,
              name: el.name,
              name_local: el.name_local,
              faculty_university_requirement: el.faculty_university_requirement,
            });
          }
        });
      }
      return courses;
    },
    faculty_id() {
      if (this.item) {
        return this.item.faculty_id;
      }
    },
    level_fields() {
      return [
        {key: "level_name", label: this.$t("Global.level_name")},
        {key: "level_number", label: this.$t("Global.level_number")},
        {key: "from_ch", label: this.$t("Global.from_ch")},
        {key: "to_ch", label: this.$t("Global.to_ch")},
        {key: "programs", label: this.$t("Global.programs")},
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    grade_scheme_fields() {
      return [
        {key: 'name', label: this.$t('Global.grade')},
        {key: 'gpa', label: this.$t('Global.points')},
        {key: 'course_min_percentage', label: this.$t('Global.from')},
        // {key: 'course_max_percentage', label: this.$t('Global.less_than')},
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
    grades_fields() {
      return [
        { key: "title", label: this.$t("Global.title") },
        { key: "name", label: this.$t("Global.grade") },
        { key: "gpa", label: this.$t("Global.points") },
        { key: "course_min_percentage", label: this.$t("Global.from") },
        // {key: 'course_max_percentage', label: this.$t('Global.less_than')},
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    fields() {
      let field = [
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "name",
          label: this.$t("Global.name"),
          thStyle: {width: "30%"},
        },
        {
          key: "credit_hours",
          label: "CH",
        },
        {
          key: "equivalent_ects",
          label: "ECTS",
        },
        {
          key: "required_swl",
          label: "SWL",
        },
        {
          key: "laboratory_hours",
          label: "lab",
        },
        {
          key: "lecture_hours",
          label: "lec",
        },
        {
          key: "tutorial_hours",
          label: "tut",
        },
        {
          key: "pre_requisites",
          label: this.$t("Global.pre_requisites"),
        },
      ];
      return field;
    },
    cardinals_fields() {
      return [
        {
          key: "label_range",
          tdClass: "border-right",
          thClass: "border-right",
          label: "",
        },
        {key: "max_ch_value", label: this.$t("Global.credit_hours")},
        {
          key: "max_courses",
          label: this.$t("Global.courses"),
          thClass: "border-right",
          tdClass: "border-right",
        },
        {key: "max_summer_ch_value", label: this.$t("Global.credit_hours")},
        {
          key: "max_summer_courses",
          label: this.$t("Global.courses"),
          thClass: "border-right",
          tdClass: "border-right",
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    id() {
      return this.$route.params.id ? Number(this.$route.params.id) : null;
    },
    checkChAndUG() {
      if (this.item) {
        return this.item.stage_id == 1 && this.item.type_id == 1 ? true : false;
      }
      return false;
    },
  },
  data() {
    return {
      maxDisabled: false,
      minDisabled: false,
      activeTab: 0,
      form: {},
      addToAdmission: false,
      paramsCourse: null,
      columnStyleReadOnly: {
        color: "rgb(139 146 153)",
      },
      level_dialog: false,
      requirement_dialog: false,
      level_id: null,
      columnStyle: {
        color: "rgb(0 0 0)",
        textAlign: "center",
      },
      render: true,
      levelForm: {},
      gradesSemesterForm: {
        grades_semester: null,
      },
      pool_dialog: false,
      poolForm: {
        semesters: [],
      },
      requirementForm: {},
      ruleForm: {
        code: null,
        name: null,
        name_local: null,
        gpa: null,
        course_min_percentage: null,
        // course_max_percentage: null,
        term_min_percentage: null,
        term_max_percentage: null,
      },
      rangeForm: {},
      errorsdata: null,
      success_form: {},
      grade_id: null,
      range_id: null,
      edit: false,
      buttonDisabled: false,
      setting_edit: false,
      dialog: false,
      dialog_success: false,
      dialog_range: false,
      levelsArray: null,
      typesArray: [],
      visitedTabs: [],
      tabIndex: 0,
      index: 0,
      itemData: null,
      regMap: {
        P: `${this.$t("Global.passed")}`,
        W: `${this.$t("Global.withdrawn")}`,
        IC: `${this.$t("Global.incomplete")}`,
        AU: `${this.$t("Global.audited")}`,
        F: `${this.$t("Global.Failed")}`,
        FA: `${this.$t("Global.Failed Absent")}`,
        FB: `${this.$t("Global.Failed Banned")}`,
        FF: `${this.$t("Global.Failed Final")}`,
        FP: `${this.$t("Global.Failed Punished")}`,
        WF: `${this.$t("Global.Withdrawn Forcibly")}`,
      },
    };
  },
  watch: {
    "gradesSemesterForm.grades_semester": function () {
      this.updateGradesSemester();
    },
    "poolForm.max"(){
      this.poolForm.min_ch = this.poolForm.max > 0 ? null : this.poolForm.min_ch
      this.poolForm.no_semester = this.poolForm.max > 0 ? null : this.poolForm.no_semester
      this.minDisabled = this.poolForm.max > 0 ? true : false
    },
    "poolForm.min_ch"(){
      this.poolForm.max = this.poolForm.min_ch > 0 ? null : this.poolForm.max
      this.maxDisabled = this.poolForm.min_ch > 0 ? true : false
    },
    "poolForm.no_semester"(){
      this.poolForm.max = this.poolForm.no_semester > 0 ? null : this.poolForm.max
      this.maxDisabled = this.poolForm.no_semester > 0 ? true : false
    },
    addToAdmission: function (val) {
      let payload = {
        query: {status: val},
        id: this.$route.params.id || null,
      };
      this.changeStatus(payload);
    },
    tabIndex: function (val) {
      if (val == 3 || val == 4) {
        this.$store.dispatch("lookups/get", {
          courses: true,
          faculties: true,
          bylaw_types: true,
          bylaw_stages: true,
          lookup_from: "bylaws",
          bylaw_id: this.id,
        });
      }
    },
    item: function (val) {
      this.itemData = val;
    },
    "$route.params.id": function (val) {
      this.init();
    },
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
      this.visitedTabs.push(this.tabIndex);
    }
  },
  emtyaz() {
    this.activeTab = 1;
    return this.item.emtyaz == 1 ? true : false;
  },
  mounted() {
    this.init();
    this.$store.dispatch("lookups/get", {
      courses: true,
      programs: true,
      faculties: true,
      bylaw_types: true,
      bylaw_stages: true,
      lookup_from: "bylaws",
      bylaw_id: this.id,
    });
  },
  destroyed() {
    //to reset tab filter data
    this.$store.dispatch("app/resetTabsFilter");
  },
  methods: {
    ...mapActions({
      editGrades: "bylaws/editGrades",
      editGradesRange: "bylaws/editGradesRange",
      addSuccessGrades: "bylaws/setSuccessGrades",
      removeSuccessGrades: "bylaws/removeSuccessGrades",
      removeRangeGrades: "bylaws/removeGradesRange",
      saveLevel: "bylaws/save_level",
      deleteLevel: "bylaws/delete_level",
      gradesSemester: "bylaws/saveSemesterGrades",
      syncRequirement: "bylaws/syncRequirement",
      changeStatus: "bylaws/changeStatus",
      // fetchPrograms: 'app/GET_INDEX_LOOKUPS',
    }),
    beforeEmtyazTabActivate() {
      if (this.activeTab === 1) {
        let currentUrl = window.location.href;

        // Define the query parameters you want to remove
        let paramsToRemove = ["inline", "export", "removed"];

        // Parse the URL
        let url = new URL(currentUrl);

        // Remove specified parameters
        paramsToRemove.forEach((param) => url.searchParams.delete(param));

        // Replace the current URL with the modified one
        window.history.replaceState({}, "", url.href);
      }
    },
    saveInfo() {
      this.$refs.basicRules.validate().then((success) => {
        if (success && this.form.stage_id) {
          if (this.params && this.params.faculty_id) {
            this.form.faculty_id = this.params.faculty_id;
          }

          const payload = {
            id: this.params && this.params.status == 1 ? null : this.id,
            query: this.form,
          };
          this.$store
              .dispatch("bylaws/put", payload)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: `${this.$t("Global.saved")}`,
                  showConfirmButton: false,
                  timer: 1500,
                });

                this.init();
                this.edit = false;
                this.updateFilterQueryParams({
                  tabNum: this.$route.query.tabNum || 0,
                  inline: false,
                });
              })
              .catch((error) => {
                this.errorsdata = this.handleBackendError(
                    error.response.data.errors
                );
              });
        }
      });
    },
    calcSemester() {
      this.render = false;
      //

      if (!this.poolForm.max) {
        this.poolForm.semesters = [];
      }

      if (this.poolForm.semesters.length > 0) {
        if (parseInt(this.poolForm.max) > this.poolForm.semesters.length) {
          for (
              let i = 0;
              i <=
              parseInt(this.poolForm.max) - this.poolForm.semesters.length + 1;
              i++
          ) {
            this.poolForm.semesters.push(1);
          }
        } else {
          for (
              let i = 0;
              i <= this.poolForm.semesters.length - parseInt(this.poolForm.max);
              i++
          ) {
            this.poolForm.semesters.pop();
          }
        }
      } else {
        this.poolForm.semesters = [];
        for (let i = 0; i <= parseInt(this.poolForm.max) - 1; i++) {
          this.poolForm.semesters.push(1);
        }
      }

      setTimeout((_) => {
        this.render = true;
      }, 200);
    },
    checkTabVisited(index) {
      return this.visitedTabs.includes(index);
    },
    openEdit(type) {
      if (type) {
        this.edit = false;
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: false,
        });
      } else {
        this.edit = true;
        this.form = this.item;
        this.$nextTick(() => {
          this.$refs.code.focus();
        });
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: true,
        });
      }
    },

    openSettingEdit(type) {
      if (type) {
        this.setting_edit = false;
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: false,
        });
      } else {
        this.setting_edit = true;
        this.form = this.item;
        this.$nextTick(() => {
          this.$refs.code.focus();
        });
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: true,
        });
      }
    },
    saveRequirement() {
      this.$refs.mandatory_courses.validate().then((success) => {
        if (success) {
          this.syncRequirement({
            id: this.id,
            query: this.requirementForm,
          }).then((_) => {
            this.init();
            this.requirement_dialog = false;
          });
        }
      });
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },

    openMandatoryCourses(courses, type) {
      this.requirementForm.courses = Array.from(courses, (el) => el.id);
      this.requirementForm.type = type;
      this.requirement_dialog = true;
    },

    openPoolDialog(pool, type = null) {
      this.poolForm = {min_ch: "",
        max: "", min_lecture: "", min_lab: "", min_swl: "", min_equivalent_ects: "",min_clinical:"",credit_hour:""
      };
      this.poolForm.semesters = [];

      if (type) {
        this.poolForm.type = type;
      }
      this.pool_id = null;
      if (pool) {
        console.log(pool.no_semester);
        this.poolForm = {...pool};
        this.poolForm.semesters = pool.semesters;
        this.poolForm.min_ch = pool.min_ch ? pool.min_ch : "";
        this.poolForm.credit_hour = pool.credit_hour ? pool.credit_hour : "";
        this.poolForm.min_lecture = pool.min_lecture ? pool.min_lecture : "";
        this.poolForm.min_tutorial = pool.min_tutorial ? pool.min_tutorial : "";
        this.poolForm.min_clinical = pool.min_clinical ? pool.min_clinical : "";
        this.poolForm.min_lab = pool.min_lab ? pool.min_lab : "";
        this.poolForm.min_swl = pool.min_swl ? pool.min_swl : "";
        this.poolForm.min_equivalent_ects = pool.min_equivalent_ects
          ? pool.min_equivalent_ects
          : "";
        this.poolForm.max = pool.max ? pool.max : "";
        this.poolForm.no_semester = pool.no_semester ? pool.no_semester :"";
        this.pool_id = pool.id;
        this.poolForm.courses = Array.from(pool.courses, (el) => el.id);
      }

      this.pool_dialog = true;
      this.buttonDisabled = false;
    },
    saveStatus(index) {
      this.updateFilterQueryParams({
        tabNum: index,
        ...this.getTabFilterData(index),
        inline: false,
      });
      if (this.$route.query.inline == "false" && index != 0) {
        this.edit = false;
        // this.resetFilterQueryParams({});
      }
      this.visitedTabs.push(index);
    },
    updateGradesRange(data) {
      this.rangeForm = {...data};
      this.range_id = data.id;
      this.openRangeDialog();
    },
    delete_pool(id) {
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
          this.$store.dispatch("programs/delete_pool", {id: id}).then((_) => {
            this.init();
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
    save_pool() {

      this.$refs.simpleRules1.validate().then((success) => {

        if (success) {
          this.buttonDisabled = true;
          this.poolForm.bylaw_id = this.id;
          this.$store
              .dispatch("programs/save_pool", {
                id: this.pool_id,
                query: this.poolForm,
              })
              .then((_) => {
                this.init();
                this.pool_dialog = false;
                this.buttonDisabled = false;
              }).catch((error) => {
                    this.$swal({
                      icon: "error",
                      text: `${this.$i18n.locale == "en" ? error.response.data.errors[0].title.en : error.response.data.errors[0].title.ar || this.$t("errorMessage")}`,
                      showConfirmButton: true,
                    });
                    this.buttonDisabled = false
                    this.pool_dialog = false
                    this.init();
                  });

        }
      });
    },
    openLevelDialog(data) {
      this.levelForm = {};
      if (data) {
        this.levelForm.name = data.name;
        this.levelForm.name_local = data.name_local;
        this.levelForm.level_number = data.level_number;
        this.levelForm.to_ch = data.to_ch;
        this.levelForm.from_ch = data.from_ch;
        this.levelForm.program_ids = Array.from(data.programs, (el) => el.id);
        this.level_id = data.id;
      }

      this.level_dialog = true;
      // })
    },
    updateGrades(data) {
      if (data) {
        this.ruleForm.code = data.code;
        this.ruleForm.name = data.name;
        this.ruleForm.name_local = data.name_local;
        this.ruleForm.gpa = data.gpa;
        this.ruleForm.course_min_percentage = data.course_min_percentage;
        // this.ruleForm.course_max_percentage = data.course_max_percentage;
        this.ruleForm.term_min_percentage = data.term_min_percentage;
        this.ruleForm.term_max_percentage = data.term_max_percentage;
        this.grade_id = data.id;
      } else {
        this.ruleForm.code = null;
        this.ruleForm.name = null;
        this.ruleForm.name_local = null;
        this.ruleForm.gpa = null;
        this.ruleForm.course_min_percentage = null;
        // this.ruleForm.course_max_percentage = null;
        this.ruleForm.term_min_percentage = null;
        this.ruleForm.term_max_percentage = null;
        this.grade_id = null;
      }
      this.openDialog(data);
    },
    selected(selectedRows) {
    },

    updateGradesSemester() {
      let payload = {id: this.id, query: this.gradesSemesterForm};
      this.gradesSemester(payload);
    },

    addLevel() {
      this.$refs.level_form.validate().then((success) => {
        if (success) {
          this.levelForm.bylaw_id = this.id;
          this.saveLevel({id: this.level_id, query: this.levelForm}).then(
              (_) => {
                this.level_dialog = false;
                this.init();
                this.$swal({
                  icon: "success",
                  title: `${this.$t("Global.saved")}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
          );
        }
      });
    },

    removeLevel(id) {
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
          this.deleteLevel(id).then((_) => {
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

    addSuccess() {
      if (this.success_form && this.success_form.grade_id) {
        this.$nextTick((_) => {
          this.$refs.simpleRules1.validate().then((success) => {
            if (success) {
              this.addSuccessGrades(this.success_form)
                  .then((_) => {
                    this.dialog_success = false;
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
                      icon: 'error',
                      showConfirmButton: true,
                      title: this.$t('Global.Failed'),
                      text: error.response.data.errors[0].title
                    });
                  });
            }
          });
        });
      }
    },
    removeSuccess(id) {
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
          this.removeSuccessGrades(id)
              .then((_) => {
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
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                  title: this.$t('Global.Failed'),
                  text: error.response.data.errors[0].title
                });
              });
        }
      });
    },

    removeRange(id) {
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
          this.removeRangeGrades(id).then((_) => {
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

    submit() {
      this.$nextTick((_) => {
        this.$refs.simpleRules1
            .validate()
            .then((success) => {
              if (success) {
                const payload = {
                  // code: this.ruleForm.code,
                  name: this.ruleForm.name,
                  gpa: this.ruleForm.gpa,
                  name_local: this.ruleForm.name_local,
                  course_min_percentage: Number(
                      this.ruleForm.course_min_percentage
                  ),
                  // course_max_percentage: Number(this.ruleForm.course_max_percentage),
                  // term_min_percentage: Number(this.ruleForm.term_min_percentage),
                  // term_max_percentage: Number(this.ruleForm.term_max_percentage),
                  bylaw_id: this.item?.id,
                };

                this.editGrades({id: this.grade_id || null, query: payload})
                    .then((_) => {
                      this.dialog = false;
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
                        text: `${this.$t("Global.errorMessage")}`,
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

    cancelSetting() {
      this.setting_edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },
    submitSettings() {
      this.$nextTick((_) => {
        this.$refs.range_form
            .validate()
            .then((success) => {
              if (success) {
                let payload = {...this.rangeForm};
                payload.bylaw_id = this.item?.id;
                this.editGradesRange({
                  id: this.range_id || null,
                  query: payload,
                })
                    .then((_) => {
                      this.dialog_range = false;
                      this.range_id = null;
                      this.init();
                      this.$swal({
                        icon: "success",
                        title: `${this.$t("Global.saved")}`,
                        showConfirmButton: false,
                        timer: 2000,
                      });
                    })
                    .catch((error) => {
                      this.range_id = null;
                      this.$swal({
                        icon: "error",
                        text: `${this.$t("Global.errorMessage")}`,
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

    openDialog(item) {
      if (item) {
        this.ruleForm.code = item.code;
        this.ruleForm.name = item.name;
        this.ruleForm.name_local = item.name_local;
        this.ruleForm.gpa = item.gpa;
        this.ruleForm.course_min_percentage = item.course_min_percentage;
        // this.ruleForm.course_max_percentage = item.course_max_percentage;
        this.ruleForm.term_min_percentage = item.term_min_percentage;
        this.ruleForm.term_max_percentage = item.term_max_percentage;
        this.grade_id = item.id;
      } else {
        this.ruleForm.code = null;
        this.ruleForm.name = null;
        this.ruleForm.name_local = null;
        this.ruleForm.gpa = null;
        this.ruleForm.course_min_percentage = null;
        // this.ruleForm.course_max_percentage = null;
        this.ruleForm.term_min_percentage = null;
        this.ruleForm.term_max_percentage = null;
        this.grade_id = null;
      }
      this.dialog = true;
    },
    openRangeDialog(item) {
      this.dialog_range = true;
    },
    openSuccessDialog(item) {
      if (item) {
        this.success_form.grade_id = item.id;
        this.success_form.title = item.title;
      } else {
        this.success_form.grade_id = null;
        this.success_form.title = null;
      }
      this.dialog_success = true;
    },
    init(id) {
      this.setting_edit = false;
      if (this.id || id) {
        this.edit =
            this.$route.query.inline == "false"
                ? false
                : this.$route.query.inline;
        this.$store.dispatch("bylaws/get", id || this.id).then((_) => {
          this.gradesSemesterForm.grades_semester = this.item.grades_semester;
          this.form = this.item;
          this.addToAdmission = this.item.current == 1 ? true : false;
          this.$nextTick((_) => {
            this.setPageTabs();
          });
        });
      } else {
        this.edit = true;
        this.setting_edit = true;
      }
    },
  },
  created() {
    EventBus.$on("changeIt", (data) => {
      this.paramsCourse = data;
    });
    // Remove query parameters here before rendering the component
  },
};
</script>
