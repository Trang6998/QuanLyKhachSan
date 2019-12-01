<template>
    <v-dialog v-model="dialog" width="500" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật vật dụng' : 'Thêm mới vật dụng'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="vatDung.TenVatDung"
                                              label="TenVatDung"
                                              type="text"
                                              :error-messages="errors.collect('TenVatDung', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="TenVatDung"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="vatDung.SoLuongKho"
                                              label="SoLuongKho"
                                              type="text"
                                              :error-messages="errors.collect('SoLuongKho', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="SoLuongKho"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="vatDung.MoTa"
                                              label="MoTa"
                                              type="text"
                                              :error-messages="errors.collect('MoTa', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="MoTa"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    import { VatDung } from '@/models/VatDung';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';
    import { VatDungPhong } from '@/models/VatDungPhong';
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                vatDung: {} as VatDung,
                dsChiTietPhieuNhap: [] as ChiTietPhieuNhap[],
                dsChiTietPhieuNhapLoading: false,
                searchChiTietPhieuNhap: '',
                searchParamsChiTietPhieuNhap: { includeEntities: true } as ChiTietPhieuNhapApiSearchParams,
                tableHeaderChiTietPhieuNhap: [
                    { text: 'ChiTietPhieuNhapID', value: 'ChiTietPhieuNhapID', align: 'center', sortable: true },
                    { text: 'PhieuNhapID', value: 'PhieuNhapID', align: 'center', sortable: true },
                    { text: 'ThuocTinhID', value: 'ThuocTinhID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'GiaNhap', value: 'GiaNhap', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                ],
                dsVatDungPhong: [] as VatDungPhong[],
                dsVatDungPhongLoading: false,
                searchVatDungPhong: '',
                searchParamsVatDungPhong: { includeEntities: true } as VatDungPhongApiSearchParams,
                tableHeaderVatDungPhong: [
                    { text: 'VatDungPhongID', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'VatDungID', value: 'VatDungID', align: 'center', sortable: true },
                    { text: 'PhongID', value: 'PhongID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsVatDung: {} as VatDungApiSearchParams,
            }
        },
        watch: {
        },
        
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.vatDung = item;
            },

            getDataFromApi(id: number): void {
                VatDungApi.detail(id).then(res => {
                    this.vatDung = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.vatDung.ChiTietPhieuNhap = undefined;
                        this.vatDung.VatDungPhong = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            VatDungApi.update(this.vatDung.VatDungID, this.vatDung).then(res => {
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
                            VatDungApi.insert(this.vatDung).then(res => {
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.vatDung = res;
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
            getDSChiTietPhieuNhap(): void {
                ChiTietPhieuNhapApi.search(this.searchParamsChiTietPhieuNhap).then(res => {
                    this.dsChiTietPhieuNhap = res.Data;
                });
            },
            getDSVatDungPhong(): void {
                VatDungPhongApi.search(this.searchParamsVatDungPhong).then(res => {
                    this.dsVatDungPhong = res.Data;
                });
            },
        }
    });
</script>

