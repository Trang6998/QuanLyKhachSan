<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/nhanvien" exact>NhanVien</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsNhanVien"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsNhanVien"
                                :total-items="searchParamsNhanVien.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.NhanVienID }}</td>
                    <td>{{ props.item.TenNhanVien }}</td>
                    <td>{{ props.item.SoDienThoai }}</td>
                    <td>{{ props.item.TenDangNhap }}</td>
                    <td>{{ props.item.MatKhau }}</td>
                    <td>{{ props.item.LoaiTaiKhoanID }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/nhanvien/'+props.item.NhanVienID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deleteNhanVien" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import NhanVienApi, { NhanVienApiSearchParams } from '@/apiResources/NhanVienApi';
    import { NhanVien } from '@/models/NhanVien';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsNhanVien: [] as NhanVien[],
                tableHeader: [
                    { text: 'NhanVienID', value: 'NhanVienID', align: 'center', sortable: true },
                    { text: 'TenNhanVien', value: 'TenNhanVien', align: 'center', sortable: true },
                    { text: 'SoDienThoai', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'TenDangNhap', value: 'TenDangNhap', align: 'center', sortable: true },
                    { text: 'MatKhau', value: 'MatKhau', align: 'center', sortable: true },
                    { text: 'LoaiTaiKhoanID', value: 'LoaiTaiKhoanID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsNhanVien: { includeEntities: true, rowsPerPage: 10 } as NhanVienApiSearchParams,
                loadingTable: false,
                selectedNhanVien: {} as NhanVien,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsNhanVien);
        },
        methods: {
            getDataFromApi(searchParamsNhanVien: NhanVienApiSearchParams): void {
                this.loadingTable = true;
                NhanVienApi.search(searchParamsNhanVien).then(res => {
                    this.dsNhanVien = res.Data;
                    this.searchParamsNhanVien.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(nhanVien: NhanVien): void {
                this.selectedNhanVien = nhanVien;
                this.dialogConfirmDelete = true;
            },
            deleteNhanVien(): void {
                NhanVienApi.delete(this.selectedNhanVien.NhanVienID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsNhanVien);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

