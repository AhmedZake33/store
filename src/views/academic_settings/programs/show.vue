<template>
  <div>
    <b-overlay :show="load" rounded="sm">
      <statistics
          :name="item.bylaw"
          title="bylaw"
          :code="item.bylaw && item.bylaw.code ? item.bylaw.code : ''"
          :items="item"
          :only="['courses_count', 'graduated_count', 'current_count']"
      ></statistics>
      <b-card class="mb-0">
        <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            lazy
            vertical
            nav-wrapper-class="nav-hidden custom_drop_tabs"
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
          <b-tab>
            <template #title>
              <feather-icon icon="InfoIcon"/>
              <span>{{ $t('Global.basic_info') }}</span></template
            >
            <Edit
                v-if="edit"
                @save="save"
                :tabNumber="0"
                :data="
                id
                  ? item
                  : {
                      code: '',
                      name: '',
                      id: '',
                      name_local: '',
                      faculty: '',
                      bylaw: '',
                      level: '',
                      courses_count: '',
                      students_count: '',
                      graduating_program: '',
                      via_schedule: '',
                      program_type: '',
                    }
              "
                @hide="edit = false"
                :inline="true"
                @refresh="init"
            ></Edit>
            <div v-else>
              <ShowComponent
                  :data="item"
                  :only="[
                  'code',
                  'name',
                  'id',
                  'name_local',
                  'faculty',
                  'bylaw',
                  'level',
                  'courses_count',
                  'students_count',
                  'graduating_program',
                  'via_schedule',
                  'program_type',
                  'parent',
                ]"
              >
                <template #edit>
                  <div class="mb-2 d-flex justify-content-between w-100">
                    <div>
                      <b-form-checkbox
                          v-if="hasPermission('general_program')"
                          @change="makeGeneral"
                          v-model="general"
                          name="check-button"
                          switch
                      >
                        {{ $t('Global.make_general') }}
                      </b-form-checkbox>
                    </div>

                    <feather-icon
                        v-if="hasPermission('edit_faculty')"
                        @click="openEdit()"
                        style="cursor: pointer"
                        icon="EditIcon"
                        class="font-medium-3"
                        v-b-tooltip.hover="$t('Global.edit')"
                    />
                  </div>
                </template>
                <template #students_count="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.type`) }}
                  </th>
                  <td>
                    <!--                 <div v-for="type in data.bylaw.types" :key="type">-->
                    <div v-if="data.bylaw && data.bylaw.type">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ data.bylaw.type.name_local }}
                      </span>
                      <span v-if="$i18n.locale == 'en'">
                        {{ data.bylaw.type.name }}
                      </span>
                    </div>

                    <!--                      -->
                    <!--                  </div>-->
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
                  </td>
                </template>
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
                        $i18n.locale == 'en'
                            ? data.faculty.name
                            : data.faculty.name_local
                      }}
                    </b-link>
                  </td>
                </template>

                <template #bylaw="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.bylaw`) }}
                  </th>
                  <td>
                    <b-link
                        target="_blank"
                        v-if="data.bylaw"
                        :to="{ name: 'bylaw', params: { id: data.bylaw.id } }"
                        class="font-weight-bold d-block"
                    >
                      {{
                        $i18n.locale == 'en'
                            ? data.bylaw.name
                            : data.bylaw.name_local
                      }}
                    </b-link>
                  </td>
                </template>

                <template #code="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.code`) }}
                  </th>
                  <td>
                    {{ data.code || '-' }}
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
                <template #graduating_program="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.graduating_program`) }}
                  </th>
                  <td>
                    {{
                      data.graduating_program
                          ? $t('Global.yes')
                          : $t('Global.no')
                    }}
                  </td>
                </template>
                <template #via_schedule="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.via_schedule`) }}
                  </th>
                  <td>
                    {{ data.via_schedule ? $t('Global.yes') : $t('Global.no') }}
                  </td>
                </template>
                <template #parent="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.parent_program`) }}
                  </th>
                  <td>
                    <b-link
                        target="_blank"
                        v-if="data.parent"
                        :to="{ name: 'program', params: { id: data.parent.id } }"
                        class="font-weight-bold d-block"
                    >
                      {{
                        $i18n.locale == 'ar'
                            ? data.parent.name_local
                            : data.parent.name
                      }}
                    </b-link>
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
                <template #program_type="{ data }" v-if="checkPG">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.program_type`) }}
                  </th>
                  <td>
                    <span v-if="data.program_type">{{
                        $i18n.locale == 'en'
                            ? data.program_type.name
                            : data.program_type.name_local
                      }}</span>
                    <span v-else>-</span>
                  </td>
                </template>
              </ShowComponent>
            </div>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon"/>
              <span>{{ $t('Global.details') }}</span></template
            >
            <Edit
                v-if="edit"
                :tabNumber="1"
                @save="save"
                :data="
                id ? item : { students_count: '', courses_count: '', bylaw: '' }
              "
                @hide="edit = false"
                :inline="true"
                @refresh="init"
            ></Edit>
            <ShowComponent
                v-else
                :data="item"
                :only="['students_count', 'courses_count', 'bylaw']"
            >
              <template #edit>
                <div class="mb-2">
                  <feather-icon
                      v-if="hasPermission('edit_faculty')"
                      @click="openEdit()"
                      style="cursor: pointer"
                      icon="EditIcon"
                      class="font-medium-3"
                      v-b-tooltip.hover="$t('Global.edit')"
                  />
                </div>
              </template>
              <template #students_count="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.program_description`) }}
                </th>
                <td>
                  {{
                    data.program_description ? data.program_description : '-'
                  }}
                </td>
              </template>
              <template #courses_count="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.career_prospects`) }}
                </th>
                <td>
                  {{ data.career_prospects ? data.career_prospects : '-' }}
                  <!-- {{ $i18n.locale == 'ar' && data.level && data.level.name_local ? data.level.name_local : '-' }} -->
                </td>
              </template>
              <template #bylaw="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.program_concentrations`) }}
                </th>
                <td>
                  {{
                    data.program_concentrations
                        ? data.program_concentrations
                        : '-'
                  }}
                </td>
              </template>
            </ShowComponent>
          </b-tab>
          <b-tab v-if="id">
            <template #title>
              <feather-icon icon="ListIcon"/>
              <span>{{ $t('Global.courses') }}</span></template
            >
            <UniversityRequirements
                plus
                v-if="faculty_id"
                :title="$t('Global.university_requirements')"
                :excel_name="item.name"
                :faculty_dep_id="faculty_id"
                :program_id="Number(id)"
                :faculty_id="faculty_id"
                :bylaw_id="item.bylaw_id"
                :inline="true"
                :hide_courses="courses_ids"
            >
            </UniversityRequirements>
            <FacultyRequirements
                plus
                v-if="faculty_id"
                :title="$t('Global.faculty_requirements')"
                :excel_name="item.name"
                :faculty_dep_id="faculty_id"
                :program_id="Number(id)"
                :faculty_id="faculty_id"
                :bylaw_id="item.bylaw_id"
                :inline="true"
                :hide_courses="courses_ids"
            >
            </FacultyRequirements>
            <courses
                plus
                v-if="faculty_id"
                :title="$t('Global.mandatory_courses')"
                :excel_name="item.name"
                :faculty_dep_id="faculty_id"
                :program_id="Number(id)"
                :faculty_id="faculty_id"
                :bylaw_id="item.bylaw_id"
                :inline="true"
                :hide_courses="courses_ids"
            ></courses>

            <!--                    background-color: #f3f2f7 !important;-->
            <div
                class="bg-gray p-0 mb-1"
                style="
                padding-left: 0rem !important;
                padding-right: 0rem !important;
              "
            >
              <div class="d-flex justify-content-between">
                <strong class="font-medium-3">
                  {{ $t('Global.pool_of_electives') }}
                </strong>

                <b-button
                    v-b-tooltip.hover="$t('Global.pool_of_electives')"
                    @click="openDialog(null,'add')"
                    variant="primary"
                    class="btn-icon"
                >
                  <feather-icon icon="PlusIcon"/>
                </b-button>
              </div>
            </div>
            <div :key="i" v-for="(pool, i) in item && item.pools && item.pools.filter((el) => el.type != 3)">
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
                    <b-th variant="warning" colspan="9">
                      <!--                                        <feather-icon icon="StarIcon" class="m-0"/>-->
                      <strong class="text-primary font-medium-2 pb-1">
                        {{ $i18n.locale == 'ar' ? pool.name_local : pool.name }}
                      </strong>

                      <strong class="mx-3">
                        {{ $t('Global.max_selected_courses') }}
                        ({{ pool.max }})
                      </strong>
                      <strong class="mx-3">
                        {{ $t('Global.min_ch') }}
                        ({{ pool.min_ch }})
                      </strong>
                    </b-th>
                    <b-th
                        variant="warning"
                        colspan="2"
                        class="d-flex justify-content-end"
                    >
                      <div class="mx-1 pb-1" v-if="pool.status">
                        <feather-icon
                            v-b-tooltip.hover="$t('Global.edit')"
                            icon="EditIcon"
                            class="text-primary mx-1 font-medium-2"
                            style="cursor: pointer"
                            v-if="hasPermission('edit_program')"
                            @click="openDialog(pool,'edit')"
                        />
                        <feather-icon
                            v-b-tooltip.hover="$t('Global.delete')"
                            icon="Trash2Icon"
                            class="text-danger font-medium-2"
                            style="cursor: pointer"
                            v-if="hasPermission('edit_program') && pool.type != 3"
                            @click="delete_pool(pool.id)"
                        />
                      </div>
                      <div v-else class="mx-1 pb-2"></div>
                    </b-th>
                  </b-tr>
                </template>
                <template #cell(name)="data">
                  <b-link
                      :to="{ name: 'course', params: { id: data.item.id } }"
                  >
                    {{
                      $i18n.locale == 'ar'
                          ? data.item.name_local
                          : data.item.name
                    }}
                  </b-link>
                </template>
                <template #cell(pre_requisites)="data">
                  <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                    {{ item.code }}
                    <!-- <strong class="text-danger" v-if="i < data.item.pre_requisites.length">,</strong> -->
                  </div>
                </template>
              </b-table>
            </div>
            <div
                :key="i"
                v-for="(pool, i) in item && item.pools && item.pools.filter((el) => el.type == 3)"
                class="py-1 mt-2"
                style="
                padding-left: 0rem !important;
                padding-right: 0rem !important ;
                background-color: #f3f2f7;
              "
            >
              <div class="d-flex justify-content-between">
                <strong class="text-primary font-medium-2 px-2">
                  {{ $i18n.locale == 'ar' ? pool.name_local : pool.name }}
                </strong>
                <strong class="mx-3">
                  {{ $t('Global.max_selected_free_courses') }}
                  ({{ pool.max }})
                </strong>
                <strong class="mx-3">
                  {{ $t('Global.number_of_credit_hours') }}
                  ({{ pool.min_ch }})
                </strong>
                <feather-icon
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    class="text-primary mx-1 font-medium-2"
                    style="cursor: pointer"
                    v-if="hasPermission('edit_program')"
                    @click="openDialog(pool,'edit')"
                />
              </div>
            </div>
          </b-tab>
          <!-- <b-tab v-if="id" @click="showStudyPlan">
            <template #title>
              <feather-icon icon="BarChart2Icon" />
              <span>{{ $t('Global.study_plan') }}</span></template
            >

            <div :key="i" v-for="(semester, i) in item.courses">
              <b-table
                outlined
                :empty-text="$t('Global.empty_text')"
                show-empty
                :items="semester"
                :fields="fields"
                striped
                responsive="sm"
              >
                <template #thead-top="data">
                  <b-tr>
                    <b-th variant="primary" class="text-center" colspan="2">
                      {{ $t('Global.term') }} ({{ i }})</b-th
                    >
                    <b-th variant="primary" class="text-center" colspan="3">
                      {{ $t('Global.ch_and_swl') }}
                    </b-th>
                    <b-th variant="primary" class="text-center" colspan="4">
                      {{ $t('Global.content_hours') }}
                    </b-th>
                    <b-th variant="primary" class="text-center"></b-th>
                  </b-tr>
                </template>
                <template #cell(name)="data">
                  <div v-if="data.item.id">
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
                          : '_'
                      }}
                    </b-link>
                    <b-link
                      dir="rtl"
                      v-if="$i18n.locale == 'ar'"
                      :to="{ name: 'course', params: { id: data.item.id } }"
                    >
                      {{
                        data.item
                          ? data.item.name_local
                            ? data.item.name_local
                            : data.item.name
                          : '_'
                      }}
                    </b-link>
                  </div>
                  <div v-else>
                    <b-link
                      v-if="$i18n.locale == 'en'"
                      class="font-weight-bold"
                    >
                      {{
                        data.item
                          ? data.item.name
                            ? data.item.name
                            : data.item.name_local
                          : '_'
                      }}
                    </b-link>
                    <b-link dir="rtl" v-if="$i18n.locale == 'ar'">
                      {{
                        data.item
                          ? data.item.name_local
                            ? data.item.name_local
                            : data.item.name
                          : '_'
                      }}
                    </b-link>
                  </div>
                </template>
                <template #cell(pre_requisites)="data">
                  <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                    {{ item }}
                    <strong class="text-danger" v-if="i < data.item.pre_requisites.length-1">,</strong>
                  </div>
                </template>
              </b-table>
            </div>
          </b-tab> -->
          <b-tab v-if="id">
            <template #title>
              <feather-icon icon="BarChart2Icon"/>
              <span>{{ $t('Global.study_plan') }}</span></template
            >
            <StudyPlan @refresh="init" :id="Number(id)"></StudyPlan>
          </b-tab>
          <b-tab v-if="id" @click="showStudents">
            <template #title>
              <feather-icon icon="UserIcon"/>
              <span>{{ $t('Global.students') }}</span></template
            >
            <Students
                v-if="openStudent"
                noStatus
                :program_id="Number(id)"
            ></Students>
          </b-tab>
          <b-tab v-if="id && hasPermission('access_programOutcome')">
            <template #title>
              <feather-icon icon="BoxIcon"/>
              <span>{{ $t('Global.course_outcomes') }}</span>
            </template>
            <Outcomes :program_id="id"/>
          </b-tab>
          <b-tab v-if="hasPermission('addResearchPlanTo_program')">
            <template #title>
              <feather-icon icon="InfoIcon"/>
              <span>{{ $t('Global.research_plan') }}</span></template
            >
            <Edit
                v-if="edit"
                :tabNumber="2"
                :data="
                id
                  ? item
                  : { research_plan_name: '', research_plan_name_local: '' }
              "
                @hide="edit = false"
                :inline="true"
                @refresh="init"
            ></Edit>
            <div v-else>
              <ShowComponent :data="item" :only="['hasChildren', 'parent']">
                <template #edit>
                  <div class="mb-2 d-flex justify-content-end w-100">
                    <feather-icon
                        v-if="hasPermission('edit_program')"
                        @click="openEdit()"
                        style="cursor: pointer"
                        icon="EditIcon"
                        class="font-medium-3"
                        v-b-tooltip.hover="$t('Global.edit')"
                    />
                  </div>
                </template>
                <template #hasChildren="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.research_plan`) }}
                  </th>
                  <td>
                    <div>
                      <strong :key="i" v-for="(research, i) in item.research_plans">
                        <span v-if="i != 0">, </span>
                        {{
                          $i18n.locale == 'ar'
                              ? research.name_local
                              : research.name
                        }}
                      </strong>
                    </div>
                  </td>
                </template>

              </ShowComponent>
            </div>
          </b-tab>
        </b-tabs>
      </b-card>

      <b-modal
          id="modal_success"
          v-model="pool_dialog"
          no-close-on-backdrop
          size="lg"
          :title="
          ruleForm.type != 3
            ? $t('Global.pool_of_electives')
            : $t('Global.free_elective_courses')
        "
      >
        <validation-observer ref="simpleRules1">
          <b-form :class="load ? 'disabled_all' : ''">
            <div class="row" v-if="ruleForm.type != 3">
              <b-col md="6">
                <b-form-group
                    :label="$t('Global.english_name')"
                    label-for="name"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="name"
                      rules="english|required"
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
              <b-col md="6">
                <b-form-group
                    :label="$t('Global.max_selected_courses')"
                    label-for="max_selected_courses"
                >
                  <validation-provider
                      :name="$t('Global.max_selected_courses')"
                      #default="{ errors }"
                      :rules="maxSelectedCoursesRules"
                  >
                    <b-form-input
                        :disabled="maxDisabled"
                        id="max_selected_courses"
                        v-model="ruleForm.max"
                        :state="errors.length > 0 ? false : null"
                    />
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
                        v-model="ruleForm.min_ch"
                        type="number"
                        :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.number_of_semester')" label-for="no_semester">
                  <validation-provider :name="$t('Global.number_of_semester')" #default="{ errors }"
                                       :rules="minSelectedCoursesRules"
                  >
                    <b-form-input
                        :disabled="minDisabled"
                        id="semester"
                        v-model="ruleForm.no_semester"
                        type="number"
                        :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- <b-col md="6">
              <b-form-group :label="$t('Global.credit_hours')" label-for="min_equivalent_ects">
                <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                  <b-form-input  id="ch"
                                v-model="ruleForm.credit_hour" type="number"
                                :state="errors.length > 0 ? false : null"/>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.equivalent_ECTS')" label-for="min_equivalent_ects">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_equivalent_ects"
                                  v-model="ruleForm.min_equivalent_ects" type="number"
                                  :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.required_SWL')" label-for="min_swl">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_swl" v-model="ruleForm.min_swl"
                                  type="number"
                                  :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.lecture_hours')" label-for="min_lecture">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_lecture" v-model="ruleForm.min_lecture"
                                  type="number" :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.tutorial_hours')" label-for="min_tutorial">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_tutorial" v-model="ruleForm.min_tutorial"
                                  type="number" :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.laboratory_hours')" label-for="min_lab">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_lab" v-model="ruleForm.min_lab"
                                  type="number"
                                  :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group :label="$t('Global.clinical_hours')" label-for="min_clinical">
                  <validation-provider :name="'ch'" #default="{ errors }" rules="between:0,1000">
                    <b-form-input  id="min_clinical" v-model="ruleForm.min_clinical"
                                  type="number"
                                  :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <b-col md="12">
                <b-form-group v-if="options" :label="$t('Global.courses')">
                  <validation-provider #default="{ errors }" rules="required">
                    <v-select
                        :filter="fuseSearch"
                        multiple
                        v-model="ruleForm.courses"
                        :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                        :options="options.courses.filter(
                        (el) => el.faculty_university_requirement == null
                      )"
                        class="w-100"
                        :reduce="(val) => val.id"
                        :placeholder="$t('Global.courses')"
                    >
                      <template slot="selected-option" slot-scope="option">
                        <span>
                          {{ option.code }} :
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local
                                : option.name
                          }}
                          <!--                                            {{ $t(`Global.${option.label}`) }}-->
                        </span>
                      </template>
                      <template v-slot:option="option">
                        {{ option.code }} :
                        {{
                          $i18n.locale == 'ar' ? option.name_local : option.name
                        }}
                      </template>
                    </v-select>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <div v-if="reshow" style="display: contents">
                <b-col md="4" :key="i" v-for="(item, i) in ruleForm.semesters">
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
                          :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                          v-model="ruleForm.semesters[i]"
                          :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                          class="w-100"
                          :reduce="(val) => val"
                      >
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <!--                                        <b-form-input v-model="ruleForm.semesters[i]" type="number"-->
                      <!--                                                      :state="errors.length > 0 ? false : null"/>-->
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </div>
            </div>
            <div class="row" v-else>
              <b-col md="6">
                <b-form-group
                    :label="$t('Global.max_selected_free_courses')"
                    label-for="semesters"
                >
                  <validation-provider
                      :name="''"
                      #default="{ errors }"
                      rules="between:0,20"
                  >
                    <b-form-input
                        id="semesters"
                        v-model="ruleForm.max"
                    />
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                    :label="$t('Global.number_of_credit_hours')"
                    label-for="min_ch"
                >
                  <validation-provider
                      :name="'ch'"
                      #default="{ errors }"
                      rules="between:0,1000"
                  >
                    <b-form-input v-model="ruleForm.min_ch" type="number"/>
                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <div v-if="reshow" style="display: contents">
                <b-col md="4" :key="i" v-for="(item, i) in ruleForm.semesters">
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
                          :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                          v-model="ruleForm.semesters[i]"
                          :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                          class="w-100"
                          :reduce="(val) => val"
                      >
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <!--                                        <b-form-input v-model="ruleForm.semesters[i]" type="number"-->
                      <!--                                                      :state="errors.length > 0 ? false : null"/>-->
                      <!--                                        <ValidationErrors :frontend-errors="errors"/>-->
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </div>
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
                  @click="save_pool"
                  :disabled="buttonDisabled"
              >
                {{ $t('Global.save') }}
              </b-button>
              <b-button
                  type="reset"
                  variant="outline-secondary"
                  @click="pool_dialog = false"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import ShowComponent from '@/views/components/info/show'
