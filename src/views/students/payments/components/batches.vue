<template>
  <div>
    <DataTable
      :title="title"
      :total="total"
      :allowSearch="false"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
    >
      <template #customTable>
        <b-table
          class="position-relative"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          
          
          <template #cell(archive_id)="data">
            {{
              data.item.archive.id
            }}
          </template>
          <template #cell(archive)="data">
            <div v-if="data.item.archive">
              {{
                $i18n.locale == "ar"
                  ? data.item.archive.title
                  : data.item.archive.title
              }}
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(created_by)="data">
            <div v-if="data.item.created_by">
              <b-link 
                :to="{ name: 'user-show', params: { id: data.item.created_by.id } }"
              > 
                {{ 
                  $i18n.locale == 'ar' 
                    ? data.item.created_by.name_local 
                    : data.item.created_by.name 
                }} 
              </b-link>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(created_at)="data">
            <div v-if="data.item.created_at">
              {{moment(data.item.created_at).utc().format('YYYY-MM-DD HH:MM:SS')}}
            </div>
            <div v-else>_</div>
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
              <b-link >
              <feather-icon
                v-b-tooltip.hover="$t('show')"
                v-if="hasPermission('show_payment_batch')"
                icon="EyeIcon"
                style="cursor: pointer"
                class="text-primary "
                @click="$router.push({name: 'batch', params: {id: data.item.id} })"
              />
              </b-link>
              <a :href="data.item.archive.url">
                <feather-icon
                v-if="hasPermission('download_payment_batch')"
                  v-b-tooltip.hover="$t('Global.download')"
                  icon="DownloadIcon"
                  style="cursor: pointer"
                  class="text-primary"
                />
              </a>
              <b-link v-if="data.item.trans == 0">
                <feather-icon
                v-if="hasPermission('delete_payment_batch')"
                  @click="deleteBatch(data.item.id)"
                  v-b-tooltip.hover="$t('Global.delete')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
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
  BFormDatepicker,
  BFormFile,
  BAlert,
  BButtonGroup,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BForm,
} from "bootstrap-vue";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import Show from "@/views/students/payments/show";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { mdiKeyRemove } from '@mdi/js';

export default {
  name: "batches",
  components: {
    Show,
    Statistics,
    DataTable,
    BCard,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    localize,
    BFormDatepicker,
    BFormFile,
    BAlert,
    BButtonGroup,
    BInputGroup,
    BFormTextarea,
    BImg,
    BFormGroup,
    BForm,
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
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      filter: {
        removed: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: "payments/batches",
      total: "payments/total",
      load: "payments/load",
      lookups: "payments/lookups",
      needDrop:'app/needDrop',
    }),
    fieldsData() {
      let fields = [
        {
          key: "id",
          label: this.$t("Global.id"),
          sortable: true,
        },
        {
          key: "archive_id",
          label: this.$t("Global.archive_id"),
          sortable: true,
        },
        {
          key: "archive",
          label: this.$t("Global.title"),
        },
        {
          key: "created_by",
          label: this.$t("Global.created_by"),
        },
        {
          key: "created_at",
          label: this.$t("Global.created_at"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.action"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      return fields;
    },
  },
  methods:{
    ...mapActions({
      getItems: 'payments/batches',
    }),
    deleteBatch(id){
      this.$store.dispatch("payments/deleteBatch",{id}).then((data)=>{
        
        this.$swal({
            title: this.$t('Global.deleted'),
            // text: this.$t('Global.uploaded'),
            icon: 'success',
            confirmButtonText: this.$t('Global.ok'),
            customClass: {
            confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
        })
        this.refresh();
      });
      this.refresh();
    },
    refresh(query) {
      query = { ...query };
      this.getItems(query)
      this.key;
    },
  },

};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
