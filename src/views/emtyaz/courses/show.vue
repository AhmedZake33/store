<template>
    <div>
        <!-- {{ typeof(bylaw) }} -->
        <!-- item {{ item }} -->
        <!-- show emtyaz course -->
        <Add :id="id" :data="item?item:{name:'',name_local:'',faculty:'' ,bylaw:bylaw_id,mandatory:'',period:'',starts_at:'',ends_at:''}"></Add>
        <!-- <Add v-else :id="id" :data="{name:'',name_local:'',faculty:'' ,bylaw:'', starts_at:'' , ends_at:'',mandatory:'',period:''}"></Add> -->

    </div>
</template>

<script>
import Add from "@/views/emtyaz/courses/add.vue";
import {mapGetters, mapActions} from 'vuex';
export default {
    components:{
        Add
    },
    data(){
        return {
            faculty:null,
            bylaw_id:null
        }
    },
    computed:{
        ...mapGetters({
      item:    "Emtyaz/item",
      load:     "Emtyaz/load",
      options: 'app/lookups',
      bylaw_data: 'bylaws/item',
      }),
        id(){
            return  this.$route.params.id?this.$route.params.id:null;
        },
        bylaw(){
            return  this.$route.params.bylaw?this.$route.params.bylaw:null;
        }
    },
    methods:{
        ...mapActions({
        getItem: 'Emtyaz/getCourse',
        getBylaw: 'bylaws/get',
      }),
        init(){
            if(this.id){
             this.getItem(this.id);
            }

            if(this.bylaw){
                this.getBylaw(this.$route.params.bylaw).then(bylaw_response => {
                if (this.$route.params.bylaw_id) {
                    // this.bylaw_id = Number(this.$route.params.bylaw_id);
                    this.bylaw_id = bylaw_response;
                    // this.bylaw_type = bylaw_response?.data?.type;
                }
                });   
            }


        }
    },
    mounted(){
        this.init()
    }
}
</script>