<template >
  <DataTable
    :title="filteredName"
    :total="total"
    :loading="load"
    :filter="filter"
    @Refresh="refresh"
    :allow-search="lookups && !lookups.selected_offering"
    :allowActions="true"
    :titleFontSize="16"
    
  >
  <template
      v-if="lookups && !lookups.selected_offering "
      #filter
    >
      <b-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="filter.term_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.terms"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.term')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == 'ar'
                ? option.name_local
                : option.name
            }}
          </template>
          <template
            #selected-option="{
              name,
              name_local
            }"
          >
            <div style="display: flex; align-items: baseline">
              <strong
                v-if="$i18n.locale == 'ar'"
              >{{ name_local }} </strong>
              <strong
                v-else
              >{{ name }}</strong>
            </div>
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
          v-model="filter.faculty_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.faculties"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="'Faculties'"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == 'ar'
                ? option.faculty_name_local
                : option.faculty_name
            }}
          </template>
          <template
            #selected-option="{
              faculty_name,
              faculty_name_local,
            }"
          >
            <div style="display: flex; align-items: baseline">
              <strong
                v-if="$i18n.locale == 'ar'"
              >{{ faculty_name_local }}</strong>
              <strong
                v-else
              >{{ faculty_name }}</strong>
            </div>
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
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.bylaws"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.bylaws')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == 'ar'
                ? option.bylaw_name_local
                : option.bylaw_name
            }}
          </template>
          <template
            #selected-option="{
              bylaw_name,
              bylaw_name_local,
              faculty_name,
              faculty_name_local,
            }"
          >
            <div style="display: flex; align-items: baseline">
              <strong
                v-if="$i18n.locale == 'ar'"
              >{{ bylaw_name_local }} - {{ faculty_name_local }}</strong>
              <strong
                v-else
              >{{ bylaw_name }} - {{ faculty_name }}</strong>
            </div>
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
          v-model="filter.program_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.programs"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.programs')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == 'ar' ? option.program_name_local : option.program_name
            }}
          </template>
          <template
            #selected-option="{
              program_name,
              program_name_local
            }"
          >
            <div style="display: flex; align-items: baseline">
              <strong
                v-if="$i18n.locale == 'ar'"
              >{{ program_name }} </strong>
              <strong
                v-else
              >{{ program_name_local }}</strong>
            </div>
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
          v-model="filter.level_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.levels"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.level')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == 'ar'
                ? option.name_local
                : option.name
            }}
          </template>
          <template
            #selected-option="{
              name,
              name_local
            }"
          >
            <div style="display: flex; align-items: baseline">
              <strong
                v-if="$i18n.locale == 'ar'"
              >{{ name_local }} </strong>
              <strong
                v-else
              >{{ name }}</strong>
            </div>
          </template>
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
    </template>
    <template #action>
      <b-button v-if="status =='Draft' && hasPermission('add_sections')"
        class="btn-icon mb-1 mr-1"
        variant="primary"
        :to="{ name: 'multi_seactions' , query:{ offering_id: offering_id} }"
        v-b-tooltip.hover="$t('Global.add_multi_seactions')"
      >
        <feather-icon
          icon="GridIcon"
        />
      </b-button>
      <b-button v-else
        class="btn-icon mb-1 mr-1"
        variant="secondary"
        style="cursor:not-allowed;"    
        v-b-tooltip.hover="$t('Global.add_multi_seactions')"
      >
        <feather-icon
          icon="GridIcon"
        />
      </b-button>

      <b-button v-if="status =='Draft' && hasPermission('add_sections')"
        class="btn-icon mb-1 "
        variant="primary"
        :to="{ name: 'add_section', query:{ offering_id: offering_id} }"
       v-b-tooltip.hover="$t('Global.add_seaction')"
      >
        <feather-icon
          icon="PlusIcon"
        />
      </b-button>
      <b-button v-else
        class="btn-icon mb-1 "
        variant="secondary"
       v-b-tooltip.hover="$t('Global.add_seaction')"
       style="cursor:not-allowed;"
      >
        <feather-icon
          icon="PlusIcon"
        />
      </b-button>
      
    </template>
    <template #customTable>
      <b-table
                  @sort-changed="sortingChanged"
          no-local-sorting
        class="position-relative font-small-2"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(offering)="data">
          <b-link
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block"
            :to="{ name: 'section', params: { id: data.item.id } }"
          >
            {{ data.item.offering.course.name ? data.item.offering.course.name : '-' }}
          </b-link>
          <span
            v-if="$i18n.locale == 'ar'"
            class="font-small-4"
          >
            {{ data.item.offering.course.name_local ? data.item.offering.course.name_local : '-' }}
          </span>
        </template>
        <template #cell(section)="data">
          <b-link
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block"
            :to="{ name: 'section', params: { id: data.item.id } }"
          >
            {{ data.item.name ? data.item.name:data.item.name_local ? data.item.name_local: '-' }}
          </b-link>
          <span
            v-if="$i18n.locale == 'ar'"
            class="font-small-4"
          >
           {{ data.item.name_local ? data.item.name_local:data.item.name ? data.item.name: '-' }}
          </span>
        </template>
        <template #cell(group)="data">
          <b-link
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold d-block"
            :to="{ name: 'section', params: { id: data.item.id } }"
          >
            {{ data.item.group ? data.item.group.name:  data.item.group.name_local ?  data.item.group.name_local :'-' }}
          </b-link>
          <span
            v-if="$i18n.locale == 'ar'"
            class="font-small-4"
          >
           {{ data.item.group ? data.item.group.name_local:  data.item.group.name ?  data.item.group.name :'-' }}
          </span>
        </template>
        <template #cell(actions)="data">
          <div>
            <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
            <b-link
                :to="{ name: 'registrations', query: { section_id: data.item.id } }">
              <feather-icon
                  icon="UsersIcon"
                  v-b-tooltip.hover="$t('Global.registrations')"
                  class="text-primary"
              />
            </b-link>
            <b-link v-if="hasPermission('edit_sections')" 
            :to="{name:'edit_section', query:{ section_id: data.item.id, offering_id: offering_id} }">
              <feather-icon
                icon="EditIcon"
                v-b-tooltip.hover="$t('Global.edit')"
                class="text-primary"
              />
            </b-link>
            <b-link v-else
            :to="{name:'edit_section', query:{ section_id: data.item.id, offering_id: offering_id} }">
              <feather-icon
                icon="EditIcon"
                v-b-tooltip.hover="$t('Global.edit')"
                class="text-secondary"
                style="cursor:not-allowed;"
              />
            </b-link>
            <b-link v-if="students_count == 0 && status == 'Draft' && hasPermission('delete_sections')">
              <feather-icon
                icon="Trash2Icon"
                v-b-tooltip.hover="$t('Global.delete')"
                class="text-danger"
                @click="deleteItem(data.item.id)"
              />
            </b-link>
            <b-link v-else>
              <feather-icon
                icon="Trash2Icon"
                v-b-tooltip.hover="$t('Global.delete')"
                class="text-secondary"
                style="cursor:not-allowed;"
              />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>

