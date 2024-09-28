<template>
  <div>
    <b-card class="mb-0">
      <b-tabs
        v-model="tabIndex"
        @input="saveStatus"
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
        <b-tab v-for="(item, i) in tabslist" :key="i">
          <template #title>
            <feather-icon :icon="item.icon" />
            <span>{{ $t(`${item.title}`) }}</span>
          </template>

          <b-overlay :show="load || addLoad" rounded="sm">
            <div class="d-flex justify-content-end">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="edit_mode = true"
                v-if="hasPermission('edit_roles') && !edit_mode"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.cancel')"
                style="cursor: pointer"
                icon="XCircleIcon"
                class="font-medium-3 text-danger"
                @click="edit_mode = false"
                v-if="hasPermission('edit_roles') && edit_mode"
              />
            </div>
            <b-row>
              <b-col
                cols="12"
                class="mb-2"
                lg="6"
                v-if="item.children && item.children.includes(name)"
                md="6"
                v-for="(permissions, name) in permissionsGroups"
                :key="name"
              >
                <b-card no-body class="mb-0">
                  <b-card-header class="pb-0">
                    <h5>
                      <feather-icon icon="StarIcon" />
                      <span v-if="name == 'Term' && i == 1">
                        {{ $t(`Global.term2`) }}
                      </span>
                      <span v-else>
                        {{ $t(`Global.${name}`) }}
                      </span>
                    </h5>
                  </b-card-header>
                  <b-row v-if="edit_mode">
                    <!-- Permissions {{ Permissions }} -->
                    <b-col
                      :key="id"
                      md="12"
                      class="mx-2 d-flex justify-content-between"
                      style="margin-bottom: 5px"
                      v-for="(permission, id) in permissions"
                    >
                      <b-form-checkbox
                        class="mx-1"
                        :disabled="disabled"
                        :value="id"
                        v-model="Permissions"
                        plain
                        :label="id"
                        :key="id"
                      >
                        <strong class="text-primary">
                          {{
                            $i18n.locale == 'ar'
                              ? permission.label_name_local
                              : permission.label_name
                          }}
                        </strong>
                        <small class="text-muted font-small-1">
                          ({{ permission.name }})
                        </small>
                      </b-form-checkbox>
                      <feather-icon
                        v-b-tooltip.hover="$t('Global.edit')"
                        icon="EditIcon"
                        @click="openPermission(permission)"
                        style="
                          cursor: pointer;
                          margin-left: 2.5rem;
                          margin-right: 2.5rem;
                        "
                        v-if="hasPermission('admin_roles')"
                      />
                    </b-col>
                  </b-row>
                  <b-row class="mb-1" v-else>
                    <b-col
                      :key="id"
                      md="12"
                      class="mx-2"
                      style="margin-bottom: 5px"
                      v-for="(permission, id) in permissions"
                    >
                      <feather-icon
                        :icon="
                          Permissions.includes(id)
                            ? 'CheckCircleIcon'
                            : 'XCircleIcon'
                        "
                        :class="
                          Permissions.includes(id)
                            ? ' font-small-2 text-success'
                            : ' font-small-2 text-danger'
                        "
                      />
                      <strong class="text-primary">
                        {{
                          $i18n.locale == 'ar'
                            ? permission.label_name_local
                            : permission.label_name
                        }}
                      </strong>
                      <small class="text-muted font-small-1">
                        ({{ permission.name }})
                      </small>
                    </b-col>
                  </b-row>
                </b-card>
              </b-col>
            </b-row>
            <b-row class="d-flex justify-content-end mx-2" v-if="edit_mode">
              <b-col md="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  @click="updateRole"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{ $t('Global.save') }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  @click="edit_mode = false"
                  type="reset"
                  variant="outline-secondary"
                >
                  {{ $t('Global.cancel') }}
                </b-button>
              </b-col>
            </b-row>
          </b-overlay>
        </b-tab>
      </b-tabs>
    </b-card>

    <b-modal
      v-model="permissionDialog"
      centered
      id="modal-closing"
      ref="my-modal"
      :title="$t('Global.submit_permission_name')"
      :cancel-title="$t('Global.cancel')"
      :ok-title="$t('Global.save')"
      cancel-variant="outline-secondary"
      @show="resetModal"
      @hidden="resetModal"
      @ok="permissionOk"
    >
      <validation-observer ref="simpleRules">
        <form ref="form" @submit.stop.prevent="savePermission">
          <b-col md="12">
            <b-form-group
              :label="$t('Global.english_name')"
              label-for="name-input"
              invalid-feedback="Name is required"
            >
              <validation-provider
                #default="{ errors }"
                name="name"
                rules="english|required"
              >
                <b-form-input
                  id="name-input"
                  v-model="permissionForm.label_name"
                  :state="errors.length > 0 ? false : null"
                  @keypress="sanitizeEnglish($event)"
                />
                <ValidationErrors
                  :frontend-errors="errors"
                  :backend-errors="getBackendFieldError(errorsdata, 'new_role')"
                />
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group
              :label="$t('Global.arabic_name')"
              label-for="nameAr-input"
            >
              <validation-provider
                #default="{ errors }"
                name="name_local"
                rules="arabic|required"
              >
                <b-form-input
                  id="nameAr-input"
                  v-model="permissionForm.label_name_local"
                  class="right_left"
                  :state="errors.length > 0 ? false : null"
                  @keypress="sanitizeArabic($event)"
                />
                <ValidationErrors
                  :frontend-errors="errors"
                  :backend-errors="
                    getBackendFieldError(errorsdata, 'name_local')
                  "
                />
              </validation-provider>
            </b-form-group>
          </b-col>
        </form>
      </validation-observer>
    </b-modal>

    <b-modal
      v-model="roleDialog"
      centered
      id="modal-prevent-closing"
      ref="my-modal"
      :title="$t('Global.submit_role_name')"
      :cancel-title="$t('Global.cancel')"
      :ok-title="$t('Global.save')"
      cancel-variant="outline-secondary"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <validation-observer ref="simpleRules">
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-col md="12">
            <b-form-group
              :label="$t('Global.english_name')"
              label-for="name-input"
              invalid-feedback="Name is required"
            >
              <validation-provider
                #default="{ errors }"
                name="name"
                rules="english|required"
              >
                <b-form-input
                  id="name-input"
                  v-model="form.new_role"
                  :state="errors.length > 0 ? false : null"
                  @keypress="sanitizeEnglish($event)"
                />
                <ValidationErrors
                  :frontend-errors="errors"
                  :backend-errors="getBackendFieldError(errorsdata, 'new_role')"
                />
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group
              :label="$t('Global.arabic_name')"
              label-for="nameAr-input"
            >
              <validation-provider
                #default="{ errors }"
                name="name_local"
                rules="arabic|required"
              >
                <b-form-input
                  id="nameAr-input"
                  v-model="form.name_local"
                  class="right_left"
                  :state="errors.length > 0 ? false : null"
                  @keypress="sanitizeArabic($event)"
                />
                <ValidationErrors
                  :frontend-errors="errors"
                  :backend-errors="
                    getBackendFieldError(errorsdata, 'name_local')
                  "
                />
              </validation-provider>
            </b-form-group>
          </b-col>
        </form>
      </validation-observer>
    </b-modal>

    <b-popover
      ref="popover"
      variant="outline-warning"
      target="popover-reactive-1"
      triggers="focus"
      :show.sync="popoverShow"
      placement="auto"
      container="my-container"
    >
      <template v-slot:title>
        <div class="d-flex justify-content-between align-items-center">
          <span>Warning</span>
          <!-- <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="close" variant="transparent" aria-label="Close">
                                <span class="d-inline-block text-white" aria-hidden="true">&times;</span>
                              </b-button> -->
        </div>
      </template>

      <div>
        <!-- <span>
                              {{$t('Global.warning')}}
                          </span> -->
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          size="sm"
          variant="danger"
          @click="popoverShow = false"
          class="mr-1"
        >
          Cancel
        </b-button>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          @click="deleteRole()"
          size="sm"
          variant="primary"
        >
          Ok
        </b-button>
      </div>
    </b-popover>
  </div>
