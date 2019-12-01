<template>
    <v-dialog v-model="dialog" width="500" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật vật dụng phòng' : 'Thêm mới vật dụng phòng'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="vatDungPhong.SoLuong"
                                              label="SoLuong"
                                              type="number"
                                              :error-messages="errors.collect('SoLuong', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="SoLuong"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="vatDungPhong.GhiChu"
                                              label="GhiChu"
                                              type="text"
                                              :error-messages="errors.collect('GhiChu', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="GhiChu"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs6 sm4 md3>
                                <v-autocomplete v-model="vatDungPhong.VatDungID"
                                                :items="dsVatDung"
                                                :loading="dsVatDungLoading"
                                                :search-input.sync="searchVatDung"
                                                item-text="VatDungID"
                                                item-value="VatDungID"
                                                label="VatDungID"
                                                placeholder="Nhập VatDungID"
                                                :error-messages="errors.collect('VatDungID', 'frmAddEdit')"
                                                v-validate="''"
                                                data-vv-scope="frmAddEdit"
                                                data-vv-name="VatDungID"
                                                clearable></v-autocomplete>
                            </v-flex>
                            <v-flex xs6 sm4 md3>
                                <v-autocomplete v-model="vatDungPhong.PhongID"
                                                :items="dsPhong"
                                                :loading="dsPhongLoading"
                                                :search-input.sync="searchPhong"
                                                item-text="PhongID"
                                                item-value="PhongID"
                                                label="PhongID"
                                                placeholder="Nhập PhongID"
                                                :error-messages="errors.collect('PhongID', 'frmAddEdit')"
                                                v-validate="''"
                                                data-vv-scope="frmAddEdit"
                                                data-vv-name="PhongID"
                                                clearable></v-autocomplete>
                            </v-flex>
                            <!--<v-flex xs12>
        <v-tabs color="primary" dark slider-color="white">
            <v-tab :key="1" ripple>
                ChiTietKiemKe
            </v-tab>
            <v-tab-item :key="1">
                <v-card flat>
                    <div class="text-xs-right">
                        <v-btn color="info" to="/chitietkiemke/add" small>Thêm mới</v-btn>
                    </div>
                    <v-card-text class="pa-0">
                        <v-data-table :headers="tableHeaderChiTietKiemKe"
                                      :items="dsChiTietKiemKe"
                                      :pagination.sync="searchParamsChiTietKiemKe"
                                      :total-items="searchParamsChiTietKiemKe.totalItems"
                                      :loading="dsChiTietKiemKeLoading"
                                      class="table-border table">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.ChiTietKiemKeID }}</td>
                                <td>{{ props.item.VatDungPhong.KiemKeID }}</td>
                                <td>{{ props.item.VatDungPhong.VatDungPhongID }}</td>
                                <td>{{ props.item.SoLuongKiemKe }}</td>
                                <td>{{ props.item.GhiChu }}</td>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-flex>-->

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
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';
    import { VatDungPhong } from '@/models/VatDungPhong';
    import { ChiTietKiemKe } from '@/models/ChiTietKiemKe';
    import ChiTietKiemKeApi, { ChiTietKiemKeApiSearchParams } from '@/apiResources/ChiTietKiemKeApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                vatDungPhong: {} as VatDungPhong,
                dsChiTietKiemKe: [] as ChiTietKiemKe[],
                dsChiTietKiemKeLoading: false,
                searchChiTietKiemKe: '',
                searchParamsChiTietKiemKe: { includeEntities: true } as ChiTietKiemKeApiSearchParams,
                tableHeaderChiTietKiemKe: [
                    { text: 'ChiTietKiemKeID', value: 'ChiTietKiemKeID', align: 'center', sortable: true },
                    { text: 'KiemKeID', value: 'KiemKeID', align: 'center', sortable: true },
                    { text: 'VatDungPhongID', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'SoLuongKiemKe', value: 'SoLuongKiemKe', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsVatDungPhong: {} as VatDungPhongApiSearchParams,
            }
        },
        watch: {
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.vatDungPhong = item;
            },

            getDataFromApi(id: number): void {
                VatDungPhongApi.detail(id).then(res => {
                    this.vatDungPhong = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.vatDungPhong.Phong = undefined;
                        this.vatDungPhong.VatDung = undefined;
                        this.vatDungPhong.ChiTietKiemKe = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            VatDungPhongApi.update(this.vatDungPhong.VatDungPhongID, this.vatDungPhong).then(res => {
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
                            VatDungPhongApi.insert(this.vatDungPhong).then(res => {
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.vatDungPhong = res;
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
            getDSChiTietKiemKe(): void {
                ChiTietKiemKeApi.search(this.searchParamsChiTietKiemKe).then(res => {
                    this.dsChiTietKiemKe = res.Data;
                });
            },
        }
    });
</script>

