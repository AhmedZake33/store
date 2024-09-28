<template>
  <div>
    <DataTable
    :total="total"
    :loading="load"
    @Refresh="refresh"
    :filter="filter"
    @reset="reset"
    ::allow-search="true"
    :allowFilterWithoutSearch="true"
  >
      <template #filter v-if="lookups">
      <b-col cols="6">
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
      <b-col cols="6">
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
    </template>
      <template #action></template>
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

            <template #head(select)="data">
              <div class="d-inline-flex align-items-center">
                <b-form-checkbox v-model="selectAll" style="margin-top: 6px" class="mt-0 custom-control-primary" />
                <span>{{ $t('All') }}</span>
              </div>
            </template>

            <template #cell(select)="data">
                <b-form-checkbox
                :disabled="!(data.item &&  data.item.user && data.item.user.name)"
                v-model="selected"
                :value="data && data.item && data.item.user && data.item.user.id"
                >
                </b-form-checkbox>
            </template>
          <template #cell(user)="data">
              {{ $i18n.locale == "ar" ? data.item &&  data.item.user && data.item.user.name_local : data && data.item && data.item.user && data.item.user.name }}
          </template>

          <template #cell(faculty)="data">
            <div v-if="data.item.department">
              {{ $i18n.locale == "ar" ?
                data.item.department.faculty.name_local +' ( ' + data.item.department.name_local + ' )'
                : data.item.department.faculty.name + ' ( ' + data.item.department.name + ' )' }}
            </div>
          </template>


        </b-table>
      </template>
    </DataTable>
    <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button  type="submit" variant="primary" class="mt-0 mr-1" @click="bulk()">
              {{ $t('Global.save') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="hideModal">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
  </div>
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
  BFormCheckbox
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import academicAdvisors from "@/api/study/academic_advisors/academic_advisors";

const advisorRequest = new academicAdvisors();

export default {
  name: "AddAdvisor",
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
    BFormCheckbox,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },

  data() {
    return {
      filter: {
        faculty_id: null,
        department_id:null,
        departments:true
      },
      selectAll: false,
      loadingSaveBulk: false,
      selected:[]
    };
  },
  computed: {
    ...mapGetters({
      items: "academicAdvisors/avalibleAdvisors",
      total: "academicAdvisors/totalOfAdvisors",
      load: "academicAdvisors/load",
      needDrop:'app/needDrop',
      lookups: "academicAdvisors/advisorslookups",
    }),

    fields: function () {
      return [
        {
            key: "select",
            lable: this.$t("selectAll")
        },
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

      ];
    },
  },
   methods: {
    ...mapActions({
      instructors: "academicAdvisors/avalibleAdvisorsList",
    }),
    refresh(query={}) {
        if (this.faculty_id) {
            query = {...query, faculty_id: this.faculty_id}
        }
        if (this.department_id) {
            query = {...query, department_id: this.department_id}
        }

        let payload={query:query}
        this.instructors(payload);

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
    bulk() {
      this.loadingSaveBulk = true;
      let payload={
        selected_advisors:this.selected,
      };
      advisorRequest.addAdvisors(payload)
        .then(response => {
          this.selected = [];
          this.RefreshParent();
          this.$swal({
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            title: this.$t('Global.saved'),
          });
        }).catch(err => {
        }).finally(()=>{
          this.loadingSaveBulk = false;
          this.hideModal();

        });
    },
    hideModal(){
      this.$emit('hideModal')
    },
    RefreshParent(){
      this.$emit('RefreshParent')
    }
   },
   watch: {
    selectAll(val) {
      if (val) {
        let filteredItems = this.items;
        let mappedItems = filteredItems.map(item => item.id);
        this.selected = mappedItems;
      } else {
        this.selected = [];
      }
    },
  },
}
</script>