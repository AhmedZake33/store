<template>
  <div>
    <div v-if="load" style="
          position: absolute;
          width: 100%;
          top:0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #eee;
          opacity: 0.8;
          text-align: center;
          z-index: 999;
          ">
      <b-spinner variant="secondary" style="position: absolute;top: 60px;z-index: 1000"/>
    </div>
    <b-table-simple small responsive bordered striped :busy="load">
      <b-thead>
        <b-tr>
          <b-th v-for="(field,index) of fields" :key="index">{{ field }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <template v-if="items.length > 0">
          <b-tr v-for="(item,index) of items" :key="index">
            <template v-if="!semesterBased">
              <b-td v-if="item.rowspan && item.course" :rowspan="item.rowspan">{{ item.course.code }}</b-td>
              <b-td v-if="item.rowspan && item.course" :rowspan="item.rowspan">
                <b-link :to="{ name: 'course', params: { id:  item.course.id  } }"
                        v-if="$i18n.locale == 'en'"
                        class="font-weight-bold text-wrap w_fit_content"
                >
                  {{ item.course ? item.course.name : "-" }}
                </b-link>
                <b-link :to="{ name: 'course', params: { id:  item.course.id  } }"
                        v-else-if="$i18n.locale == 'ar'"
                        class="font-weight-bold text-wrap w_fit_content"
                >
                  {{
                    item.course && $i18n.locale == "ar"
                        ? item.course.name_local
                        : "-"
                  }}
                </b-link>
              </b-td>
              <b-td>{{ item.term ? ($i18n.locale == 'en' ? item.term.name : item.term.name_local) : '' }}</b-td>

              <!--Credit Hours-->
              <b-td>{{ item.credit_hours && item.grade_type.code != "IC" && item.grade_type.code != "WF" && item.grade_type.code != "W" ? item.credit_hours : '0' }}</b-td>

              <!--Credit Points-->
              <b-td v-if="item.term && (item.term.type != 5 || item.grade_term.flags == 1)">{{ item.credit_point ? item.credit_point : '0' }}</b-td>
              <b-td v-else-if=" item.term && item.term.type == 5 && item.grade_term.flags == 2"><span >{{ $t("-") }}</span></b-td>
              <b-td v-else><span>-</span></b-td>

              <!--GPA-->
              <b-td v-if="item.term && (item.term.type != 5 || item.grade_term.flags == 1)">{{ item.grade_type && item.grade_type.gpa ? item.grade_type.gpa : '0' }}</b-td>
              <b-td v-else-if=" item.term && item.term.type == 5 && item.grade_term.flags == 2"><span >{{ $t("-") }}</span></b-td>
              <b-td v-else><span>-</span></b-td>

              <!--Grade Letter-->
              <b-td v-if="item.term && (item.term.type != 5 || item.grade_term.flags == 1)">{{ item.grade_type ? item.grade_type.name : '0' }}</b-td>
              <b-td v-else-if=" item.term && item.term.type == 5 && item.grade_term.flags == 2"><span >{{ $t("-") }}</span></b-td>
              <b-td v-else><span>-</span></b-td>

              <b-td v-if="item.term && (item.term.type != 5 || item.grade_term.flags == 1)">{{ (item.total ? item.total : '0') + '/' + (item.max_total ? item.max_total : '0') }}</b-td>
              <b-td v-else-if=" item.term && item.term.type == 5 && item.grade_term.flags == 2"><span >{{ $t("-") }}</span></b-td>
              <b-td v-else><span>-</span></b-td>
            </template>

            <template v-else>
              <b-td v-if="item.rowspan && item.course" :rowspan="item.rowspan">{{ item.course.code }}</b-td>
              <b-td v-if="item.rowspan && item.course" :rowspan="item.rowspan">
                <b-link :to="{ name: 'course', params: { id:  item.course.id  } }"
                        v-if="$i18n.locale == 'en'"
                        class="font-weight-bold d-block text-wrap w_fit_content"
                >
                  {{ item.course ? item.course.name : "-" }}
                </b-link>
                <b-link :to="{ name: 'course', params: { id:  item.course.id  } }"
                        v-if="$i18n.locale == 'ar'"
                        class="font-weight-bold d-block text-wrap w_fit_content"
                >
                  {{
                    item.course && $i18n.locale == "ar"
                        ? item.course.name_local
                        : "-"
                  }}
                </b-link>
              </b-td>
              <b-td>{{ item.term ? ($i18n.locale == 'en' ? item.term.name : item.term.name_local) : '' }}</b-td>
              <b-td>{{ item.total ? item.total : '0' }}</b-td>
              <b-td>{{ item.max_total ? item.max_total : '0' }}</b-td>
              <b-td>
                <span v-if=" item.term && item.term.type == 5 && item.grade_term.flags == 2">{{ $t("-") }}</span>
                <span v-else>
                  <template v-if="$i18n.locale == 'en'">{{ item.grade_type ? item.grade_type.name : '-' }}</template>
                  <template v-else>{{ item.grade_type ? item.grade_type.name_local : '-' }}</template>
                </span>
              </b-td>
            </template>
            <template v-if="actions">
              <b-td>
                <div>
                  <feather-icon v-if="item.manual == 1 && hasPermission('edit_student')" icon="EditIcon"
                                style="cursor: pointer"
                                @click="$emit('editCourse',item)"/>
                  <feather-icon v-if="item.manual == 1 && hasPermission('edit_student')" icon="Trash2Icon"
                                style="cursor: pointer"
                                class="text-danger ml-1" @click="$emit('deleteGradeForStudent', item.course.id )"/>
                </div>
              </b-td>
            </template>

          </b-tr>
        </template>

        <template v-else>
          <b-tr>
            <b-td colspan="9" class="text-center p-3">
            <span>
              {{ $t('Global.empty_text') }}
             </span>
            </b-td>
          </b-tr>
        </template>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>

import {TableSimplePlugin, BTableSimple, BTbody, BThead, BTr, BTd, BTh, BLink, BSpinner, BOverlay} from 'bootstrap-vue';

export default {
  name: 'simple-table',
  props: {
    items: {
      type: Array
    },
    load: {
      type: Boolean,
      default: true
    },
    studyType: {
      type: Number,
      default: 1
    },
    fields: {
      type: Array
    },
    actions: false,
    semesterBased: false
  },
  components: {
    TableSimplePlugin,
    BTableSimple,
    BTbody,
    BThead,
    BLink,
    BTr,
    BTd,
    BTh,
    BSpinner,
    BOverlay
  },
  data() {
    return {}
  },
};
</script>

<scoped>

</scoped>
