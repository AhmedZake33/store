<template>
  <div>
    <statistics :items="item" :only="['courses_count', 'staff_count']" />
    <b-card class="mb-0 custom_margin">
      <!-- <div v-if="edit">
        <b-card-header class="flex-wrap text-initial mx-1_3" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; padding-left: 0rem">
          <div v-if="edit" class="d-flex align-items-center">
            <feather-icon icon="EditIcon" size="16" />
            <strong class="mx-1">
              {{ $t('Global.department_edit') }}
            </strong>
            <slot name="status" />
          </div>
        </b-card-header>
        <hr class="mt-0" />
      </div> -->
      <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left">
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
            <feather-icon icon="FileTextIcon" />
            <span>{{ $t('Global.basic_info') }}</span></template
          >
          <edit v-if="edit" :data="id?item:{'name':'', 'name_local':'', 'id':'', 'code':'', 'faculty':''}" :inline="true" @hide="cancel()" @Refresh="init" />
          <div v-else>
            <ShowComponent v-if="item" :data="item" :only="['name', 'name_local', 'id', 'code', 'faculty']" :loading="load">
              <template #id="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                  {{ $t(`Global.name_local`) }}
                </th>
                <td  v-if="$i18n.locale == 'en'">
                  {{ data.name_local }}
                </td>

                <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
                <td  v-if="$i18n.locale == 'ar'">
                  {{ data.name }}
                </td>
              </template>
              <template #code="{ data }">
              <template v-if="data.code">
              
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.code`) }}
                </th>
                <td >
                  {{ data.code || '-' }}
                </td>
                  
                
              </template>
              </template>
              <template #name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>
                <td >
                  {{ data.name }}
                </td>
              </template>
              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td >
                  {{ data.name_local }}
                </td>
              </template>
              <template #faculty="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.faculty`) }}
                </th>
                <td  v-if="data.faculty">
                  <b-link target="_blank" v-b-tooltip.hover="data.faculty.name" :to="{ name: 'faculty', params: { id: data.faculty.id } }" class="font-weight-bold d-block">
                    {{ $i18n.locale == 'en' ? data.faculty.name : data.faculty.name_local }}
                  </b-link>
                </td>
              </template>
              <template #edit>
                <div class="mb-2">
                  <feather-icon v-b-tooltip.hover="$t('Global.edit')" style="cursor: pointer" icon="EditIcon" class="font-medium-3" @click="openEdit()" />
                  <!--                  <b-button @click="edit = true" title="Edit" style="width: 100px" to="" variant="primary"> Edit </b-button>-->
                </div>
              </template>
            </ShowComponent>
          </div>
        </b-tab>

        <b-tab v-if="id">
          <template #title
            ><feather-icon icon="BookOpenIcon" /><span>{{ $t('Global.courses') }}</span></template
          >
          <Courses v-if="checkTabVisited(1)" :excel_name="item.name" :tabNum="1" :faculty_dep_id="item.faculty_id" :department_id="id" :inline="true" />
        </b-tab>
        <b-tab v-if="id">
          <template #title>
            <feather-icon icon="UserIcon" />
            <span>{{ $t('Global.staff') }}</span></template
          >
          <Instructors v-if="checkTabVisited(2)" :excel_name="item.name" :tabNum="2" :department_id="id" :inline="true" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BLink, BTab,BDropdown,BDropdownItem, BTabs, BCard } from 'bootstrap-vue';
import List from '@/views/components/info/list';
import ShowComponent from '@/views/components/info/show';
import Statistics from '@/views/components/info/statistics';
import Instructors from '@/views/user_settings/staff/components/instructors';
import Edit from '@/views/academic_settings/departments/edit';
import Courses from '@/views/academic_settings/courses/components/courses';

export default {
  name: 'Show',
  components: {
    ShowComponent,
    Courses,
    Edit,
    Instructors,
    BDropdown,BDropdownItem,
    Statistics,
    List,
    BLink,
    BTab,
    BTabs,
    BCard,
  },
  computed: {
    ...mapGetters({
      item: 'departments/item',
      load: 'departments/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },

  data() {
    return {
      edit: false,
      visitedTabs: [],
      tabIndex: 0,
      index: 0,
    };
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
      this.visitedTabs.push(this.tabIndex);
    }
  },
  destroyed() {
    //to reset tab filter data
    this.$store.dispatch('app/resetTabsFilter');
  },
  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      if(this.id || id){
        this.$store.dispatch('departments/get', id||this.id).then(_=>{
          this.$nextTick(_ => {
              this.setPageTabs();
            });
        });
        this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
      }else{
        this.edit = true
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
    checkTabVisited(index) {
      return this.visitedTabs.includes(index);
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index, ...this.getTabFilterData(index), inline: false });
      if (this.$route.query.inline == 'false' && index != 0) {
        this.edit = false;
        // this.resetFilterQueryParams({});
      }
      this.visitedTabs.push(index);
    },
  },
};
</script>

<style lang="scss">
  .custom_margin .card-body{
    padding:1.5rem 2rem;
  }
</style>
