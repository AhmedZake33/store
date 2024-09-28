<template>
  <div>
    <b-card class="mb-0">
      <b-overlay :show="load" rounded="sm">
        <b-tabs
          v-model="tabIndex"
          @input="saveStatus"
          vertical
          nav-wrapper-class="nav-hidden"
          align="left"
        >
          <!-- Basic Information -->
          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t("Global.basic_info") }}</span>
            </template>
            <Edit
              v-if="edit"
              @hide="cancel()"
              @refresh="init"
              :inline="true"
              :tabNumber="0"
              :data="
                id
                  ? item
                  : {
                      student: '',
                      plan: '',
                      title: '',
                      title_local: '',
                      id: '',
                      status: '',
                    }
              "
            >
            </Edit>
            <ShowComponent
              v-if="item && !edit"
              :loading="load"
              :data="item"
              :only="[
                'student',
                'plan',
                'title',
                'title_local',
                'id',
                'status',
              ]"
            >
              <template #student="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.student`) }}
                </th>
                <td>
                  <b-link
                    class="font-weight-bold d-inline-block"
                    :to="{
                      name: 'student-show',
                      params: { id: data.student.id },
                    }"
                  >
                    {{
                      $i18n.locale == "ar"
                        ? data.student.name_local
                        : data.student.name
                    }}
                  </b-link>
                </td>
              </template>
              <template #plan="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.research_plan`) }}
                </th>
                <td>
                  <div v-if="data.plan">
                    {{
                      $i18n.locale == "ar" ? data.plan.name_local : data.plan.name
                    }}
                  </div>
                </td>
              </template>
              <template #title="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.english_title`) }}
                </th>
                <td>
                  {{ data.title }}
                </td>
              </template>
              <template #title_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_title`) }}
                </th>
                <td>
                  {{ data.title_local }}
                </td>
              </template>
              <template #id="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                  {{ $t(`Global.english_title`) }}
                </th>
                <td v-if="$i18n.locale == 'ar'">
                  {{ data.title }}
                </td>
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                  {{ $t(`Global.arabic_title`) }}
                </th>
                <td v-if="$i18n.locale == 'en'">
                  {{ data.title_local }}
                </td>
              </template>
              <template #abstract="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.english_abstract`) }}
                </th>
                <td>
                  <div v-if="data.abstract">
                    <span v-html="data.abstract"></span>
                  </div>
                  <!-- {{ data.abstract }} -->
                </td>
              </template>
              <template #abstract_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_abstract`) }}
                </th>
                <td>
                  <div v-if="data.abstract">
                    <span v-html="data.abstract_local"></span>
                  </div>
                  <!-- {{ data.abstract_local }} -->
                </td>
              </template>
              <template #submitted_by="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                  {{ $t(`Global.english_abstract`) }}
                </th>
                <td v-if="$i18n.locale == 'ar'">
                  <div v-if="data.abstract">
                    <span v-html="data.abstract"></span>
                  </div>
                  <!-- {{ data.abstract }} -->
                </td>
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                  {{ $t(`Global.arabic_abstract`) }}
                </th>
                <td v-if="$i18n.locale == 'en'">
                  <div v-if="data.abstract">
                    <span v-html="data.abstract_local"></span>
                  </div>
                  <!-- {{ data.abstract_local }} -->
                </td>
              </template>
              <template #status="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.status`) }}
                </th>
                <td>
                  {{
                    $i18n.locale == "ar"
                      ? data.status.name_local
                      : data.status.name
                  }}
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <b-button
                    v-b-tooltip.hover="$t('Print')"
                    @click="printData"
                    variant="primary"
                    class="btn-icon mr-2"
                  >
                    <feather-icon icon="PrinterIcon" />
                  </b-button>
                  <feather-icon
                    v-if="
                      hasPermission('edit_student_thesis') && item.canUpdate
                    "
                    @click="openEdit()"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    v-b-tooltip.hover="$t('Global.edit')"
                  />
                </div>
              </template>
            </ShowComponent>
          </b-tab>
          <!-- Abstracts -->
          <validation-observer ref="simpleRules" v-if="$route.name != 'add_thesis'">
            <b-form ref="form" @submit.stop.prevent="save">
              <b-tab>
                <template #title>
                  <feather-icon icon="Edit3Icon" />
                  <span>{{ $t(`Global.english_abstract`) }}</span>
                </template>
                <div v-if="item && !edit">
                  <div class="text-center text-black my-2" v-if="load">
                    <b-spinner class="align-middle"></b-spinner>
                  </div>
                  <div class="container" v-else>
                    <div
                      class="row w-100 justify-content-end border-bottom mb-2"
                      v-if="
                        hasPermission('edit_student_thesis') && item.canUpdate
                      "
                    >
                      <div class="mt-0 mb-1">
                        <feather-icon
                          v-if="!editAbstract"
                          @click="openEditAbstract(item)"
                          style="cursor: pointer"
                          icon="EditIcon"
                          class="font-medium-3"
                          v-b-tooltip.hover="$t('Global.edit')"
                        />
                        <div v-else>
                          <feather-icon
                            @click="cancelAbstract()"
                            style="cursor: pointer"
                            icon="XCircleIcon"
                            class="font-medium-3"
                            v-b-tooltip.hover="$t('Global.close')"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row w-100">
                      <div
                        v-if="!editAbstract"
                        :class="
                          $i18n.locale == 'en'
                            ? 'w-100 d-flex justify-content-start'
                            : 'w-100 d-flex justify-content-end'
                        "
                      >
                        <span v-html="item.abstract"></span>
                      </div>
                      <div v-else>
                        <b-form-group class="left_right">
                          <validation-provider
                            #default="{ errors }"
                          >
                            <quill-editor
                              :class="
                                $i18n.locale == 'ar' ? 'my-2 rtl' : 'my-2 ltr'
                              "
                              v-model="form.abstract"
                              :options="snowOption"
                              @keypress="sanitizeEnglish($event)"
                            />
                            <ValidationErrors
                              :default-message="true"
                              :frontend-errors="errors"
                              :backend-errors="
                                getBackendFieldError(
                                  errorsdata,
                                  'english_abstract'
                                )
                              "
                            />
                          </validation-provider>
                        </b-form-group>
                        <b-row>
                          <b-col md="12 mt-3">
                            <b-button
                              type="submit"
                              variant="primary"
                              class="mr-1"
                              @click="save()"
                            >
                              {{ $t("Global.save") }}
                            </b-button>
                            <b-button
                              type="reset"
                              variant="outline-secondary"
                              @click="cancelAbstract()"
                            >
                              {{ $t("Global.cancel") }}
                            </b-button>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="Edit3Icon" />
                  <span>{{ $t(`Global.arabic_abstract`) }}</span>
                </template>

                <div v-if="item && !edit">
                  <div class="text-center text-black my-2" v-if="load">
                    <b-spinner class="align-middle"></b-spinner>
                  </div>
                  <div class="container" v-else>
                    <div
                      class="row w-100 justify-content-end border-bottom mb-2"
                      v-if="
                        hasPermission('edit_student_thesis') && item.canUpdate
                      "
                    >
                      <div class="mt-0 mb-1">
                        <feather-icon
                          v-if="!editAbstract"
                          @click="openEditAbstract(item)"
                          style="cursor: pointer"
                          icon="EditIcon"
                          class="font-medium-3"
                          v-b-tooltip.hover="$t('Global.edit')"
                        />
                        <div v-else>
                          <feather-icon
                            @click="cancelAbstract()"
                            style="cursor: pointer"
                            icon="XCircleIcon"
                            class="font-medium-3"
                            v-b-tooltip.hover="$t('Global.close')"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="row w-100 ar">
                      <div
                        v-if="!editAbstract"
                        :class="
                          $i18n.locale == 'ar'
                            ? 'w-100 d-flex justify-content-start'
                            : 'w-100 d-flex justify-content-end'
                        "
                      >
                        <div>
                          <span v-html="item.abstract_local"></span>
                        </div>
                      </div>
                      <div v-else>
                        <b-form-group class="left_right">
                          <validation-provider
                            #default="{ errors }"
                          >
                            <quill-editor
                              :class="
                                $i18n.locale == 'en' ? 'my-2 rtl' : 'my-2 ltr'
                              "
                              v-model="form.abstract_local"
                              :options="snowOption"
                              @keypress="sanitizeEnglish($event)"
                            />
                            <ValidationErrors
                              :default-message="true"
                              :frontend-errors="errors"
                              :backend-errors="
                                getBackendFieldError(
                                  errorsdata,
                                  'arabic_abstract'
                                )
                              "
                            />
                          </validation-provider>
                        </b-form-group>
                        <b-row>
                          <b-col md="12 mt-3">
                            <b-button
                              type="submit"
                              variant="primary"
                              class="mr-1"
                              @click="save()"
                            >
                              {{ $t("Global.save") }}
                            </b-button>
                            <b-button
                              type="reset"
                              variant="outline-secondary"
                              @click="cancelAbstract()"
                            >
                              {{ $t("Global.cancel") }}
                            </b-button>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-form>
          </validation-observer>
          <!-- Members -->
          <b-tab v-if="$route.name != 'add_thesis'">
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t("supervisors") }}</span>
            </template>
            <!-- <div class="text-center text-black my-2" v-if="load">
              <b-spinner class="align-middle"></b-spinner>
            </div> -->
            <div >
              <Members memberType="1"></Members>
            </div>
          </b-tab>
          <b-tab v-if="$route.name != 'add_thesis'">
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t("Global.committees") }}</span>
            </template>
            <!-- <div class="text-center text-black my-2" v-if="load">
              <b-spinner class="align-middle"></b-spinner>
            </div> -->
            <div >
              <Members memberType="2"></Members>
            </div>
          </b-tab>
          <!-- Status -->
          <b-tab v-if="$route.name != 'add_thesis'">
            <template #title>
              <feather-icon icon="ToggleRightIcon" />
              <span>{{ $t("Global.status") }}</span>
            </template>
            <div class="text-center text-black my-2" v-if="load">
              <b-spinner class="align-middle"></b-spinner>
            </div>
            <div v-else>
              <Status :items="item" @refresh="init" @printData="printData" />
            </div>
          </b-tab>
        </b-tabs>
      </b-overlay>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import {
  BBadge,
  BLink,
  BTab,
  BTabs,
  BCard,
  BRow,
  BCol,
  BSpinner,
  BForm,
  BFormGroup,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import Edit from "@/views/research/theses/edit.vue";
import Members from "@/views/research/theses/components/members.vue";
import ShowComponent from "@/views/components/info/show";
import Status from "@/views/research/theses/components/status.vue";

export default {
  name: "Show",
  data() {
    return {
      edit: false,
      editAbstract: false,
      visitedTabs: [],
      tabIndex: 0,
      index: 0,
      snowOption: {
        placeholder: "Compose an epic...",
      },
      errorsdata: {},
      form: {
        research_plan_id: null,
        title: null,
        title_local: null,
        abstract: null,
        abstract_local: null,
        student_id : null,
      },
    };
  },
  components: {
    ShowComponent,
    Members,
    Edit,
    Status,
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BSpinner,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    quillEditor,
  },
  watch: {
    "item.canUpdate"(val) {
      this.editAbstract = val == "true" ? true : false;
    },
  },
  computed: {
    ...mapGetters({
      item: "theses/item",
      load: "theses/load",
    }),
    localLang() {
      return this.$i18n.locale;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  methods: {
    init(id) {
      if (this.id || id) {
        this.$store.dispatch("theses/get", this.id).then((_) => {
          this.form.research_plan_id = this.item.plan.id;
          this.form.title = this.item.title;
          this.form.title_local = this.item.title_local;
          this.form.abstract = this.item.abstract;
          this.form.abstract_local = this.item.abstract_local;
        });
        this.edit =
          this.$route.query.inline == "false"
            ? false
            : this.$route.query.inline;
      } else {
        this.edit = true;
      }
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: true,
      });
    },
    openEditAbstract(item) {
      this.form.student_id = item.student.id
      this.editAbstract = true;
    },
    cancelAbstract() {
      this.editAbstract = false;
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },
    checkTabVisited(index) {
      return this.visitedTabs.includes(index);
    },
    saveStatus(index) {
      this.edit = false;
      this.resetFilterQueryParams({});
      this.updateFilterQueryParams({
        tabNum: index,
        ...this.getTabFilterData(index),
      });
      this.visitedTabs.push(index);
    },
    printData() {
      this.$store
        .dispatch("theses/printPdf", this.id)
        .then((response) => {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.$emit("refresh");
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
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {

          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("theses/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.$route.name == "add_questionnaire") {
                this.$router.go(-1);
              } else {
                this.init();
                this.cancelAbstract();
              }
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
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped>
.ar {
  padding-right: 2rem !important;
}
/deep/ .ql-container {
  min-height: 200px !important;
}

.rtl {
  direction: rtl;
}
/deep/.rtl > .ql-toolbar {
  display: flex;
}
/deep/.rtl > .ql-toolbar > .ql-formats {
  display: flex;
}

.ltr {
  direction: ltr;
}
/deep/.ltr > .ql-toolbar {
  display: flex;
}
/deep/.ltr > .ql-toolbar > .ql-formats {
  display: flex;
}

/deep/ .ql-align-right {
  text-align: right !important;
}
</style>