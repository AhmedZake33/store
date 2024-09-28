<template>
  <b-row>
    <b-col cols="12">
      <b-card class="mb-0">
        <ShowComponent
          v-if="!this.load"
          :data="item"
          :except="[
            'id',
            'removed',
            'parent_id',
            'courses_count',
            'students_count',
            'programs_count',
          ]"
          :title="
            $t('Global.group') +
              ' ' +
              item.group +
              ' / ' +
              $t('Global.section') +
              ' ' +
              item.section
          "
        >
          <template #edit>
            <div class="mt-0">
              <b-button
                v-b-tooltip.hover
                title="Edit"
                style="width: 100px"
                :to="{ name: 'edit_section', id: item.id }"
                variant="primary"
              >
                Edit
              </b-button>
            </div>
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
  name: 'Show',
  components: {
    List,
    BCard,
    BCol,
    BRow,
    ShowComponent,
  },
  computed: {
    ...mapGetters({
      item: 'sections/itemDetails',
      load: 'sections/load',
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
      getItem: 'sections/get',
    }),
    init() {
      this.getItem(this.id)
    },
  },
}
</script>

<style scoped></style>
