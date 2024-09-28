<template>
  <DataTable
    :total="total"
    :allow-search="true"
    :filter="filter"
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
  >
    <template v-if="lookups" #filter>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.term_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.terms"
          label="name"
          class="w-100 mb-1"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
          
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.faculty_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.faculties"
          label="name"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.faculty')"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.bylaw_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.bylaws"
          label="name"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.bylaw')"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
        
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.program_id"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.programs"
          label="name"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.program')"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.stage_group_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.stage_groups"
          label="name"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.stage_group')"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.stage_code_id"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.stage_codes"
          label="name"
          class="w-100"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.stage_code')"
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
            <strong v-if="$i18n.locale == 'ar'"
            >{{ name_local }}  </strong
            >
            <strong v-else
            >{{ name }} </strong
            >
          </div>
        </template>
        <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
        <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
      </b-col>
      <b-col cols="6" md="3">
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList()"
          class="w-100"
          :reduce="(val) => val.value"
          :placeholder="$t('Global.status')"
        />
      </b-col>
    </template>
    <template #action>
      <b-button
        :to="{ name: 'add_term_stage' }"
        variant="primary"
        class="btn-icon"
      >
        <feather-icon
          icon="PlusIcon"
          v-b-tooltip.hover="$t('Global.add_term_stage')"
        />
      </b-button>
    </template>
    <template #customTable>
      <b-table
                  @sort-changed="sortingChanged"
          no-local-sorting
        class="position-relative"
        :items="items"
        responsive
        :fields="fields"
        primary-key="id"
        show-empty
        :empty-text="getLoadText(load)"
      >
        <template #cell(term)="data">
          <b-link
            v-b-tooltip.hover="data.item.term.name"
            :to="{ name: 'term_stage', params: { id: data.item.id } }"
            class="font-weight-bold d-block text-nowrap text-truncate"
          >
            {{ $i18n.locale == 'ar' ? data.item.term.name_local : data.item.term.name }}
          </b-link>
        </template>

        <template #cell(bylaw)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{ data.item.bylaw ? data.item.bylaw.code : "" }}
            </div>
          </b-media>
        </template>
        <template #cell(stage_group)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{ $i18n.locale == 'ar' ?
                  data.item.stage_code.term_stage_group.name_local
                  : data.item.stage_code.term_stage_group.name
              }}
            </div>
          </b-media>
        </template>
        <template #cell(stage_code)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{ $i18n.locale == 'ar' ? data.item.stage_code.name_local : data.item.stage_code.name }}
            </div>
          </b-media>
        </template>
        <template #cell(start_date)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{ data.item.start_date }}
            </div>
          </b-media>
        </template>
        <template #cell(end_date)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{ data.item.end_date }}
            </div>
          </b-media>
        </template>
        <template #cell(information)="data">
          <b-media
            vertical-align="center"
            class="d-inline-flex align-items-center"
          >
            <div class="font-weight-bold d-inline-block text-nowrap">
              {{$t('Minimum GPA')}} ({{ data.item.min_gpa }})
            </div>
          </b-media>
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
            <span>
              <b-link
                :to="{ name: 'edit_term_stage', params: { id: data.item.id } }"
                class="mx-1"
              >
                <feather-icon icon="EditIcon" />
              </b-link>
            </span>

            <span>
              <feather-icon
                icon="TrashIcon"
                class="text-danger"
                @click="remove(data.item.id)"
              />
            </span>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BFormGroup,
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
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";

export default {
  name: "TermStages",
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
    BFormGroup,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      codeState: null,
      filter: { removed: 0 },
     
      name: null,
      name_local: null,
      code: null,
      changed: true,
      message: null,
    };
  },
  computed: {
    ...mapGetters({
      items: "termStages/items",
      total: "termStages/total",
      load: "termStages/load",
      lookups: "termStages/lookups",
      needDrop:'app/needDrop',
    }),
    fields() {
       return [
        { key: "term", label: this.$t('Global.term'), sortable: true },
        { key: "bylaw", label: this.$t('Global.bylaw'), sortable: true },
        { key: "stage_group", label: this.$t('Global.stage_group'), sortable: true },
        { key: "stage_code", label: this.$t('Global.stage_code'), sortable: true },
        { key: "start_date", label: this.$t('Global.start_date'), sortable: true },
        { key: "end_date", label: this.$t('Global.end_date') ,sortable: true },
        { key: "information", label: this.$t('Global.information'), sortable: true },
        {
          key: "actions",
          label: this.$t('Global.actions'),
          thClass: "customAction",
          tdClass: "customWidth",
        }
      ]
    }
  },
  methods: {
    ...mapActions({}),
    
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      this.$store.dispatch("termStages/termStages", { query });
    },
    remove(id) {
      this.$swal({
        title: "Are you sure?",
        text: `${this.$t('Global.deleteText')}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText:`${this.$t('Global.cancel')}`,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("termStages/remove", id).then((_) => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
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
  },
};
</script>