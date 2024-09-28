<template>
  <b-card class="mb-0">
    <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
      <b-tab @click="listingPublications">
        <template #title>
          <feather-icon icon="BookOpenIcon"/>
          <span>{{ $t('Publications') }}</span></template
        >
        <ListPublications v-if="listPublications" @toEditPublication="editPublication" @toShowPublication="showPublication"></ListPublications>
        <ShowPublications :publication_id="publicationId" v-else-if="showPublications" @toEditPublication="editPublication"></ShowPublications>
        <EditPublications :publication_id="publicationId" v-else-if="editPublications" @toListPublications="listingPublications"></EditPublications>
      </b-tab>

      <b-tab @click="listingProjects">
        <template #title>
          <feather-icon icon="BookOpenIcon"/>
          <span>{{ $t('Projects') }}</span></template
        >
        <ListProjects v-if="listProjects" @toEditProject="editProject" @toShowProject="showProject"></ListProjects>
        <ShowProjects :project_id="projectId" v-else-if="showProjects" @toEditProject="editProject">></ShowProjects>
        <EditProjects :project_id="projectId" v-else-if="editProjects" @toListProjects="listingProjects"></EditProjects>
      </b-tab>
    </b-tabs>
  </b-card>


</template>

<script>
import ListPublications from "@/views/research/publications/components/publication";
import ShowPublications from "@/views/research/publications/show";
import EditPublications from "@/views/research/publications/edit";
import ListProjects from "@/views/research/projects/components/projects";
import ShowProjects from "@/views/research/projects/show";
import EditProjects from "@/views/research/projects/edit";
import {
  BCard,
  BTab,
  BTabs,
} from 'bootstrap-vue';

export default {
  name: "index",
  components: {
    ListPublications,
    ShowPublications,
    EditPublications,
    ListProjects,
    ShowProjects,
    EditProjects,
    BCard,
    BTab,
    BTabs,
  },
  data() {
    return {
      listPublications: true,
      showPublications: false,
      editPublications: false,
      publicationId: null,
      listProjects: true,
      showProjects: false,
      editProjects: false,
      projectId: null,
    }
  },
  methods: {
    listingPublications() {
      this.publicationId = null;
      this.$nextTick(() => {
        this.listPublications = true;
        this.showPublications = false;
        this.editPublications = false;
      });
    },
    editPublication(id) {
      this.publicationId = id;
      this.$nextTick(() => {
        this.listPublications = false;
        this.showPublications = false;
        this.editPublications = true;
      });
    },
    showPublication(id) {
      this.publicationId = id;
      this.$nextTick(() => {
        this.listPublications = false;
        this.showPublications = true;
        this.editPublications = false;
      });
    },
    listingProjects() {
      this.projectId = null;
      this.$nextTick(() => {
        this.listProjects = true;
        this.showProjects = false;
        this.editProjects = false;
      });
    },
    editProject(id) {
      this.projectId = id;
      this.$nextTick(() => {
        this.listProjects = false;
        this.showProjects = false;
        this.editProjects = true;
      });
    },
    showProject(id) {
      this.projectId = id;
      this.$nextTick(() => {
        this.listProjects = false;
        this.showProjects = true;
        this.editProjects = false;
      });
    }
  }
}
</script>

<style scoped>

</style>
