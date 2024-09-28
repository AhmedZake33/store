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
  import Edit from "@/views/examination/papers_types/edit";

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
        item: "papersTypes/item",
        load: "papersTypes/load",
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
          this.$store.dispatch("papersTypes/get", this.id);
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