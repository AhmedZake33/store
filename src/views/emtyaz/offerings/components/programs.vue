<template>
  <div>
    <!--         <add v-if="hasPermission('edit_programs') && params.status == 4" :inline="true" :params="params" @hide="params.status = 3"/>
 -->
    <!--  <edit
                v-else-if="params.status == 1 || params.status == 2"
                :inline="true"
                :params="params"
                @hide="params.status = 3"
        /> -->
    <DataTable :title="title" :total="total" :allow-search="false" :filter="filter" @reset="filter = { export: 0, removed: 0, bylaw_id: null }" @Refresh="refresh" @Export="Export">
      <!-- <template
                    v-if="lookups && !noStatus"
                    #filter
            >

                <b-col
                        v-if="!faculty_id"
                        cols="12"
                        md="4"
                >
                    <v-select
                            v-model="filter.faculty_id"
                            :filter="fuseSearch"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups.faculties"
                            label="name"
                            class="w-100"
                            :reduce="val => val.id"
                            :placeholder="$t('Global.faculty')"
                    >
                        <template slot="selected-option" slot-scope="option">
                              <span v-if="$i18n.locale == 'ar'">
                                {{ option.name_local || option.name }}
                              </span>
                            <span v-else>
                                {{ option.name || option.name_local }}
                              </span>
                        </template>
                        <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                        </template>
                        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                    </v-select>
                </b-col>
                <b-col
                        cols="12"
                        md="4"
                >
                    <v-select
                            v-model="filter.bylaw_id"
                            :filter="fuseSearch"
                            :disabled="!filter.faculty_id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="lookups.bylaws"
                            label="name"
                            class="w-100"
                            :reduce="val => val.id"
                            :placeholder="$t('Global.bylaw')"
                    >
                        <template slot="selected-option" slot-scope="option">
                              <span v-if="$i18n.locale == 'ar'">
                                {{ option.name_local || option.name }}
                              </span>
                            <span v-else>
                                {{ option.name || option.name_local }}
                              </span>
                        </template>
                        <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                        </template>
                        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                    </v-select>
                </b-col>

                <b-col cols="12" md="4" v-if="!faculty_id">
                    <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.stage"
                              :options="lookups.stages" class="w-100" clearable label="name"
                              :reduce="val => val.id"
                              :placeholder="$t('Global.stage')">
                        <template slot="selected-option" slot-scope="option">
                              <span v-if="$i18n.locale == 'ar'">
                                {{ option.name_local || option.name }}
                              </span>
                            <span v-else>
                                {{ option.name || option.name_local }}
                              </span>
                        </template>
                        <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                        </template>
                        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                    </v-select>
                </b-col>
                <b-col
                        cols="12"
                        md="4"
                >
                    <v-select
                            v-model="filter.removed"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="getStatusList(true)"
                            class="w-100"
                            :class="faculty_id ? '' : 'mt-1'"
                            :reduce="val => val.value"
                            :placeholder="$t('Global.status')"
                    >
                        <template slot="selected-option" slot-scope="option">
                            <span>
                                {{ $t(`Global.${option.label}`) }}
                            </span>
                        </template>
                        <template v-slot:option="option">
                            {{ $t(`Global.${option.label}`) }}
                        </template>
                    </v-select>
                </b-col>
            </template> -->
      <template #customTable>
        <div class="bg-gray p-0 mb-1" style="padding-left: 0rem !important; padding-right: 0rem !important">
          <div class="d-flex justify-content-between" v-if="innerTitle">
            <strong class="font-medium-3">
              {{ innerTitle }}
            </strong>
          </div>
        </div>
        <b-table :sort-desc.sync="filter.order_direction" :sort-by.sync="filter.order_by" :items="items" responsive striped :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
          <template #cell(name)="data">
            <b-link v-if="$i18n.locale == 'en'" v-b-tooltip.hover="data.item.name" :to="{ name: 'program', params: { id: data.item.id } }" class="font-weight-bold">
              {{ data.item ? (data.item.name ? data.item.name : data.item.name_local) : '_' }}
            </b-link>
            <b-link v-if="$i18n.locale == 'ar'" v-b-tooltip.hover="data.item.name_local" :to="{ name: 'program', params: { id: data.item.id } }">
              {{ data.item ? (data.item.name_local ? data.item.name_local : data.item.name) : '_' }}
            </b-link>
          </template>
          <template #cell(faculty)="data">
            <b-link v-if="$i18n.locale == 'en' && data.item.faculty" v-b-tooltip.hover="data.item.faculty.name" :to="{ name: 'faculty', params: { id: data.item.faculty.id } }" class="font-weight-bold">
              {{ data.item ? data.item.faculty.name : '_' }}
            </b-link>
            <b-link v-if="$i18n.locale == 'ar' && data.item.faculty" v-b-tooltip.hover="data.item.faculty.name_local" :to="{ name: 'faculty', params: { id: data.item.faculty.id } }">
              {{ data.item ? data.item.faculty.name_local : '_' }}
            </b-link>
          </template>
          <template #cell(bylaw)="data">
            <template v-if="faculty_id">
              <div v-if="data.item.bylaw">
                <b-link v-b-tooltip.hover="data.item.bylaw.name" :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }" class="font-weight-bold">
                  {{ data.item ? data.item.bylaw.code : '-' }}
                </b-link>
              </div>
            </template>
            <template v-if="!faculty_id">
              <div v-if="data.item.bylaw">
                <b-link v-b-tooltip.hover="$i18n.locale == 'en' ? data.item.bylaw.name : data.item.bylaw.name_local" :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }" class="font-weight-bold">
                  {{ data.item.bylaw ? data.item.bylaw.code : '_' }}
                </b-link>
              </div>
            </template>
          </template>
          <template #cell(stage)="data">
            <div v-if="data.item.stage">
              <span v-if="$i18n.locale == 'en'">
                {{ data.item.stage.name }}
              </span>
              <span v-else>
                {{ data.item.stage.name_local }}
              </span>
            </div>
          </template>

          <template #cell(status)="data">
            <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
              {{ getStatus(data.item.removed).name }}
            </b-badge>
          </template>
          <template #cell(actions)="data">
            <feather-icon @click="showStatistics(data)" v-if="offering && hasPermission('admin_system')" v-b-tooltip.hover="$t('Global.statistics')" icon="PieChartIcon" class="mx-1" style="cursor: pointer" />
          </template>
          <!--- <template #cell(actions)="data">
                        <div>
                           
                            <feather-icon
                                    v-b-tooltip.hover="$t('Global.delete')"
                                    icon="Trash2Icon"
                                    style="cursor: pointer"
                                    class="text-danger"
                                    @click="remove(data.item.id)"
                                    v-if="hasPermission('admin_program')"
                            /> 
                        </div>
                    </template>
                    -->
        </b-table>
      </template>
    </DataTable>
    <b-modal ref="my-modal" v-model="levelModal" hide-footer :title="$t('Global.level')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.semester')" label-for="semester">
                <validation-provider #default="{ errors }" name="semester" :rules="'required'">
                  <v-select v-model="form.semester" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" class="w-100 mb-2" :reduce="val => val">
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="submit()">
              {{ $t('Global.send') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="levelModal = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody, BModal, VBModal, BPopover } from 'bootstrap-vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Edit from '@/views/academic_settings/programs/edit';
import Add from '@/views/study/offerings/components/add_programs';
import DataTable from '@/views/components/table/DataTable';
import { EventBus } from '../../../../main';

export default {
  name: 'Programs',
  components: {
    DataTable,
    BCard,
    Add,
    vSelect,
    BRow,
    BCol,
    Edit,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
    faculty_id: null,
    offering: Boolean,
    action_hide: Boolean,
    noStatus: Boolean,
    inline: false,
    faculty: Object,
    faculty_id_course: null,
    innerTitle: String,
  },
  data() {
    return {
      filter: { export: 0, removed: 0, bylaw_id: null },
      params: {},
      levelModal: false,
    };
  },
  computed: {
    ...mapGetters({
      items: 'programs/items',
      total: 'programs/total',
      load: 'programs/load',
      lookups: 'programs/lookups',
    }),
    fields() {
      let fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        {
          key: 'bylaw',
          label: this.$t('Global.bylaw'),
          sortable: true,
        },
        {
          key: 'stage',
          label: this.$t('Global.stage'),
          sortable: true,
        },
        {
          key: 'courses_count',
          label: this.$t('Global.courses'),
          sortable: true,
        },
        {
          key: 'students_count',
          label: this.$t('Global.students'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('Global.status'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      if (this.noStatus) {
        fields = fields.filter(obj => !['status'].includes(obj.key));
      }
      if (this.bylaw_id) {
        fields = fields.filter(obj => !['bylaw', 'faculty', 'level', 'stage'].includes(obj.key));
      }
      if (this.faculty_id) {
        fields = fields.filter(obj => !['faculty', 'actions'].includes(obj.key));
      }
      if(!this.hasPermission('admin_system')){
        fields = fields.filter(obj => !['actions'].includes(obj.key));
      }
      return fields;
    },
    list() {
      return [
        { label: this.$t('Global.UNDERGRADUATE'), value: 1 },
        { label: this.$t('Global.POSTGRADUATE'), value: 2 },
      ];
    },
  },
  methods: {
    ...mapActions({
      exportData: 'programs/export',
    }),
    showStatistics(data) {
      EventBus.$emit('showStatisticsEvent', data.item);
    },
    open(id) {
      window.open(this.$router.resolve({ name: 'program_edit', params: { id } }).href, '_blank');
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: Number(this.faculty_id) };
      }
      this.$store.dispatch('programs/programs', { query });
    },
    remove(id) {
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
      }).then(result => {
        if (result.value) {
          this.$store.dispatch('programs/remove', id).then(_ => {
            this.refresh();
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    },
    Export(query) {
      query = { ...query, language: this.$i18n.locale };

      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: Number(this.faculty_id) };
      }

      this.exportData(query);
      this.filter.export = 0;
    },
  },
  watch: {
    'filter.faculty_id'() {
      this.filter.bylaw_id = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
