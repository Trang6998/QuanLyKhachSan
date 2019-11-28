<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/vatdung" exact>VatDung</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="vatDung.TenVatDung"
                            label="TenVatDung"
                            type="text"
                            :error-messages="errors.collect('TenVatDung', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TenVatDung"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="vatDung.SoLuongKho"
                            label="SoLuongKho"
                            type="text"
                            :error-messages="errors.collect('SoLuongKho', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoLuongKho"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="vatDung.MoTa"
                            label="MoTa"
                            type="text"
                            :error-messages="errors.collect('MoTa', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="MoTa"
                            hide-details
                            clearable
                            ></v-text-field>
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
                        <td>{{ props.item.VatDung.PhieuNhapID }}</td>
                        <td>{{ props.item.VatDung.VatDungID }}</td>
                <td>{{ props.item.SoLuong }}</td>
                <td>{{ props.item.GiaNhap }}</td>
                <td>{{ props.item.GhiChu }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="2" ripple>
                                    VatDungPhong
                                </v-tab>
                                <v-tab-item :key="2">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/vatdungphong/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderVatDungPhong"
                              :items="dsVatDungPhong"
                              :pagination.sync="searchParamsVatDungPhong"
                              :total-items="searchParamsVatDungPhong.totalItems"
                              :loading="dsVatDungPhongLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.VatDungPhongID }}</td>
                <td>{{ props.item.SoLuong }}</td>
                <td>{{ props.item.GhiChu }}</td>
                        <td>{{ props.item.VatDung.VatDungID }}</td>
                        <td>{{ props.item.VatDung.PhongID }}</td>
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
        mounted() {
            if (this.$route.name === 'suaVatDung') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
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
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            VatDungApi.update(id, this.vatDung).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            VatDungApi.insert(this.vatDung).then(res => {
                                this.$router.push('/vatdung/' + res.VatDungID);
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

