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
          :class="!rerender ? 'py-3' : ''"
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

          <div class="d-flex mb-2 justify-content-end">
            <feather-icon
              v-b-tooltip.hover="$t('Global.edit')"
              style="cursor: pointer"
              icon="EditIcon"
              class="font-medium-3"
              @click="edit_mode = true"
              v-if="hasPermission('edit_roles')"
            />
          </div>

          <b-row class="d-flex justify-content-between">
            <div class="flex-fill mx-1">
              <form ref="ruleForm">
                <b-form-group>
                  <v-select
                    v-if="edit_mode"
                    required
                    multiple
                    :placeholder="$t('Global.roles')"
                    v-model="role"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    :options="roles"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local || option.name
                          : option.name || option.name_local
                      }}
                      <!--                    {{option}}-->
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local || name
                        }}</strong>
                        <strong v-else>{{ name || name_local }}</strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <div v-else class="mx-2">
                    <b-badge
                      :key="i"
                      v
                      pill
                      v-for="(item, i) in role"
                      variant="primary"
                      style="margin-right: 3px"
                      class="font-small-4"
                    >
                      {{ $i18n.locale == "ar" ? item.name_local : item.name }}
                    </b-badge>
                  </div>
                </b-form-group>
              </form>
            </div>
          </b-row>

          <b-overlay :show="load" rounded="sm">
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
                      {{ $t(`Global.${name}`) }}
                    </h5>
                  </b-card-header>
                  <b-row v-if="edit_mode">
                    <b-col
                      :key="id"
                      md="12"
                      class="mx-2 d-flex justify-content-between"
                      style="margin-bottom: 5px"
                      v-for="(permission, id) in permissions"
                    >
                      <b-form-checkbox
                        class="mx-1"
                        :disabled="
                          userRolesPermissions.indexOf(id) !== -1
                            ? disabled
                            : !disabled
                        "
                        :value="id"
                        v-model="Permissions"
                        plain
                        :label="id"
                        :key="id"
                      >
                        <strong class="text-primary">
                          {{
                            $i18n.locale == "ar"
                              ? permission.label_name_local
                              : permission.label_name
                          }}
                        </strong>
                        <small class="text-muted font-small-1">
                          ({{ permission.name }})
                        </small>
                      </b-form-checkbox>
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
                          $i18n.locale == "ar"
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
                  @click="save"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{ $t("Global.save") }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  @click="edit_mode = false"
                  type="reset"
                  variant="outline-secondary"
                >
                  {{ $t("Global.cancel") }}
                </b-button>
              </b-col>
            </b-row>
          </b-overlay>
        </b-tab>
      </b-tabs>
    </b-card>
    <!--    <b-overlay :show="load" rounded="sm">-->
    <!--      <b-row>-->
    <!--        <b-col cols="12" class="mb-2" lg="4" md="6" v-for="(permissions, name) in permissionsGroups" :key="name">-->
    <!--          <b-card no-body class="mb-0">-->
    <!--            <b-card-header class="pb-0">-->
    <!--              <h5>-->
    <!--                <feather-icon icon="StarIcon"/>-->
    <!--                {{ $t(`Global.${name}`) }}-->
    <!--              </h5>-->
    <!--            </b-card-header>-->
    <!--            <b-row class="mb-1">-->
    <!--              <b-col md="12" class="mx-2 d-flex justify-content-between" style="margin-bottom: 5px"-->
    <!--                     v-for="(permission, id) in permissions">-->
    <!--                <b-form-checkbox class="mx-1" :disabled="userRolesPermissions.indexOf(id) !== -1 ? disabled : !disabled" :value="id" v-model="Permissions" plain :label="id" :key="id">-->
    <!--                  <strong class="text-primary">-->
    <!--                    {{ $i18n.locale == 'ar' ? permission.label_name_local : permission.label_name }}-->
    <!--                  </strong>-->
    <!--                  <small class="text-muted  font-small-1">  ({{ permission.name }}) </small>-->
    <!--                </b-form-checkbox>-->
    <!--              </b-col>-->
    <!--            </b-row>-->
    <!--          </b-card>-->
    <!--        </b-col>-->
    <!--      </b-row>-->
    <!--    </b-overlay>-->
  </div>
</template>

<script>
import {
  BModal,
  BTab,
  BTabs,
  BTable,
  VBModal,
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
} from "bootstrap-vue";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";

