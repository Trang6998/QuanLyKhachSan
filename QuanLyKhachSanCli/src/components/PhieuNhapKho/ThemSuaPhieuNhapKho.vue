<template>
    <v-dialog v-model="dialog" width="800">
        <v-card>
            <v-card-title class="primary white--text" style="height: 3.5em">
                <v-flex>
                    <h3 style="margin: auto">{{isUpdate ? 'CẬP NHẬT PHIẾU NHẬP KHO' : 'NHẬP KHO'}}</h3>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex>
                    <div class="text-xs-right">
                        <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
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
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="NgayNhap|moment('DD/MM/YYYY')"
                                          clearable>
                            </v-datepicker>
                        </v-flex>
                        <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                            <v-text-field v-model="phieuNhapKho.TongTien"
                                          label="Tổng tiền"
                                          type="number"
                                          :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                                          v-validate="''"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="TongTien"
                                          clearable></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    Chi tiết phiếu nhập
                                </v-tab>

                                <v-tab-item :key="1">
                                    <v-card flat>
                                        <div>
                                            <v-form scope="frmChiTiet">
                                                <v-card>
                                                    <v-card-text>
                                                        <v-layout row wrap>
                                                            <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                                                <v-autocomplete v-model="chiTietPhieuNhap.ThuocTinhID"
                                                                                :items="dsVatDung"
                                                                                item-text="TenVatDung"
                                                                                item-value="VatDungID"
                                                                                label="Vật dụng"
                                                                                placeholder="Vật dụng"
                                                                                :error-messages="errors.collect('ThuocTinhID', 'frmChiTiet')"
                                                                                v-validate="''"
                                                                                data-vv-scope="frmChiTiet"
                                                                                data-vv-name="ThuocTinhID"
                                                                                clearable></v-autocomplete>
                                                            </v-flex>
                                                            <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                                                <v-text-field v-model="chiTietPhieuNhap.SoLuong"
                                                                              label="Số lượng"
                                                                              type="number"
                                                                              :error-messages="errors.collect('SoLuong', 'frmChiTiet')"
                                                                              v-validate="''"
                                                                              data-vv-scope="frmChiTiet"
                                                                              data-vv-name="SoLuong"
                                                                              hide-details
                                                                              clearable></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                                                <v-text-field v-model="chiTietPhieuNhap.GiaNhap"
                                                                              label="Giá nhập"
                                                                              type="number"
                                                                              :error-messages="errors.collect('GiaNhap', 'frmChiTiet')"
                                                                              v-validate="''"
                                                                              data-vv-scope="frmChiTiet"
                                                                              data-vv-name="GiaNhap"
                                                                              hide-details
                                                                              clearable></v-text-field>
                                                            </v-flex>
                                                            <v-flex xs6 sm4 md4 style="padding-right: 1.5em">
                                                                <v-text-field v-model="chiTietPhieuNhap.GhiChu"
                                                                              label="Ghi chú"
                                                                              type="text"
                                                                              :error-messages="errors.collect('GhiChu', 'frmChiTiet')"
                                                                              v-validate="''"
                                                                              data-vv-scope="frmChiTiet"
                                                                              data-vv-name="GhiChu"
                                                                              hide-details
                                                                              clearable></v-text-field>
                                                            </v-flex>

                                                        </v-layout>
                                                    </v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn small class="primary" :disabled="loading" :loading="loading" @click.native="saveChiTiet">Lưu</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-form>
                                        </div>
                                        <v-card-text class="pa-0">
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
                                                        <a v-on:click="deletePhieuNhapKho(props.item.ChiTietPhieuNhapID)" onClick="return confirm('are you sure?');"><v-icon small>delete</v-icon></a>
                                                        <!--<v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
        <v-icon small>delete</v-icon>
    </v-btn>-->
                                                    </td>
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
                phieuNhapKho: { ChiTietPhieuNhap: [] as ChiTietPhieuNhap[] } as PhieuNhapKho,
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
                loading: false,
                searchParamsPhieuNhapKho: { phieuNhapID: null as any } as PhieuNhapKhoApiSearchParams,
                isUpdateChiTiet: false
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
                this.chiTietPhieuNhap = {} as ChiTietPhieuNhap;
                this.dsChiTietPhieuNhap = [] as ChiTietPhieuNhap[];
                this.phieuNhapKho = Object.assign({}, item);
                if (isUpdate === true) {
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
            },
            getDataFromApi(id: number): void {
                PhieuNhapKhoApi.detail(id).then(res => {
                    this.phieuNhapKho = res;
                });
            },
            getNhanVien(): void {
                var search = {} as NhanVienApiSearchParams;
                NhanVienApi.search(search).then(res => {
                    this.dsNhanVien = res.Data;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.phieuNhapKho.NhanVienID = 1;//store.state.user.Profile.NhanVien.NhanVienID;
                        this.phieuNhapKho.ChiTietPhieuNhap = this.dsChiTietPhieuNhap;
                        if (this.isUpdate) {
                            this.loading = true;
                            PhieuNhapKhoApi.update(this.phieuNhapKho.PhieuNhapID, this.phieuNhapKho).then(res => {
                                this.loading = false;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.isUpdate = false;
                                //this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            PhieuNhapKhoApi.insert(this.phieuNhapKho).then(res => {
                                this.phieuNhapKho = res;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.isUpdate = false;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
                this.$validator.validateAll('frmChiTiet').then((res) => {
                    if (res) {
                        
                        if (this.isUpdate) {
                            this.loading = true;
                            for (var ct in this.dsChiTietPhieuNhap) {
                                ChiTietPhieuNhapApi.update((ct as ChiTietPhieuNhap).ChiTietPhieuNhapID, (ct as ChiTietPhieuNhap)).then(res => {
                                    this.loading = false;
                                    this.dialog = false;
                                    //this.$emit("getLaiDanhSach");
                                    this.isUpdate = false;
                                    this.$snotify.success('Cập nhật thành công!');
                                }).catch(res => {
                                    this.loading = false;
                                    this.$snotify.error('Cập nhật thất bại!');
                                });
                            }
                        } else {
                            this.loading = true;
                            PhieuNhapKhoApi.insert(this.phieuNhapKho).then(res => {
                                this.phieuNhapKho = res;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.isUpdate = false;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
            saveChiTiet(): void {
                this.$validator.validateAll('frmChiTiet').then((res) => {
                    if (res) {
                        if (this.isUpdateChiTiet) {
                            this.loading = true;
                            ChiTietPhieuNhapApi.update(this.phieuNhapKho.PhieuNhapID, this.chiTietPhieuNhap).then(res => {
                                
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.phieuNhapKho.ChiTietPhieuNhap.push(this.chiTietPhieuNhap);
                        }
                    }
                });
            },
            deletePhieuNhapKho(id: number): void {
                ChiTietPhieuNhapApi.delete(this.selectedPhieuNhapKho.PhieuNhapID).then(res => {
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

