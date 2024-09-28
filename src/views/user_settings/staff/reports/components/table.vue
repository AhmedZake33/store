<template>
  <b-card no-body>
    <b-card-header v-if="title" class="text-white p-0 w-100">
      <b-row
        class="mb-1 d-flex justify-content-between w-100 align-items-center"
      >
        <div class="mx-2 my-1">
          <h3 class="m-0">{{ title }}</h3>
        </div>
        <div>
          <b-button
            v-if="add"
            class="btn-icon"
            @click="$emit('add', null, 3)"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
          <b-button
            @click="exportPDF"
            class="btn-icon ml-1"
            v-b-tooltip.hover="$t('Global.export')"
            variant="primary"
          >
            <feather-icon icon="FileTextIcon" />
          </b-button>
        </div>
      </b-row>
    </b-card-header>
    <b-table
      show-empty
      :busy="loading"
      :items="items"
      :fields="fieldsData"
      striped
      responsive
    >
      <template #thead-top="data" v-if="head">
        <b-tr>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th variant="primary" class="text-center" colspan="4">{{
            $t('Global.staff_count')
          }}</b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
          <b-th colspan="1"><span class="sr-only"></span></b-th>
        </b-tr>
      </template>
      <template #table-busy>
        <div class="text-center text-black my-2">
          <b-spinner class="align-middle" />
        </div>
      </template>
      <template #cell(faculty)="data">
        <b-link
          v-if="$i18n.locale == 'en'"
          class="font-weight-bold"
          :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
        >
          {{
            data.item
              ? data.item.faculty.name
                ? data.item.faculty.name
                : data.item.faculty.name_local
              : '_'
          }}
        </b-link>
        <b-link
          v-if="$i18n.locale == 'ar'"
          class="font-weight-bold"
          :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
        >
          {{
            data.item
              ? data.item.faculty.name_local
                ? data.item.faculty.name_local
                : data.item.faculty.name
              : '_'
          }}
        </b-link>
        <div v-if="data.item.program">
          (
          <b-link
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold"
            :to="{ name: 'program', params: { id: data.item.program.id } }"
          >
            {{
              data.item
                ? data.item.program.name
                  ? data.item.program.name
                  : data.item.program.name_local
                : '_'
            }}
          </b-link>
          <b-link
            v-if="$i18n.locale == 'ar'"
            class="font-weight-bold"
            :to="{ name: 'program', params: { id: data.item.program.id } }"
          >
            {{
              data.item
                ? data.item.program.name_local
                  ? data.item.program.name_local
                  : data.item.program.name
                : '_'
            }}
          </b-link>
          )
        </div>
        <small class="text-muted">{{ data.item.faculty.code }}</small>
      </template>
      <template #cell(percentage)="data">
        <div
          v-if="
            data.item.students_count &&
            data.item.instructors_count &&
            data.item.students_count > data.item.instructors_count
          "
        >
          <div v-if="data.item.faculty && data.item.faculty.type == 1">
            <strong
              :class="
                Math.round(
                  (data.item.instructors_count / data.item.students_count) *
                    100,
                  2
                ) < 3
                  ? 'text-danger'
                  : 'text-primary'
              "
            >
              {{
                Math.round(
                  (data.item.instructors_count / data.item.students_count) *
                    100 *
                    100
                ) / 100
              }}
              %
            </strong>
          </div>
          <div v-else>
            <strong
              :class="
                Math.round(
                  (data.item.instructors_count / data.item.students_count) *
                    100,
                  2
                ) < 2
                  ? 'text-danger'
                  : 'text-primary'
              "
            >
              {{
                Math.round(
                  (data.item.instructors_count / data.item.students_count) *
                    100 *
                    100
                ) / 100
              }}
              %
            </strong>
          </div>
        </div>
      </template>
      <template #cell(staff_required)="data">
        <div v-if="data.item.faculty && data.item.faculty.type == 1">
          <strong>
            {{ Math.round(data.item.students_count * 0.03, 2) }}
          </strong>
        </div>
        <div v-else>
          <strong>
            {{ Math.round(data.item.students_count * 0.02, 2) }}
          </strong>
        </div>
      </template>

      <template #cell(staff_need)="data">
        <div v-if="data.item.faculty && data.item.faculty.type == 1">
          <strong>
            {{ Math.round(data.item.students_count * 0.03, 2) }}
          </strong>
        </div>
        <div v-else>
          <strong>
            {{ Math.round(data.item.students_count * 0.02, 2) }}
          </strong>
        </div>
      </template>
      <template #cell(staff_need_required)="data">
        <div v-if="data.item.faculty && data.item.faculty.type == 1">
          <strong v-if="Math.round(data.item.students_count * 0.03, 2) > 0">
            {{
              Math.round(data.item.students_count * 0.03, 2) -
              data.item.instructors_count
            }}
          </strong>
        </div>
        <div v-else>
          <strong v-if="Math.round(data.item.students_count * 0.02, 2) > 0">
            {{
              Math.round(data.item.students_count * 0.02, 2) -
              data.item.instructors_count
            }}
          </strong>
        </div>
      </template>

      <template #cell(different_required)="data">
        <div v-if="data.item.faculty && data.item.faculty.type == 1">
          <strong>
            {{
              Math.round(data.item.students_count * 0.03, 2) -
              data.item.instructors_count
            }}
          </strong>
        </div>
        <div v-else>
          <strong>
            {{
              Math.round(data.item.students_count * 0.02, 2) -
              data.item.instructors_count
            }}
          </strong>
        </div>
      </template>

      <template #cell(different_percentage)="data">
        <div v-if="data.item.faculty && data.item.faculty.type == 1">
          <strong v-if="Math.round(data.item.students_count * 0.03, 2) > 0">
            {{
              Math.round(
                ((Math.round(data.item.students_count * 0.03, 2) -
                  data.item.instructors_count) /
                  Math.round(data.item.students_count * 0.03, 2)) *
                  100,
                2
              )
            }}
            %
          </strong>
        </div>
        <div v-else>
          <strong v-if="Math.round(data.item.students_count * 0.02, 2) > 0">
            {{
              Math.round(
                ((Math.round(data.item.students_count * 0.02, 2) -
                  data.item.instructors_count) /
                  Math.round(data.item.students_count * 0.02, 2)) *
                  100,
                2
              )
            }}
            %
          </strong>
        </div>
      </template>
    </b-table>
  </b-card>
</template>

<script>
import {
  BTable,
  BOverlay,
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
} from 'bootstrap-vue';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
import { mapActions } from 'vuex';
import request from '@/utils/request';
import fileDownload from 'js-file-download'

export default {
  components: {
    BTr,
    BTh,
    BCardHeader,
    BTable,
    BLink,
    BButton,
    BFormCheckbox,
    BCard,
    BSpinner,
    BRow,
    BCol,
    BBadge,
    BAvatar,
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
    type: String,
    loading: false,
    noDetails: Boolean,
    head: Boolean,
    table: { default: 3, type: Number },
    head_tuition: Boolean,
    settings: Boolean,
  },
  computed: {
    fieldsData() {
      let data = [
        ...this.fields,
        {
          key: 'show_details',
          thClass: 'customAction',
          tdClass: 'customDetailsWidth',
        },
      ];
      if (this.noDetails) {
        data = data.filter((obj) => !['show_details'].includes(obj.key));
      }
      return data;
    },
  },
  methods: {
    exportPDF() {
      this.$emit('export-pdf')
    }
  },
};
</script>
