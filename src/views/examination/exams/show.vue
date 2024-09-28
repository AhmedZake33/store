<template>
  <div>
    <b-card class="mb-0">
      <b-tabs vertical nav-wrapper-class="nav-hidden" align="left">
        <!-- basic info -->
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template>
          <Edit 
            v-if="edit" 
            :tabNumber="0" 
            :data="
              id  ? item : {
              'name':'', 
              'name_local':'', 
              'id':'',
              'type':'',
              'term':'', 
              'schedule_due_date':'',
              'preferences_start_date':'', 
              'preferences_end_date':'', 
              'proctoring_table_date':'',
            }" @hide="cancel()" :inline="true" @refresh="init">
          </Edit>
          <div v-if="item && !edit">
            <ShowComponent 
              :loading="load"
              :data="item" 
              :only="[
                  'name',
                  'name_local',
                  'id',
                  'type',
                  'term',
                  'schedule_due_date',
                  'preferences_start_date',
                  'preferences_end_date',
                  'proctoring_table_date',
                ]" 
              >
              
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
              <template #type>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.type`) }}
                </th>
                <td >
                  {{ $i18n.locale == 'ar' ? item.type.name_local : item.type.name }}
                </td>
              </template>
              <template #term>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.term`) }}
                </th>
                <td >
                  {{ $i18n.locale == 'ar' ? item.term.name_local : item.term.name }}
                </td>
              </template>
              <template #schedule_due_date>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.schedule_due_date`) }}
                </th>
                <td >
                  <div v-if="item.schedule_due_date">
                    {{ item.schedule_due_date }}
                  </div>
                  <div v-else>_</div>
                </td>
              </template>
              <template #published>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.Published`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <b-badge pill :variant="`light-${
                      getStatus(item.published, 'published').color
                    }`" class="text-capitalize">
                    {{ getStatus(item.published, "published").name }}
                  </b-badge>
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <feather-icon v-if="hasPermission('edit_exam')" @click="openEdit()" style="cursor: pointer"
                    icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import {
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard
  } from "bootstrap-vue";
  import Offerings from "@/views/study/offerings/components/offerings";
  import ShowComponent from "@/views/components/info/show";
  import Edit from "@/views/examination/exams/edit";

  export default {
    name: "show",
    components: {
      mapGetters,
      Offerings,
      ShowComponent,
      Edit,
      BBadge,
      BLink,
      BTab,
      BTabs,
      BCard,
    },
    data() {
      return {
        edit: false,
      };
    },
    computed: {
      ...mapGetters({
        item: "exams/item",
        load: "exams/load",
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },

    mounted() {
      this.init();
    },
    methods: {
      init(id) {
        if(this.id || id){
          this.$store.dispatch("exams/get", this.id);
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
    },
  };
</script>

<style scoped></style>