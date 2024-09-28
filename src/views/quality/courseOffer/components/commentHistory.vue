<template>
  <div>
    <div v-if="isLoading" class="spinner-container">
      <b-spinner label="Loading..." />
    </div>
    <div v-else>
      <div
        v-for="(comment, ind) in comments"
        :key="ind"
        class="d-flex align-items-start mb-1"
      >
        <b-avatar
          :text="avatarText(comment.user.name)"
          :src="user_photo(comment.user.id)"
          size="34"
          class="mt-25 mr-75"
        />
        <div class="profile-user-info w-100">
          <div class="d-flex align-items-center justify-content-between">
            <h6 class="mb-0">
              {{ comment.user.name }}
            </h6>
            <div style="float: right">
              <div style="text-align: right">
                <b-badge
                  pill
                  :variant="getColor(comment.current_status)"
                  class="text-capitalize"
                  v-if="$i18n.locale == 'en' && comment.current_status"
                >
                  {{ comment.current_status }}
                </b-badge>

                <b-badge
                  pill
                  :variant="getColor(comment.current_status)"
                  class="text-capitalize"
                  v-if="$i18n.locale == 'ar' && comment.current_status"
                >
                  {{ comment.current_status_local }}
                </b-badge>

                <!-- <small  style="display: block;">{{ formatTimer(comment.created_at) }}</small> -->
                <small style="display: block">{{
                  moment(comment.created_at).locale($i18n.locale).fromNow()
                }}</small>
              </div>
            </div>
          </div>
          <small>{{ comment.comment }}</small>
        </div>
      </div>
      <!-- comment section markup goes here -->
    </div>
  </div>
</template>
  
  <script>
import {
  BAvatar,
  BSpinner,
  BCard,
  BCardText,
  BImg,
  BLink,
  BRow,
  BCol,
  BAvatarGroup,
  VBTooltip,
  BFormTextarea,
  BButton,
  BFormGroup,
  BEmbed,
  VBModa,
  BBadge,
  VBModal,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import moment from "moment";
import DataTable from "@/views/components/table/DataTable";
import { EventBus } from "@/main";
import Statistics from "@/views/components/info/statistics";
import { mdiDataMatrix, mdiBarcode } from "@mdi/js";
import SvgIcon from "@jamescoyle/vue-icon";
import { kFormatter } from "@core/utils/filter";

export default {
  name: "courseFile",
  components: {
    BSpinner,
    BBadge,
    DataTable,
    BAvatar,
    BCard,
    BCardText,
    BButton,
    BFormTextarea,
    BImg,
    BFormGroup,
    BRow,
    VBModal,
    BLink,
    BCol,
    BAvatarGroup,
    BEmbed,
  },
  directives: {
    "b-tooltip": VBTooltip,
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    id: null,
    title: String,
    listed_only: { type: Boolean, default: false },
    bylaw_id: null,
    course_id: null,
    term_id: null,
    program_id: null,
    status: null,
  },
  data() {
    return {
      filter: {
        term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        status: null,
        stages: null,
        comments: null,
      },
      isLoading: false,
      path: mdiBarcode,
      paramsLoaded: true,
    };
  },
  mounted() {
    this.showSpinner();
    let id = this.id;
    this.$store.dispatch("courseFile/getAllComments", id).then((data) => {
      this.isLoading = false;
    });
  },
  beforeMount() {
    this.filter = {
      term_id: this.currentTerm || null,
      faculty_id: null,
      bylaw_id: null,
      program_id: null,
      status: null,
    };
  },

  computed: {
    ...mapGetters({
      comments: "courseFile/comments",
      total: "courseFile/countComment",
      count: "courseFile/count",
      load: "courseFile/commentLoad",
      lookups: "courseFile/lookups",
      currentTerm: "app/currentTerm",
    }),
    getEmptyListLabel() {
      return this.$i18n.locale === "en"
        ? "Sorry, No Matching Options."
        : "لاتوجد نتائج مطابقة للبحث.";
    },

    language: function () {
      localStorage.setItem("mylang", this.$i18n.locale);
      return this.$i18n.locale;
    },
    header: function () {
      localStorage.setItem("headers", false);
      return false;
    },
  },
  watch: {
    language: function (val) {
      this.language = val;
    },
    header: function (val) {
      this.header = val;
    },
  },
  methods: {
    showSpinner() {
      this.isLoading = true;
    },
    formatTimer(created_at) {
      return moment(created_at).locale($i18n.locale).fromNow();
    },
    kFormatter,
    ...mapActions({
      exportExcel: "offerings/exportData",
      fileCount: "courseFile/FileCount",
    }),
    emit_edit(offering_id) {
      let changeName = "edit_course_offering";
      EventBus.$emit("changeIt", changeName);
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
    coordinator(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Course Coordinator"
        );
      }
    },
    examinationCommittee(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Examination Committee"
        );
      }
    },
    teacher(data) { 
      if (data) {
        return data.filter((el) => el.role && el.role.name == "Teacher");
      }
    },
    TeachingAssistantEdit(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Teaching Assistant (Editor)"
        );
      }
    },
    TeachingAssistantView(data) {
      if (data) {
        return data.filter(
          (el) => el.role && el.role.name == "Teaching Assistant (Viewer)"
        );
      }
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    exportData() {
      this.exportExcel({ lang: this.$i18n.locale, query: this.filter });
    },

    getColor(status) {
      if (status == "New") {
        return "info";
      } else if (status == "Submitted") {
        return "light-warning";
      } else if (status == "Accepted") {
        return "light-success";
      } else if (status == "Not Accepted") {
        return "light-danger";
      } else if (status == "Approved") {
        return "success";
      } else if (status == "Not Approved") {
        return "danger";
      } else if (status == "Updated") {
        return "warning";
      }
    },
    openCalendar(id) {
      this.$router.push({
        name: "courseFile-Schedule",
        params: {
          id,
        },
      });
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.spinner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* adjust to match the height of your comment section */
}
.comment-timestamp {
  display: block;
}
.comment-status {
  width: auto;
  float: right;
}
</style>
  
  <style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
  