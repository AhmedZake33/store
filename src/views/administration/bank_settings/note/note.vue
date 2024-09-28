<template>
    <div>
      <b-card class="mb-0 custom_margin">
        <!-- <b-tabs v-model="tabIndex" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left" style="overflow: auto"> -->
          <!-- <b-tab>
            <template #title>
              <feather-icon icon="InfoIcon" />
              <span>{{ $t('Global.basic_info') }}</span></template
            > -->
                <!-- item {{ items }} -->
            <edit v-if="edit" :data="items"  @hide="cancel()" :inline="true" @refresh="init"></edit>
            <div v-else>

              <ShowComponent  :data="items" :only="['name','name_local']" :loading="load">
                <template #edit>
                  <div class="mb-2">
                    <feather-icon v-if="hasPermission('edit_note_bank')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                  </div>
                </template>
  
                <template #name="{ data }">
                  <th scope="row" :width="'20%'" >
                    {{ $t(`Global.note`) }}
                  </th>
                  <td :width="'80%'">
                    {{ data.value }}
                  </td>
                </template>
                <template #name_local="{ data }">
                  <th scope="row" :width="'20%'" >
                    {{ $t(`Global.note`) }}
                  </th>
                  <td :width="'80%'">
                    {{ data.value }}
                  </td>
                </template>
              </ShowComponent>
            </div>
          <!-- </b-tab> -->
        <!-- </b-tabs> -->
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
  import Edit from '@/views/administration/bank_settings/note/edit';
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
        item: 'bankInfos/itemsNotes',
        load: 'bankInfos/load',
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
        items:null,
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
        if(true){
          this.$store.dispatch('bankInfos/notes').then((data)=>{
            // this.$nextTick(_ => {
            //   this.setPageTabs();

            // });
            this.items = data;
            // console.log(this.items);
            
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
  