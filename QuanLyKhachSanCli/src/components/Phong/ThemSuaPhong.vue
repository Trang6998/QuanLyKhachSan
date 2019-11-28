<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/phong" exact>Phong</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="phong.SoPhong"
                            label="SoPhong"
                            type="number"
                            :error-messages="errors.collect('SoPhong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoPhong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-checkbox v-model="phong.TrangThai" label="TrangThai"
                            :error-messages="errors.collect('TrangThai', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TrangThai"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="phong.LoaiPhongID"
                            :items="dsLoaiPhong"
                            :loading="dsLoaiPhongLoading"
                            :search-input.sync="searchLoaiPhong"
                            item-text="LoaiPhongID"
                            item-value="LoaiPhongID"
                            label="LoaiPhongID"
                            placeholder="Nhập LoaiPhongID"
                            :error-messages="errors.collect('LoaiPhongID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="LoaiPhongID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    ThuePhong
                                </v-tab>
                                <v-tab-item :key="1">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/thuephong/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderThuePhong"
                              :items="dsThuePhong"
                              :pagination.sync="searchParamsThuePhong"
                              :total-items="searchParamsThuePhong.totalItems"
                              :loading="dsThuePhongLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.ThuePhongID }}</td>
                        <td>{{ props.item.Phong.PhongID }}</td>
                        <td>{{ props.item.Phong.HoaDonID }}</td>
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
                        <td>{{ props.item.Phong.VatDungID }}</td>
                        <td>{{ props.item.Phong.PhongID }}</td>
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
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import { Phong } from '@/models/Phong';
    import { ThuePhong } from '@/models/ThuePhong';
    import ThuePhongApi, { ThuePhongApiSearchParams } from '@/apiResources/ThuePhongApi';
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
                phong: {} as Phong,
                dsThuePhong: [] as ThuePhong[],
                dsThuePhongLoading: false,
                searchThuePhong: '',
                searchParamsThuePhong: { includeEntities: true } as ThuePhongApiSearchParams,
                tableHeaderThuePhong: [
                    { text: 'ThuePhongID', value: 'ThuePhongID', align: 'center', sortable: true },
                    { text: 'PhongID', value: 'PhongID', align: 'center', sortable: true },
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
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
                searchParamsPhong: {} as PhongApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaPhong') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                PhongApi.detail(id).then(res => {
                    this.phong = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.phong.LoaiPhong = undefined;
                        this.phong.ThuePhong = undefined;
                        this.phong.VatDungPhong = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            PhongApi.update(id, this.phong).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            PhongApi.insert(this.phong).then(res => {
                                this.$router.push('/phong/' + res.PhongID);
                                this.phong = res;
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
            getDSThuePhong(): void {
                ThuePhongApi.search(this.searchParamsThuePhong).then(res => {
                    this.dsThuePhong = res.Data;
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

