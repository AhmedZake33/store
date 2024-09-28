<template>
  <div>
    <div
      v-if="load"
      style="
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #eee;
        opacity: 0.8;
        text-align: center;
        z-index: 999;
      "
    >
      <b-spinner
        variant="secondary"
        style="position: absolute; top: 60px; z-index: 1000"
      />
    </div>
    <b-table-simple small responsive bordered striped :busy="load">
      <b-thead>
        <b-tr>
          <b-th>{{ $t("Global.course") }}</b-th>
          <b-th>{{ $t("Global.exam") }}</b-th>
          <b-th>{{ $t("Global.type") }}</b-th>
          <b-th>{{ $t("date") }}</b-th>
          <b-th>{{ $t("Global.slots") }}</b-th>
          <b-th>{{ $t("Global.locations") }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-if="items">
        <b-tr v-for="(item, index) of items" :key="index">
          <b-td>{{ $i18n.locale == "en" ? item.course.name : item.course.name_local}}</b-td>
          <b-td >{{ $i18n.locale == "en" ? item.exam.name : item.exam.name_local}}</b-td>
          <b-td >{{ $i18n.locale == "en" ? item.exam.type.name : item.exam.type.name_local}}</b-td>
          <b-td >{{ item.exam_date }}</b-td>
          <b-td >
            <div v-if="item.slots" class="with-comma">
                <span
                    class="font-weight-bold"
                    v-for="slot in item.slots"
                    :key="slot.id">
                    {{ $i18n.locale == "ar" ? slot.title : slot.title }}
                </span>
            </div>
          </b-td>
          <b-td >
            <div v-if="item.locations" class="with-comma">
                <span
                  class="font-weight-bold d-block"
                  v-for="location in item.locations"
                  :key="location.id"
                >
                  {{ $i18n.locale == "ar" ? location.name_local : location.name}}
                </span>
              </div>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TableSimplePlugin ,BTableSimple, BTbody ,BThead ,BTr ,BTd,BTh ,BSpinner,BOverlay } from 'bootstrap-vue';


export default {
  name: "ExamSchedule",
  components: {
    TableSimplePlugin,
    BTableSimple,
    BTbody,
    BThead,
    BTr,
    BTd,
    BTh,
    BSpinner,
    BOverlay
  },

  props: {
    // title: String,
    // listedOnly: { type: Boolean, default: false },
    studentID: null
  },
  data() {
    return {
      student_id: this.studentID,
    };
  },
  computed: {
    ...mapGetters({
      items: "examsSchedules/items",
      load: "examsSchedules/load",
    }),

    getEmptyListLabel() {
      return this.$i18n.locale === "en"
        ? "Sorry, No Matching Options."
        : "لاتوجد نتائج مطابقة للبحث.";
    },
  },

  mounted() {
    this.$store.dispatch("examsSchedules/examsSchedules", {
      query: { student_id: this.student_id },
      id: null,
    });
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
.with-comma span:not(:last-child)::after {
  content: ",";
  color: red;
  margin-right: 5px;
}
</style>
