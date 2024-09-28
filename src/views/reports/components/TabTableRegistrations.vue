<template>
  <b-card no-body :style="cardStyle">
    <b-table
        :empty-text="$t('Global.empty_text')"
        show-empty
        :busy="loading"
        :items="items"
        :fields="fieldsData"
        striped
        responsive="sm"
    >
      <template #thead-top="data">
        <b-tr>
          <th rowspan="2">{{ $t('Global.faculty') }}</th>
          <th rowspan="2">{{ $t('Global.advisors') }}</th>
          <th colspan="5" class="text-center">{{ $t('Global.advised_students') }}</th>
          <th rowspan="2">{{ $t('Global.show_details') }}</th>
        </b-tr>
      </template>
      <template #table-busy>
        <div class="text-center text-black my-2">
          <b-spinner class="align-middle"/>
        </div>
      </template>

      <template #cell(faculty)="data">
        <span>
          {{ $i18n.locale == "ar" ? data.item.faculty_name_local : data.item.faculty_name }}
        </span>
      </template>
      <template #cell(advisors)="data">
        <span>
          {{ data.item.advisors ? data.item.advisors : 0}}
        </span>
      </template>
      <template #cell(not_registered)="data">
        <span>
          {{ data.item.not_registered }}
        </span>
      </template>
      <template #cell(requested)="data">
        <span>
          {{ data.item.requested }}
        </span>
      </template>
      <template #cell(pending)="data">
        <span>
          {{ data.item.pending }}
        </span>
      </template>
      <template #cell(registered)="data">
        <span>
          {{ data.item.registered }}
        </span>
      </template>
      <template #cell(total_advised_students)="data">
        <span>
          {{ data.item.total_advised_students }}
        </span>
      </template>
      <template #cell(show_details)="row" v-if="showDetailsValidation">
        <div class="pointer d-flex" v-if="row.item.programs.length">
          <feather-icon @click="row.toggleDetails" icon="EyeIcon"/>
        </div>
      </template>
      <!--Inner Table-->
      <template #row-details="row">
        <b-table
            small
            :empty-text="$t('Global.empty_text')"
            show-empty
            :items="row.item.programs"
            :fields="inner"
            striped
            responsive

        >
          <template #cell(program)="data">
              <span class="font-weight-bold d-block text-nowrap w_fit_content">
                {{
                  $i18n.locale == "ar" ? data.item.program_name_local : data.item.program_name
                }} ({{ data.item.bylaw_code }})
              </span>
          </template>
          <template #cell(not_registered)="data">
            <span>
              {{ data.item.not_registered }}
            </span>
          </template>
          <template #cell(requested)="data">
            <span>
              {{ data.item.requested }}
            </span>
          </template>
          <template #cell(pending)="data">
            <span>
              {{ data.item.pending }}
            </span>
          </template>
          <template #cell(registered)="data">
            <span>
              {{ data.item.registered }}
            </span>
          </template>
          <template #cell(total_advised_students)="data">
            <span>
              {{ data.item.total_advised_students }}
            </span>
          </template>
        </b-table>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {
  BTable,
  BOverlay,
  BFormCheckboxGroup,
  BFormCheckbox,
  BButton,
  BCard,
  BRow,
  BCol,
  BAvatar,
  BBadge,
  BLink,
  BSpinner,
  BTr,
  BCardHeader,
  BTh,
} from "bootstrap-vue";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import {mapActions} from "vuex";
import {getAuth} from "@/auth/utils";

export default {
  components: {
    BTr,
    BTh,
    BCardHeader,
    BTable,
    BLink,
    BButton,
    BCard,
    BSpinner,
    BRow,
    BCol,
    BBadge,
    BAvatar,
    BFormCheckbox,
    BFormCheckboxGroup,
    BCardActions,
    AppCollapse,
    AppCollapseItem,
    BOverlay,
  },
  props: {
    items: null,
    fields: [],
    inner: [],
    add_subject: Boolean,
    add: Boolean,
    title: String,
    title2: String,
    spring: Boolean,
    type: String,
    loading: false,
    noDetails: Boolean,
    head: Boolean,
    add_option: Boolean,
    table: {default: 3, type: Number},
    head_tuition: Boolean,
    head_grade: Boolean,
    settings: Boolean,
    remove_grades: Boolean,
    is_pg: Boolean,
    status: Object,
    studentAccount: {default: false, type: Boolean},
    showDetailsValidation: {default: true, type: Boolean},
    cardStyle: {
      type: String,
      default: "",
    },
    customStyle: {
      default: false,
      type: Boolean,
      controlView: {default: false, type: Boolean},
      editMode: {default: false, type: Boolean},
    },
  },
  data() {
    return {
      selected: [],
      rerender: true
    };
  },
  computed: {
    fieldsData() {
      let data = [
        ...this.fields,
        {
          key: "show_details",
          thClass: "customAction text-center d-none",
          tdClass: "customDetailsWidth ",
          label: this.$i18n.locale === "en" ? "Show Details" : "رؤية التفاصيل",
        },
      ];
      if (this.noDetails) {
        data = data.filter((obj) => !["show_details"].includes(obj.key));
      }

      return data;
    },
  },
  mounted() {

  },
  methods: {

    checkInstallment(event, data) {
      this.$emit("getCheck", [event, data]);
      this.rerender = false;
      setTimeout((_) => {
        this.rerender = true;
      }, 2);
    },

  },
};
</script>

<style scoped lang="scss">
.remove-padding {
  padding-left: 0;
  padding-right: 0;
}

.hour_status {
  span {
    padding: 0rem 0.6rem;
    padding-bottom: 0.2rem;
  }
}

.w_fit_content {
  width: fit-content;
}
</style>
  