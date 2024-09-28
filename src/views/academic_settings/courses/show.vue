<template>
  <div>
    <!-- <router-link ref="redirect" :to="route_id ? `/settings/courses/${route_id}` :''"></router-link> -->
    <Add :key="addKey" v-if="edit" :inline="true" @hide="cancel()" @save="save" :courseData="item" @refresh="init"></Add>
    <b-card v-else class="mb-0 custom_columns c-mt-2" :class="load ? 'disabled_all' : ''">
      <div class="custom_actions">
        <b-dropdown v-ripple.400="'rgba(113, 102, 240, 0.15)'" :text="$t('Global.more')" right size="sm" variant="outline-primary">
          <b-dropdown-item @click="exportSpecs('PDF')">
            {{ $t('Global.Export course specs PDF') }}
          </b-dropdown-item>
          <b-dropdown-item @click="exportSpecs('word')">
            {{ $t('Global.Export course specs word') }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-tabs v-if="item" ref="custom_tabs" v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden custom_drop_tabs" align="left">
        <div class="custom_drop mb-2" v-if="$store.getters['app/width'] < 982 && $store.getters['app/width'] != 0" :class="!rerender ? 'py-3' : ''">
          <b-dropdown block :text="$store.getters['app/updateSelectedTab'] ? $store.getters['app/updateSelectedTab'].name : ''" variant="primary">
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
            <feather-icon icon="InfoIcon" />
            <span>{{ $t('Global.basic_info') }}</span></template>
          <ShowComponent
            :data="item"
            :only="['name', 'id', 'name_local', 'code', 'faculty', 'bylaw', 'department', 'lecture_hours', 'tutorial_hours', 'clinical_hours', 'laboratory_hours', 'pre_requisites', 'co_requisites', 'exposed_requisites', 'min_level', 'min_ch_passed', 'removed', 'max_total', 'level', 'type','continuous','graduation_flag']"
            :loading="load"
          >
            <template #edit>
              <div class="mb-2" :class="checkOfferedNow ? '' : 'disabled_with_tooltip'">
                <feather-icon
                  v-if="hasPermission('edit_course')"
                  @click="checkOfferedNow ? openEdit() : ''"
                  style="cursor: pointer"
                  :icon="id ? 'EditIcon' : 'PlusCircleIcon'"
                  class="font-medium-3"
                  v-b-tooltip.hover="id ? (checkOfferedNow ? $t('Global.edit') : $t('Global.not_editing')) : $t('Global.add')"
                />
              </div>
            </template>
            <template #min_level="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.min_level`) }}
              </th>
              <td>
                {{ data.min_level || '-' }}
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
            <template #laboratory_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.laboratory_hours`) }}
              </th>
              <td>
                {{ data.laboratory_hours || '-' }}
              </td>
            </template>
            <template #clinical_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.clinical_hours`) }}
              </th>
              <td>
                {{ data.clinical_hours || '-' }}
              </td>
            </template>
            <template #tutorial_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.tutorial_hours`) }}
              </th>
              <td>
                {{ data.tutorial_hours || '-' }}
              </td>
            </template>

            <template #min_ch_passed="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.min_ch_passed`) }}
              </th>
              <td>
                {{ data.min_ch_passed || '-' }}
              </td>
            </template>

            <template #lecture_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.lecture_hours`) }}
              </th>
              <td>
                {{ data.lecture_hours || '-' }}
              </td>
            </template>

            <template #co_requisites="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.core_requisites`) }}
              </th>
              <td>
                <template v-if="data && data.co_requisites">
                  <div v-for="(course, i) in data.co_requisites" class="mr-sm-1 font-weight-bolder">
                    <b-link target="_blank" v-if="course" :to="{ name: 'course', params: { id: course.id } }" class="font-weight-bold d-block">
                      {{ $i18n.locale == 'en' ? course.name : course.name_local }}
                      <strong class="text-danger">,</strong>
                    </b-link>
                  </div>
                </template>
                <template v-else> -</template>
              </td>
            </template>
            <template #pre_requisites="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.pre_requisites`) }}
              </th>
              <td>
                <template v-if="data && data.pre_requisites">
                  <div v-for="(course, i) in data.pre_requisites" class="mr-sm-1 font-weight-bolder">
                    <b-link target="_blank" v-if="course" :to="{ name: 'course', params: { id: course.id } }" class="font-weight-bold d-block">
                      {{ $i18n.locale == 'ar' ? course.name_local || course.name : '' }}
                      {{ $i18n.locale == 'en' ? course.name || course.name_local : '' }}
                      <strong class="text-danger">,</strong>
                    </b-link>
                  </div>
                </template>
                <template v-else> -</template>
              </td>
            </template>

            <template #department="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.department`) }}
              </th>
              <td>
                <b-link target="_blank" v-if="data.department" :to="{ name: 'department', params: { id: data.department.id } }" class="font-weight-bold d-block">
                  {{ $i18n.locale == 'en' ? data.department.name : data.department.name_local }}
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

              <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
              <td v-if="$i18n.locale == 'ar'">
                {{ data.name }}
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
            <template #removed="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.stage`) }}
              </th>
              <td v-if="data.bylaw && data.bylaw.stage">
                <span v-if="$i18n.locale == 'ar'">
                  {{ data.bylaw.stage.name_local }}
                </span>
                <span v-else>
                  {{ data.bylaw.stage.name }}
                </span>
              </td>
            </template>
            <template #max_total="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.type`) }}
              </th>
              <td v-if="data.bylaw && data.bylaw.type">
                <span v-if="$i18n.locale == 'ar'">
                  {{ data.bylaw.type.name_local }}
                </span>
                <span v-else>
                  {{ data.bylaw.type.name }}
                </span>
              </td>
            </template>
            <template #faculty="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.faculty`) }}
              </th>
              <td>
                <b-link target="_blank" v-if="data.faculty" :to="{ name: 'faculty', params: { id: data.faculty.id } }" class="font-weight-bold d-block">
                  {{ $i18n.locale == 'en' ? data.faculty.name : data.faculty.name_local }}
                </b-link>
              </td>
            </template>
            <template #bylaw="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.bylaw`) }}
              </th>
              <td>
                <b-link target="_blank" v-if="data.bylaw" :to="{ name: 'bylaw', params: { id: data.bylaw.id } }" class="font-weight-bold d-block">
                  {{ $i18n.locale == 'en' ? data.bylaw.name : data.bylaw.name_local }}
                </b-link>
              </td>
            </template>
            <!--            <template #core_requisites="{ data }">-->
            <!--              <th scope="row" :width="'20%'">-->
            <!--                {{ $t(`Global.core_requisites`) }}-->
            <!--              </th>-->
            <!--              <td >-->
            <!--                {{ data.core_requisites && data.core_requisites.name ? data.core_requisites.name : '-' }}-->
            <!--              </td>-->
            <!--            </template>-->
            <template #exposed_requisites="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.exposed_requisites`) }}
              </th>
              <td>
                <template v-if="data && data.exposed_requisites">
                  <div v-for="(course, i) in data.exposed_requisites" class="mr-sm-1 font-weight-bolder">
                    <b-link target="_blank" v-if="course" :to="{ name: 'course', params: { id: course.id } }" class="font-weight-bold d-block">
                      {{ $i18n.locale == 'en' ? course.name : course.name_local }}
                      <strong class="text-danger">,</strong>
                    </b-link>
                  </div>
                </template>
                <template v-else> -</template>
                <!--                <div v-if="data && data.exposed_requisites">-->
                <!--                  {{ $i18n.locale == 'en' ? data.exposed_requisites.name : data.exposed_requisites.name_local }}-->
                <!--                </div>-->
              </td>
            </template> 
            <template #continuous="{ data }" v-if="showContinousAndfinal">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.continuous_course`) }}
              </th>
              <td>
                <!-- <b-form-checkbox v-model="checked" disabled style="margin-top: 6px" class="mt-0 custom-control-primary"/> -->
                {{ data.continuous ? $t('Global.yes') : $t('Global.no') }}
              </td> 
            </template>

            <template #graduation_flag="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.graduation_project`) }}
              </th>
              <td>
                {{ data.graduation_flag ? $t('Global.yes') : $t('Global.no') }}
              </td> 
            </template>

          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="AlignJustifyIcon" />
            <span>{{ $t('Global.course_content') }}</span>
          </template>

          <ShowComponent :data="item" :only="['id', 'description', 'description_local', 'course_aims', 'reference']" :loading="load">
            <template #edit>
              <div class="mb-2" :class="checkOfferedNow ? '' : 'disabled_with_tooltip'">
                <feather-icon
                  v-if="hasPermission('edit_course')"
                  @click="checkOfferedNow ? openEdit() : ''"
                  style="cursor: pointer"
                  :icon="id ? 'EditIcon' : 'PlusCircleIcon'"
                  class="font-medium-3"
                  v-b-tooltip.hover="id ? (checkOfferedNow ? $t('Global.edit') : $t('Global.not_editing')) : $t('Global.add')"
                />
              </div>
            </template>
            <template #course_aims="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.course_aims`) }}
              </th>
              <td>
                {{ data.course_aims || '-' }}
              </td>
            </template>
            <template #reference="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.reference`) }}
              </th>
              <td>
                {{ data.reference || '-' }}
              </td>
            </template>
            <template #id="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.english_description`) }}
              </th>
              <td>
                {{ data.description || '-' }}
              </td>
            </template>
            <template #description="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.description_local`) }}
              </th>
              <td>
                {{ data.description_local || '-' }}
              </td>
            </template>
            <template #description_local="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.description_local`) }}
              </th>
              <td>
                {{ data.description_local || '-' }}
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="PaperclipIcon" />
            <span>{{ $t('Global.course_load') }}</span></template
          >
          <ShowComponent :data="item" :only="['credit_hours', 'equivalent_ects', 'required_swl']" :loading="load">
            <template #edit>
              <div class="mb-2" :class="checkOfferedNow ? '' : 'disabled_with_tooltip'">
                <feather-icon
                  v-if="hasPermission('edit_course')"
                  @click="checkOfferedNow ? openEdit() : ''"
                  style="cursor: pointer"
                  :icon="id ? 'EditIcon' : 'PlusCircleIcon'"
                  class="font-medium-3"
                  v-b-tooltip.hover="id ? (checkOfferedNow ? $t('Global.edit') : $t('Global.not_editing')) : $t('Global.add')"
                />
              </div>
            </template>
            <template #credit_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.credit_hours`) }}
              </th>
              <td>
                {{ data.credit_hours || '-' }}
              </td>
            </template>
            <template #equivalent_ects="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.equivalent_ECTS`) }}
              </th>
              <td>
                {{ data.equivalent_ects || '-' }}
              </td>
            </template>
            <template #required_swl="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.required_SWL`) }}
              </th>
              <td>
                {{ data.required_swl || '-' }}
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="MonitorIcon" />
            <span>{{ $t('Global.assessment_criteria') }}</span></template
          >
          <ShowComponent :data="item" :only="['marks', 'pass_fail','final_exam_first_semester']" :loading="load">
            <template #edit>
              <div class="mb-2" :class="checkOfferedNow ? '' : 'disabled_with_tooltip'">
                <feather-icon
                  v-if="hasPermission('edit_course')"
                  @click="checkOfferedNow ? openEdit() : ''"
                  style="cursor: pointer"
                  :icon="id ? 'EditIcon' : 'PlusCircleIcon'"
                  class="font-medium-3"
                  v-b-tooltip.hover="id ? (checkOfferedNow ? $t('Global.edit') : $t('Global.not_editing')) : $t('Global.add')"
                />
              </div>
            </template>
            <template #pass_fail="{ data }">
              <th scope="row" :width="'40%'">
                {{ $t(`Global.pass_fail`) }}
              </th>
              <td>
                {{ data.pass_fail ? $t('Global.yes') : $t('Global.no') }}
              </td>
            </template>

            <template #final_exam_first_semester="{ data }" v-if="showContinousAndfinal">
              <th scope="row" :width="'40%'">
                {{ $t(`Global.final_exam_in_first_semester`) }}
              </th>
              <td>
                {{ data.final_exam_first_semester ? $t('Global.yes') : $t('Global.no') }}
              </td>
            </template>

            <template #marks="{ data }">
              <th scope="row" :width="'40%'">
                {{ $t(`Global.marks`) }}
              </th>
              <td>
                <!--                {{data.marks}}-->
                <div v-for="mark in data.marks">
                  <strong>{{ $i18n.locale == 'ar' ? mark.name_local : mark.name }}:</strong>
                  <span class="mx-1">{{ mark.max ? mark.max : '-' }},</span>
                </div>
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t('Exam Durations') }}</span></template
          >
          <ShowComponent :data="item" :only="['midterm_hours', 'finalexam_hours']" :loading="load">
            <template #edit>
              <div class="mb-2" :class="checkOfferedNow ? '' : 'disabled_with_tooltip'">
                <feather-icon
                  v-if="hasPermission('edit_course')"
                  @click="checkOfferedNow ? openEdit() : ''"
                  style="cursor: pointer"
                  :icon="id ? 'EditIcon' : 'PlusCircleIcon'"
                  class="font-medium-3"
                  v-b-tooltip.hover="id ? (checkOfferedNow ? $t('Global.edit') : $t('Global.not_editing')) : $t('Global.add')"
                />
              </div>
            </template>
            <template #midterm_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Midterm Hours`) }}
              </th>
              <td>
                {{ data.midterm_hours || '-' }}
              </td>
            </template>
            <template #finalexam_hours="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Final Exam Hours`) }}
              </th>
              <td>
                {{ data.finalexam_hours || '-' }}
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="ServerIcon" />
            <span>{{ $t('Global.programs') }}</span>
          </template>
          <Programs :course_id="id" :bylaw_id="item ? item.bylaw_id : 0" action_hide :inner-title="$t('Global.mandatory_programs')" />

          <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :fields="fields_pool" :items="item ? item.university_pools : []" striped responsive="sm">
            <template #thead-top="data">
              <b-tr>
                <b-th variant="warning" colspan="2">
                  <strong class="text-primary font-medium-2 pb-1">
                    {{ $t('Global.elective_university_requirement') }}
                  </strong>
                </b-th>
              </b-tr>
            </template>
            <template #cell(name)="data">
              <b-link :to="{ name: 'programs', params: { id: data.item.id } }" v-if="data.item.program">
                {{ $i18n.locale == 'ar' ? data.item.program.name_local : data.item.program.name }}
              </b-link>
            </template>
            <template #cell(pool)="data">
              {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name }}
            </template>
          </b-table>
          <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :fields="fields_pool" :items="item ? item.faculty_pools : []" striped responsive="sm">
            <template #thead-top="data">
              <b-tr>
                <b-th variant="warning" colspan="2">
                  <strong class="text-primary font-medium-2 pb-1">
                    {{ $t('Global.elective_faculty_requirement') }}
                  </strong>
                </b-th>
              </b-tr>
            </template>
            <template #cell(name)="data">
              <b-link :to="{ name: 'programs', params: { id: data.item.id } }" v-if="data.item.program">
                {{ $i18n.locale == 'ar' ? data.item.program.name_local : data.item.program.name }}
              </b-link>
            </template>
            <template #cell(pool)="data">
              {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name }}
            </template>
          </b-table>
          <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :fields="fields" :items="item ? item.pools : []" striped responsive="sm">
            <template #thead-top="data">
              <b-tr>
                <b-th variant="warning" colspan="2">
                  <strong class="text-primary font-medium-2 pb-1">
                    {{ $t('Global.elective_program') }}
                  </strong>
                </b-th>
              </b-tr>
            </template>
            <template #cell(name)="data">
              <b-link :to="{ name: 'program', params: { id: data.item.program.id } }" v-if="data.item && data.item.program">
                {{ $i18n.locale == 'ar' ? data.item.program.name_local : data.item.program.name }}
              </b-link>
            </template>
            <template #cell(pool)="data">
              {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name }}
            </template>
          </b-table>
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="LinkIcon" />
            <span>{{ $t('Global.linked_offerings') }}</span>
          </template>

          <b-table :items="item ? item.linked_offerings : []" responsive striped :fields="offerings_fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
            <template #cell(id)="data">
              <b-link :to="{ name: 'offering', params: { id: data.item.id } }" class="font-weight-bold">
                {{ data.item.id }}
              </b-link>
            </template>
            <template #cell(course)="data">
              <b-link v-if="$i18n.locale == 'en'" :to="{ name: 'course', params: { id: data.item.course.id } }" class="font-weight-bold">
                {{ data.item.course.code ? data.item.course.code : ' ' }} {{ data.item.course ? (data.item.course.name ? data.item.course.name : data.item.course.name_local) : '_' }}
              </b-link>
              <b-link v-if="$i18n.locale == 'ar'" :to="{ name: 'course', params: { id: data.item.course.id } }">
                {{ data.item ? (data.item.course.name_local ? data.item.course.name_local : data.item.course.name) : '_' }}
              </b-link>
            </template>
          </b-table>

          <!--          <Offerings :course_id="id" listed_only />-->
        </b-tab>

        <b-tab v-if="id && hasPermission('access_courseOutcome')">
          <template #title>
            <feather-icon icon="BoxIcon" />
            <span>{{ $t('Global.course_outcomes') }}</span>
          </template>
          <Outcomes />

          <!-- <TabTable
            no-details
            head
            :title2="$t('Global.course_outcomes')"
            :loading="load"
            :items="[{ type: 1, group: 'test', learning_outcome: 'learning_outcome', plans_outcome: 'plans_outcome' }]"
            :fields="[
              { key: 'type', label: this.$t('Global.type'), thStyle: { width: '10%' } },
              { key: 'group', label: this.$t('Global.group'), thStyle: { width: '10%' } },
              {
                key: 'learning_outcome',
                label: this.$t('Global.learning_outcome'),
              },
              {
                key: 'plans_outcome',
                label: this.$t('Global.plans_outcome'),
              },
            ]"
          >
            <template #action>
              <b-button v-b-tooltip.hover="$t('Global.add')" v-if="hasPermission('edit_bylaw')" variant="primary" class="btn-icon" @click="openDialog()">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </template>
          </TabTable> -->
        </b-tab>

        <b-tab v-if="id && hasPermission('access_courseTopic')">
          <template #title>
            <feather-icon icon="CommandIcon" />
            <span>{{ $t('Global.course_topics') }}</span>
          </template>
          <Topics />
          <!-- <TabTable
            no-details
            head
            :title2="$t('Global.course_topics')"
            :loading="load"
            :items="[{ order: 1, contents: 'test', lecture_hours: '2', tutorial_hours: '3', laboratory_hours: '4', plans_outcome: 'plans_outcome' }]"
            :fields="[
              { key: 'order', label: this.$t('Global.order'), thStyle: { width: '10%' } },
              { key: 'contents', label: this.$t('Global.contents') },
              {
                key: 'lecture_hours',
                label: this.$t('Global.lecture_hours'),
                thStyle: { width: '10%' },
              },
              {
                key: 'tutorial_hours',
                label: this.$t('Global.tutorial_hours'),
                thStyle: { width: '10%' },
              },
              {
                key: 'laboratory_hours',
                label: this.$t('Global.laboratory_hours'),
                thStyle: { width: '10%' },
              },
              {
                key: 'outcomes',
                label: this.$t('Global.outcomes'),
                thStyle: { width: '20%' },
              },
            ]"
          >
            <template #action>
              <b-button v-b-tooltip.hover="$t('Global.add')" v-if="hasPermission('edit_bylaw')" variant="primary" class="btn-icon" @click="openAddCourseTopics()">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </template>
            <template #status>
              <b-badge v-for="item in hour_status" pill :variant="item.type" class="text-capitalize ml-1">
                <small>{{ item.count }} {{ $t(`Global.${item.name}`) }}</small>
              </b-badge>
            </template>
          </TabTable> -->
        </b-tab>

        <b-tab v-if="id && hasPermission('access_courseMethod')">
          <template #title>
            <feather-icon icon="ApertureIcon" />
            <span>{{ $t('Global.teaching_learning_methods') }}</span>
          </template>
          <Methods />
          <!-- <TabTable
            no-details
            head
            :title2="$t('Global.teaching_learning_methods')"
            :loading="load"
            :items="[{ title: 'title test', outcomes: 'plans_outcome' }]"
            :fields="[
              { key: 'title', label: this.$t('Global.title'), },
              {
                key: 'outcomes',
                label: this.$t('Global.outcomes'),
              },
            ]"
          >
            <template #action>
              <b-button v-b-tooltip.hover="$t('Global.add')" v-if="hasPermission('edit_bylaw')" variant="primary" class="btn-icon" @click="openAddTeachingLearningMethods()">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </template>
          </TabTable> -->

          <b-modal id="course_outcomes" v-model="course_outcomes" no-close-on-backdrop size="lg" :title="$t('Global.course_outcomes')">
            <validation-observer ref="simpleRules1">
              <b-form :class="load ? 'disabled_all' : ''">
                <div class="row">
                  <b-col md="10">
                    <b-form-group>
                      <validation-provider #default="{ errors }" rules="required">
                        <v-select :filter="fuseSearch" multiple v-model="form.courses" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.course_outcomes_type')">
                          <template slot="selected-option" slot-scope="option">
                            <span>
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                              <!--                                            {{ $t(`Global.${option.label}`) }}-->
                            </span>
                          </template>
                          <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <validation-provider #default="{ errors }" name="modifier" rules="required">
                        <b-form-input :placeholder="$t('Global.modifier')" id="modifier" v-model="form.modifier" :state="errors.length > 0 ? false : null" />
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group :label="$t('Global.learning_outcome')">
                      <validation-provider #default="{ errors }" name="outcomes">
                        <b-form-textarea class="mb-2" :placeholder="$t('Global.outcome')" id="outcome-input" v-model="form.learning_outcome" rows="3" />
                        <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'learning_outcome')" />
                      </validation-provider>

                      <validation-provider #default="{ errors }" rules="required">
                        <v-select :filter="fuseSearch" multiple v-model="form.plan_outcomes" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.plan_outcomes_search')">
                          <template slot="selected-option" slot-scope="option">
                            <span>
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                              <!--                                            {{ $t(`Global.${option.label}`) }}-->
                            </span>
                          </template>
                          <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </div>
              </b-form>
            </validation-observer>
            <template #modal-footer>
              <b-row :class="load ? 'disabled_all' : ''">
                <b-col md="12">
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="saveCourseOutcomes">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="course_outcomes = false">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </b-modal>

          <b-modal id="course_topics" v-model="course_topics" no-close-on-backdrop size="lg" :title="$t('Global.course_topics')">
            <validation-observer ref="simpleRules1">
              <b-form :class="load ? 'disabled_all' : ''">
                <div class="row">
                  <b-col md="12">
                    <b-form-group class="mb-0" :label="$t('Global.lecture_content')">
                      <validation-provider #default="{ errors }" name="lecture_content">
                        <b-form-textarea class="mb-2" :placeholder="$t('Global.lecture_content')" id="outcome-input" v-model="form.lecture_content" rows="1" />
                        <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'lecture_content')" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group class="mb-0" :label="$t('Global.tutorial_content')">
                      <validation-provider #default="{ errors }" name="tutorial_content">
                        <b-form-textarea class="mb-2" :placeholder="$t('Global.tutorial_content')" id="outcome-input" v-model="form.tutorial_content" rows="1" />
                        <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'tutorial_content')" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group class="mb-0" :label="$t('Global.practical_content')" label-for="practical_content">
                      <validation-provider #default="{ errors }" name="practical_content">
                        <b-form-textarea class="mb-2" :placeholder="$t('Global.practical_content')" id="outcome-input" v-model="form.practical_content" rows="1" />
                        <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'practical_content')" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group :label="$t('Global.lecture_hours')" label-for="lecture_hours">
                      <validation-provider #default="{ errors }" name="lecture_hours" rules="required">
                        <b-form-input id="lecture_hours" v-model="form.lecture_hours" :state="errors.length > 0 ? false : null" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group :label="$t('Global.tutorial_hours')" label-for="tutorial_hours">
                      <validation-provider #default="{ errors }" name="tutorial_hours" rules="required">
                        <b-form-input id="tutorial_hours" v-model="form.tutorial_hours" :state="errors.length > 0 ? false : null" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group :label="$t('Global.practical_hours')" label-for="practical_hours">
                      <validation-provider #default="{ errors }" name="practical_hours" rules="required">
                        <b-form-input id="practical_hours" v-model="form.practical_hours" :state="errors.length > 0 ? false : null" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group :label="$t('Global.order')" label-for="order">
                      <validation-provider #default="{ errors }" name="order" rules="required">
                        <b-form-input id="order" v-model="form.order" :state="errors.length > 0 ? false : null" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <validation-provider #default="{ errors }" rules="required">
                      <v-select :filter="fuseSearch" multiple v-model="form.outcomes" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.outcomes_search')">
                        <template slot="selected-option" slot-scope="option">
                          <span>
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                          </span>
                        </template>
                        <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-col>
                </div>
              </b-form>
            </validation-observer>
            <template #modal-footer>
              <b-row :class="load ? 'disabled_all' : ''">
                <b-col md="12">
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="saveCourseTopics">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="course_topics = false">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </b-modal>

          <b-modal id="teaching_learning_methods" v-model="teaching_learning_methods" no-close-on-backdrop size="lg" :title="$t('Global.teaching_learning_methods')">
            <validation-observer ref="simpleRules1">
              <b-form :class="load ? 'disabled_all' : ''">
                <div class="row">
                  <b-col md="12">
                    <b-form-group class="mb-1" :label="$t('Global.course_method')">
                      <validation-provider #default="{ errors }" rules="required">
                        <v-select :filter="fuseSearch" v-model="form.course_method" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.course_method')">
                          <template slot="selected-option" slot-scope="option">
                            <span>
                              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                            </span>
                          </template>
                          <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group class="mb-1" :label="$t('Global.title')">
                      <validation-provider #default="{ errors }" name="title">
                        <b-form-textarea class="mb-2" :placeholder="$t('Global.title')" id="outcome-input" v-model="form.title" rows="1" />
                        <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'title')" />
                      </validation-provider>
                    </b-form-group>
                    <validation-provider #default="{ errors }" rules="required">
                      <v-select :filter="fuseSearch" multiple v-model="form.outcomes" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.outcomes')">
                        <template slot="selected-option" slot-scope="option">
                          <span>
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                          </span>
                        </template>
                        <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                      </v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-col>
                </div>
              </b-form>
            </validation-observer>
            <template #modal-footer>
              <b-row :class="load ? 'disabled_all' : ''">
                <b-col md="12">
                  <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="saveTeachingLearningMethods">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="teaching_learning_methods = false">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </b-modal>
        </b-tab>
        <b-tab v-if="id && hasPermission('access_courseAssessment')">
          <template #title>
            <feather-icon icon="ArchiveIcon" />
            <span>{{ $t('Global.assessments') }}</span>
          </template>
          <Assessments :max_total="item.max_total" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { BTab, BTabs, BLink, BCard, BModal, BDropdown, BDropdownItem, BAvatar, BTable, BTh, BTr, BButton, BCol, BForm, BBadge, BFormCheckbox, BFormGroup, BFormInput, BRow, BFormTextarea } from 'bootstrap-vue';
