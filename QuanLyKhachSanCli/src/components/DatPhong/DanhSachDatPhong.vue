<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/datphong" exact>DatPhong</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsDatPhong"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsDatPhong"
                                :total-items="searchParamsDatPhong.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.DatPhongID }}</td>
                            <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
                    <td>{{ props.item.HoTen }}</td>
                    <td>{{ props.item.SoDienThoai }}</td>
                            <td>{{ props.item.ThoiGianDat === null ? "" : props.item.ThoiGianDat|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                    <td>{{ props.item.SoLuongNguoi }}</td>
                    <td>{{ props.item.SoNgayDat }}</td>
                    <td>{{ props.item.TienCoc }}</td>
                            <td>{{ props.item.NgayTao === null ? "" : props.item.NgayTao|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/datphong/'+props.item.DatPhongID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteDatPhong" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsDatPhong: [] as DatPhong[],
                tableHeader: [
                    { text: 'DatPhongID', value: 'DatPhongID', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhong.LoaiPhongID', align: 'center', sortable: true },
                    { text: 'HoTen', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'SoDienThoai', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'ThoiGianDat', value: 'ThoiGianDat', align: 'center', sortable: true },
                    { text: 'SoLuongNguoi', value: 'SoLuongNguoi', align: 'center', sortable: true },
                    { text: 'SoNgayDat', value: 'SoNgayDat', align: 'center', sortable: true },
                    { text: 'TienCoc', value: 'TienCoc', align: 'center', sortable: true },
                    { text: 'NgayTao', value: 'NgayTao', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsDatPhong: { includeEntities: true, rowsPerPage: 10 } as DatPhongApiSearchParams,
                loadingTable: false,
                selectedDatPhong: {} as DatPhong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsDatPhong);
        },
        methods: {
            getDataFromApi(searchParamsDatPhong: DatPhongApiSearchParams): void {
                this.loadingTable = true;
                DatPhongApi.search(searchParamsDatPhong).then(res => {
                    this.dsDatPhong = res.Data;
                    this.searchParamsDatPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(datPhong: DatPhong): void {
                this.selectedDatPhong = datPhong;
                this.dialogConfirmDelete = true;
            },
            deleteDatPhong(): void {
                DatPhongApi.delete(this.selectedDatPhong.DatPhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsDatPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