<script>
import {
  BAvatar,
  BBadge,
  BButton,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BDropdown,
  BDropdownItem,
  BFormInput,
  BLink,
  BMedia, BModal,
  BOverlay,
  BPagination, BPopover,
  BRow,
  BTable,
  VBModal,
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

export default {
  name: 'Sections',
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
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
  },
  props: {
    title: String,
    bylaw_id: null,
    term_id: null,
    program_id: null,
    level_id: null,
    faculty_id: null,
  },
  data() {
    return {
      filter: { removed: 0 },
      offering_id:0,
      status:null,
      students_count: null,
      show: true,
    }
  },
  mounted() {
    if(this.$route.query.offering_id){
      this.getOffering(this.$route.query.offering_id).then(value =>{
          this.status=value.data.status.name
          this.students_count=value.data.students_count
          this.show=false
        })
    }
  },
  computed: {
    ...mapGetters({
      items: 'sections/items',
      total: 'sections/total',
      load: 'sections/load',
      needDrop:'app/needDrop',
      lookups: 'sections/lookups',
    }),
    filteredName(){
      if(this.lookups && this.lookups.selected_offering != null){
        // to load breadcrump student code
        //this.$store.commit('app/UPDATE_PAGE_DETAILS', {...this.lookups.selected_offering.course,active:true}, {root: true});
        // this.$store.commit('app/SET_PATH', [
        //     {name:this.$t('sections'),route:'sections'},
        //     {name:this.titlePage,active:true}
        // ]);
       // return this.$t('offering')+": "+this.getTranslatedName(this.lookups.selected_offering.course);
        return this.titlePage
      }else{
        return '';
      }
    },
    titlePage(){
              return this.lookups.selected_offering.course.code + " ( " + this.lookups.selected_offering.course.bylaw.code + " ) :" + this.getTranslatedName(this.lookups.selected_offering.course) + " - " +this.getTranslatedName(this.lookups.selected_offering.term) + ' ( ' +this.lookups.selected_offering.id + ' ) '

    }
    ,
    fields() {
      let fields = [
        /* {
          key: 'id',
          sortable: true,
          label: this.$t("Global.id"),
        }, */
         {
          key: 'section',
          sortable: true,
          label: this.$t("Global.section"),
        },
        {
          key: 'group',
          sortable: true,
          label: this.$t("Global.group"),
        },
       
        {
          key: 'quota',
          sortable: true,
          label: this.$t("Global.quota"),
        },
        {
          key: 'over_quota',
          sortable: true,
          label: this.$t("Global.over_quota"),
        },
        {
          key: 'taken',
          sortable: false,
          label: this.$t("Global.taken"),
        },
        {
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
          label: this.$t("Global.actions"),
        },
      ];
      if(this.lookups && this.lookups.selected_offering == null){
        fields =
            [
              {
                key: 'id',
                sortable: true,
              },
              {
                key: 'offering',
                sortable: true,
              },
              {
                key: 'level',
                sortable: true,
              },
              ...fields
            ];
      }
      return fields;

    },
  },
  methods: {
    ...mapActions({
      getSections: 'sections/sections',
      deleteSection: 'sections/remove',
      getOffering:'offerings/get',
    }),
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id }
      }
      if (this.term_id) {
        query = { ...query, term_id: this.term_id }
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id }
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id }
      }
      if (this.$route.query && this.$route.query.offering_id) {
        query = { ...query, offering_id: this.$route.query.offering_id }
        this.offering_id=this.$route.query.offering_id
        
      }
      this.getSections({ query })
    },
    deleteItem(id) {
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
          this.deleteSection(id).then(_ => {
            this.refresh()
            this.$swal({
              icon: 'success',
              title: this.$i18n.locale=='en'? 'Deleted!' : 'تم المسح',
              text:  this.$i18n.locale=='en'? 'ٍSection has been deleted.' : 'تم مسح الفصل',
              showConfirmButton: false,
              timer: 1500,
            })
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
    .per-page-selector {
        width: 90px;
    }
</style>

<style lang="scss">
    @import '@core/scss/vue/libs/vue-select.scss';
</style>
