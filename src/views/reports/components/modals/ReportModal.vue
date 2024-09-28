<template>
  <div class="custom_modal">
    <b-modal
      ref="my-modal"
      :size="size"
      v-model="show"
      hide-footer
      :title="title"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <b-overlay :show="load">
        <b-row
          class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left"
        >
          <slot name="filters_modal"></slot>
          <!-- <template v-if="title == 'students'">
            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.stage"
                :options="lookups && lookups.stages"
                class="w-100 bg-white"
                clearable
                label="start_year"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.stage')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
    
            <b-col cols="12" md="6">
              <v-select
                :filter="fuseSearch"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="filter.type"
                :options="lookups && lookups.types"
                class="w-100 bg-white"
                clearable
                label="type"
                :reduce="(val) => val.id"
                :placeholder="$t('Global.type')"
              >
                <template v-slot:option="option">
                  <span>
                    {{ option.name }}
                  </span>
                </template>
                <template #selected-option="{ name }">
                  {{ name }}
                </template>
                <template #no-options>
                  {{ $t("noMatching") }}
                </template>
              </v-select>
            </b-col>
    
            <b-col class="mt-2" cols="12" md="6">
              <Multiselect
                :options="makeCategory(lookups && lookups.tags)"
                @addStatus="addStatus"
                @remove="remove"
              ></Multiselect>
            </b-col> 
        </template> -->
        </b-row>
      </b-overlay>
      <div class="mt-2" :class="load ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="ExportReport()"
            >
              {{ $t("Global.export") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-primary"
              @click="toggleModal()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>
  
  <script>
import { mapGetters, mapActions } from "vuex";
import {
  BFormInput,
  BAlert,
  BFormCheckbox,
  BSpinner,
  BCol,
  BForm,
  BModal,
  VBModal,
  BFormFile,
  BButton,
  BRow,
  BOverlay,
  BFormGroup,
} from "bootstrap-vue";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Multiselect from "@/views/components/common/Multiselect.vue";
export default {
  components: {
    Multiselect,
    vSelect,
    BOverlay,
    BAlert,
    BRow,
    BSpinner,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BFormFile,
    BModal,
    VBModal,
    BFormGroup,
    BCol,
  },
  props: {
    show: Boolean,
    title: String,
    size: String,
    link: String,
    hint: String,
    filtersModal: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      error: [],
      lookups: {},
      passedFilters: {},
    };
  },
  computed: {
    ...mapGetters({
      load: "Report/load",
      reportLookups: "Report/reportLookups",
    }),
  },
  methods: {
    ...mapActions({
      ExportSysReports: "Report/ExportSysReports",
      getReportsLookups: "Report/getReportsLookups",
    }),
    toggleModal() {
      this.show = false;
      this.$emit("close");
    },
    async ExportReport() {
      this.passedFilters[this.link] = this.filtersModal;
      this.$toast(
        {
          component: ToastificationContent,
          props: {
            icon: "FileTextIcon",
            text: this.$t("Global.downloading_report_in_progress"),
            variant: "info",
          },
        },
        {
          position: "top-center",
          timeout: false,
          closeOnClick: false,
          draggable: false,
        }
      );
      var currentdate = new Date();
      var datetime =
        "Last Sync: " +
        currentdate.getDate() +
        "." +
        (currentdate.getMonth() + 1) +
        "." +
        currentdate.getFullYear() +
        "." +
        currentdate.getHours() +
        "." +
        currentdate.getMinutes() +
        "." +
        currentdate.getSeconds();
      let fileName = this.title + "_Report_" + datetime;
      let payload = {
        title: this.title,
        link: this.link,
        query: this.passedFilters[this.link],
        fileName: fileName,
      };
      this.ExportSysReports(payload)
        .then((response) => {
          this.toggleModal();
          this.downloadURI(response.url)
          document.querySelector(".toastification-close-icon").click();
        })
        .catch((error) => {
          this.toggleModal();
          document.querySelector(".toastification-close-icon").click();
        });
    },
  },
  beforeMount(){
    this.$emit('setLang')
  },
  async mounted() {
    if (!this.reportLookups[this.link]) {
      await this.getReportsLookups({
        title: this.title,
        link: this.link,
        query: { lookups: "yes" },
      });
      this.lookups = this.reportLookups[this.link];
    }
  },
};
</script>
  
<style>
.modal-dialog.modal-lg .modal-title {
  width: 100% !important;
}
</style>