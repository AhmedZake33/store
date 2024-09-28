<template>
    <div>
      <b-overlay :show="load" rounded="sm">
        <b-card>
          <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            class="mt-3"
            lazy
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
            <b-tab>
              <template #title>
                <feather-icon icon="InfoIcon" />
                <span>{{ $t('Global.emtyaz_training_information') }}</span>
              </template>
  
              <Edit
                v-if="edit"
                :tabNumber="0"
                :data="training"
                @hide="edit = false"
                :inline="true"
                @refresh="init"
              ></Edit>
  
              <div v-else>
                <ShowComponent
                  :only="[
                    'emtyaz_training_type',
                    'Bylaw',
                    'capacity',
                    'capacity_count',
                    'period',
                    'starts_at',
                    'ends_at',
                    'year_name',
                    'mandatory',
                    'mandatory_local',
                  ]"
                  :data="training"
                  :loading="load"
                >
                  <template #edit>
                    <b-row>
                      <b-col md="12">
                        <div
                          class="mt-0 mb-1"
                          style="
                            display: flex;
                            justify-content: flex-end;
                            cursor: pointer;
                          "
                        >
                          <b-link>
                            <feather-icon
                              @click="openEdit()"
                              v-b-tooltip.hover="$t('Global.edit')"
                              icon="EditIcon"
                              class="font-medium-3 mx-3"
                            />
                          </b-link>
                        </div>
                      </b-col>
                    </b-row>
                  </template>
                  <template #emtyaz_training_type="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.emtyaz_training_type`) }}
                    </th>
                    <td>
                      {{
                        $i18n.locale == 'ar'
                          ? data.type_name_local
                          : data.emtyaz_training_type
                      }}
                    </td>
                  </template>
                  <template #capacity_count="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.Students`) }}
                    </th>
                    <td>
                      {{ data.capacity_count }}
                    </td>
                  </template>
                  <template #period="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.weeks`) }}
                    </th>
                    <td>
                      {{ data ? data.period : '-' }}
                    </td>
                  </template>
                  <template #mandatory_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.mandatory`) }}
                    </th>
                    <td>
                      {{
                        $i18n.locale == 'ar'
                          ? data.mandatory_local
                          : data.mandatory
                      }}
                    </td>
                  </template>
                  <template #year_name="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.Year`) }}
                    </th>
                    <td>
                      {{ data ? data.year_name : '-' }}
                    </td>
                  </template>
  
                  <template #starts_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.start_at`) }}
                    </th>
                    <td>
                      {{ data && data.starts_at ? data.starts_at : '-' }}
                    </td>
                  </template>
                  <template #ends_at="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.end_at`) }}
                    </th>
                    <td>
                      {{ data && data.ends_at ? data.ends_at : '-' }}
                    </td>
                  </template>
                </ShowComponent>
              </div>
            </b-tab>
  
            <b-tab>
              <template #title>
                <feather-icon icon="UserIcon" />
                <span>{{ $t('Global.instructors') }}</span>
              </template>
              <addInstructors
                :course_id="course_id"
                :bylaw_id="bylaw_id"
                action_hide
                :instructors="instructors"
              />
            </b-tab>
          </b-tabs>
        </b-card>
      </b-overlay>
    </div>
  </template>
  
  <script>
  import ShowComponent from '@/views/components/info/show';
  import addInstructors from '@/views/emtyaz/training/components/addInstructors';
  import Edit from '@/views/emtyaz/training/edit';
  import {
    BCard,
    BCol,
    BFormCheckbox,
    BFormGroup,
    BForm,
    BFormInput,
    BFormTextarea,
    BRow,
    BDropdown,
    BDropdownItem,
    BTab,
    BTabs,
    BButton,
    BOverlay,
    BLink,
    BTable,
    BTh,
    BTr,
  } from 'bootstrap-vue';
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  export default {
    name: 'Show',
    components: {
      ShowComponent,
      addInstructors,
      Edit,
      BOverlay,
      BCard,
      BCol,
      BFormCheckbox,
      BFormGroup,
      BForm,
      BFormInput,
      BFormTextarea,
      BRow,
      BDropdown,
      BDropdownItem,
      BTab,
      BTabs,
      BButton,
      BOverlay,
      BLink,
      BTable,
      BTh,
      BTr,
    },
    data() {
      return {
        tabIndex: 0,
        data: {},
        edit: false,
        course_id: null,
        bylaw_id: null,
        instructors: [],
      };
    },
    mounted() {
      this.init();
    },
    beforeMount() {
      if (this.$route.query) {
        this.tabIndex = Number(this.$route.query.tabNum);
        if (this.$route.query.tabNum) {
          this.setSelectedTab({ name: '', id: Number(this.$route.query.tabNum) });
        }
      }
    },
    methods: {
      init() {
        this.getTrainingData();
        this.getInstructors();
      },
      getTrainingData() {
        let payload = Number(this.id);
  
        this.$store
          .dispatch('Emtyaz/getTraining', { id: payload })
          .then((response) => {
            const res = response.data;
            const data = {
              id: res.id,
              Bylaw: res.emtyaz_type.bylaw.name,
              bylaw_name_local: res.emtyaz_type.bylaw.name_local,
              emtyaz_training_type: res.emtyaz_type.name,
              type_name_local: res.emtyaz_type.name_local,
              period: res.emtyaz_type.period,
              mandatory: res.emtyaz_type.mandatory,
              mandatory_local: res.emtyaz_type.mandatory_local,
              ends_at: res.ends_at,
              starts_at: res.starts_at,
              start_year: res.year.start_year,
              end_year: res.year.end_year,
              year_name: res.year.name,
              year_id: res.year.id,
              capacity_count: res.capacityCount,
              capacity: res.capacity,
            };
  
            this.$store.commit('Emtyaz/SET_ITEM', data);
          });
      },
  
      getInstructors() {
        let payload = Number(this.id);
        this.$store
          .dispatch('Emtyaz/getTrainingInstructors', { id: payload })
          .then((response) => {
            this.instructors = response.data;
          });
      },
  
      saveStatus(index) {
        this.edit = false;
        this.updateFilterQueryParams({ tabNum: index });
        this.setSelectedTab({ name: '', id: this.tabIndex });
      },
      openEdit() {
        this.edit = true;
        this.updateFilterQueryParams({
          tabNum: this.$route.query.tabNum || 0,
          inline: true,
        });
      },
    },
    computed: {
      ...mapGetters({
        training: 'Emtyaz/item',
        load: 'Emtyaz/load',
      }),
  
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },
  };
  </script>
  