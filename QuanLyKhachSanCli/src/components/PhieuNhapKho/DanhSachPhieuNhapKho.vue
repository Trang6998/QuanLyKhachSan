<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phieunhapkho" exact>Phiếu nhập kho</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card style="min-height : 500px;">
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12> 
                    <v-data-table :headers="tableHeader"
                                :items="dsPhieuNhapKho"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsPhieuNhapKho"
                                :total-items="searchParamsPhieuNhapKho.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.index + 1 }}</td>
                            <td>{{ props.item.PhieuNhapID }}</td>
                            <td>{{ props.item.NgayNhap === null ? "" : props.item.NgayNhap|moment('DD/MM/YYYY') }}</td>
                            <td>{{ props.item.TongTien }}</td>
                            <td class="text-xs-center" style="width:80px;">
                                <v-btn flat icon small @click="confirmEdit(true,props.item)" class="ma-0">
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
        <v-dialog v-model="dialogEdit">
            <v-card>
                <v-breadcrumbs divider="/" class="pa-0">
                    <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
                </v-breadcrumbs>
                <v-card>
                    <v-card-text>
                        <v-form scope="frmAddEdit">
                            <v-layout row wrap>
                                <v-flex xs6 sm4 md3>
                                    <v-text-field v-model="selectedPhieuNhapKho.NgayNhap"
                                                  label="NgayNhap"
                                                  type="date"
                                                  :error-messages="errors.collect('NgayNhap', 'frmAddEdit')"
                                                  v-validate="''"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="NgayNhap"
                                                  hide-details
                                                  clearable></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm4 md3>
                                    <v-text-field v-model="selectedPhieuNhapKho.TongTien"
                                                  label="TongTien"
                                                  type="number"
                                                  :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                                                  v-validate="''"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="TongTien"
                                                  hide-details
                                                  clearable></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm4 md3>
                                    <v-autocomplete v-model="selectedPhieuNhapKho.NhanVienID"
                                                    :items="dsNhanVien"
                                                    :search-input.sync="searchNhanVien"
                                                    item-text="NhanVienID"
                                                    item-value="NhanVienID"
                                                    label="NhanVienID"
                                                    placeholder="Nhập NhanVienID"
                                                    :error-messages="errors.collect('NhanVienID', 'frmAddEdit')"
                                                    v-validate="''"
                                                    data-vv-scope="frmAddEdit"
                                                    data-vv-name="NhanVienID"
                                                    clearable></v-autocomplete>
                                </v-flex>
                                <v-flex xs12>
                                    <v-tabs color="primary" dark slider-color="white">
                                        <v-tab :key="1" ripple>
                                            ChiTietPhieuNhap
                                        </v-tab>
                                        <v-tab-item :key="1">
                                            <v-card flat>
                                                <div class="text-xs-right">
                                                    <v-btn color="info" to="/chitietphieunhap/add" small>Thêm mới</v-btn>
                                                </div>
                                                <v-card-text class="pa-0">
                                                    <v-data-table :headers="tableHeaderChiTietPhieuNhap"
                                                                  :items="dsChiTietPhieuNhap"
                                                                  :pagination.sync="searchParamsChiTietPhieuNhap"
                                                                  :total-items="searchParamsChiTietPhieuNhap.totalItems"
                                                                  :loading="dsChiTietPhieuNhapLoading"
                                                                  class="table-border table">
                                                        <template slot="items" slot-scope="props">
                                                            <td>{{ props.item.ChiTietPhieuNhapID }}</td>
                                                            <td>{{ props.item.PhieuNhapKho.PhieuNhapID }}</td>
                                                            <td>{{ props.item.PhieuNhapKho.VatDungID }}</td>
                                                            <td>{{ props.item.SoLuong }}</td>
                                                            <td>{{ props.item.GiaNhap }}</td>
                                                            <td>{{ props.item.GhiChu }}</td>
                                                        </template>
                                                    </v-data-table>
                                                </v-card-text>
                                            </v-card>
                                        </v-tab-item>
                                    </v-tabs>
                                </v-flex>

                            </v-layout>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deletePhieuNhapKho" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';
import { NhanVien } from '../../models/NhanVien';
    export default Vue.extend({
        components: {},
        data() {
            return {
                dsNhanVien: [] as NhanVien[],
                isUpdate: false,
                dsPhieuNhapKho: [] as PhieuNhapKho[],
                tableHeader: [
                    { text: 'STT', value: 'index', align: 'center', sortable: true },
                    { text: 'ID', value: 'PhieuNhapID', align: 'center', sortable: true },
                    { text: 'Ngày nhập', value: 'NgayNhap', align: 'center', sortable: true },
                    { text: 'Tổng tiền', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                tableHeaderChiTietPhieuNhap: [
                    { text: 'ChiTietPhieuNhapID', value: 'ChiTietPhieuNhapID', align: 'center', sortable: true },
                    { text: 'PhieuNhapID', value: 'PhieuNhapID', align: 'center', sortable: true },
                    { text: 'ThuocTinhID', value: 'ThuocTinhID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'GiaNhap', value: 'GiaNhap', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                ],
                searchParamsPhieuNhapKho: { includeEntities: true, rowsPerPage: 10 } as PhieuNhapKhoApiSearchParams,
                loadingTable: false,
                selectedPhieuNhapKho: {} as PhieuNhapKho,
                dialogConfirmDelete: false,
                dsChiTietPhieuNhap: [] as ChiTietPhieuNhap[]
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsPhieuNhapKho);
        },
        methods: {
            getDataFromApi(searchParamsPhieuNhapKho: PhieuNhapKhoApiSearchParams): void {
                this.loadingTable = true;
                PhieuNhapKhoApi.search(searchParamsPhieuNhapKho).then(res => {
                    this.dsPhieuNhapKho = res.Data;
                    this.searchParamsPhieuNhapKho.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            getDataPNKFromApi(id: number): void {
                PhieuNhapKhoApi.detail(id).then(res => {
                    this.selectedPhieuNhapKho = res;
                });
            },
            dialogEdit(isEdit: boolean, phieunhapkho: PhieuNhapKho): void {
                this.isUpdate = isEdit;
                this.selectedPhieuNhapKho = phieunhapkho;
                this.getDataPNKFromApi(this.selectedPhieuNhapKho.PhieuNhapID);
            },
            confirmDelete(phieuNhapKho: PhieuNhapKho): void {
                this.selectedPhieuNhapKho = phieuNhapKho;
                this.dialogConfirmDelete = true;
            },
            deletePhieuNhapKho(): void {
                PhieuNhapKhoApi.delete(this.selectedPhieuNhapKho.PhieuNhapID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsPhieuNhapKho);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

