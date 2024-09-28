<template>
  <div>
    <!-- faq search section -->
    <section id="faq-search-filter">
      <b-card
        no-body
        class="faq-search"
        :style="{
          backgroundImage: `url(${require('@/assets/images/banner/banner.png')})`,
        }"
      >
        <b-card-body class="text-center">
          <!-- <h2 class="text-primary">Let's answer some questions</h2> -->
          <!-- <b-card-text class="mb-2"> or choose a category to quickly find the help you need </b-card-text> -->

          <!-- form -->
          <b-form class="faq-search-input">
            <b-input-group class="input-group-merge">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" />
              </b-input-group-prepend>
              <b-form-input
                @input="filterResults()"
                id="searchbar"
                v-model="faqSearchQuery"
                :placeholder="$t('Global.search')"
              />
            </b-input-group>
          </b-form>
          <!-- form -->
        </b-card-body>
      </b-card>
    </section>
    <!--/ faq search section -->

    <!-- frequently asked questions tabs pills -->
    <section id="faq-tabs">
      <b-tabs
        vertical
        content-class="col-12 col-md-8 col-lg-9"
        pills
        nav-wrapper-class="faq-navigation col-md-4 col-lg-3 col-12"
        nav-class="nav-left"
      >
        <!-- payment tab -->
        <b-tab
          v-for="(categoryObj, index) in faqData"
          :key="index"
          :active="!index"
        >
          <!-- title -->
          <template #title>
            <feather-icon :icon="categoryObj.icon" size="18" class="mr-1" />
            <span class="font-weight-bold">{{ categoryObj.title }}</span>
          </template>

          <faq-question-answer :options="categoryObj.categoryObj" />
        </b-tab>
        <!--/ payment tab -->

        <!-- sitting lady image -->
        <!-- <template #tabs-end>
          <b-img fluid :src="require('@/assets/images/faq-illustrations.svg')" class="d-none d-md-block mt-auto" />
        </template> -->
        <!--/ sitting lady image -->
      </b-tabs>
    </section>
    <!--/ frequently asked questions tabs pills -->

    <!-- contact us -->
    <!-- <section class="faq-contact">
      <b-row class="mt-5 pt-75 text-center">
        <b-col cols="12">
          <h2>You still have a question?</h2>
          <b-card-text class="mb-3"> If you cannot find a question in our FAQ, you can always contact us. We will answer to you shortly! </b-card-text>
        </b-col>
        <b-col sm="6">
          <b-card class="shadow-none py-1 faq-contact-card">
            <b-avatar size="42" rounded variant="light-primary" class="mb-2">
              <feather-icon icon="PhoneCallIcon" size="18" />
            </b-avatar>
            <h4>+ (810) 2548 2568</h4>
            <span class="text-body">We are always happy to help!</span>
          </b-card>
        </b-col>
        <b-col sm="6">
          <b-card class="shadow-none py-1 faq-contact-card">
            <b-avatar size="42" rounded variant="light-primary" class="mb-2">
              <feather-icon icon="MailIcon" size="18" />
            </b-avatar>
            <h4>hello@help.com</h4>
            <span class="text-body">Best way to get answer faster!</span>
          </b-card>
        </b-col>
      </b-row>
    </section> -->
    <!--/ contact us -->
  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BForm,
  BInputGroup,
  BFormInput,
  BCardText,
  BInputGroupPrepend,
  BTabs,
  BTab,
  BImg,
  BRow,
  BCol,
  BAvatar,
} from "bootstrap-vue";
import FaqQuestionAnswer from "./FaqQuestionAnswer.vue";

