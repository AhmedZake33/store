<template>
  <b-row>
    <b-col md="6" class="my-1">
      <b-form-group class="mb-0">
        <b-input-group size="xs">
          <b-form-input
            id="filterInput"
            v-model="filter"
            type="search"
            :placeholder="$i18n.locale == 'en' ? 'Search...' : ' ابحث...'"
          >
          </b-form-input>
        </b-input-group>
      </b-form-group>
    </b-col>

    <b-col cols="12">
      <b-overlay :show="show" rounded="sm" no-fade>
        <div v-if="warning">
          <b-alert variant="warning" show>
            <div class="alert-body">
              <span v-if="$i18n.locale == 'en'"
                >These Students Codes Are Missing</span
              >
              <span v-if="$i18n.locale == 'ar'">رموز هؤلاء الطلاب مفقودة </span>
              <br />
              <span v-for="msg in warningMessage" :key="alert">
                {{ msg.code }} ,
              </span>
            </div>
          </b-alert>
        </div>
        <div v-if="alert">
          <b-alert variant="danger" show>
            <div class="alert-body">
              <span v-if="$i18n.locale == 'en'"
                >These Students Aren't Registered In This Offering</span
              >
              <span v-if="$i18n.locale == 'ar'"
                >هؤلاء الطلاب غير مسجلين في هذا المقرر</span
              >
              <br />
              <span v-for="msg in alertMessage" :key="alert">
                {{ msg.code }} ,
              </span>
            </div>
          </b-alert>
        </div>
        <b-table
          v-if="fillData"
          striped
          hover
          responsive
          :per-page="perPage"
          :current-page="currentPage"
          :items="fillData"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :filter="filter"
          :filter-included-fields="filterOn"
          @filtered="onFiltered"
        >
          <template #cell(note)="items">
            <span
              v-for="elem in items.item.note"
              :key="elem"
              style="color: red"
            >
              {{ elem }}
              <br />
            </span>
          </template>
          <template #cell(asm_altalb)="items">
            {{ items.item.asm_altalb }}
          </template>
        </b-table>
      </b-overlay>
    </b-col>

    <b-col md="4" sm="4" class="my-0">
      <b-form-group class="mb-0">
        <label class="d-inline-block text-sm-left mr-50">{{
          $t("Global.show")
        }}</label>
        <b-form-select
          id="perPageSelect"
          v-model="perPage"
          :options="pageOptions"
          class="w-25 v-select per-page-selector d-inline-block mx-50 vs--single vs--searchable"
        />
        <label class="d-inline-block text-sm-right ml-50">
          {{ $t("Global.entries") }} . {{ $t("Global.from") }} 1
          {{ $t("Global.to") }} {{ perPage }} {{ $t("Global.of") }}
          {{ totalRows }}</label
        >
      </b-form-group>
    </b-col>
    <b-col v-if="$i18n.locale == 'en'" md="8" sm="4" class="justFlexEn">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        class="my-0 pagination mb-0 mt-1 mt-sm-0 b-pagination"
      />
    </b-col>
    <b-col v-if="$i18n.locale == 'ar'" md="8" sm="4" class="justFlexAr pr-5">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        class="my-0"
      />
    </b-col>

    <b-col
      :class="show ? 'disabled_all' : ''"
      v-if="$i18n.locale == 'en'"
      md="12"
      class="justFlexEn pr-7"
      style="padding-right: 100px"
    >
      <b-button
        v-if="button == true"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="btn-icon ml-1 mt-1"
        @click="submit()"
      >
        {{ $t("Global.save") }}
      </b-button>

      <b-button
        v-if="button == false"
        class="btn-icon mt-1"
        @click="wrongSubmit()"
      >
        {{ $t("Global.save") }}
      </b-button>

      <b-button
        class="btn-icon ml-1 mt-1"
        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t("Global.cancel") }}
      </b-button>
    </b-col>

    <b-col
      :class="show ? 'disabled_all' : ''"
      v-if="$i18n.locale == 'ar'"
      md="12"
      class="justFlexAr pl-2"
      style="padding-left: 100px"
    >
      <b-button
        v-if="button == true"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        type="submit"
        variant="primary"
        class="btn-icon mr-1 mt-1"
        @click="submit()"
      >
        {{ $t("Global.submit") }}
      </b-button>
      <b-button
        v-if="button == false"
        class="btn-icon mr-1 mt-1"
        @click="wrongSubmit()"
      >
        {{ $t("Global.submit") }}
      </b-button>
      <b-button
        @click="cancel()"
        class="btn-icon ml-1 mt-1"
        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
        variant="outline-secondary"
      >
        {{ $t("Global.cancel") }}
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import {
  BTable,
  BAvatar,
  BBadge,
  BRow,
  BCol,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BButton,
  BOverlay,
  BAlert,
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BTable,
    BAvatar,
    BBadge,
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BOverlay,
    BAlert,
  },
  data() {
    return {
      columns: [],
      offeringGradesHeader: null,
      offeringStudentsGrades: null,
      searchResult: [],
      data: [],
      button: true,
      show: false,
      perPage: 10,
      pageOptions: [10, 25, 50, 100, 150],
      totalRows: 0,
      currentPage: 1,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      fields: [
        {
          key: this.$i18n.locale === "en" ? "bn" : "rkm_alglos",
          label: this.$t("Global.bn"),
          sortable: true,
        },
        {
          key: this.$i18n.locale === "en" ? "code" : "alkod",
          label: this.$t("Global.code"),
          sortable: true,
        },
        {
          key: this.$i18n.locale === "en" ? "student_name" : "asm_altalb",
          label: this.$t("Global.name"),
          sortable: true,
        },
        {
          key: "note",
          label: this.$t("Global.notes"),
        },
      ],
      items: [],
      alertMessage: [],
      alert: false,
      warningMessage: [],
      warning: false,
    };
  },
  computed: {
    ...mapGetters({
      item: "offerings/item",
      load: "offerings/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },

    getColumns() {
      const columns = [];
      // const maxTotal = 0
      if (this.offeringGradesHeader) {
        this.offeringGradesHeader.forEach((element) => {
          if (element.mark != null) {
            // maxTotal += element.max
            const db = {
              /// //////////////////////////////////////////////////////////
              id: element.offering_mark_id,
              //name_local: element.mark.name_local,
              //name: element.mark.name,
              name: element.mark.short_name,

              //name_local: element.mark.short_name,
              max: element.max,
            };
            const field = { key: db.name, label: db.name, sortable: true };
            this.fields.push(field);
            // this.maxtotal = maxTotal
            // this.columnsMax[element.mark.id] = element.max

            columns.push(db);
          }
        });
        this.fields.push({
          key: "note",
          label: this.$t("Global.notes"),
          sortable: true,
        });
      }

      // this.header = true
      return columns;
    },
    getStudents() {
      const studentData = [];
      if (this.offeringStudentsGrades) {
        this.offeringStudentsGrades.forEach((element) => {
          const db = {};
          db.code = element.student.user.code;
          db.name = element.student.user.name;
          db.name_local = element.student.user.name_local;
          db.student_id = element.student_id;
          db.exam_location_bn = element.student.exam_location_bn;
          db.id = element.id;

          studentData.push(db);
        });
      }

      return studentData;
    },
    fillData() {
      const columns = [];
      if (this.data.length > 0) {
        this.data.forEach((element) => {
          columns.push(element);
          // element.forEach(e => {
          // })
        });
      }
      /*  this.data.forEach(element => {
                }) */
      return columns;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
  },
  mounted() {
    // this.$store.commit('app/SET_PATH', [{ name: 'test', id: 12 }, { name: 'test2', id: 12 }])
    // this.init()
    let columns = [];
    if (this.$route.query.data) {
      // this.data = this.$route.query.data.rows.sort((a, b) => a.student_name.localeCompare(b.student_name))
      this.data = this.$route.query.data.rows;
      this.button = this.$route.query.data.submit_button;
      if (
        Object.keys(this.$route.query.data.not_registered_students).length > 0
      ) {
        this.alert = true;
        let arr = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [key, val] of Object.entries(
          this.$route.query.data.not_registered_students
        )) {
          let db = {};
          db.id = key;
          db.code = val;

          arr.push(db);
        }
        this.alertMessage = arr;
      }
      if (
        Object.keys(this.$route.query.data.missing_registered_students).length >
        0
      ) {
        this.warning = true;
        this.button = false;
        let arr = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [key, val] of Object.entries(
          this.$route.query.data.missing_registered_students
        )) {
          let db = {};
          db.id = key;
          db.code = val;

          arr.push(db);
        }
        this.warningMessage = arr;
      }
      this.totalRows = Object.keys(this.$route.query.data.rows).length;
      columns = this.$route.query.columns;
      this.data.forEach((element) => {
        let entries = Object.entries(element);
        let elem;
        let data = entries.map(([key, val] = entry) => {
          if (this.$i18n.locale === "en") {
            if (this.containsNumbers(key) || key == "extra") {
              if (key == "extra") {
                this.fields.push({
                  key: key,
                  label: this.$t(`${key}`),
                });
              } else {
                this.fields.push({
                  key: key.toLowerCase(),
                  label:
                    this.$t(
                      `${key
                        .toLowerCase()
                        .replaceAll("_", " ")
                        .replace(/[0-9]/g, "")}`
                    ) + this.retnum(key.toLowerCase()),
                });
              }
            }
          } else {
            if(!key){
              this.fields.push({
              key: key.toLowerCase(),
              label:
                this.$t(
                  `${key
                    .toLowerCase()
                    .replaceAll("_", " ")
                    .replace(/[0-9]/g, "")}`
                ) + '-',
            });
            }else{
              this.fields.push({
                key: key.toLowerCase(),
                label:
                  this.$t(
                    `${key
                      .toLowerCase()
                      .replaceAll("_", " ")
                      .replace(/[0-9]/g, "")}`
                  ) + this.ConvertToArabicNumbers(this.retnum(key.toLowerCase())),
              });
            }
          }
        });
      });
    }
  },
  methods: {
    ...mapActions({
      offering_mark: "offerings/offering_mark",
      getItem: "offerings/get",
      importStudentGrades: "offerings/importStudentGrades",
      submitImportedExcel: "offerings/submitImportedExcel",
    }),
    containsNumbers(str) {
      return /\d/.test(str);
    },
    ConvertToArabicNumbers(num) {
      const arabicNumbers =
        "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
      return new String(num).replace(/[0123456789]/g, (d) => {
        return arabicNumbers[d];
      });
    },
    retnum(str) {
      var num = str.replace(/[^0-9]/g, "");
      return parseInt(num, 10);
    },
    init() {
      this.getItem(this.id);

      this.offering_mark(this.id).then((data) => {
        this.offeringGradesHeader = data.offeringGradesHeader;
        this.offeringStudentsGrades = data.offeringStudentsGrades;
      });
      // this.getColumns()
    },
    submit() {
      const payload = {
        id: this.$route.params.id,
        lang: this.$i18n.locale,
        query: { rows: this.data },
      };
      this.show = true;
      this.$toast(
        {
          component: ToastificationContent,
          props: {
            icon: "FileTextIcon",
            text: this.$t("Global.saving"),
            variant: "info",
            class: "toastShow",
          },
        },
        {
          position: "top-center",
          timeout: false,
          closeOnClick: false,
          draggable: false,
        }
      );
      this.submitImportedExcel(payload).then((response) => {
        if (response.status === true) {
          let closeIcon = document.querySelector(".toastification-close-icon");
          if (closeIcon) {
            closeIcon.click();
          }
          this.show = false;
          this.$swal({
            type: "success",
            title: `${this.$t("Global.saved")}`,
            icon: "success",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push({
            name: "offering",
            params: { id: this.$route.params.id },
            query: { tabNum: 5 },
          });
        }
      });
      /*  this.$store.dispatch('offerings/submitImportedExcel', payload).then(response => {
                //   this.init()
                  //this.$router.push({ name: 'import_grades', params: { id: this.id }, query: { data: response, columns: this.marksColumns } })
                }) */
    },
    cancel() {
      let closeIcon = document.querySelector(".toastification-close-icon");
      if (closeIcon) {
        closeIcon.click();
      }
      this.$router.push({
        name: "offering",
        params: { id: this.$route.params.id },
        query: { tabNum: 5 },
      });
    },
    wrongSubmit() {
      this.$swal({
        type: "error",
        title: this.$i18n.locale == "en" ? "Submit Error" : "خطأ في الحفظ",
        text:
          this.$i18n.locale == "en"
            ? "Please Solve All Issues First"
            : "من فضلك قم بحل جميع المشكلات اولا",
        icon: "error",
        showConfirmButton: true,
        timer: 5000,
      });
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>
<style lang="scss">
.toastShow {
  .toastification-close-icon {
    visibility: hidden;
  }
}
</style>
<style scoped>
.justFlexEn {
  justify-content: right;
  display: flex;
}

.justFlexAr {
  justify-content: left;
  display: flex;
}
</style>
