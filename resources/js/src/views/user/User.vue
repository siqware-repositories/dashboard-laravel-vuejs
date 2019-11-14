<template>
    <!-- SIMPLE CARD WITH TABS -->
    <div class="vx-col w-full md:w-1/1 mb-base">
        <vx-card collapse-action refresh-content-action @refresh="refreshCard">
            <div class="flex flex-wrap">
                <div class="w-full sm:w-1/1 md:w-1/1 lg:w-1/4 xl:w-1/4 flex sm:justify-center lg:justify-start">
                    <div class="btn-group mb-2">
                        <vs-button @click="popupActive=true" color="success">បន្ថែម</vs-button>
                        <vs-button color="warning">កែប្រែ</vs-button>
                        <vs-button color="danger">លុប</vs-button>
                    </div>
                </div>
                <div class="w-full sm:w-1/1 md:w-1/1 lg:w-1/2 xl:w-1/2 lg:justify-center flex">
                    <vs-input icon-no-border placeholder="Search" class="input-rounded-full w-full mb-2" v-model="searchQuery" @keyup.enter="updateSearchQuery(searchQuery)" icon="icon-search" icon-pack="feather" />
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-3">
                        <div class="px-5 py-3 ml-2 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{currentItemsPerPage}}</span>
                            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                        </div>
                        <vs-dropdown-menu>

                            <vs-dropdown-item v-if="totalRecords>20" @click="gridApi.paginationSetPageSize(20);currentItemsPerPage=20">
                                <span>20</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item v-if="totalRecords>50" @click="gridApi.paginationSetPageSize(50);currentItemsPerPage=50">
                                <span>50</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item v-if="totalRecords>100" @click="gridApi.paginationSetPageSize(100);currentItemsPerPage=100">
                                <span>100</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="gridApi.paginationSetPageSize(totalRecords);currentItemsPerPage=totalRecords">
                                <span>ទាំងអស់</span>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </div>
                <div class="w-full sm:w-1/1 md:w-1/1 lg:w-1/4 xl:w-1/4 lg:justify-end sm:justify-center flex">
                    <vs-button color="primary" type="line" icon-pack="feather" icon="icon-download" @click="gridApi.exportDataAsCsv()">ទាញយក CSV</vs-button>
                </div>
            </div>
            <ag-grid-vue
                    :gridOptions="gridOptions"
                    class="ag-theme-material my-4 ag-grid-table"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="allUsers"
                    rowSelection="multiple"
                    :animateRows="true"
                    :pagination="true"
                    :paginationPageSize="itemsPerPage">
            </ag-grid-vue>
            <!--popup-->
            <vs-popup title="បន្ថែមអ្នកប្រើប្រាស់" :active.sync="popupActive">
                <form>
                    <div class="vx-row mb-2">
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-input class="w-full" v-validate="'required'" name="name" icon-pack="feather" icon="icon-user" icon-no-border label-placeholder="ឈ្មោះ" v-model="user.name" />
                            <span class="text-danger text-sm" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-select
                                    class="w-full"
                                    autocomplete
                                    @input-change=""
                                    label="ភេទ"
                                    v-model="user.gender"
                            >
                                <vs-select-item value="ប្រុស" text="ប្រុស"/>
                                <vs-select-item value="ស្រី" text="ស្រី"/>
                            </vs-select>
                        </div>
                    </div>
                    <div class="vx-row mb-2">
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-select
                                    class="w-full"
                                    autocomplete
                                    @input-change=""
                                    label="សិទ្ធ"
                                    v-model="user.role"
                            >
                                <vs-select-item value="user" text="User"/>
                                <vs-select-item value="admin" text="Admin"/>
                                <vs-select-item value="super_admin" text="Super Admin"/>
                            </vs-select>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-select
                                    class="w-full"
                                    autocomplete
                                    @input-change=""
                                    label="ប្រភេទ"
                                    v-model="user.type"
                            >
                                <vs-select-item value="employee" text="Employee"/>
                                <vs-select-item value="owner" text="Owner"/>
                                <vs-select-item value="developer" text="Developer"/>
                            </vs-select>
                        </div>
                    </div>
                    <div class="vx-row mb-2">
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-input type="email" v-validate="'required|email'" name="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label-placeholder="អ៊ីម៉ែល" v-model="user.email" />
                            <span class="text-danger text-sm" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full">
                            <vs-input class="w-full" v-validate="'required'" name="phone" icon-pack="feather" icon="icon-smartphone" icon-no-border label-placeholder="លេខទុរស័ព្ទ" v-model="user.phone" />
                            <span class="text-danger text-sm" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
                        </div>
                    </div>
                    <div class="vx-row mb-6">
                        <div class="vx-col w-full">
                            <vs-input type="password" v-validate="'required'" name="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border label-placeholder="លេខសម្អាត់" v-model="user.password" />
                            <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>
                        </div>
                    </div>
                    <div class="centerx">
                        <vs-upload text="ដាក់ប្រូហ្វាល" :limit="1" automatic :show-upload-button="false" fileName="file" action="api/file-upload" @on-delete="removeFile" @on-success="uploadFile" />
                    </div>
                    <div class="vx-row">
                        <div class="vx-col w-full">
                            <vs-button :disabled="disabled" @click.prevent="submitForm" type="relief" class="mr-3 mb-2">បង្កើត</vs-button>
                            <vs-button @click.prevent="clearField" color="warning" type="relief" class="mb-2" @click="">ចាកចេញ</vs-button>
                        </div>
                    </div>
                </form>
            </vs-popup>
        </vx-card>
    </div>