export default {
  components: {
    BCard,
    BPopover,
    PlusIcon,
    BTab,
    BTabs,
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
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      Permissions: [],
      disabled: true,
      tabIndex: 0,
      edit_mode: false,
      role: [],
      tabslist: [
        {
          title: "dashboard",
          icon: "HomeIcon",
          children: ["System"],
        },
        {
          title: "admission",
          icon: "LayersIcon",
          children: [
            "Term",
            "Applicant",
            "TransferStudent",
            "PostgraduateAdmission",
          ],
        },
        {
          title: "students",
          icon: "UserIcon",
          children: [
            "Student",
            "Certificate",
            "CorrectionRequests",
            "InternalTransfer",
            "Advising",
            "Other",
          ],
        },
        {
          title: "study",
          icon: "BookOpenIcon",
          children: [
            "Term",
            "Year",
            "Offering",
            "Registration",
            "Sections",
            "Study",
            "Excuse",
            "Control",
            "MarksControl",
            "OfferingMethod",
            "OfferingAssessment",
            "OfferingTopic"
          ],
        },
        {
          title: "financial",
          icon: "DollarSignIcon",
          permission: "access_applicant",
          children: ["Applicant", "Financial", "Credit", "Payment"],
        },
        {
          title: "chat",
          icon: "MessageCircleIcon",
          children: ["Request", "Chat"],
        },
        {
          title: "ticket",
          icon: "MessageCircleIcon",
          children: ["MyTicket", "Ticket"],
        },
        {
          title: "academic_settings",
          icon: "CommandIcon",
          children: [
            "Faculty",
            "Department",
            "Bylaw",
            "Courses",
            "Program",
            "Academic",
          ],
        },
        {
          title: "services_settings",
          icon: "LayersIcon",
          children: ["CertificateSetting"],
        },
        {
          title: "user_settings",
          icon: "UserPlusIcon",
          children: ["Users", "Instructor", "Employee", "Roles"],
        },
        {
          title: "Administration",
          icon: "SettingsIcon",
          children: [
            "Schedule Settings",
            "Archive",
            "Log",
            "Building",
            "Location",
            "Slot",
            "MarkCategories",
          ],
        },
      ],
      changed: true,
    };
  },
  computed: {
    ...mapGetters({
      permissionsGroups: "roles/permissionsGroups",
      userRolesPermissions: "roles/userRolesPermissions",
      rolesList: "roles/roles",
      userRoles: "roles/userRoles",
      total: "roles/total",
      load: "roles/rolesLoad",
    }),
  },
  mounted() {
    this.refresh();
  },
  methods: {
    shortName(name) {
      var nameArr = name.split(" ");
      return nameArr[0].toLowerCase();
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index });
      this.setSelectedTab(index);
    },
    refresh() {
      this.$store.dispatch("roles/getRoles").then((_) => {
        this.$nextTick((_) => {
          this.setPageTabs();
        });
        this.$store
          .dispatch("roles/getUserRolesPermissions", this.$route.params.id)
          .then((response) => {
            this.role = this.userRoles.map((role) => {
              return role;
            });
            this.Permissions.push(
              ...this.$store.getters["roles/userRolesPermissions"]
            );
            this.Permissions.push(
              ...this.$store.getters["roles/userPermissions"]
            );
          });
      });
    },
    save() {
      let direct_permission = this.Permissions.filter(
        (permission) =>
          this.$store.getters["roles/userRolesPermissions"].indexOf(
            permission
          ) === -1
      );
      let roles = this.role.map((role) => {
        if (role.name) {
          return role.name;
        } else {
          return role;
        }
      });
      this.$store
        .dispatch("roles/updateUserRolesPermissions", {
          id: this.$route.params.id,
          data: { roles: roles, permissions: direct_permission },
        })
        .then((response) => {
          this.$store
            .dispatch("roles/getUserRolesPermissions", this.$route.params.id)
            .then((response) => {
              // this.roles = this.$store.getters['roles/userRoles'];
              this.Permissions = [];
              this.Permissions.push(
                ...this.$store.getters["roles/userRolesPermissions"]
              );
              this.Permissions.push(
                ...this.$store.getters["roles/userPermissions"]
              );
              this.edit_mode = false;
              this.$swal({
                icon: "success",
                title: this.$t("Global.Saved"),
                showConfirmButton: false,
                timer: 1500,
              });
            });
        });
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
@import "@core/scss/vue/libs/vue-select.scss";
</style>