import { mapGetters, mapActions } from 'vuex'
import Courses from '@/views/academic_settings/courses/components/courses'
import UniversityRequirements from '@/views/academic_settings/courses/components/UniversityRequirements'
import FacultyRequirements from '@/views/academic_settings/courses/components/FacultyRequirements'
import Statistics from '@/views/components/info/statistics'
import {
  BCol,
  BLink,
  BRow,
  BCard,
  BTabs,
  BTab,
  BTable,
  BDropdown,
  BOverlay,
  BDropdownItem,
  BTr,
  BTh,
  BForm,
  BFormInput,
  BFormGroup,
  BModal,
  BFormCheckbox,
} from 'bootstrap-vue'
import Edit from '@/views/academic_settings/programs/edit'
import Students from '@/views/students/student/components/students'
import StudyPlan from '@/views/academic_settings/programs/components/study_plan'
import Outcomes from '@/views/quality/outcomes/components/outcomes.vue'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import vSelect from 'vue-select'
import { localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import { EventBus } from '../../../main'

export default {
  name: 'show',
  components: {
    StudyPlan,
    Outcomes,
    Students,
    BLink,
    Edit,
    Statistics,
    Courses,
    ShowComponent,
    BCol,
    BDropdown,
    BDropdownItem,
    BRow,
    BCard,
    BTabs,
    BTab,
    BTable,
    BTr,
    BTh,
    BForm,
    BOverlay,
    BFormInput,
    BModal,
    BFormGroup,
    ValidationErrors,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormCheckbox,
    UniversityRequirements,
    FacultyRequirements
  },
  computed: {
    ...mapGetters({
      item: 'programs/item',
      load: 'programs/load',
      options: 'lookups/lookups',
    }),
    minSelectedCoursesRules() {
      const rules = ['between:0,1000']

      // Add 'required' rule dynamically based on a condition
      if ((!this.minDisabled && !this.maxDisabled) || this.maxDisabled) {
        rules.unshift('required')
      }

      return rules.join('|')
    },
    maxSelectedCoursesRules() {
      const rules = ['between:0,1000']

      // Add 'required' rule dynamically based on a condition
      if ((!this.minDisabled && !this.maxDisabled) || this.minDisabled) {
        rules.unshift('required')
      }

      return rules.join('|')
    },
    checkPG() {
      if (this.item) {
        return this.item && this.item.bylaw && this.item.bylaw.stage_id === 2 ? true : false
      }
      return true
    },
    id() {
      return this.$route.params.id ? Number(this.$route.params.id) : null
    },
    fields() {
      let field = [
        {
          key: 'code',
          label: this.$t('Global.code'),
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          thStyle: { width: '30%' },
        },
        {
          key: 'credit_hours',
          label: 'CH',
        },
        {
          key: 'equivalent_ects',
          label: 'ECTS',
        },
        {
          key: 'required_swl',
          label: 'SWL',
        },
        {
          key: 'lecture_hours',
          label: 'lec',
        },
        {
          key: 'tutorial_hours',
          label: 'tut',
        },
        {
          key: 'laboratory_hours',
          label: 'lab',
        },
        {
          key: 'clinical_hours',
          label: 'cli',
        },
        {
          key: 'pre_requisites',
          label: this.$t('Global.pre_requisites'),
        },
      ]
      return field
    },

    pool_courses() {
      let courses = []
      let plan_courses = []
      if (this.item && this.item.courses) {
        let data = Object.values(this.item.courses)
        for (let courses of data) {
          plan_courses.push(...Array.from(courses, (el) => el.id))
        }
      }

      if (this.options) {
        this.options.courses.forEach((el) => {
          let pos = plan_courses.indexOf(el.id)
          if (pos == -1) {
            courses.push({
              id: el.id,
              code: el.code,
              name: el.name,
              name_local: el.name_local,
              faculty_university_requirement: el.faculty_university_requirement,
            })
          }
        })
      }

      return courses
    },
    courses_ids() {
      let all_courses = []
      if (this.item && this.item.courses) {
        let data = Object.values(this.item.courses)
        for (let courses of data) {
          for (let courses of data) {
            all_courses.push(...Array.from(courses, (el) => el.id))
          }
        }

        if (this.item && this.item.pools && this.item.pools.length > 0) {
          this.item.pools.forEach((el) => {
            all_courses.push(...Array.from(el.courses, (el) => el.id))
          })
        }
        return all_courses
      }
    },
  },
  watch: {
    // general: function(){
    //   this.makeGeneral();
    // }
    // 'ruleForm.max'(){

    // },
    'ruleForm.max'() {
      this.calcSemester()
      this.ruleForm.min_ch = this.ruleForm.max > 0 ? null : this.ruleForm.min_ch
      this.minDisabled = this.ruleForm.max > 0 ? true : false
    },
    'ruleForm.min_ch'() {
      this.ruleForm.max = this.ruleForm.min_ch > 0 ? null : this.ruleForm.max
      this.maxDisabled = this.ruleForm.min_ch > 0 ? true : false
    },
    'ruleForm.no_semester'() {
      this.calcSemester()
      this.maxDisabled = this.ruleForm.no_semester > 0 ? true : false
    },
  },
  data() {
    return {
      maxDisabled: false,
      minDisabled: false,
      openStudent: false,
      buttonDisabled: false,
      formDataContent: null,
      formData: null,
      edit: false,
      reshow: true,
      formType: null,
      faculty_id: null,
      ruleForm: {
        semesters: [],
      },
      tabIndex: 0,
      pool_id: null,
      pool_dialog: false,
      general: false,
      parent: {},
      studyPlan: {},
    }
  },
  mounted() {
    this.$store.dispatch('theses/myTheses', { query: {} })
    this.init()
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum)
    }
  },
  created() {
    EventBus.$on('changeProgramForm', (data) => {
      this.formData = data
    })
    EventBus.$on('changeDescriptionTab', (data) => {
      this.formDataContent = data
    })
  },
  methods: {
    ...mapActions({
      saveData: 'programs/put',
    }),
    showStudents() {
      this.openStudent = true
    },
    init(id) {
      if (this.id || id) {
        //get parent program data
        this.$store.dispatch('programs/get', id || this.id)
            .then((_) => {
              this.$store
                  .dispatch('lookups/get', {
                    courses: true,
                    bylaw_id: this.item ? this.item.bylaw_id : 0,
                    program_types: true,
                  })
                  .then((_) => {
                    this.$nextTick((_) => {
                      this.setPageTabs()
                    })
                  })

              this.faculty_id = this.item.faculty_id
              this.general = this.item.general == 1 ? true : false
            })
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true
        }

      } else {
        this.edit = true
      }
      // this.$store.dispatch('programs/get', this.item.parent).then((res) => {
      // });
    },
    makeGeneral() {
      this.$store
          .dispatch('programs/setGeneral', { id: this.item.id })
          .then(() => {
            this.init()
          })
          .catch((error) => {
            this.errorToast(error.response.data)
            this.init()
          })
    },
    openEdit() {
      this.edit = true
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: true,
      })
    },
    calcSemester() {
      this.reshow = false
      //

      if (!this.ruleForm.max && !this.ruleForm.no_semester) {
        this.ruleForm.semesters = []
      }

      if (this.ruleForm.semesters && this.ruleForm.semesters.length > 0 && this.formType == 'edit') {
        if (parseInt(this.ruleForm.max) > this.ruleForm.semesters.length) {
          // for ( let i = 0; i <= parseInt(this.ruleForm.max) - this.ruleForm.semesters.length + 1; i++ ) {
          //   this.ruleForm.semesters.push(1);
          // }
          this.ruleForm.semesters = []
          for (let i = 0; i <= parseInt(this.ruleForm.max) - 1; i++) {
            this.ruleForm.semesters.push(1)
          }
        }
        if (parseInt(this.ruleForm.no_semester) > this.ruleForm.semesters.length) {
          // for ( let i = 0; i <= parseInt(this.ruleForm.max) - this.ruleForm.semesters.length + 1; i++ ) {
          //   this.ruleForm.semesters.push(1);
          // }
          this.ruleForm.semesters = []
          for (let i = 0; i <= parseInt(this.ruleForm.no_semester) - 1; i++) {
            this.ruleForm.semesters.push(1)
          }
        }
        // else {
        //   for ( let i = 0; i <= this.ruleForm.semesters.length - parseInt(this.ruleForm.max); i++ ) {
        //     this.ruleForm.semesters.pop();
        //   }
        // }
      } else {
        if (parseInt(this.ruleForm.max) > 0) {
          this.ruleForm.semesters = []
          for (let i = 0; i <= parseInt(this.ruleForm.max) - 1; i++) {
            this.ruleForm.semesters.push(1)
          }
        }
        if (parseInt(this.ruleForm.no_semester) > 0) {
          this.ruleForm.semesters = []
          for (let i = 0; i <= parseInt(this.ruleForm.no_semester) - 1; i++) {
            this.ruleForm.semesters.push(1)
          }
        }

      }

      setTimeout((_) => {
        this.reshow = true
      }, 50)
    },

    openDialog(pool, type) {
      this.formType = type
      this.ruleForm = {
        min_ch: '',
        max: ''
      }
      this.pool_id = null
      this.ruleForm.type = 0
      this.ruleForm.semesters = []
      if (pool) {
        this.ruleForm = { ...pool }
        this.ruleForm.semesters = pool.semesters
        this.ruleForm.min_ch = pool.min_ch ? pool.min_ch : ''
        this.ruleForm.no_semester = pool.no_semester ? pool.no_semester : ''
        this.ruleForm.min_lecture = pool.min_lecture ? pool.min_lecture : ''
        this.ruleForm.min_tutorial = pool.min_tutorial ? pool.min_tutorial : ''
        this.ruleForm.min_lab = pool.min_lab ? pool.min_lab : ''
        this.ruleForm.min_swl = pool.min_swl ? pool.min_swl : ''
        this.ruleForm.min_equivalent_ects = pool.min_equivalent_ects
            ? pool.min_equivalent_ects
            : ''
        this.ruleForm.max = pool.max ? pool.max : ''
        this.pool_id = pool.id
        this.ruleForm.courses = Array.from(pool.courses, (el) => el.id)
      }

      this.pool_dialog = true
      this.buttonDisabled = false
    },
    delete_pool(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
          .then((result) => {
            if (result.value) {
              this.$store.dispatch('programs/delete_pool', { id: id })
                  .then((_) => {
                    this.init()
                    this.$swal({
                      icon: 'success',
                      timer: 1500,
                      showConfirmButton: false,
                      title: this.$t('Global.deleted'),
                    })
                  })
            }
          })
    },
    save_pool() {
      this.$refs.simpleRules1.validate()
          .then((success) => {
            if (success) {
              this.buttonDisabled = true
              this.ruleForm.program_id = this.id
              this.$store
                  .dispatch('programs/save_pool', {
                    id: this.pool_id,
                    query: this.ruleForm,
                  })
                  .then((_) => {
                    this.init()
                    this.pool_dialog = false
                    this.buttonDisabled = false
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
            })
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index })
    },
    save(data) {
      if (this.params && this.params.bylaw_id) {
        this.form.bylaw_id = this.params.bylaw_id
      }
      if (this.params && this.params.faculty_id) {
        this.form.faculty_id = this.params.faculty_id
      }
      const payload = {
        id: this.params && this.params.status == 1 ? null : this.id,
        query: { ...this.form, ...this.formDataContent, ...this.formData },
      }
      this.saveData(data ? data : payload)
          .then((response) => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.init(this.id || response.data.id)
            if (!this.id) {
              this.$router.push({
                name: 'program',
                params: { id: response.data.id },
              })
            }
            this.updateFilterQueryParams({
              tabNum: this.$route.query.tabNum || 0,
              inline: false,
            })
            this.edit = false
          })
          .catch((error) => {
            let errorsdata = this.handleBackendError(error.response && error.response.data.errors)
            EventBus.$emit('errorsdata', errorsdata)
          })
    },
  },
}
</script>
