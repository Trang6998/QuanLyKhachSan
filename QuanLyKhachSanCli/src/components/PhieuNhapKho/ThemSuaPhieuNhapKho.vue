<template>
    <v-dialog persistent v-model="dialog" width="800">
        <v-card>
            <v-card-title class="primary white--text" style="height: 3.5em">
                <v-flex>
                    <h3 style="margin: auto">{{isUpdate ? 'CẬP NHẬT PHIẾU NHẬP KHO' : 'NHẬP KHO'}}</h3>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                    <div class="text-xs-right">
                        <v-btn class="white--text ma-0" small @click="save()" icon dark><v-icon>close</v-icon></v-btn>
                    </div>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                            <v-datepicker v-model="phieuNhapKho.NgayNhap"
                                          label="Ngày nhập"
                                          type="date"
                                          :error-messages="errors.collect('NgayNhap', 'frmAddEdit')"
                                          v-validate="'required'"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="NgayNhap|moment('DD/MM/YYYY')"
                                          clearable>
                            </v-datepicker>
                        </v-flex>
                        <v-flex xs12>
                            <h3>Chi tiết phiếu nhập</h3>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                    <v-autocomplete v-model="chiTietPhieuNhap.ThuocTinhID"
                                                    :items="dsVatDung"
                                                    item-text="TenVatDung"
                                                    item-value="VatDungID"
                                                    label="Vật dụng"
                                                    placeholder="Vật dụng"
                                                    :error-messages="errors.collect('ThuocTinhID', 'frmAddEdit')"
                                                    v-validate="'required'"
                                                    data-vv-scope="frmAddEdit"
                                                    data-vv-name="ThuocTinhID"
                                                    clearable></v-autocomplete>
                                </v-flex>
                                <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                    <v-text-field v-model="chiTietPhieuNhap.SoLuong"
                                                  label="Số lượng"
                                                  type="number"
                                                  :error-messages="errors.collect('SoLuong', 'frmAddEdit')"
                                                  v-validate="'required'"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="SoLuong"
                                                  clearable></v-text-field>
                                </v-flex>
                                <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                    <v-text-field v-model="chiTietPhieuNhap.GiaNhap"
                                                  label="Giá nhập"
                                                  type="number"
                                                  :error-messages="errors.collect('GiaNhap', 'frmAddEdit')"
                                                  v-validate="'required'"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="GiaNhap"
                                                  clearable></v-text-field>
                                </v-flex>
                                <v-flex xs10 style="padding-right: 1.5em">
                                    <v-text-field v-model="chiTietPhieuNhap.GhiChu"
                                                  label="Ghi chú"
                                                  type="text"
                                                  :error-messages="errors.collect('GhiChu', 'frmAddEdit')"
                                                  v-validate="''"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="GhiChu"
                                                  clearable></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-btn style="margin-top: 20px" small class="primary" @click.native="saveChiTiet">Lưu</v-btn>
                            </v-layout>
                        </v-flex>

                        <v-flex xs12>
                            <v-data-table :headers="tableHeaderChiTietPhieuNhap"
                                          :items="dsChiTietPhieuNhap"
                                          :total-items="searchParamsChiTietPhieuNhap.totalItems"
                                          class="table-border table">
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.index + 1 }}</td>
                                    <td>{{ props.item.VatDung.TenVatDung }}</td>
                                    <td>{{ props.item.SoLuong }}</td>
                                    <td>{{ props.item.GiaNhap }}</td>
                                    <td>{{ props.item.GhiChu }}</td>
                                    <td class="text-xs-center" style="width:80px;">
                                        <v-btn flat icon small @click="showChiTiet(props.item)" class="ma-0">
                                            <v-icon small>edit</v-icon>
                                        </v-btn>
                                        <a v-on:click="deleteChiTiet(props.item)" onClick="return confirm('are you sure?');"><v-icon small>delete</v-icon></a>

                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                        <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                            <v-text-field v-model="phieuNhapKho.TongTien"
                                          label="Tổng tiền"
                                          type="number"
                                          disabled
                                          :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="TongTien"
                                          clearable></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" @click="save()">Đóng</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';
    import { NhanVien } from '@/models/NhanVien';
    import NhanVienApi, { NhanVienApiSearchParams } from '@/apiResources/NhanVienApi';
    import { VatDung } from '@/models/VatDung';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    import store from '@/store/store';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {
        },
        data() {
            return {
                dialog: false,
                isUpdate: false,
                dsNhanVien: [] as NhanVien[],
                phieuNhapKho: {} as PhieuNhapKho,
                chiTietPhieuNhap: {} as ChiTietPhieuNhap,
                dsChiTietPhieuNhap: [] as ChiTietPhieuNhap[],
                selectedPhieuNhapKho: {} as ChiTietPhieuNhap,
                searchVatDung: {} as VatDungApiSearchParams,
                dsVatDung: [] as VatDung[],
                searchChiTietPhieuNhap: '',
                searchParamsChiTietPhieuNhap: { includeEntities: true } as ChiTietPhieuNhapApiSearchParams,
                tableHeaderChiTietPhieuNhap: [
                    { text: 'STT', value: 'ChiTietPhieuNhapID', align: 'center', sortable: true },
                    { text: 'Vật dụng', value: 'VatDung', align: 'center', sortable: true },
                    { text: 'Số lượng', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'Giá nhập', value: 'GiaNhap', align: 'center', sortable: true },
                    { text: 'Ghi chú', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: true },
                ],
                dialogConfirmDelete: false,
                searchParamsPhieuNhapKho: { phieuNhapID: null as any } as PhieuNhapKhoApiSearchParams,
                isUpdateChiTiet: false,
                TongTien: 0,
            }
        },
        watch: {
        },
        created() {
            this.getNhanVien();
            this.getVatDung();
        },
        mounted() {
        },
        methods: {
            show(isUpdate: boolean, item: any): void {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.isUpdateChiTiet = false;
                this.chiTietPhieuNhap = {} as ChiTietPhieuNhap;
                this.dsChiTietPhieuNhap = [] as ChiTietPhieuNhap[];
                this.phieuNhapKho = Object.assign({}, item);
                if (isUpdate) {
                    this.searchParamsChiTietPhieuNhap.phieuNhapID = this.phieuNhapKho.PhieuNhapID;
                    ChiTietPhieuNhapApi.search(this.searchParamsChiTietPhieuNhap).then(res => {
                        this.dsChiTietPhieuNhap = res.Data;
                    });
                }
            },
            getVatDung(): void {
                this.searchVatDung = {} as VatDungApiSearchParams;
                VatDungApi.search(this.searchVatDung).then(
                    res => {
                        this.dsVatDung = res.Data;
                    }
                )
            },
            showChiTiet(item: any): void {
                this.chiTietPhieuNhap = item;
                this.isUpdateChiTiet = true;
                this.TongTien = this.chiTietPhieuNhap.GiaNhap * this.chiTietPhieuNhap.SoLuong;
            },
            getDataFromApi(id: number): void {
                PhieuNhapKhoApi.detail(id).then(res => {
                    this.phieuNhapKho = res;
                });
            },
            getDanhSachChiTiet(): void {
                this.searchParamsChiTietPhieuNhap.phieuNhapID = this.phieuNhapKho.PhieuNhapID;
                ChiTietPhieuNhapApi.search(this.searchParamsChiTietPhieuNhap).then(res => {
                    this.dsChiTietPhieuNhap = res.Data;
                });
            },
            getNhanVien(): void {
                var search = {} as NhanVienApiSearchParams;
                NhanVienApi.search(search).then(res => {
                    this.dsNhanVien = res.Data;
                });
            },
            save(): void {
                this.phieuNhapKho.NhanVienID = store.state.user.Profile.NhanVien.NhanVienID;
                PhieuNhapKhoApi.update(this.phieuNhapKho.PhieuNhapID, this.phieuNhapKho).then(res => {
                    this.dialog = false;
                    this.$emit("getLaiDanhSach");
                    this.isUpdate = false;
                    //this.$snotify.success('Cập nhật thành công!');
                }).catch(res => {
                    this.dialog = false;
                    //this.$snotify.error('Cập nhật thất bại!');
                });
            },
            saveChiTiet(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.phieuNhapKho.TongTien += this.chiTietPhieuNhap.GiaNhap * this.chiTietPhieuNhap.SoLuong - this.TongTien;
                        this.chiTietPhieuNhap.PhieuNhapID = this.phieuNhapKho.PhieuNhapID;
                        if (this.isUpdateChiTiet) {
                            ChiTietPhieuNhapApi.update(this.chiTietPhieuNhap.ChiTietPhieuNhapID, this.chiTietPhieuNhap).then(res => {
                                this.chiTietPhieuNhap = {} as ChiTietPhieuNhap;
                                this.isUpdateChiTiet = false;
                                this.getDanhSachChiTiet();
                                this.TongTien = 0;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            ChiTietPhieuNhapApi.insert(this.chiTietPhieuNhap).then(res => {
                                this.getDanhSachChiTiet();
                                this.chiTietPhieuNhap = {} as ChiTietPhieuNhap;
                                this.TongTien = 0;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
            deleteChiTiet(item: any): void {
                this.phieuNhapKho.TongTien -= item.SoLuong * item.GiaNhap;
                ChiTietPhieuNhapApi.delete(item.ChiTietPhieuNhapID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.searchParamsChiTietPhieuNhap.phieuNhapID = this.phieuNhapKho.PhieuNhapID;
                    ChiTietPhieuNhapApi.search(this.searchParamsChiTietPhieuNhap).then(res => {
                        this.dsChiTietPhieuNhap = res.Data;
                    });
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

