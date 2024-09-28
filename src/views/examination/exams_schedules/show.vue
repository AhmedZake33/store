<template>
  <div>
    <b-card class="mb-0">
      <b-tabs v-model="tabIndex" vertical nav-wrapper-class="nav-hidden" align="left">
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template>
            <Edit
                v-if="edit"
                :tabNumber="0"
                :data="
                    id ? item : {
                        'course': '',
                        'exam': '',
                        'type': '',
                        'exam_date': '',
                        'id':'',
                        'slots': '',
                        'locations_capacity':'',
                        'locations': '',
                        'paper_types': '',
                        'minutes': '',
                        'notes': '',
                    }" @hide="cancel()" :inline="true" @refresh="init">
            </Edit>

            <div v-if="item && !edit">
                <ShowComponent
                    :loading="load"
                    :data="item"
                    :only="[
                        'course',
                        'exam',
                        'type',
                        'exam_date',
                        'id',
                        'slots',
                        'locations',
                        'paper_types',
                        'minutes',
                        'notes',
                    ]"
                >
                    <template #course>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.offering`) }}
                        </th>
                        <td>
                            <div v-if="item.course">
                                <b-link
                                    v-if="$i18n.locale == 'en'"
                                    class="font-weight-bold custom_link h5"
                                    :to="{
                                        name: 'offering',
                                        params: { id: item.offering_id },
                                    }"
                                >
                                    {{
                                        item.course
                                        ? `${item.course.code}: ${item.course.name}`
                                        : "-"
                                    }}
                                </b-link>
                                <b-link
                                v-if="$i18n.locale == 'ar'"
                                class="font-weight-bold custom_link h5"
                                :to="{
                                    name: 'offering',
                                    params: { id: item.offering_id },
                                }"
                                >
                                {{
                                    item.course
                                    ? `${item.course.code}: ${item.course.name_local}`
                                    : "-"
                                }}
                                </b-link>
                                <div class="d-flex flex-wrap">
                                    <strong>
                                        {{
                                            `${$t("Global.students")} : ${
                                            item.students_per_offering
                                                ? item.students_per_offering
                                                : "_"
                                            }`
                                        }}
                                    </strong>
                                </div>
                                <div class="d-flex flex-wrap">
                                    <strong>
                                        {{ $t("Global.faculty") }}: &nbsp;
                                    </strong>
                                    <div v-if="item.offering.course.faculty">
                                    <span
                                        v-if="$i18n.locale == 'en'"
                                        class="font-weight-bold d-block"
                                    >
                                        {{ item.offering.course.faculty.name }}
                                    </span>
                                    <span
                                        v-if="$i18n.locale == 'ar'"
                                        class="font-weight-bold d-block"
                                    >
                                        {{ item.offering.course.faculty.name_local }}
                                    </span>
                                    </div>
                                    <div v-else>_</div>
                                </div>
                            </div>
                        </td>
                    </template>
                    <template #exam>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.exam`) }}
                        </th>
                        <td>
                            <div v-if="item.exam">
                                <b-link
                                    :to="{
                                        name: 'exam',
                                        params: { id: item.exam.id },
                                    }"
                                >
                                    {{ $i18n.locale == 'ar' ? item.exam.name_local : item.exam.name }}
                                </b-link>
                            </div>
                        </td>
                    </template>
                    <template #paper_types>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.paper_types`) }}
                        </th>
                        <td>
                            <div v-if="item.paper_types">
                                <div v-for="paper in item.paper_types" :key="paper.id">
                                    {{ $i18n.locale == 'ar' ? paper.name_local : paper.name }}
                                </div>
                            </div>
                        </td>
                    </template>
                    <template #minutes>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.minutes`) }}
                        </th>
                        <td>
                            <div v-if="item.minutes">
                                {{item.minutes}}
                            </div>
                        </td>
                    </template>
                    <template #notes>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.notes`) }}
                        </th>
                        <td>
                            <div v-if="item.notes">
                                {{item.notes}}
                            </div>
                        </td>
                    </template>
                    <template #id>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.start_time`) }}
                        </th>
                        <td>
                            <div v-if="item">
                                {{item.start_slot_id}}
                            </div>
                        </td>
                    </template>
                    <template #slots>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.slots`) }}
                        </th>
                        <td class="d-flex">
                            <div v-if="item.slots">
                                <div
                                    class="font-weight-bold mr-1"
                                    v-for="slot in item.slots"
                                    :key="slot.id"
                                >
                                    {{ $i18n.locale == "ar" ? slot.title : slot.title }}
                                </div>
                            </div>
                        </td>
                    </template>
                    <template #locations>
                        <th scope="row" :width="'20%'">
                            {{ $t(`Global.locations`) }}
                        </th>
                        <td class="d-flex">
                            <div v-if="item.locations">
                                <div
                                    class="font-weight-bold"
                                    v-for="location in item.locations"
                                    :key="location.id"
                                >
                                    {{ $i18n.locale == "ar" ? location.name_local : location.name }}
                                </div>
                            </div>
                        </td>
                    </template>
                    <template #edit>
                        <!-- <div class="mr-2 mb-1">
                            <b-button
                                v-b-tooltip.hover="$t('Print Attendance Sheet')"
                                variant="primary"
                                class="btn-icon ml-1"
                                @click="printData"
                            >
                                <feather-icon icon="PrinterIcon" />
                            </b-button>
                        </div> -->
                        <div class="mt-0 mb-1">
                            <feather-icon
                                icon="EditIcon"
                                v-b-tooltip.hover="$t('Global.edit')"
                                class="font-medium-3"
                                style="cursor: pointer"
                                @click="openEdit()"
                                v-if="hasPermission('edit_examSchedule')"
                            />
                        </div>
                    </template>
                </ShowComponent>
            </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import {
    mapGetters
  } from "vuex";
  import {
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard
  } from "bootstrap-vue";
  import Offerings from "@/views/study/offerings/components/offerings";
  import ShowComponent from "@/views/components/info/show";
  import Edit from "@/views/examination/exams_schedules/edit";

  export default {
    name: "show",
    components: {
      mapGetters,
      Offerings,
      ShowComponent,
      Edit,
      BBadge,
      BLink,
      BTab,
      BTabs,
      BCard,
    },
    data() {
      return {
        edit: false,
        tabIndex: 0,
      };
    },
    computed: {
      ...mapGetters({
        item: "examsSchedules/item",
        load: "examsSchedules/load",
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },

    mounted() {
      this.init();
    },
    methods: {
      init(id) {
        if(this.id || id){
            this.$store.dispatch("examsSchedules/get", this.id)
            this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
        }else{
          this.edit = true
        }
      },
      openEdit() {
        this.edit = true;
        this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
      },
      cancel() {
        this.edit = false;
        this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
      },
      printData(){
        const locations = this.item.locations.map(x => x.id);
        this.$store.dispatch('examsSchedules/printPdf', {
            query:{ exam_id: this.item.exam.id, exam_date: this.item.exam_date, locations_ids: locations }
        }).then((response) => {
            this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
            });
        })
        .catch((error) => {
          console.log(error)
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
    },
  };
</script>

<style scoped>
/deep/ .card .card-header {
    justify-content: end !important;
}
</style>
