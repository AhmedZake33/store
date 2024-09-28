<template>
  <b-row>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0"> {{ $t("Faculties") }}</h4>
            <small>{{ $t("Global.export and import faculties") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportFaculties">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Faculties', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0"> {{ $t("departments") }}</h4>
            <small>{{ $t("Global.export and import departments") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportDeparments">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Faculties', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("Bylaws") }}</h4>
            <small>{{ $t("Global.export and import bylaws") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="handleButtonClick('Bylaws', 'Export')">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Bylaws', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("Programs") }}</h4>
            <small>{{ $t("Global.export and import programs") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportPrograms">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Programs', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("courses") }}</h4>
            <small>{{ $t("Global.export and import courses") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportCourses">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="toggleMigrationModal">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("instructors") }}</h4>
            <small>{{ $t("Global.export and import instructors") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportInstructors">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Instructors', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("Students") }}</h4>
            <small>{{ $t("Global.export and import students") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="Exportstudents">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Students', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("Employees") }}</h4>
            <small>{{ $t("Global.export and import employees") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportEmployees">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Employees', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t("grades") }}</h4>
            <small>{{ $t("Global.export and import grades") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="handleButtonClick('Grades', 'Export')">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Grades', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t('Offerings') }}</h4>
            <small>{{ $t("Global.export and import offerings") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="exportOfferings">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Offerings', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t('Registrations') }}</h4>
            <small>{{ $t("Global.export and import registrations") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="ExportRegistrations">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Registrations', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
    <b-col md="4">
      <b-card>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h4 class="mb-0">{{ $t('payments') }}</h4>
            <small>{{ $t("Global.export and import payments") }}</small>
          </div>
          <div>
            <b-button v-b-tooltip.hover="$t('Global.export_excel')" :class="'ml-1'" class="btn-icon" variant="primary"
              @click="exportPaymentsExcel()">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button v-b-tooltip.hover="$t('Global.importMigrationData')" :class="'ml-1'" class="btn-icon"
              variant="primary" @click="handleButtonClick('Payments', 'Import')">
              <feather-icon icon="UploadCloudIcon" />
            </b-button>
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { BCol, BRow, BCard, BButton, BIcon } from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "YourParentComponent",
  components: { BCol, BRow, BCard, BButton, BIcon },

  // Inside your Faculties component
  data() {
    return {
    
      exportQuery: null,
  
      filter: {
        removed: 0,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        statuses: [],
        date_from: null,
        date_to: null,
        scholarship_id: null,
        nationality_id: [],
        installment_status: []
      },
   
    };
  },
  methods: {
    ...mapActions({
      exportemployeesExcel: 'employees/export',
      exportofferingsExcel: "offerings/exportData",
      exportregestrationsExcel: "registrations/export",
      exportstudentExcel: "students/export",
      exportProgramsExcel: 'programs/export',
      exportdepartmentExcel: 'departments/export',
      exportfacultiesExcel: "faculties/export",
      exportTemplate: 'departments/exportMigrationTemplate',
      exportTemplate: 'courses/exportMigrationTemplate',
    }),
    exportPaymentsExcel(query){
      query = {...query, language: this.$i18n.locale};
      this.$store.dispatch('payments/exportDataExcel', { 
        query: query 
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        // let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
        let message = this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
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
    ExportInstructors(query) {
      query = {...query, language: this.$i18n.locale, excel_name: this.excel_name};
      if (this.faculty_id) {
        query = {...query, faculty_id: this.faculty_id};
      }

      if (this.department_id) {
        query = {...query, department_id: this.department_id};
      }

      this.$store.dispatch('instructors/export', query).then(_ => {
        this.filter.export = 0;
      });
    },
    ExportEmployees(query) {
      const payload = {...query, language: this.$i18n.locale};
      this.exportemployeesExcel(payload);
      this.filter.export = 0;
    },
    ExportRegistrations(query) {
      query = {...query, language: this.$i18n.locale,grad: 'UG'};
      this.exportregestrationsExcel(query);
      this.filter.export = 0;
    },
    exportOfferings() {
      this.exportofferingsExcel({ lang: this.$i18n.locale, query: this.filter });
    },
    ExportFaculties(query) {
      // let payload = {query: {...query, language: this.$i18n.locale}};
      query = { ...query, language: this.$i18n.locale };
      this.exportfacultiesExcel(query);
      this.filter.export = 0;
    },
    Exportstudents(query) {
      const payload = { ...query, language: this.$i18n.locale,term_id :1561 };
      this.$store.dispatch("students/export", payload).then((res) => {
        this.filter.export = 0;
      });
    },
    ExportPrograms(query) {
      query = { ...query, language: this.$i18n.locale, excel_name: this.excel_name };

      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: Number(this.faculty_id) };
      }

      this.exportProgramsExcel(query);
      this.filter.export = 0;
    },
    ExportDeparments(query) {
      // let payload = {query: {...query, language: this.$i18n.locale}};
      query = {...query, language: this.$i18n.locale, excel_name: this.excel_name};
      if (this.faculty_id) {
        query = {...query, faculty_id: this.faculty_id};
      }
      this.exportdepartmentExcel(query);
      this.filter.export = 0;
    },
    exportMigrationTemplate() {
      this.exportTemplate();
    },
    toggleMigrationModal() {
      this.importMigrationModal = !this.importMigrationModal;
    },

    async uploadMigrationData() {
      this.$refs.importForm.validate().then(success => {
        if (success) {
          this.$swal({
            title: "Are you sure?",
            text: `${this.$t("Global.confirmUpload")}`,
            icon: "warning",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: `${this.$t("Global.cancel")}`,
            confirmButtonText: `${this.$t("Global.yes_import")}`,
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
          }).then(async (result) => {
            if (result.value) {
              this.total_message = "";
              this.status_messages = [];
              this.statusModal = true;
              this.showCloseButton = false;

              const data = new FormData();
              for (let i = 0; i < this.migrationFiles.length; i++) {
                let file = this.migrationFiles[i];
                data.append('files[' + i + ']', file);
              }
              let url = process.env.VUE_APP_BASE_URL + "/courses/import_migrated_courses";
              const response = await fetch(url, {
                headers: {
                  Authorization: "Bearer " + getToken(),
                },
                method: "POST",
                body: data,
              });
              let isDone = false;
              const reader = response.body
                .pipeThrough(new TextDecoderStream())
                .getReader();
              while (!isDone) {
                const { value, done } = await reader.read();
                if (done || isDone) {
                  this.migrationFiles = [];
                  this.toggleMigrationModal();
                  this.refresh();
                  this.showCloseButton = true;
                  this.$swal({
                    icon: "success",
                    title: this.$t("Global.success"),
                    showConfirmButton: true,
                    text: this.$t("Global.import_done_successfully"),
                  });
                  break;
                }

                let allObjects = typeof value !== "undefined" ? value.split("}") : {};
                if (allObjects.length) {
                  for (let i = 0; i < allObjects.length; i++) {
                    if (allObjects[i].trim() !== "" && allObjects[i].trim()) {
                      let object = allObjects[i] + "}";
                      object = JSON.parse(object);
                      if (object.done === false && object.failed === false) {
                        this.setStatusesMessages(object);
                      } else if (object.done === true && object.failed === false) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "success",
                          title: this.$t("Global.success"),
                          showConfirmButton: true,
                          text: this.$t("Global.import_done_successfully"),
                        });
                      } else if (object.failed === true) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "error",
                          title: this.$t("Global.failed"),
                          showConfirmButton: true,
                          text: object.message,
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
    ExportCourses(query) {
      query = { ...query, language: this.$i18n.locale, excel_name: this.excel_name };
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.department_id) {
        query = { ...query, department_id: this.department_id };
      }

      this.$store.dispatch('courses/export', query).then(_ => {
        this.filter.export = 0;
      });
    },
  }

};

</script>

<style scoped>
/* Your scoped styles here */
</style>
