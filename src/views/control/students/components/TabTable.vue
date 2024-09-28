<template>
  <b-card no-body :style="cardStyle">
    <b-overlay :show="show" rounded="sm">

      <div v-if="title2" class="bg-gray p-1">
        <div class="d-flex justify-content-between">
          <strong class="font-medium-3" :class="customStyle ? 'col-6 remove-padding':''">
            {{ title2 }}
          </strong>
          <slot name="action"></slot>
        </div>
      </div>

      <b-table
          outlined
          :empty-text="$t('Global.empty_text')" show-empty :busy="loading" :items="items" :fields="fieldsData"
          striped responsive="sm">
        <template v-if="head" #thead-top="data">
          <b-tr>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th variant="primary" class="text-center" colspan="2">{{ $t('Global.marks_collected') }}</b-th>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
          </b-tr>
        </template>
        <template v-if="head_tuition" #thead-top="data">
          <b-tr>
            <b-th colspan="2"><span class="sr-only"></span></b-th>
            <b-th variant="primary" class="text-center" colspan="3">{{ $t('Global.instalments') }}</b-th>
            <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>
          </b-tr>
        </template>
        <template v-if="head_grade" #thead-top="data">
          <b-tr>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <b-th variant="primary" class="text-center border-left border-right" colspan="2">{{
                $t('Global.ms')
              }}
            </b-th>
            <b-th variant="primary" class="text-center border-right border-left" colspan="2">{{
                $t('Global.ss')
              }}
            </b-th>
            <b-th colspan="1"><span class="sr-only"></span></b-th>
            <!--                    <b-th colspan="1"><span class="sr-only">Name and ID</span></b-th>-->
          </b-tr>
        </template>
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"/>
          </div>
        </template>


        <template #cell(bylaw)="data">
          <b-link v-if="data.item.bylaw && data.item.bylaw.name && $i18n.locale =='en'"
                  :to="{name: 'bylaw', params: { id: data.item.bylaw.id},}">
            {{ data.item.bylaw.name ? data.item.bylaw.name : data.item.bylaw.name_local }}
          </b-link>
          <b-link v-if="data.item.bylaw && data.item.bylaw.name_local && $i18n.locale =='ar'"
                  :to="{name: 'bylaw', params: { id: data.item.bylaw.id},}">
            {{ data.item.bylaw.name_local ? data.item.bylaw.name_local : data.item.bylaw.name }}
          </b-link>
        </template>

        <template #cell(course)="data">
          <b-link v-if="$i18n.locale =='en' && data.item.name" :to="{name: 'course', params: { id: data.item.id},}">
            {{ data.item.code ? data.item.code : '-' }} {{ data.item.name ? data.item.name : data.item.name_local }}
          </b-link>
          <b-link v-if=" $i18n.locale =='ar' && data.item.name_local"
                  :to="{name: 'course', params: { id: data.item.id},}">
            {{ data.item.code ? data.item.code : '-' }}
            {{ data.item.name_local ? data.item.name_local : data.item.name }}
          </b-link>
        </template>
        <template #cell(max_degree)="data">
                    <span v-if="data.item.history">
                     {{ data.item.history[0].max_total }}
                    </span>
        </template>
        <template #cell(hours)="data">
                    <span v-if="data.item.history">
                     {{ data.item.history[0].credit_hours ? data.item.history[0].credit_hours : '-' }}
                    </span>
        </template>
        <template #cell(grade)="data">
                    <span v-if="data.item.history && data.item.history[0].grade_type">
                     {{ data.item.history[0].grade_type ? data.item.history[0].grade_type.name : '-' }}
                    </span>
        </template>
        <template #cell(credit_points)="data">
                    <span v-if="data.item.history">
                     {{ data.item.history[0].credit_point ? data.item.history[0].credit_point : '-' }}
                    </span>
        </template>
        <template #cell(last_term)="data">
                    <span
                        v-if="$i18n.locale == 'en' && data.item.history[0] && data.item.history[0].grade_term && data.item.history[0].grade_term.term && data.item.history[0].grade_term.term.name">
                     {{
                        data.item.history[0].grade_term.term.name ? data.item.history[0].grade_term.term.name : data.item.history[0].grade_term.term.name_local
                      }}
                    </span>
          <span
              v-if="$i18n.locale == 'ar' && data.item.history[0] && data.item.history[0].grade_term && data.item.history[0].grade_term.term && data.item.history[0].grade_term.term.name_local">
                     {{
              data.item.history[0].grade_term.term.name_local ? data.item.history[0].grade_term.term.name_local : data.item.history[0].grade_term.term.name
            }}
                    </span>

        </template>
        <template #cell(last_grade)="data">
                    <span
                        v-if="$i18n.locale == 'en' && data.item.history[0] && data.item.history[0].grade_type && data.item.history[0].grade_type.name">
                     {{
                        data.item.history[0].grade_type ? data.item.history[0].grade_type.name ? data.item.history[0].grade_type.name : data.item.history[0].grade_type.name_local : '-'
                      }}
                    </span>
          <span
              v-if="$i18n.locale == 'ar' && data.item.history[0] && data.item.history[0].grade_type && data.item.history[0].grade_type.name_local">
                     {{
              data.item.history[0].grade_type ? data.item.history[0].grade_type.name_local ? data.item.history[0].grade_type.name_local : data.item.history[0].grade_type.name : '-'
            }}
                    </span>
        </template>

        <template #cell(show_details)="row" v-if="showDetailsValidation">
          <div class="pointer d-flex " @click="row.toggleDetails">
            <feather-icon icon="EyeIcon"/>
          </div>
        </template>

        <template #row-details="row">
          <b-table v-if="row.item.history" :empty-text="$t('Global.empty_text')" show-empty
                   :items="row.item.history"
                   :fields="inner" striped responsive>
            <template #cell(course)="data">
              <b-link v-if="$i18n.locale =='en' && data.item.course && data.item.course.code && data.item.course.name"
                      :to="{name: 'course', params: { id: data.item.course.id},}">
                {{ data.item.course.code ? data.item.course.code : '-' }}
                {{ data.item.course.name ? data.item.course.name : data.item.course.name_local }}
              </b-link>
              <b-link
                  v-if=" $i18n.locale =='ar' && data.item.course && data.item.course.code && data.item.course.name_local"
                  :to="{name: 'course', params: { id: data.item.course.id},}">
                {{ data.item.course.code ? data.item.course.code : '-' }}
                {{ data.item.course.name_local ? data.item.course.name_local : data.item.course.name }}
              </b-link>
            </template>
            <template #cell(bylaw)="data">
              <b-link v-if="data.item.course.bylaw &&data.item.course.bylaw.name && $i18n.locale =='en'"
                      :to="{name: 'bylaw', params: { id: data.item.course.bylaw.id},}">
                {{ data.item.course.bylaw.name ? data.item.course.bylaw.name : data.item.course.bylaw.name_local }}
              </b-link>
              <b-link v-if="data.item.course.bylaw && $i18n.locale =='ar' && data.item.course.bylaw.name_local"
                      :to="{name: 'bylaw', params: { id: data.item.course.bylaw.id},}">
                {{
                  data.item.course.bylaw.name_local ? data.item.course.bylaw.name_local : data.item.course.bylaw.name
                }}
              </b-link>
            </template>
            <template #cell(term)="data">
              <span
                  v-if="data.item.grade_term && data.item.grade_term.term && data.item.grade_term.term.name && $i18n.locale =='en'">
                   {{
                  data.item.grade_term.term.name ? data.item.grade_term.term.name : data.item.grade_term.term.name_local
                }}
              </span>
              <span
                  v-if="data.item.grade_term && data.item.grade_term.term && data.item.grade_term.term.name_local && $i18n.locale =='ar'">
                         {{
                  data.item.grade_term.term.name_local ? data.item.grade_term.term.name_local : data.item.grade_term.term.name
                }}
              </span>

            </template>
            <template #cell(gpa)="data">
              <span>
              {{ data.item.grade_term.gpa ? data.item.grade_term.gpa : '0' }}
              </span>
            </template>
            <template #cell(grade)="data">
              <span v-if="$i18n.locale == 'en' && data.item.grade_type && data.item.grade_type.name">
               {{
                  data.item.grade_type ? data.item.grade_type.name ? data.item.grade_type.name : data.item.grade_type.name_local : '-'
                }}
             </span>
              <span v-if="$i18n.locale == 'ar' && data.item.grade_type && data.item.grade_type.name_local">
                {{
                  data.item.grade_type ? data.item.grade_type.name_local ? data.item.grade_type.name_local : data.item.grade_type.name : '-'
                }}
              </span>
            </template>

            <template #cell(hours)="data">
              <span>
                {{ data.item.credit_hours && data.item.grade_type.code != "WF" && data.item.grade_type.code != "W" && data.item.grade_type.code != "IC" ? data.item.credit_hours : '0' }}
              </span>
            </template>
          </b-table>
        </template>
      </b-table>
    </b-overlay>
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
  BTh
} from 'bootstrap-vue';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
import {mapActions} from 'vuex';
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
    add: Boolean,
    title: String,
    title2: String,
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
    studentAccount: {default: false, type: Boolean},
    showDetailsValidation: {default: true, type: Boolean},
    cardStyle: {
      type: String,
      default: '',
    },
    customStyle: {default: false, type: Boolean}
  },
  data() {
    return {
      selected: [],
      rerender: true,
      gradeHistoryFields: [
        {
          key: "course",
          label: this.$t("Global.course"),
          thStyle: {width: "25%"},
          sortable: false,
        },
        {
          key: "bylaw",
          label: this.$t("Global.bylaw"),
          thStyle: {width: "15%"},
          sortable: false,
        },
        /*  {
        key: "min_degree",
        label: this.$t("Global.min_degree"),
        sortable: false,
        },  */
        {
          key: "max_degree",
          label: this.$t("Global.max_degree"),
          sortable: false,
        },
        {
          key: "hours",
          label: this.$t("Global.hours"),
          sortable: false,
        },
        {
          key: "last_grade",
          label: this.$t("Global.last_grade"),
          sortable: false,
        },
        {
          key: "last_term",
          label: this.$t("Global.last_term"),
          sortable: false,
          thStyle: {width: "15%"},
        },
      ],
      show: true,

    };
  },
  computed: {
    fieldsData() {
      if (this.showDetailsValidation) {
        let data = [
          ...this.fields,
          {
            key: 'show_details',
            thClass: 'customAction text-center',
            tdClass: 'customDetailsWidth ',
            label: this.$i18n.locale === 'en' ? 'Show Details' : 'رؤية التفاصيل',
          },
        ];
        if (this.noDetails) {
          data = data.filter(obj => !['show_details'].includes(obj.key));
        }

        return data;

      } else {
        let data = [
          ...this.fields
        ];
        if (this.noDetails) {
          data = data.filter(obj => !['show_details'].includes(obj.key));
        }

        return data;
      }

    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({}),


    init() {
      this.show = true
      if (this.items) {
        this.show = false
      }

    },
  },
};
</script>

<style scoped>
.remove-padding {
  padding-left: 0;
  padding-right: 0;
}
</style>
