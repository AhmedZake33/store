<template>
    <div>
      <statistics v-if="$route.params.id" :items="item" :widths="[3,3,3,3,3,3,3]" :only="['bylaws_count', 'courses_count', 'programs_count', 'departments_count', 'staff_count','graduated_count','current_count']"></statistics>
      <b-card class="mb-0 custom_margin">
        <!-- <div v-if="edit">
          <b-card-header class="flex-wrap text-initial mx-1_3" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; padding-left: 0rem">
            <div v-if="edit" class="d-flex align-items-center">
              <feather-icon icon="EditIcon" size="16" />
              <strong class="mx-1">
                {{ $t('Global.faculty_edit') }}
              </strong>
              <slot name="status" />
            </div>
          </b-card-header>
          <hr class="mt-0" />
        </div> -->
        <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left" style="overflow: auto">
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
              <span>{{ $t('Global.basic_info') }}</span></template
            >
                <!-- item {{ item }} -->
            <edit v-if="edit" :data="item" @hide="cancel()" :inline="true" @refresh="init"></edit>
            <div v-else>
              <ShowComponent v-if="item" :data="item" :only="['name', 'name_local', 'id', 'code', 'type_data','emtyaz','total_weeks']" :loading="load">
                <template #edit>
                  <div class="mb-2">
                    <feather-icon v-if="hasPermission('edit_faculty')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                  </div>
                </template>
                <template #emtyaz="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.emtyaz`) }}
                  </th>
                  <td v-if="$i18n.locale == 'en'">
                    {{ data.emtyaz == 1 ? 'Yes' :'No' }}
                  </td>
                  <td v-else>
                    {{ data.emtyaz == 1 ? 'نعم' :'لا' }}
                  </td>
                </template>
                <template #total_weeks="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.total_weeks`) }}
                  </th>
                  <td v-if="$i18n.locale == 'en'">
                    {{ data.total_weeks }}
                  </td>
                </template>
                <template #code="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.facultyCode`) }}
                  </th>
                  <td >
                    {{ data.code }}
                  </td>
                </template>
  
                <template #id="{ data }">
                  <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
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
  
                <template #type_data="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.type`) }}
                  </th>
                  <td v-if="$i18n.locale== 'ar'">
                    {{ data.type_data.name_local }}
                  </td>
                  <td v-else>
                    {{ data.type_data.name }}
                  </td>
                </template>
              </ShowComponent>
            </div>
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="FileTextIcon" />
              <span>{{ $t('Global.bylaws') }}</span>
            </template>
            <Bylaws v-if="checkTabVisited(1)" :excel_name="item.name" :tabNum="1" :inline="true" noFaculty :faculty_id="id"></Bylaws>
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="CommandIcon" />
              <span>{{ $t('Global.departments') }}</span></template
            >
            <Department v-if="checkTabVisited(2)" :tabNum="2" :excel_name="item.name" noStatus :faculty_id="id" :inside="true" :inline="true"></Department>
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="ListIcon" />
              <span>{{ $t('Global.courses') }}</span></template
            >
            <Courses v-if="checkTabVisited(3)" :tabNum="3" :excel_name="item.name" :faculty_dep_id="id" :faculty_id="id" :inline="true"></Courses>
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t('Global.programs') }}</span></template
            >
            <Programs v-if="checkTabVisited(4)" :tabNum="4" :excel_name="item.name" :faculty_id="id" :inline="true" />
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t('Global.staff') }}</span></template
            >
            <Instructors v-if="checkTabVisited(5)" :tabNum="5" :excel_name="item.name" :faculty_id="id" :inline="true"></Instructors>
          </b-tab>
          <b-tab v-if="$route.params.id">
            <template #title>
              <feather-icon icon="UserIcon" />
              <span>{{ $t('Global.students') }}</span></template
            >
            <Students v-if="checkTabVisited(6)" :tabNum="6" noStatus :faculty_id="id"></Students>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </template>
  
  <script>
  import List from '@/views/components/info/list';
  import { mapGetters } from 'vuex';
  import { BTab, BTabs,BDropdownItem,BDropdown, BCard, BCol, BRow, BAvatar } from 'bootstrap-vue';
  import Programs from '@/views/academic_settings/programs/components/programs';
  import Courses from '@/views/academic_settings/courses/components/courses';
  import Department from '@/views/academic_settings/departments/components/departments';
  import Bylaws from '@/views/academic_settings/bylaws/components/bylaws';
  import Statistics from '@/views/components/info/statistics';
  import Students from '@/views/students/student/components/students';
  import Instructors from '@/views/user_settings/staff/components/instructors';
  import Edit from '@/views/academic_settings/faculties/edit';
  import ShowComponent from '@/views/components/info/show';
  
  export default {
    name: 'show',
    components: {
      Edit,
      Instructors,
      BDropdownItem,BDropdown,
      Students,
      Statistics,
      Bylaws,
      Courses,
      Programs,
      List,
      Department,
      BTab,
      BTabs,
      BCard,
      BCol,
      BRow,
      BAvatar,
      ShowComponent,
    },
    computed: {
      ...mapGetters({
        item: 'faculties/item',
        load: 'faculties/load',
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },
  
    data() {
      return {
        edit: false,
        tabIndex: 0,
        visitedTabs: [],
        index: 0,
      };
    },
    beforeMount() {
      if (this.$route.query) {
        this.tabIndex = Number(this.$route.query.tabNum);
        this.visitedTabs.push(this.tabIndex);
      }
    },
    mounted() {
      this.init();
    },
    destroyed() {
      //to reset tab filter data
      this.$store.dispatch('app/resetTabsFilter');
    },
    methods: {
      init(id) {
        if(this.id || id){
          this.$store.dispatch('faculties/get', id||this.id).then(_=>{
            this.$nextTick(_ => {
              this.setPageTabs();
            });
          });
          this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
        }else{
          this.edit = true;
        }
      },
      openEdit() {
        this.edit = true;
        this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
      },
      cancel() {
        this.edit = false;
        this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
      },
      saveStatus(index) {

        this.updateFilterQueryParams({ tabNum: index, ...this.getTabFilterData(index), inline: false });
        if (this.$route.query.inline == 'false' && index != 0) {
          this.edit = false;
          // this.resetFilterQueryParams({});
        }
        this.visitedTabs.push(index);
      },
      checkTabVisited(index) {
        return this.visitedTabs.includes(index);
      },
    },
    watch: {
      tabIndex: function (val) {
        if (val != 1 && val != 2) {
          this.updateFilterQueryParams({ bread: null }, 'bread');
        } else if ((val == 2 || val == 1) && this.inline) {
          this.updateFilterQueryParams({ bread: 'add' });
        }
      },
    },
  };
  </script>
  
  <style scoped></style>
  