import List from '@/views/components/info/list';
import Programs from '@/views/academic_settings/programs/components/programs';
import CourseOutcomes from '@/views/quality/outcomes/components/outcomes';
import Edit from '@/views/academic_settings/courses/edit';
import Add from '@/views/academic_settings/courses/add';
import ShowComponent from '@/views/components/info/show';
import Offerings from '@/views/study/offerings/components/offerings';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { EventBus } from '../../../main';
import TabTable from '@/views/students/student/components/TabTable';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';
import vSelect from 'vue-select';
import Outcomes from '@/views/quality/outcomes/components/outcomes.vue';
import Topics from '@/views/quality/topics/components/topics.vue';
import Methods from '@/views/quality/methods/components/methods.vue';
import Assessments from '@/views/quality/assessments/components/assessments.vue';

export default {
  name: 'Show',
  components: {
    CourseOutcomes,
    Topics,
    Methods,
    Offerings,
    Assessments,
    BDropdown,
    BButton,
    BModal,
    TabTable,
    BDropdownItem,
    Add,
    Edit,
    BLink,
    BTable,
    BTh,
    BTr,
    Programs,
    List,
    ShowComponent,
    BTab,
    BTabs,
    BCard,
    BCol,
    BRow,
    BAvatar,
    BBadge,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
    vSelect,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormCheckbox,
    Outcomes,
  },
  computed: {
    ...mapGetters({
      item: 'courses/item',
      load: 'courses/load',
      outcomes: 'outcomes/items',
      load_data: 'app/load',
    }),
    showContinousAndfinal(){
      if(this.item){
        return (this.item.bylaw.type.id == 2)?true:false;
      }
      return false;
    },
    checked(){
      if(this.item){
        return this.item.continuous;
      }
    },
    checkOfferedNow() {
      if (this.item.offered_now == 1) {
        return false;
      } else {
        return true;
      }
    },
    hour_status() {
      return [
        { name: 'lecture_hours', count: 3, type: 'danger' },
        { name: 'tutorial_hours', count: 5, type: 'success' },
        { name: 'laboratory_hours', count: 6, type: 'info' },
      ];
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields() {
      return [
        {
          key: 'name',
          label: this.$t('Global.name'),
        },
        {
          key: 'pool',
          label: this.$t('Global.pool_name'),
        },
      ];
    },
    offerings_fields() {
      let fields = [
        {
          key: 'id',
          label: this.$t('Global.id'),
          sortable: true,
        },
        {
          key: 'course',
          label: this.$t('Global.course'),
          sortable: true,
        },
        {
          key: 'instructors',
          label: this.$t('Global.instructors'),
          sortable: true,
        },
      ];

      return fields;
    },
    fields_pool() {
      return [
        {
          key: 'pool',
          label: this.$t('Global.pool_name'),
        },
      ];
    },
  },

  mounted() {
    this.init();
  },
  data() {
    return {
      addKey: 1,
      edit: false,
      route_id: null,
      tabIndex: 0,
      formData: null,
      formDataContent: null,
      formDataLoad: null,
      formDataMarks: null,
      formDataExam: null,
      course_outcomes: false,
      course_topics: false,
      teaching_learning_methods: false,
      form: {},
    };
  },
  watch: {
    $route(from, to) {
      // if ((from.params.id || from.params.bylaw_id) && (from.name == 'course_add' || from.name == 'course')) {
      //   this.addKey += 1;
      // }
    },
    tabIndex: function (val) {
      EventBus.$emit('changeTabNumber', val);
    },
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
    }
  },
  created() {
    window.addEventListener('resize', this.handleResizeGlobal);
    EventBus.$on('changeForm', data => {
      this.formData = data;
    });
    EventBus.$on('changeContentTab', data => {
      this.formDataContent = data;
    });
    EventBus.$on('changeLoadTab', data => {
      this.formDataLoad = data;
    });
    EventBus.$on('changeMarksTab', data => {
      this.formDataMarks = data;
    });
    EventBus.$on('changeExamTab', data => {
      this.formDataExam = data;
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResizeGlobal);
  },
  methods: {
    ...mapActions({
      coursesOutComes: 'outcomes/outcomes',
      exportSpecsAction: 'courses/exportSpecs',
    }),
    // setSelectedTab(num) {
    //   this.selectedTab = num.id;
    //   this.inputTab = num.id;
    //   this.rerender = false;
    //   setTimeout(() => {
    //     this.rerender = true;
    //   }, 10);
    // },
    exportSpecs(type) {
      this.exportSpecsAction({ type: type, id: this.$route.params.id });
    },
    openDialog() {
      this.course_outcomes = true;
    },
    openAddCourseTopics() {
      this.course_topics = true;
    },
    openAddTeachingLearningMethods() {
      this.teaching_learning_methods = true;
    },
    saveCourseOutcomes() {},
    saveCourseTopics() {},
    saveTeachingLearningMethods() {},
    save(data) {
      let payload = {};
      payload = {
        id: this.id || null,
        query: data,
      };
      // payload.query.pass_fail = payload.data.pass_fail ? true :false
      // if(data){
      //   payload =  {
      //     id: this.id || null,
      //     query: {...this.formData, ...this.formDataContent, ...this.formDataLoad, ...this.formDataMarks, ...this.formDataExam ,...data},
      //   };
      //   if(this.tabIndex == 1 || this.tabIndex == 2 || this.tabIndex == 4){
      //     payload.query.marks = this.item.marks
      //   }
      // }
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
            this.init(response.data.id);
            // if (this.inline) {
            this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
            this.cancel();
            // }
          })
          .catch(error => {
            if (error.response) {
              EventBus.$emit('errorForm', error.response);
              this.errorToast(this.$t('check_form_errors'));
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
    },
    cancel(id) {
      this.edit = false;
      if (id || this.id) {
        const payload = { id: id || this.id, type: 3 };
        this.$store.dispatch('courses/get', payload);
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        } else {
          this.edit = false;
        }
      } else {
        this.edit = true;
      }
    },
    openEdit() {
      this.addKey += 1;
      if (this.id) {
        const payload = { id: this.id, type: 4 };
        this.$store.dispatch('courses/get', payload);
      }
      this.edit = true;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
    },
    open(id) {
      window.open(this.$router.resolve({ name: 'course_edit', params: { id } }).href, '_blank');
    },
    init(id) {
      if (id || this.id) {
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        } else {
          const payload = { id: id || this.id, type: 3 };
          this.$store.dispatch('courses/get', payload).then(() => {
            this.$nextTick(_ => {
              this.setPageTabs();
            });
          });
        }
      } else {
        this.edit = true;
      }
    },
  },
};
</script>

<style lang="scss">
.custom_columns {
  .card-body {
    .tabs {
      // flex-wrap: nowrap;
    }
  }
}
@media screen and (max-width: 780px) {
  .c-mt-2 {
    margin-top: 3rem;
  }
}
@media screen and (max-width: 391px) {
  .c-mt-2 {
    margin-top: 5rem;
  }
}
</style>
