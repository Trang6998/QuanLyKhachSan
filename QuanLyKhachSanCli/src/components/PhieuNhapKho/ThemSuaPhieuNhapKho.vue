<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phieunhapkho" exact>PhieuNhapKho</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="phieuNhapKho.NgayNhap"
                            label="NgayNhap"
                            type="date"
                            :error-messages="errors.collect('NgayNhap', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NgayNhap"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="phieuNhapKho.TongTien"
                            label="TongTien"
                            type="number"
                            :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TongTien"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="phieuNhapKho.NhanVienID"
                            :items="dsNhanVien"
                            :loading="dsNhanVienLoading"
                            :search-input.sync="searchNhanVien"
                            item-text="NhanVienID"
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
    </v-flex>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                phieuNhapKho: {} as PhieuNhapKho,
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
                loading: false,
                searchParamsPhieuNhapKho: {} as PhieuNhapKhoApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaPhieuNhapKho') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                PhieuNhapKhoApi.detail(id).then(res => {
                    this.phieuNhapKho = res;
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
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            PhieuNhapKhoApi.insert(this.phieuNhapKho).then(res => {
                                this.$router.push('/phieunhapkho/' + res.PhieuNhapID);
                                this.phieuNhapKho = res;
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
        }
    });
</script>