</template>

<script>
    import { AgGridVue } from "ag-grid-vue";
    import {mapGetters,mapActions} from 'vuex'
    export default {
        components: {
            AgGridVue
        },
        data() {
            return {
                /*user data*/
                user:{
                    profile:null,
                    gender:'ប្រុស',
                    role:'user',
                    type:'employee',
                    name:'',
                    email:'',
                    phone:'',
                    password:'',
                },
                disabled:false,
                /*\User data*/
                popupActive: false,
                itemsPerPage: 10,
                currentItemsPerPage: 10,
                columnDefs: null,
                defaultColDef: {
                    sortable: true,
                    resizable: true,
                    filter: true,
                },
                totalRecords: null,
                gridOptions: {},
                searchQuery:'',
                gridApi:null
            }
        },
        /*computed*/
        computed:{
            ...mapGetters(['allUsers'])
        },
        /*end computed*/
        beforeCreate(){
            console.log('before created')
        },
        created() {
            if (!this.allUsers){
                this.fetchUsers();
            }
            console.log('created')
        },
        beforeMount() {
            /*set column deft to ag grid*/
            this.columnDefs = [
                {headerName: 'Name', field: 'name' },
                {headerName: 'ID', field: 'id' ,checkboxSelection: true, headerCheckboxSelection: true},
                {headerName: 'Email', field: 'email' },
                {headerName: 'Password', field: 'password' },
                {headerName: 'Date', field: 'created_at' },
                {headerName: 'Verify At', field: 'email_verified_at' },
                {headerName: 'Date Update', field: 'updated_at' },
            ];
            console.log('before mount')
        },
        mounted() {
            /*create grid option*/
            this.gridApi = this.gridOptions.api;
            console.log('mounted');
            if (!this.totalRecords){
                this.totalRecords = this.gridApi.getDisplayedRowCount();
            }
        },
        beforeUpdate() {
            console.log('before updated')
        },
        updated() {
            console.log('updated');
            /*get total row count*/
            if (!this.totalRecords){
                this.totalRecords = this.gridApi.getDisplayedRowCount();
            }
        },
        beforeDestroy() {
            console.log('before destroy')
        },
        destroyed() {
            console.log('destroyed')
        },
        /*method*/
        methods: {
            ...mapActions(['fetchUsers']),
            updateSearchQuery(val) {
                this.gridApi.setQuickFilter(val);
            },
            refreshCard(card) {
                card.removeRefreshAnimation(300);
                /*clear search*/
                this.updateSearchQuery(this.searchQuery = '');
                /*clear filter*/
                this.gridApi.setFilterModel(null);
            },
            /*upload file*/
            uploadFile(data){
                this.user.profile = data.target.response;
            },
            /*upload file*/
            removeFile(){
                this.user.profile = null;
            },
            /*form submit*/
            submitForm() {
                this.$validator.validateAll().then(result => {
                    if(result && this.user.profile) {
                        this.$vs.notify({
                            title:'Success',
                            text:'Success added',
                            color:'success',
                            iconPack: 'feather',
                            icon:'icon-check',
                            position:'top-right'})
                    }else{
                        this.$vs.notify({
                            title:'Icon mail',
                            text:'Lorem ipsum dolor sit amet, consectetur',
                            color:'warning',
                            iconPack: 'feather',
                            icon:'icon-message-square',
                            position:'top-right'})
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    @import '@sass/vuexy/extraComponents/agGridStyleOverride.scss'
</style>