<template>
    <v-dialog v-model="dialog" width="800">
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-datepicker  v-model="phieuNhapKho.NgayNhap"
                            label="Ngày nhập"
                            type="date"
                            :error-messages="errors.collect('NgayNhap', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NgayNhap|moment('DD/MM/YYYY')"
                            clearable>
                            </v-datepicker>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="phieuNhapKho.TongTien"
                            label="Tổng tiền"
                            type="number"
                            :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TongTien"
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="phieuNhapKho.NhanVienID"
                            :items="dsNhanVien"
                            item-text="TenNhanVien"
                            item-value="NhanVienID"
                            label="NhanVienID"
                            placeholder="Nhập NhanVienID"
                            :error-messages="errors.collect('NhanVienID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NhanVienID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    Chi tiết phiếu nhập
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
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.VatDung.TenVatDung }}</td>
                        <td>{{ props.item.SoLuong }}</td>
                        <td>{{ props.item.GiaNhap }}</td>
                        <td>{{ props.item.GhiChu }}</td>
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

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                dsNhanVien: [] as NhanVien[],
                phieuNhapKho: {} as PhieuNhapKho,
                dsChiTietPhieuNhap: [] as ChiTietPhieuNhap[],
                dsChiTietPhieuNhapLoading: false,
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
                loading: false,
                searchParamsPhieuNhapKho: {} as PhieuNhapKhoApiSearchParams,
            }
        },
        watch: {
        },
        created() {
            this.getNhanVien();
        },
        mounted() {
        },
        methods: {
            show(isUpdate: boolean, item: any): void {
                debugger
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.phieuNhapKho = item;
                this.searchParamsChiTietPhieuNhap.phieuNhapID = this.phieuNhapKho.PhieuNhapID;
                ChiTietPhieuNhapApi.search(this.searchParamsChiTietPhieuNhap).then(res => {
                    this.dsChiTietPhieuNhap = res.Data;
                });
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
                        this.phieuNhapKho.NhanVien = undefined;
                        this.phieuNhapKho.ChiTietPhieuNhap = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            PhieuNhapKhoApi.update(id, this.phieuNhapKho).then(res => {
                                this.loading = false;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.$snotify.success('Cập nhật thành công!');
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
                                this.isUpdate = true;
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
        }
    });
</script>

