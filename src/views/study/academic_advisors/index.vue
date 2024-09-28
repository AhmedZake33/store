<template>
    <DataTable
    :total="total"
    :loading="load"
    @Refresh="refresh"
    :filter="filter"
    @reset="reset"
    :params-loaded="paramsLoaded"

    >
     <template #filter v-if="lookups">
      
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.faculty_id"
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.faculties"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.faculty')"
        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="6" md="4">
        <v-select
          :disabled="!filter.faculty_id"
          v-model="filter.department_id"
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.departments"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.department')"
        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ getEmptyListLabel }}
          </template>
        </v-select>
      </b-col>
      
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.rank_id"
          :label="$i18n.locale == 'en' ? 'name':'name_local'"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.ranks"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.rank')"
        >
          <template #no-options>
            {{ getEmptyListLabel }}
          </template>
        </v-select>
      </b-col>
      
      
    </template> 
    <template #action>

    
      <b-button
                v-b-tooltip.hover="$t('Global.add')"
                class="btn-icon"
                variant="primary"
                @click="modalShow = !modalShow"
                v-if="hasPermission('add_academicAdvisors')"

            >
                <feather-icon icon="PlusIcon"/>
            </b-button>
    </template>
    <template #customTable>
      <b-table
        
        class="position-relative"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="$t('Global.empty_text')"
      >

        <template #cell(user)="data">
            <router-link :to="`/instructors/${data.item.user.id}`">
              {{ $i18n.locale == "ar" ? data.item.user.name_local : data.item.user.name }}
            </router-link>
        </template>

        <template #cell(faculty)="data">
          <span v-if="data.item.department">
            <router-link :to="`/faculties/${data.item.department.faculty.id}`">
            {{getTranslatedName(data.item.department.faculty)}}
            </router-link>
          </span>
        </template>

        <template #cell(department)="data">
            <span v-if="data.item.department">
                <router-link :to="`/departments/${data.item.department.id}`">
                  {{getTranslatedName(data.item.department)}}
                </router-link>
            </span>
        </template>

        <template #cell(rank)="data">
           <span v-if="data.item.rank">
              {{getTranslatedName(data.item.rank)}}
            </span>
        </template>

        <template #cell(email)="data">
            <span v-if="data.item.user">
                {{data.item.user.email}}
              </span>
          </template>
        <template #cell(advised_Student)="data">
            {{  data.item.students_count }}
        </template>

        <template #cell(registered_students )="data">
            {{  data.item.registered_students_count }}
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
            <feather-icon
              v-b-tooltip.hover="$t('Global.delete')"
              icon="Trash2Icon"
              :style="data.item.students_count == 0?'cursor: pointer':''"
              :class="data.item.students_count == 0?'text-danger':'disabled_all2'"
              @click="remove(data.item.id, $event)"
              v-if="hasPermission('delete_academicAdvisors')"
            />
          </div>
        </template>
      </b-table>
      <b-modal
        v-model="modalShow"
        :title="$t('Add Advisors')"
        size="lg"
        hide-footer
        v-if="hasPermission('add_academicAdvisors')"
      >
        <AddAdvisor @RefreshParent="refresh" @hideModal="hideModal()"></AddAdvisor>
         
    </b-modal>
    </template>
  </DataTable>
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
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
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import AddAdvisor from "@/views/study/academic_advisors/add_advisors"
import academicAdvisors from "@/api/study/academic_advisors/academic_advisors";

const advisorRequest = new academicAdvisors();
export default {
  name: "academic_advisors",
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
    AddAdvisor
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props:{

  },
  data() {
    return {
      filter: {
        faculty_id: null,
        department_id:null,
        rank_id:null,
      },
      modalShow:false,
      paramsLoaded: true
    };
  },
  computed: {
    ...mapGetters({
      items: "academicAdvisors/items",
      total: "academicAdvisors/total",
      load: "academicAdvisors/load",
      needDrop:'app/needDrop',
      lookups: "academicAdvisors/lookups",
    }),

    fields: function () {
      return [
        {
          key: "user",
          label: this.$t("name"),
          sortable: true,
        },
        {
          key: "faculty",
          label: this.$t("Global.faculty"),
          sortable: true,
        },
        {
          key: "department",
          label: this.$t("Global.department"),
          sortable: true,
        },
        {
          key: "rank",
          label: this.$t("Global.rank"),
          sortable: true,
        },
        {
          key: "pending_students_count",
          label: this.$t("Pending Students"),
          sortable: true,
        },
        {
          key: "students_count",
          label: this.$t("Advised students"),
          sortable: true,
        },
         {
          key: "registered_students_count",
          label: this.$t("Registered students"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
  },
  mounted() {
    this.init();
  },
   methods: {
    ...mapActions({
      advisors: "academicAdvisors/advisorslist",
      delete:"academicAdvisors/deleteAdvisor"
    }),
    refresh(query={}) {
        if (this.filter) {
          query = { ...query, ...this.filter, departments:true}
        }
        this.advisors({ query:query }).then(()=>{
          this.paramsLoaded = false;
        });

    },
     init() {
      //this.advisors();
    },
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
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
                        this.delete(id).then(_ => {
                            this.refresh()
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
    hideModal() {
      this.modalShow = false;
    },
     
    }
}
</script>