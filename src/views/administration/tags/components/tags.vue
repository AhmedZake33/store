<template>
  <div>
    <DataTable
        :total="total"
        :allowSearch="true"
        :filter="filter"
        :loading="load"
        @Refresh="refresh"
        @reset="reset"
    >
      <template #action>
        <b-button
            class="btn-icon"
            v-if="hasPermission('edit_tags')"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
            @click="openAddTagModal()"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </template>
      <template #filter></template>
      <template #customTable>
        <b-table
            no-local-sorting
            class="position-relative"
            :items="items"
            responsive
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="getLoadText(load)"
        >
          <template #cell(name)="data">
              {{ $i18n.locale == "ar" ? data.item.name_local : data.item.name }}
          </template>
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(actions)="data">
            <div>
              <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  v-if="hasPermission('edit_tags')"
                  icon="EditIcon"
                  class="text-primary"
                  style="cursor: pointer"
                  @click="openEditTagModal(data.item)"
              />
              <feather-icon
                  v-if="hasPermission('delete_tags')"
                  v-b-tooltip.hover="$t('Global.delete')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="remove(data.item.id)"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <div class="all-modals">
      <!-- modal -->
      <b-modal
        id="tags-modal"
        v-model="tagsModal"
        ref="tags-modal"
        :title="$t('Add Tag')"
        size="lg"
        no-close-on-backdrop
        @hidden="resetModal"
      >
        <b-overlay
          :show="load"
          rounded="sm"
        >
          <validation-observer ref="simpleTagsRules">
            <b-form :class="load ? 'disabled_all' : ''">
              <div class="row">
                <b-col md="12">
                  <b-form-group
                    :label="$t('name_custom')"
                    label-for="name"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="name"
                      rules="required"
                    >
                      <b-form-input
                        v-model="form.name"
                        type="text"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="12">
                  <b-form-group
                    :label="$t('name_local')"
                    label-for="name_local"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="name_local"
                      rules="required"
                    >
                      <b-form-input
                        v-model="form.name_local"
                        type="text"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                        validation(null, 0).message
                      }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </div>
            </b-form>
          </validation-observer>
        </b-overlay>
        <template #modal-footer>
              <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="save()"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button type="reset" variant="outline-secondary" @click="resetModal">
                {{ $t("Global.cancel") }}
              </b-button>
        </template>
      </b-modal>
    </div>
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
  BFormDatepicker,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormFile,
  BAlert,
  BButtonGroup,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BSpinner,
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

export default {
  name: "tags",
  components: {
    Show,
    Statistics,
    DataTable,
    BSpinner,
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
  data() {
    return {
      filter: {export: 0, removed: 0},
      paramsLoaded: true,
      tagsModal: false,
      id: null,
      form:{
        name: null,
        name_local: null,
      }
    };
  },
  computed: {
    ...mapGetters({
      items: "tags/items",
      total: "tags/total",
      load: "tags/load",
      lookups: "tags/lookups",
    }),
    fields: function () {
      return [
        {
          key: "name",
          sortable: true,
          label: this.$t("name"),
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

  methods: {
    ...mapActions({
      editTag: "tags/put"
    }),
    refresh(query) {
      this.$store.dispatch("tags/tags", {query: query}).then((data) => {
        this.paramsLoaded = false;
      });
    },
    reset() {
      this.filter = {};
    },
    openAddTagModal(){
      this.id = null
      this.tagsModal = true
    },
    openEditTagModal(item){
      this.id = item.id
      this.form.name = item.name
      this.form.name_local = item.name_local
      this.tagsModal = true
    },
    save(){
      this.$refs.simpleTagsRules.validate().then((success) => {
        if (success) {
          this.editTag({ query: this.form , id: this.id}).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.refresh()
            this.resetModal()
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          });
        }
      });
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("tags/delete", id).then((_) => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    resetModal(){
      this.id = null
      this.form = {
        name: null,
        name_local: null
      }
      this.tagsModal = false
    }
  },
};
</script>