</template>

<script>
import {
  BModal,
  BTable,
  VBModal,
  BTab,
  BTabs,
  BPopover,
  BFormCheckbox,
  BFormGroup,
  BCardText,
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
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
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
import { PlusIcon, DeleteIcon } from 'vue-feather-icons';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required } from '@validations';
import DataTable from '@/views/components/table/DataTable';

export default {
  components: {
    DataTable,
    BCard,
    BPopover,
    PlusIcon,
    ValidationObserver,
    BTab,
    BTabs,
    ValidationProvider,
    localize,
    ValidationErrors,
    vSelect,
    BModal,
    VBModal,
    DeleteIcon,
    BFormCheckbox,
    BCardText,
    BRow,
    BFormGroup,
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
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      perPage: 10,
      pageOptions: [5, 10, 15],
      totalRows: 1,
      currentPage: 1,
      edit_mode: false,
      tabIndex: '0',
      name: '',
      nameState: null,
      roleState: null,
      popoverShow: false,
      submittedNames: [],
      Permissions: [],
      Auth: JSON.parse(Cookies.get('user')),
      disabled: true,
      role_name: '',
      role: null,
      errorsdata: null,
      new_role: '',
      permissionDialog: false,
      permission_id: null,
      form: {
        new_role: '',
        name_local: null,
      },
      permissionForm: {
        label_name: '',
        label_name_local: '',
      },
      tabslist: [
        {
          title: 'dashboard',
          icon: 'HomeIcon',
          children: ['System'],
        },
        {
          title: 'admission',
          icon: 'LayersIcon',
          children: [
            'Term',
            'Applicant',
            'TransferStudent',
            'PostgraduateAdmission',
          ],
        },
        {
          title: 'students',
          icon: 'UserIcon',
          children: ['Student', 'Military','Certificate', 'CorrectionRequests', 'Advising','InternalTransfer', 'ExternalTransfer', 'Other','Hotel','Notes'],
        },
        {
          title: 'study',
          icon: 'BookOpenIcon',
          children: [
            'Term',
            'Year',
            'Offering',
            'OfferingSchedule',
            'OfficeHours',
            'Registration',
            'Sections',
            'Study',
            'Excuse',
            'AcademicAdvisors',
            'AdvisedStudents',
            'OfferingMethod',
            'OfferingAssessment',
            'OfferingTopic',
            'Training',
          ],
        },
        {
          title: 'Control',
          icon: 'BookOpenIcon',
          children: [
            'Control',
            'ControlAction',
            'StudentActivity',
            'PracticalExam',
            'MidtermExam',
            'OralExam',
            'FinalExam',
            'Extra',
            'Barcode',
            'Recheck',
            'Total',
          ],
        },
        {
          title: 'examination',
          icon: 'PenToolIcon',
          children: [
            'Examination',
            'Exam',
            'ExamSlot',
            'ExamSchedule',
            'ExamSpecification',
            'ExamDelivery',
            'ExamTakePapers',
            'ExamReturnPapers',
            'ExamAbsence',
            'ExamPunishment',
            'ExamDeliver',
            'ExamBackupBarcode',
            'ExamBarcode',
            'ExamPapersType',
            'Sheet',
          ],
        },
        {
          title: 'quality',
          icon: 'AwardIcon',
          children: ['QuestionnaireType','Questionnaire','QuestionnaireQuestion','QuestionnaireStats','CourseFiles','Quality']
        },
        {
          title: 'post_graduate',
          icon: 'BookIcon',
          children: ['Graduates','Theses','Thesis', 'Publication','MasterDegree']
        },
        {
          title: 'financial',
          icon: 'DollarSignIcon',
          permission: 'access_applicant',
          children: [
            'Applicant',
            'Financial',
            'Payment',
            'Batches',
            'Batch',
            'Transaction',
            'Credit',
          ],
        },
        {
          title: 'chat',
          icon: 'MessageCircleIcon',
          children: ['Request', 'Chat'],
        },
        {
          title: 'communication',
          icon: 'MessageCircleIcon',
          children: ['Communication'],
        },
        {
          title: 'ticket',
          icon: 'MessageCircleIcon',
          children: ['Ticket'],
        },
        {
          title: 'academic_settings',
          icon: 'CommandIcon',
          children: [
            'Faculty',
            'Department',
            'Bylaw',
            'Course',
            'Program',
            'Academic',
          ],
        },
        {
          title: 'services_settings',
          icon: 'LayersIcon',
          children: ['Items','Fees','Years','CertificateSetting','FinancialSetting','Scholarship','DueDates'],
        },
        {
          title: 'user_settings',
          icon: 'UserPlusIcon',
          children: [
            'Users',
            'Instructor',
            'Employee',
            'Roles',
            'UsersSettings',
          ],
        },
        {
          title: 'Administration',
          icon: 'SettingsIcon',
          children: ['Schedule Settings', 'Archive', 'Log', 'Administration', 'Management', 'Building', 'Location', 'Slot', 'MarkCategories', 'Groups','TicketGroup','University', 'MigrationData', 'Tags','Bank'],
        },
        {
          title: 'Development',
          icon: 'SettingsIcon',
          children: ['Development'],
        },
        {
          title: 'Reports',
          icon: 'BookOpenIcon',
          children: [
            'Reports',
            'Applicants',
            'AcademicStaff',
            'Graduate',
            'Registrations',
            'Students',
            'Financials',
            'Equivalent',
            'Foreigner',
          ],
        },
      ],
      roleDialog: false,
      message: null,
      changed: true,
    };
  },

  watch: {
    role: function (role) {
      if (role) {
        this.$store
          .dispatch('roles/getRolePermissions', role.id)
          .then((response) => {
            this.Permissions = this.$store.getters['roles/rolePermissions'];
            this.disabled = false;
          });
      } else {
        this.Permissions = [];
      }
    },
    edit_mode(val) {
      if (!val) {
        this.Permissions = this.$store.getters['roles/rolePermissions'];
      }
    },
  },
  computed: {
    ...mapGetters({
      permissionsGroups: 'roles/permissionsGroups',
      roles: 'roles/roles',
      total: 'roles/total',
      load: 'roles/rolesLoad',
      addLoad: 'roles/addLoad',
    }),
  },
  mounted() {
    this.refresh();
  },
  methods: {
    shortName(name) {
      var nameArr = name.split(' ');
      return nameArr[0].toLowerCase();
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
      this.setSelectedTab({ name: '', id: Number(index) });
    },
    // changeStatus() {
    //   this.changed = false;
    // },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },

    openPermission(permission) {
      this.permission_id = permission.id;
      this.permissionForm.label_name_local = permission.label_name_local;
      this.permissionForm.label_name = permission.label_name;
      this.permissionDialog = true;
    },

    checkruleFormValidity() {
      const valid = this.$refs.ruleForm.checkValidity();
      this.roleState = valid;
      return valid;
    },

    resetModal() {
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    permissionOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.savePermission();
    },
    deleteRole() {
      if (!this.checkruleFormValidity()) {
        return;
      }
      if (this.role) {
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
        }).then((result) => {
          if (result.value) {
            this.popoverShow = false;
            this.$store
              .dispatch('roles/deleteRole', this.role.id)
              .then((response) => {
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Deleted'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.$store.dispatch('roles/getRoles').then((response) => {
                  this.role = '';
                  this.disabled = true;
                  this.role_name = '';
                });
                this.$store.dispatch(
                  'roles/getAuthUserRolesPermissions',
                  this.Auth.id
                );
              });
          }
        });
      }
    },
    updateRole() {
      if (this.role) {
        this.$store
          .dispatch('roles/updateRole', {
            id: this.role.id,
            data: {
              name: this.role.name,
              name_local: this.role.name_local,
              permissions: this.Permissions,
            },
          })
          .then((response) => {
            this.$store.dispatch('roles/getRoles').then((response) => {
              this.role = {
                id: this.role.id,
                type: 'role',
                name: this.role.name,
              };
              this.changed = true;
              this.edit_mode = false;
            });
            this.$store.dispatch(
              'roles/getAuthUserRolesPermissions',
              this.Auth.id
            );
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Saved'),
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      this.addRole();
      // this.$nextTick(() => {
      //   this.$refs['my-modal'].toggle('#toggle-btn');
      // });
    },
    savePermission() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch('roles/savePermission', {
              id: this.permission_id,
              data: this.permissionForm,
            })
            .then((response) => {
              this.permissionDialog = false;
              this.refresh();
              this.$swal({
                icon: 'success',
                title: this.$t('Global.Saved'),
                showConfirmButton: false,
                timer: 1500,
              });
              this.permissionForm.label_name = null;
              this.permissionForm.label_name_local = null;
            })
            .catch((error) => {
              this.errorToast(this.$t('role_exist'));
            });
        }
      });
    },
    addRole() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          if (this.form.new_role !== '') {
            this.$store
              .dispatch('roles/addRole', {
                data: {
                  name: this.form.new_role,
                  name_local: this.form.name_local,
                },
              })
              .then((response) => {
                this.message = null;
                this.roleDialog = false;
                this.role = this.$store.getters['roles/newRole'];
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Saved'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.form.new_role = null;
                this.form.name_local = null;
              })
              .catch((error) => {
                this.errorToast(this.$t('role_exist'));
              });
          }
        }
      });
    },
    refresh() {
      // this.$store.dispatch('roles/getRolePermissions', this.$route.params.id).then(response => {
      //     this.Permissions = this.$store.getters['roles/rolePermissions'];
      this.$store.dispatch('roles/getRoles').then((_) => {
        this.$nextTick((_) => {
          this.setPageTabs();
        });
        this.role = this.roles.find((x) => x.id == this.$route.params.id);
        this.$store.commit('app/UPDATE_PAGE_DETAILS', this.role);
        if (this.$route.query.tabNum) {
          this.tabIndex = this.$route.query.tabNum;
        }
      });
      // this.disabled = false;
      // });
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
.dropdown-menu.show {
  z-index: 999 !important;
}
</style>
