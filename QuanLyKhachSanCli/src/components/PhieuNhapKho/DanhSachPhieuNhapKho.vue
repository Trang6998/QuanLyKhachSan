<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phieunhapkho" exact>Phiếu nhập kho</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card style="min-height: 40em">
            <v-card-text>
                <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout nowrap>
                                <v-flex xs3 style="padding-right: 5px; ">
                                    <v-datepicker label="Từ ngày" v-model="searchParamsPhieuNhapKho.NgayBD" @input="getDataFromApi(searchParamsPhieuNhapKho)"></v-datepicker>
                                </v-flex>
                                <v-flex xs3 style="padding-right: 10px; ">
                                    <v-datepicker label="Đến ngày" v-model="searchParamsPhieuNhapKho.NgayKT" @input="getDataFromApi(searchParamsPhieuNhapKho)"></v-datepicker>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-btn small color="primary" style="margin: auto" @click="showDialogThemSua(false, {})">+ Thêm mới</v-btn>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-data-table :headers="tableHeader"
                                          :items="dsPhieuNhapKho"
                                          @update:pagination="getDataFromApi" :pagination.sync="searchParamsPhieuNhapKho"
                                          :total-items="searchParamsPhieuNhapKho.totalItems"
                                          :loading="loadingTable"
                                          class="table-border table">
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.index + 1 }}</td>
                                    <td>{{ props.item.NgayNhap === null ? "" : props.item.NgayNhap|moment('DD/MM/YYYY') }}</td>
                                    <td>{{ props.item.TongTien }}</td>
                                    <td>{{ props.item.NhanVien ? props.item.NhanVien.TenNhanVien : "" }}</td>
                                    <td class="text-xs-center" style="width:80px;">
                                        <v-tooltip top>
                                            <v-badge left slot="activator">
                                                <v-btn flat icon small @click="showDialogThemSua(true, props.item)" class="ma-0">
                                                    <v-icon small>edit</v-icon>
                                                </v-btn>
                                            </v-badge>
                                            <span>Sửa</span>
                                        </v-tooltip>

                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
            </v-card-text>
        </v-card>
        
        <them-sua-phieu-nhap-kho ref="themSuaPhieuNhapKho" @getLaiDanhSach="getDataFromApi(searchParamsPhieuNhapKho)"></them-sua-phieu-nhap-kho>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';
    import ThemSuaPhieuNhapKho from './ThemSuaPhieuNhapKho.vue';
    import store from '@/store/store';

    export default Vue.extend({
        components: {
            ThemSuaPhieuNhapKho
        },
        data() {
            return {
                dsPhieuNhapKho: [] as PhieuNhapKho[],
                tableHeader: [
                    { text: 'STT', value: 'index', align: 'center', sortable: true },
                    { text: 'Ngày nhập', value: 'NgayNhap', align: 'center', sortable: true },
                    { text: 'Tổng tiền', value: 'TongTien', align: 'center', sortable: true },
                      { text: 'Nhân viên', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsPhieuNhapKho: { includeEntities: true, rowsPerPage: 10 } as PhieuNhapKhoApiSearchParams,
                loadingTable: false,
                selectedPhieuNhapKho: {} as PhieuNhapKho,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsPhieuNhapKho);
        },
        methods: {
            showDialogThemSua(isUpdate: boolean, item: any): void {
                if (!isUpdate) {
                    item = {} as PhieuNhapKho;
                    item.NgayNhap = new Date();
                    item.TongTien = 0;
                    item.NhanVienID = store.state.user.Profile.NhanVien.NhanVienID;
                    PhieuNhapKhoApi.insert(item).then(res => {
                        if (res) {
                            item = res;
                            (this.$refs.themSuaPhieuNhapKho as any).show(isUpdate, item);
                        }
                    })
                }
                (this.$refs.themSuaPhieuNhapKho as any).show(isUpdate, item);
            },
            getDataFromApi(searchParamsPhieuNhapKho: PhieuNhapKhoApiSearchParams): void {
                this.loadingTable = true;
                PhieuNhapKhoApi.search(searchParamsPhieuNhapKho).then(res => {
                    this.dsPhieuNhapKho = res.Data;
                    this.searchParamsPhieuNhapKho.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(phieuNhapKho: PhieuNhapKho): void {
                this.selectedPhieuNhapKho = phieuNhapKho;
                this.dialogConfirmDelete = true;
            },
            
        }
    });
</script>

