<template>
  <b-overlay :show="load" rounded="sm">
    <b-row>
      <b-col sm="12">
        <TabTable
          no-details
          class="mt-0"
          :head="true"
          :loading="load"
          :title="$t('Global.analytical_staff_for_ug')"
          :fields="facultyFields"
          :items="item.staff_data"
          @export-pdf="downloadPDF($i18n.locale, item.staff_data , 1)"
        >
        </TabTable>
      </b-col>
      <b-col sm="12">
        <TabTable
          no-details
          class="mt-0"
          :loading="load"
          :title="$t('Global.analytical_staff_assistant_for_ug')"
          :fields="facultyAssistantFields"
          :items="item.assistant_data"
          @export-pdf="downloadPDF($i18n.locale, item.assistant_data , 2)"
        >
        </TabTable>
      </b-col>
    </b-row>
  </b-overlay>
</template>

<script>
import {
  BTabs,
  BTab,
  BCard,
  BCol,
  BRow,
  BBadge,
  BAlert,
  BLink,
  BAvatar,
  BCardBody,
  BButtonGroup,
  BButton,
  BModal,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BOverlay,
  BForm,
} from 'bootstrap-vue';
import TabTable from '@/views/user_settings/staff/reports/components/table';
import { mapGetters } from 'vuex';
import request from '@/utils/request';
import fileDownload from 'js-file-download';

export default {
  name: 'Show',
  components: {
    TabTable,
    BTabs,
    BTab,
    BOverlay,
    BCard,
    BCol,
    BRow,
    BBadge,
    BAlert,
    BLink,
    BCardBody,
    BAvatar,
    BButtonGroup,
    BButton,
    BImg,
    BModal,
    BInputGroup,
    BFormTextarea,
    BFormGroup,
    BForm,
  },
  computed: {
    ...mapGetters({
      item: 'instructors/item',
      load: 'instructors/load',
    }),
    facultyFields() {
      return [
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
          thStyle: { width: '20%' },
        },
        {
          key: 'students_count',
          label: this.$t('Global.students'),
        },
        {
          key: 'employed',
          label: this.$t('Global.employed'),
        },
        {
          key: 'visiting_full_time',
          label: this.$t('Global.visiting_full_time'),
        },
        {
          key: 'visiting_2_day',
          label: this.$t('Global.visiting_2_day'),
        },
        {
          key: 'visiting_1_day',
          label: this.$t('Global.visiting_1_day'),
        },
        {
          key: 'instructors_count',
          label: this.$t('Global.equivalent_total_staff'),
        },
        {
          key: 'percentage',
          label: this.$t('Global.percentage_staff'),
        },
        {
          key: 'staff_required',
          label: this.$t('Global.staff_required'),
        },
        {
          key: 'different_required',
          label: this.$t('Global.different_required'),
        },
        {
          key: 'different_percentage',
          label: this.$t('Global.different_percentage'),
        },
      ];
    },
    facultyAssistantFields() {
      return [
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
          thStyle: { width: '20%' },
        },
        {
          key: 'students_count',
          label: this.$t('Global.students'),
        },
        {
          key: 'instructors_count',
          label: this.$t('Global.total_staff_assistant'),
        },
        {
          key: 'percentage',
          label: this.$t('Global.percentage_staff_assistant'),
        },
        {
          key: 'staff_required',
          label: this.$t('Global.staff_required_assistant'),
        },
        {
          key: 'different_required',
          label: this.$t('Global.different_required'),
        },
        {
          key: 'different_percentage',
          label: this.$t('Global.different_percentage'),
        },
      ];
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('instructors/reports');
    },
    downloadPDF(lang, data, type) {
      request
        .post(`/reports/staff-pdf?lang=${lang}&type=${type}`, {data : data  } , {
          responseType: 'blob',
        })
        .then((res) => {
          fileDownload(res, 'Staff.pdf');
        })
        .catch((err) => {})
        .finally(() => {
          document.querySelector('.toastification-close-icon').click();
        });
    },
  },
};
</script>

<style scoped></style>
