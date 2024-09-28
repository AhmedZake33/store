<template>
    
    <!-- <feather-icon icon="InfoIcon" /> -->
    <!-- <form> -->
        <div  v-if="quality.name == 'New'"> 
            <!-- <feather-icon icon="InfoIcon" /> -->
            <!-- <input id="agree" type="checkbox" value="agree" v-model="checked"/> -->
                <b-form-checkbox
                    v-model="checked"
                    value="A"
                    plain
                >
                {{ $t('Global.checkBox') }}
                </b-form-checkbox>
            <!-- <textarea v-model="text" class="input" rows="4" cols="50"></textarea> -->
            <div  class="container">
            <label for="textarea-default"></label>
            <b-form-textarea
            id="textarea-default"
            :placeholder="$t('Global.Place_Holder')"
            rows="3"
            v-model="text"
            />
            <br>
            <!-- <b-button :disabled="!checked || buttonDisabled" @click="submit()"  id="comment" class="input1" name="comment">submit</b-button> -->
            <div class="button-container">
            <b-button
                :disabled="!checked || buttonDisabled"
                @click="submit()"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="button"
                
                
            >
            {{ $t('Global.Submit') }}
            </b-button>
        </div>
        </div>
        

        </div>
        <div v-else-if="(quality.name == 'Submitted' || quality.name == 'Updated') && hasPermission('show_all_courseFiles')">
            <div class="container">
            <b-form-textarea
            id="textarea-default"
            :placeholder="$t('Global.Place_Holder')"
            rows="3"
            v-model="text"
            />
            <br>
            <div class="button-container">
            <b-button
                :disabled="buttonDisabled1"
                @click="Accept()"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="button"
            >
            {{ $t('Global.Accept') }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
                :disabled="buttonDisabled1"
                @click="NotAccept()"
                class="button"
            >
            {{ $t('Global.Not_Accept') }}
            </b-button>
            <b-button
                :disabled="buttonDisabled1"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="warning"
                @click="undo()"
                class="button"
                v-if="hasPermission('undo_courseFiles')"
            >
            {{ $t('Global.undo') }}
            </b-button>
            
            </div>
        </div>
            <!-- <b-button @click="Accept()" :disabled=" buttonDisabled1" id="accept" class="accept" name="comment">Accept</b-button>
            <b-button @click="NotAccept()" :disabled=" buttonDisabled1" id="notApproved" class="notaccept" variant="outline-primary"  name="comment"><span class="bg-white">Not Accept</span></b-button> -->
        <br>
        </div>
        <div v-else-if="quality.name == 'Not Accepted'">
            <b-form-checkbox
                    v-model="checked"
                    value="A"
                    plain
                >
                {{ $t('Global.checkBox') }}
                </b-form-checkbox>
            <div class="container">
            <label for="textarea-default"></label>
            <b-form-textarea
            id="textarea-default"
            :placeholder="$t('Global.Place_Holder')"
            rows="3"
            v-model="text"
            />
            <br>
            <!-- <b-button :disabled="!checked || buttonDisabled" @click="submit()"  id="comment" class="input1" name="comment">submit</b-button> -->
            <div class="button-container">
                <b-button
                    :disabled="!checked || buttonDisabled2"
                    @click="upload()"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="button"
                    
                >
                {{ $t('Global.Submit') }}
                </b-button>
                <b-button
                v-if="hasPermission('undo_courseFiles')"
                    :disabled="buttonDisabled2"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="warning"
                    @click="undo()"
                    class="button"
                    
                >
                {{ $t('Global.undo') }}
                </b-button>
            </div>
        </div>
        <br>
        </div>
        <div v-else-if="quality.name == 'Accepted' && hasPermission('approve_courseFiles')" class="div" >
            <div class="container">
            <label for="textarea-default"></label>
            <b-form-textarea
            id="textarea-default"
            :placeholder="$t('Global.Place_Holder')"
            rows="3"
            v-model="text"
            />
            <br>
            <div class="button-container">
                <b-button
                    :disabled="buttonDisabled3"
                    @click="Approved()"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="button"
                >
                {{ $t('Global.Approve') }}
                </b-button>
                <b-button
                    :disabled="buttonDisabled3"
                    @click="NotApproved()"
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="outline-primary"
                    class="button"
                >
                {{ $t('Global.Not_Approve') }}
                </b-button>
                <b-button
                v-if="hasPermission('undo_courseFiles')"
                :disabled="buttonDisabled3"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="warning"
                class="button"
                @click="undo()"
                >
                {{ $t('Global.undo') }}
                </b-button>
            </div>
        </div>
                <br>  
            
                <!-- <b-button @click="Approved()" :disabled=" buttonDisabled3" id="approve"  class="approve" name="comment">Approved</b-button>
                <b-button @click="NotApproved()" :disabled=" buttonDisabled3" id="notApproved" class="notapprove" variant="outline-primary"  name="comment"><span class="bg-white">Not Approve</span></b-button> -->
        </div>
        <div v-else-if="(quality.name == 'Approved' || quality.name == 'Not Approved') && hasPermission('approve_courseFiles')" class="div">
            <div class="container">
            <div class="button-container ">
            <b-button
                :disabled="buttonDisabled4"
                v-if="hasPermission('undo_courseFiles')"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="warning"
                class="button"
                @click="undo()"
                >
                {{ $t('Global.undo') }}
                </b-button>
            </div>
        </div>
        </div>
        
    <!-- </form> -->
    <!-- <span>{{ $t('Global.course_information') }}</span> -->
    
</template>
<script>
import {
  BCard,
  BRow,
  BCol,
  BAlert,
  BFormInput,
  BFormCheckbox,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  BFormTextarea,
  VBModal,
  BPopover,
} from "bootstrap-vue";
import { mapGetters, mapMutations } from "vuex";
import Ripple from 'vue-ripple-directive';
export default {
    components: {
        BAlert,
        BFormTextarea,
        BFormCheckbox,
    },
    directives: {
        Ripple,
    },
    data() {
    return {
      text: '',
      containerHeight: null,
      checked : false,
      buttonHeight: null,
      buttonBottom: null,
      buttonDisabled: false,
      buttonDisabled1: false,
      buttonDisabled2: false,
      buttonDisabled3: false,
      buttonDisabled4:false,
    };
  },

    beforeMount() {
        
        

    },
    
    
    computed: {
    ...mapGetters({
      comments: "courseFile/comment",
      archive:"courseFile/archive",
      //item: 'archive/archive',
       

    }),
    },
    methods: {
        undo :function(){

            let id = this.id;
            let quality = this.quality.name;
            this.buttonDisabled4 = true;
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = true;
            this.buttonDisabled3 = true;
            this.buttonDisabled = true;
            this.$store.dispatch("courseFile/undoStatus",{id,quality}).then((data) => {
                this.$emit('refresh')
                this.buttonDisabled4 = false;
                this.buttonDisabled1 = false;
                this.buttonDisabled2 = false;
                this.buttonDisabled3 = false;
                this.buttonDisabled = false;
            });
        },
        submit :function(){
           
            let archive_id = this.checkArchive
            let id = this.id;
            let text = this.text;
            let currentStatus = "Submitted"
            let currentStatus_local = "تم تقديمه"
            this.buttonDisabled = true;

            this.$store.dispatch("courseFile/checkArchives",archive_id).then((data)=>{
                if(this.archive){

                    this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{

                    });
                    this.$swal({
                        title:this.$t('Global.Submitted'),
                        text: this.$t('Global.TextSucces'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                    this.$store.dispatch("courseFile/changeStatus",this.id).then((data) => {
                        this.$emit('refresh')
                    });
                }else{

                    this.$swal({
                        title: this.$t('Global.warning'),
                        text: this.$t('Global.warningMessage'),
                        icon: 'warning',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                    this.buttonDisabled = false;
                }
            });
            
            
            
            
            // this.$store.dispatch("courseFile/courseFile", {}).then((data) => {
            // this.paramsLoaded = false;
            // });
        },
        Accept :function(){

            let id = this.id;
            let text = this.text;
            let currentStatus = "Accepted"
            let currentStatus_local = "اتفق"
            this.buttonDisabled1 = true;

            this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{
            });
            this.$store.dispatch("courseFile/accStatus",this.id).then((data) => {
                this.$emit('refresh')
                this.$swal({
                        title: this.$t('Global.Submitted'),
                        text: this.$t('Global.uploaded'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                //this.paramsLoaded = false;

            });
        },


        NotAccept :function(){

            let id = this.id;
            let text = this.text;
            let currentStatus = "Not Accepted"
            let currentStatus_local = "لم يتفق"
            this.buttonDisabled1 = true;
            this.buttonDisabled2 = false;
            this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{
            });
            this.$store.dispatch("courseFile/notAccStatus",this.id).then((data) => {
                this.$emit('refresh')
                this.$swal({
                        title: this.$t('Global.Submitted'),
                        text: this.$t('Global.uploaded'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
            });

        },

        upload :function(){

            let archive_id = this.checkArchive;
            let id = this.id;
            let text = this.text;
            let currentStatus = "Updated"
            let currentStatus_local = "تم الرفع"
            this.buttonDisabled2 = true;
            this.buttonDisabled1 = false;

            this.$store.dispatch("courseFile/checkArchives",archive_id).then((data)=>{
                if(this.archive){

                    this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{

                    });
                    this.$swal({
                        title:this.$t('Global.Submitted'),
                        text: this.$t('Global.TextSucces'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                    this.$store.dispatch("courseFile/changeStatus",this.id).then((data) => {
                        this.$emit('refresh')
                    });
                }else{

                    this.$swal({
                        title: this.$t('Global.warning'),
                        text: this.$t('Global.warningMessage'),
                        icon: 'warning',
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
                    this.buttonDisabled2 = false;
                }
            });
        },

        Approved :function(){

            let id = this.id;
            
            let text = this.text;
            let currentStatus = "Approved"
            let currentStatus_local = "معتمد"
            this.buttonDisabled3 = true;

            this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{
            });
            
            this.$store.dispatch("courseFile/approvedStatus",this.id).then((data) => {
                this.$emit('refresh')
                this.$swal({
                        title: this.$t('Global.Submitted'),
                        text: this.$t('Global.uploaded'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })

            });
        },
        NotApproved :function(){

            let id = this.id;
            let text = this.text;
            let currentStatus = "Not Approved"
            let currentStatus_local = "لم يقبل"
            this.buttonDisabled3 = true;

            this.$store.dispatch("courseFile/postComments",{id,text,currentStatus,currentStatus_local}).then((data)=>{
            });
            this.$store.dispatch("courseFile/notAppStatus",this.id).then((data) => {
                this.$emit('refresh')
                this.$swal({
                        title: this.$t('Global.Submitted'),
                        text: this.$t('Global.uploaded'),
                        icon: 'success',
                        confirmButtonText: this.$t('Global.ok'),
                        customClass: {
                        confirmButton: 'btn btn-primary',
                        },
                        buttonsStyling: false,
                    })
            });

        },
        mounted(){
        },
        beforeDestroy() {

        },
        

    },

    
    
    
    props: {
        id : null,
        quality: null,
        // checked : false,
        lableCheck : false,
        checkArchive : null,
        content : '',
    },
    
}
</script>
<style>
.container {
  position: relative; /* Set the position property of the parent container to relative */
}
.input{
    width: 90%;
    height: 50%;
    resize: both;
    padding: 10px;
    box-sizing: border-box;
    max-width: 900px; /* set maximum width */
    max-height: 300px;
    }

.b-button-wrapper {
    position: relative;
    display: inline-block;
}
.button-container {
  position: absolute; /* Set the position property of the button container to absolute */
  bottom: -39px;
  right: 14px;

}
.button {
    margin-left: 10px;
    margin-bottom: 10px;
}
.div {
    position: relative;
    /* text-align: left; */
    }
.button3{
    position: absolute;
    bottom: 10px;
    right: 10px;

    background-color: #055069!important;
    /* float: center; */
    /* border: 1px solid coral; */
}
.button-group {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.input1{
    position: absolute;
    float:right;
    right:0px;
    /* background-color: #055069!important; */
    /* border: 1px solid coral; */
}
.input2{
    position: absolute;
    float:right;
    right:97px;
    /* background-color: #055069!important; */
    /* border: 1px solid coral; */
}
.input3{
    position: absolute;
    float:  right; 
    right:106px;
    width: 140px;
}
.input4{
    position: absolute;
    float:  right; 
    right:250px;
}
.accept{
    position: absolute;
    float: right;
    left: 669px;

    margin-left: 30px;
    background-color: #055069!important;
    /* border: 1px solid coral; */
}

.approve{
    position: absolute;
    float: right;
    
    left: 650px;

    margin-left: 30px;
    background-color: #055069!important;
    /* border: 1px solid coral; */
}
.notapprove{
    position: absolute;
    float: right;
    left: 542px;
    /* border: none; */
    /* padding: 10px 20px; */
    /* background-color: rgb(228, 102, 102)!important;  */
    /* border: 1px solid coral; */
    
}

.notaccept{
    position: absolute;
    float: right;
    left: 571px;
    /* background-color: rgb(228, 102, 102)!important; */
    /* border: 1px solid coral; */
}
.button2 {background-color: #055069;
    color: rgb(228, 102, 102);
    border-radius: 4px;
    font-size: 16px; /* Blue */
} /* Blue */
</style>