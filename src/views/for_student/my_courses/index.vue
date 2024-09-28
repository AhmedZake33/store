<template>
  <b-row>
    <b-col cols="12">
      <b-card :title="$t('My Courses')">
        <b-overlay
            :show="load"
            rounded="sm"
            class="col-12"
        >
          <div  v-for="course in myCourses" :key="course">
            <b-card>
              <b-link
                  :to="{
            name: 'show_my_course',
            params: { offering_id: course.offering_id },
          }"
              >
                <feather-icon icon="FileTextIcon" size="15" />
                {{ course.offering.course.code }} :
                {{ $i18n.locale=='ar' ? course.offering.course.name_local : course.offering.course.name }} ({{ $i18n.locale=='ar' ? course.offering.term.name_local : course.offering.term.name }})
              </b-link>
              <hr />
              <strong>{{$t('Teacher(s)')}}:</strong>
              <span
                  v-for="instractor in course.offering.instructors"
                  :key="instractor"
              >
          {{ $i18n.locale=='ar' ? instractor.user.name_local : instractor.user.name }} ,
        </span>
            </b-card>
          </div>
        </b-overlay>
      </b-card>
    </b-col>
  </b-row>
</template>
<script>
import {
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BRow,
  BLink,
  BOverlay
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import FeatherIcon from "@/@core/components/feather-icon/FeatherIcon.vue";

export default {
  name: "my_courses",
  components: {
    BCard,
    BCardBody,
    BCardHeader,
    BCol,
    BRow,
    FeatherIcon,
    BLink,
    BOverlay
  },
  computed: {
    ...mapGetters({
      myCourses: "students/courses",
      load: "students/load",
    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      studentCourses: "students/getCourses",
    }),
    init() {
      this.studentCourses();
    },
  },
};
</script>
