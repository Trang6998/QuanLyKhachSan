<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/datphong" exact>Đặt phòng</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card style="min-height: 40em">
            <v-card-text>
                <v-layout row wrap>
                    <v-flex>
                        <v-layout nowrap>
                            <v-flex xs4>
                                <v-text-field label="Tìm kiếm" append-icon="search" v-model="searchParamsDatPhong.HoTen" @input="getDataFromApi(searchParamsDatPhong)"></v-text-field>
                            </v-flex>
                            <v-flex xs2 nowrap style="padding-right: 5px; ">
                                <v-datepicker label="Ngày đắt đầu" v-model="searchParamsDatPhong.NgayBD" @input="getDataFromApi(searchParamsDatPhong)"></v-datepicker>
                            </v-flex>
                            <v-flex xs2 style="padding-right: 10px; ">
                                <v-datepicker label="Ngày kết thúc" v-model="searchParamsDatPhong.NgayKT" @input="getDataFromApi(searchParamsDatPhong)"></v-datepicker>
                            </v-flex>
                            <v-flex xs2 >
                                Trạng thái<br/>
                                <select class="form-control" style="border:1px solid #ccc; margin-top:0.5em; width:10em;" v-model="searchParamsDatPhong.TrangThai" @change="getDataFromApi(searchParamsDatPhong)">
                                    
                                    <option v-bind:value="0">Đã đặt</option>
                                    <option v-bind:value="1">Đã thuê</option>
                                    <option v-bind:value="2">Đã hủy</option>
                                </select>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-btn small color="primary" style="margin-top: auto;" @click="showDialogThemSua(false, {})">+ Thêm mới</v-btn>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table :headers="tableHeader"
                                      :items="dsDatPhong"
                                      @update:pagination="getDataFromApi" :pagination.sync="searchParamsDatPhong"
                                      :total-items="searchParamsDatPhong.totalItems"
                                      :loading="loadingTable"
                                      class="table-border table">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.index + 1 }}</td>
                                <td>{{ props.item.HoTen }}</td>
                                <td>{{ props.item.SoDienThoai }}</td>
                                <td>{{ props.item.ThoiGianDat === null ? "" : props.item.ThoiGianDat|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                                <td>{{ props.item.LoaiPhong.TenLoaiPhong }}</td>
                                <td>{{ props.item.SoLuongNguoi }}</td>
                                <td>{{ props.item.SoNgayDat }}</td>
                                <td>{{ props.item.TienCoc }}</td>
                                <td>{{ props.item.NgayTao === null ? "" : props.item.NgayTao|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                                <td class="text-xs-center" style="width:80px;">
                                    <v-btn flat icon small @click="showDialogThemSua(true, props.item)" class="ma-0">
                                        <v-icon small>edit</v-icon>
                                    </v-btn>
                                    <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                                        <v-icon small>delete</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
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
        <them-sua-dat-phong ref="themSuaDatPhong" @getDatPhong="getDataFromApi(searchParamsDatPhong)"></them-sua-dat-phong>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';
    import ThemSuaDatPhong from './ThemSuaDatPhong.vue';

    export default Vue.extend({
        components: {
            ThemSuaDatPhong
        },
        data() {
            return {
                dsDatPhong: [] as DatPhong[],
                tableHeader: [
                    { text: 'STT', value: 'DatPhongID', align: 'center', sortable: true },
                    { text: 'Họ tên', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'Số điện thoại', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'Ngày thuê', value: 'ThoiGianDat', align: 'center', sortable: true },
                    { text: 'Tên loại phòng', value: 'LoaiPhong.TenLoaiPhong', align: 'center', sortable: true },
                    { text: 'Số lượng người', value: 'SoLuongNguoi', align: 'center', sortable: true },
                    { text: 'Số ngày đặt', value: 'SoNgayDat', align: 'center', sortable: true },
                    { text: 'Tiền cọc', value: 'TienCoc', align: 'center', sortable: true },
                    { text: 'Ngày đặt', value: 'NgayTao', align: 'center', sortable: true },
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
            showDialogThemSua(isUpdate: boolean, item: any): void {
                (this.$refs.themSuaDatPhong as any).show(isUpdate, item);
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

