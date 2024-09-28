<template>
  <div>
    <b-card class="mb-0">
        <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            vertical
            nav-wrapper-class="nav-hidden"
            align="left"
        >
            <b-tab>
                <template #title>
                    <feather-icon icon="BookOpenIcon" />
                    <span>{{ $t("Global.theses") }}</span>
                </template>
                <div>
                  <Theses />
                </div>
            </b-tab>

        </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import 
{
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard
} from "bootstrap-vue";
import Edit from "@/views/quality/questionnaires_types/edit.vue";
import ShowComponent from "@/views/components/info/show";
import Theses from "@/views/research/theses/components/theses.vue";

export default {
    name:'Show',
    data(){
        return {
            edit: false,
            visitedTabs: [],
            tabIndex: 0,
            index: 0,
        }
    },
    components:{
        ShowComponent,
        Edit,
        Theses,
        BBadge,
        BLink,
        BTab,
        BTabs,
        BCard,
    },
    computed:{
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    methods:{
        init(id) {
            if(this.id || id){
                this.$store.dispatch("questionnairesTypes/get", this.id);
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
        checkTabVisited(index) {
            return this.visitedTabs.includes(index);
        },
        saveStatus(index) {
            this.edit = false;
            this.resetFilterQueryParams({});
            this.updateFilterQueryParams({
                tabNum: index,
                ...this.getTabFilterData(index),
            });
            this.visitedTabs.push(index);
        },
    },
    // mounted() {
    //   this.init();
    // }
}
</script>

<style scoped>

</style>