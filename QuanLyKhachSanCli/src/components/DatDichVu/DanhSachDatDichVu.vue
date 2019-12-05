<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-flex xs12>
                <h3>Danh khách đặt dịch vụ</h3>
            </v-flex>
            <v-flex xs12>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-layout nowrap>
                            <v-flex xs4>
                                <v-text-field label="Tìm kiếm" append-icon="search" v-model="searchParamsDatPhong.HoTen" @input="getDataFromApi(searchParamsDatPhong)"></v-text-field>
                            </v-flex>
                            <v-flex xs2 nowrap style="padding-right: 5px; ">
                                <v-datepicker label="Từ ngày" v-model="searchParamsDatPhong.NgayBD" @input="getDataFromApi(searchParamsDatPhong)"></v-datepicker>
                            </v-flex>
                            <v-flex xs2 style="padding-right: 10px; ">
                                <v-datepicker label="Đến ngày" v-model="searchParamsDatPhong.NgayKT" @input="getDataFromApi(searchParamsDatPhong)"></v-datepicker>
                            </v-flex>
                            <v-flex xs2>
                                <v-autocomplete v-model="searchParamsDatPhong.TrangThai"
                                                :items="lstTrangThai"
                                                item-text="name"
                                                item-value="value"
                                                label="Trạng thái"
                                                @change="getDataFromApi(searchParamsDatPhong)"></v-autocomplete>

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
                                <td>{{ props.item.ThoiGianDat === null ? "" : props.item.ThoiGianDat|moment('DD/MM/YYYY') }}</td>
                                <td>{{ props.item.DichVu != null? props.item.DichVu.TenDichVu :"" }}</td>
                                <td>{{ props.item.SoLuongNguoi }}</td>
                                <td>{{ props.item.NgayTao === null ? "" : props.item.NgayTao|moment('DD/MM/YYYY') }}</td>
                                <td v-if="props.item.TrangThai == 0">Đã đặt</td>
                                <td v-if="props.item.TrangThai == 1">Đã nhận</td>
                                <td v-if="props.item.TrangThai == 2">Đã hủy</td>
                                <td class="icon-xs-center" style="width:110px;">
                                    <v-layout nowrap>
                                        <v-tooltip top>
                                            <v-badge left slot="activator">
                                                <v-btn flat icon small @click="showDialogThemSua(true, props.item)" class="ma-0">
                                                    <v-icon small>edit</v-icon>
                                                </v-btn>
                                            </v-badge>
                                            <span>Sửa</span>
                                        </v-tooltip>
                                        <v-tooltip top>
                                            <v-badge left slot="activator">
                                                <v-btn class="ma-0" flat color="green" icon small @click="confirm(props.item)">
                                                    <v-icon small>done</v-icon>
                                                </v-btn>
                                            </v-badge>
                                            <span>Xác nhận đặt dịch vụ</span>
                                        </v-tooltip>
                                        <v-tooltip top>
                                            <v-badge left slot="activator">
                                                <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                                                    <v-icon small>delete</v-icon>
                                                </v-btn>
                                            </v-badge>
                                            <span>Hủy đặt dịch vụ</span>
                                        </v-tooltip>

                                    </v-layout>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-flex>
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
            <v-dialog v-model="dialogConfirm" max-width="290">
                <v-card>
                    <v-card-title class="headline">Xác nhận đặt dịch vụ</v-card-title>
                    <v-card-text class="pt-3">Bạn có chắc chắn muốn xác nhận?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click.native="dialogConfirm=false" flat>Hủy</v-btn>
                        <v-btn color="red darken-1" @click.native="confirmDatPhong" flat>Xác Nhận</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <them-sua-dat-dich-vu ref="themSuaDatDichVu" @getDatPhong="getDataFromApi(searchParamsDatPhong)"></them-sua-dat-dich-vu>

        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';
    import ThemSuaDatDichVu from './ThemSuaDatDichVu.vue';

    export default Vue.extend({
        components: {
            ThemSuaDatDichVu
        },
        data() {
            return {
                dialogConfirm: false,
                lstTrangThai: [
                    { name: 'Tất cả', value: null as any },
                    { name: 'Chưa nhận', value: 0 },
                    { name: 'Đã nhận', value: 1 },
                    { name: 'Đã hủy', value: 2},
                ],
                dsDatPhong: [] as DatPhong[],
                tableHeader: [
                    { text: 'STT', value: 'DatPhongID', align: 'center', sortable: true },
                    { text: 'Họ tên', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'Số điện thoại', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'Ngày thuê', value: 'ThoiGianDat', align: 'center', sortable: true },
                    { text: 'Dịch vụ đặt', value: 'DichVu.TenDichVu', align: 'center', sortable: true },
                    { text: 'Số lượng người', value: 'SoLuongNguoi', align: 'center', sortable: true },
                    { text: 'Ngày đặt', value: 'NgayTao', align: 'center', sortable: true },
                    { text: 'Trạng thái', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsDatPhong: { includeEntities: true, rowsPerPage: 10, TrangThai: null as any } as DatPhongApiSearchParams,
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
                searchParamsDatPhong.laDatPhong = false;
                DatPhongApi.search(searchParamsDatPhong).then(res => {
                    this.dsDatPhong = res.Data;
                    this.searchParamsDatPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            showDialogThemSua(isUpdate: boolean, item: any): void {
                (this.$refs.themSuaDatDichVu as any).show(isUpdate, item);
            },
            confirmDelete(datPhong: DatPhong): void {
                this.selectedDatPhong = datPhong;
                this.dialogConfirmDelete = true;
            },
            deleteDatPhong(): void {
                DatPhongApi.delete(this.selectedDatPhong.DatPhongID).then(res => {
                    this.$snotify.success('Hủy dịch vụ thành công!');
                    this.getDataFromApi(this.searchParamsDatPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Hủy dịch vụ thất bại!');
                });
            },
            confirm(datPhong: DatPhong): void {
                this.selectedDatPhong = datPhong;
                this.dialogConfirm = true;
            },
            confirmDatPhong(): void {
                this.selectedDatPhong.TrangThai = 1;
                DatPhongApi.update(this.selectedDatPhong.DatPhongID, this.selectedDatPhong).then(res => {
                    this.$snotify.success('Xác nhận thành công!');
                    this.$eventBus.$emit('getSoKhachDatDichVu');
                    this.getDataFromApi(this.searchParamsDatPhong);
                    this.dialogConfirm = false;
                }).catch(res => {
                    this.$snotify.error('Xác nhận thất bại!');
                });
            },
        }
    });
</script>

