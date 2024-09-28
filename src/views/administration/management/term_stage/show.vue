<template>
  <b-row>
    <b-col cols="12">
      <b-card class="mb-0">
        <ShowComponent
          v-if="!this.load"
          :data="item"
          :except="[
            'id',
          
          ]"
          :title="item.term.name "
        >
          <template #edit>
            <div class="mt-0">
              <b-button
                v-b-tooltip.hover
                title="Edit"
                style="width: 100px"
                :to="{ name: 'edit_term_stage', id: item.id }"
                variant="primary"
              >
                Edit
              </b-button>
            </div>
          </template>
          <template #term="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.term`) }}
            </th>
            <td class="d-flex flex-wrap">
              {{data.term.name}} 
            </td>
          </template>

          <template #faculty="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.faculty`) }}
            </th>
            <td class="d-flex flex-wrap">
              {{data.faculty.name}}
            </td>
          </template>

          <template #bylaw="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.bylaw`) }}
            </th>
            <td class="d-flex flex-wrap">
              {{data.bylaw.name}}
            </td>
          </template>

          <template #programs="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.programs`) }}
            </th>
            <td class="d-flex flex-wrap">
              <span v-for="(program,index) in data.programs" :key="index">
                {{program.name}}
                <span v-if="index != data.programs.length - 1"> &nbsp;- &nbsp;</span>
              </span>
              <span v-if="data.programs.length==0">All Programs</span>
            </td>
          </template>

          <template #stage_group="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.stage_group`) }}
            </th>
            <td class="d-flex flex-wrap">
              {{data.stage_code.term_stage_group.name}}
            </td>
          </template>

          <template #stage_code="{ data }">
            <th
              scope="row"
              :width="'20%'"
            >
              {{ $t(`Global.stage_code`) }}
            </th>
            <td class="d-flex flex-wrap">
              {{data.stage_code.name}}
            </td>
          </template>
          
        </ShowComponent>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BCard, BCol, BRow } from 'bootstrap-vue'
import List from '@/views/components/info/list'
import ShowComponent from '@/views/components/info/show'

export default {
  name: 'term_stage',
  components: {
    List,
    BCard,
    BCol,
    BRow,
    ShowComponent,
  },
  computed: {
    ...mapGetters({
      item: 'termStages/item',
      load: 'termStages/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },

  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getItem: 'termStages/get',
    }),
    init() {
      this.getItem(this.id)
    },
  },
}
</script>


