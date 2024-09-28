<template>
  <div>
    <DataTable
        :browse="true"
        :allowSearch="false"
        :loading="load"
        @Refresh="refresh"
        @reset="reset"
        :draggable="item.canEdit"
        @Drag="drag"
    >
      <template #action>
        <b-button
            v-if="item.canEdit"
            @click="addClicked()"
            class="btn-icon"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </template>
      <template #customTable>
        <b-table
            :sort-desc.sync="filter.order_direction"
            :sort-by.sync="filter.order_by"
            :class="item.canEdit ? 'position-relative list-group list-group-flush cursor-move' : 'position-relative'"
            :items="item.authors"
            responsive
            striped
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(supervisor)="data">
            <div v-if="data && data.item">
              <div>
                {{ $i18n.locale == 'ar' ? data.item.user.name_local : data.item.user.name }}
              </div>
            </div>
          </template>
          <template #cell(order)="data">
            <div v-if="data && data.item">
              <div>
                {{ data.item.order }}
              </div>
            </div>
          </template>
          <template #cell(authors)="data">
            <div v-if="data && data.item">
              <div v-if="data.item.user">
                <b-link :to="{ name: 'staff-show', params: { id: data.item.user.id } }" class="font-weight-bold">
                  {{ $i18n.locale == 'ar' ? data.item.user.name_local : data.item.user.name }}
                </b-link>
              </div>
              <div v-else-if="data.item.name">
                {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name }}
              </div>
            </div>
          </template>
          <template #cell(actions)="data">
            <div v-if="data && data.item">
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
              <b-link>
                <feather-icon
                    v-if="item.canEdit"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    class="text-primary"
                    @click="editMember(data.item)"
                />
              </b-link>
              <b-link>
                <feather-icon
                    v-if="item.canDelete"
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    class="text-danger"
                    @click="deleteMember(data.item.id)"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal no-close-on-backdrop ref="my-modal" v-model="addMemberModal" hide-footer :title="$t('Add Member')">
      <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form @submit.stop.prevent="save">
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.type')" label-for="type">
                <validation-provider #default="{ errors }" name="type" :rules="'required'">
                  <v-select v-model="form.type"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="types" class="w-100 mb-2"
                            :get-option-label="option => $t(option.name)"
                            :reduce="val => val.id"
                            :placeholder="$t('Global.select_type')"
                  >
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="12" v-if="form.type == 0">
              <b-form-group
                  :label="$t('Global.Member')"
                  label-for="mc-member"
              >
                <validation-provider
                    #default="{ errors }"
                    name="member"
                    rules=""
                >
                  <v-select
                      id="mc-members"
                      v-model="form.member_id"
                      :options="searchMembers"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :placeholder="$t('Global.search')"
                      :filterable="false"
                      clearable
                      :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                      :reduce="(val) => val.id"
                      @search="fetchUsers"
                  >
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col cols="12" md="12" v-if="form.type == 1">
              <b-form-group :label="$t('Global.english_name')" label-for="name-input">
                <validation-provider
                    #default="{ errors }"
                    name="name"
                    rules="required"
                >
                  <b-form-input
                      dir="ltr"
                      v-model="form.name"
                      @keypress="sanitizeEnglish($event); sanitizeNumber($event);"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="12" md="12" v-if="form.type == 1">
              <b-form-group
                  :label="$t('Global.arabic_name')"
                  label-for="name_local-input"
              >
                <validation-provider
                    #default="{ errors }"
                    name="name_local"
                    rules="required"
                >
                  <b-form-input
                      dir="rtl"
                      v-model="form.name_local"
                      @keypress="sanitizeArabic($event); sanitizeNumber($event);"
                  />
                  <ValidationErrors :frontend-errors="errors"/>
                </validation-provider>
              </b-form-group>
            </b-col>

            <div class="mt-2" :class="loading ? 'disabled_all' : ''">
              <b-col cols="12" md="12">
                <div class="d-flex justify-content-end">
                  <b-button type="submit" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-primary" @click="addMemberModal = false">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </div>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BForm,
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
  BPopover
} from 'bootstrap-vue';
import DataTable from '@/views/components/table/DataTable';
import {mapActions, mapGetters} from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {required} from '@validations';

export default {
  name: 'publications',
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
    BForm,
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
    BModal,
    VBModal,
    BPopover,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      filter: {removed: 0},
      addMemberModal: false,
      form: {
        type: null,
        member_id: null,
        name: null,
        name_local: null
      },
      types: [
        {id: 0, name: 'Internal'},
        {id: 1, name: 'External'},
      ],
      waitFetchUsers: false,
      searchMembers: [],
    };
  },
  computed: {
    ...mapGetters({
      item: "publications/item",
      load: 'publications/load',
      lookups: 'publications/lookups',
      loading: 'app/load',
      needDrop:'app/needDrop',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields: function () {
      return [
        {
          key: "order",
          label: this.$t("order"),
          sortable: false,
          thStyle: {width: "10%"},
        },
        {
          key: "authors",
          label: this.$t("Author"),
          sortable: false,
        },
        {
          key: 'actions',
          thClass: 'customAction',
          tdClass: 'customWidth',
          label: this.$t("Global.action"),
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
    }),
    refresh() {
      this.$store.dispatch("publications/get", this.id);
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
    addClicked() {
      this.form.type = null;
      this.form.member_id = null;
      this.form.name = "";
      this.form.name_local = "";
      this.addMemberModal = true
    },
    cancelAdd() {
      this.addMemberModal = false
    },
    editMember(item) {
      if (item.user) {
        this.form.id = item.id;
        this.form.type = 0;
        this.form.member_id = item.user.id;
        this.searchMembers.push(item.user);
      } else {
        this.form.id = item.id;
        this.form.type = 1;
        this.form.name = item.name;
        this.form.name_local = item.name_local;
      }
      this.addMemberModal = true;
    },
    deleteMember(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
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
          this.popoverShow = false;
          this.$store.dispatch('publications/removeMember', id).then(response => {
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Deleted'),
              showConfirmButton: false,
              timer: 1500,
            })
            this.refresh()
          });
        }
      });
    },
    drag(data) {
      this.$store.dispatch('publications/reorderMembers', {
        query: data
      })
          .then((response) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.refresh()
          })
          .catch((error) => {
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
    },
    fetchUsers(search, load) {
      if (search.length >= 3 && !this.waitFetchUsers) {
        this.waitFetchUsers = true;
        load(true)
        const query = {
          search_instructors_keyword: search,
        }

        this.getLookups(query).then(response => {
          this.searchMembers = response.success.instructors
          load(false)
          this.waitFetchUsers = false;
        })
      }
    },
    save() {
      this.$refs.simpleForm.validate().then( success => {
        if (success) {

          this.$store
              .dispatch('publications/addMember', { id: this.id , query: this.form })
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: `${this.$t("Global.saved")}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh()
                this.cancelAdd();
              })
              .catch((error) => {
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
      })
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