export default {
  components: {
    BForm,
    BCard,
    BRow,
    BCol,
    BAvatar,
    BCardBody,
    BInputGroup,
    BFormInput,
    BCardText,
    BInputGroupPrepend,
    BTabs,
    BTab,
    BImg,
    FaqQuestionAnswer,
  },
  data() {
    return {
      faqSearchQuery: null,
      resualts: null,
      tempQuestions: [
        {
          title: this.$t("General"),
          icon: "DatabaseIcon",
          categoryObj: {
            icon: "DatabaseIcon",
            title: this.$t("General"),
            subtitle: "EMS",
            qandA: [
              {
                video: true,
                question: this.$t("About EMS"),
                ans: null,
                link: "https://www.youtube.com/embed/atHJPe4bP8Y",
              },
            ],
          },
        },
        {
          title: this.$t("Website"),
          icon: "ApertureIcon",
          categoryObj: {
            icon: "ApertureIcon",
            title: this.$t("Website"),
            subtitle: this.$t("How to modify the website ?"),
            qandA: [
              {
                video: true,
                question: this.$t("How to edit home page ?"),
                ans: null,
                link: "https://www.youtube.com/embed/3ncnglVT6Sc",
              },
              {
                video: true,
                question: this.$t("How to change photos in faculty page ?"),
                ans: null,
                link: "https://www.youtube.com/embed/CuwIvPIsa1Q",
              },
              {
                video: true,
                question: this.$t(
                  "How to change key facts section in home page ?"
                ),
                ans: null,
                link: "https://www.youtube.com/embed/9l9I0K7uQrU",
              },
            ],
          },
        },
        {
          title: this.$t("Registration"),
          icon: "BarChartIcon",
          categoryObj: {
            icon: "BarChartIcon",
            title: this.$t("Registration"),
            subtitle: this.$t("How to Registration in system ?"),
            qandA: [
              {
                video: true,
                pdf_link:
                  "https://drive.google.com/file/d/1pXLxpZjzWlLt_MKE0WTFSsBKo-JGVsZG/view?usp=sharing",
                pdf_title: "Quickstart Guide of O6U Student Portal.pdf",
                question: this.$t("How to students register in courses ?"),
                ans: null,
                link: "https://www.youtube.com/embed/-qm0rd2WYS8",
              },
              {
                video: true,
                pdf_title:
                  "Academic Advisor Quickstart Guide of EMS Course Registration.pdf",
                pdf_link:
                  "https://octopi.o6u.edu.eg/api/archive/download/663870",
                question: this.$t(
                  "How academic advisors record courses for students ?"
                ),
                ans: null,
                link: "https://www.youtube.com/embed/2hIXg1Ydt34",
              },
            ],
          },
        },
        {
          title: "LMS",
          icon: "ActivityIcon",
          categoryObj: {
            icon: "ActivityIcon",
            title: "LMS",
            subtitle: this.$t("How to use LMS system ?"),
            qandA: [
              {
                video: false,
                pdf_title: "Moodel",
                // pdf_link: 'https://www.youtube.com/playlist?list=PLTcPeoMjkuCzsEEojJpbRerlsmfkyVWu8',
                question: this.$t("How to use Moodel ?"),
                ans: null,
                link: "https://www.youtube.com/playlist?list=PLTcPeoMjkuCzsEEojJpbRerlsmfkyVWu8",
              },
            ],
          },
        },
      ],
    };
  },
  computed: {
    faqData: function () {
      if (this.faqSearchQuery) {
        return this.resualts;
      } else {
        return [
          {
            title: this.$t("General"),
            icon: "DatabaseIcon",
            categoryObj: {
              icon: "DatabaseIcon",
              title: this.$t("General"),
              subtitle: "EMS",
              qandA: [
                {
                  video: true,
                  question: this.$t("About EMS"),
                  ans: null,
                  link: "https://www.youtube.com/embed/atHJPe4bP8Y",
                },
              ],
            },
          },
          {
            title: this.$t("Website"),
            icon: "ApertureIcon",
            categoryObj: {
              icon: "ApertureIcon",
              title: this.$t("Website"),
              subtitle: this.$t("How to modify the website ?"),
              qandA: [
                {
                  video: true,
                  question: this.$t("How to edit home page ?"),
                  ans: null,
                  link: "https://www.youtube.com/embed/3ncnglVT6Sc",
                },
                {
                  video: true,
                  question: this.$t("How to change photos in faculty page ?"),
                  ans: null,
                  link: "https://www.youtube.com/embed/CuwIvPIsa1Q",
                },
                {
                  video: true,
                  question: this.$t(
                    "How to change key facts section in home page ?"
                  ),
                  ans: null,
                  link: "https://www.youtube.com/embed/9l9I0K7uQrU",
                },
              ],
            },
          },
          {
            title: this.$t("Registration"),
            icon: "BarChartIcon",
            categoryObj: {
              icon: "BarChartIcon",
              title: this.$t("Registration"),
              subtitle: this.$t("How to Registration in system ?"),
              qandA: [
                {
                  video: true,
                  pdf_link:
                    "https://drive.google.com/file/d/1pXLxpZjzWlLt_MKE0WTFSsBKo-JGVsZG/view?usp=sharing",
                  pdf_title: "Quickstart Guide of O6U Student Portal.pdf",
                  question: this.$t("How to students register in courses ?"),
                  ans: null,
                  link: "https://www.youtube.com/embed/-qm0rd2WYS8",
                },
                {
                  video: true,
                  pdf_title:
                    "Academic Advisor Quickstart Guide of EMS Course Registration.pdf",
                  pdf_link:
                    "https://octopi.o6u.edu.eg/api/archive/download/663870",
                  question: this.$t(
                    "How academic advisors record courses for students ?"
                  ),
                  ans: null,
                  link: "https://www.youtube.com/embed/2hIXg1Ydt34",
                },
              ],
            },
          },
          {
            title: "LMS",
            icon: "ActivityIcon",
            categoryObj: {
              icon: "ActivityIcon",
              title: "LMS",
              subtitle: this.$t("How to use LMS system ?"),
              qandA: [
                {
                  video: false,
                  pdf_title: "Moodel",
                  // pdf_link: 'https://www.youtube.com/playlist?list=PLTcPeoMjkuCzsEEojJpbRerlsmfkyVWu8',
                  question: this.$t("How to use Moodel ?"),
                  ans: null,
                  link: "https://www.youtube.com/playlist?list=PLTcPeoMjkuCzsEEojJpbRerlsmfkyVWu8",
                },
              ],
            },
          },
        ];
      }
    },
  },
  watch: {
    // faqSearchQuery: {
    //   immediate: true,
    //   handler() {
    //     this.fetchData();
    //   },
    // },
  },
  methods: {
    filterResults() {
      // this.resualts = this.tempQuestions.map(el => {
      //   el.categoryObj.qandA = el.categoryObj.qandA.filter(item => item.question.toLowerCase().includes(this.faqSearchQuery));
      //   return el;
      // });
      // let items = '' ;
      //        this.resualts  = this.faqData.filter((item) => {
      //     return (item.categoryObj.qandA.indexOf(this.faqSearchQuery.toLowerCase()) >= 0);
      // });
      // this.resualts = this.faqData.filter(item => {
      //   items = item.categoryObj.qandA.filter(item => item.question.toLowerCase().indexOf(this.faqSearchQuery.toLowerCase()) > -1);
      // });
      this.resualts = this.tempQuestions.filter(
        (item) =>
          item.title.toLowerCase().indexOf(this.faqSearchQuery.toLowerCase()) >
          -1
      );
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-faq.scss";
.faq-search .card-body {
  padding: 1rem !important;
}
</style>
