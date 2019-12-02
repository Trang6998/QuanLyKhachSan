<template>
    <v-dialog v-model="dialog" width="900" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật thông tin phòng' : 'Thêm mới thông tin phòng'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>

                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout>
                            <v-toolbar-title>Thông tin phòng </v-toolbar-title>
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex xs4>
                                <v-select v-model="phong.LoaiPhongID"
                                          :items="dsLoaiPhong"
                                          :search-input.sync="searchLoaiPhong"
                                          item-text="TenLoaiPhong"
                                          item-value="LoaiPhongID"
                                          label="Loại phòng"
                                          :error-messages="errors.collect('Loại phòng', 'frmAddEdit')"
                                          v-validate="'required'"
                                          data-vv-scope="frmAddEdit"
                                          data-vv-name="Loại phòng"
                                          hide-details
                                          clearable></v-select>
                            </v-flex>
                            <v-flex xs4>
                                <v-text-field v-model="phong.SoPhong"
                                              label="Số Phòng"
                                              :error-messages="errors.collect('Số Phòng', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số Phòng"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs4>
                                <v-checkbox v-model="phong.TrangThai" label="TrangThai"
                                            :error-messages="errors.collect('TrangThai', 'frmAddEdit')"
                                            v-validate="''"
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="TrangThai"></v-checkbox>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout>
                                    <v-toolbar-title>Vật dụng phòng </v-toolbar-title>
                                </v-layout>
                                <v-layout nowrap>
                                    <v-flex xs3>
                                        <v-select :items="dsVatDung"
                                                  v-model="vatDungPhong.VatDung"
                                                  label="Vật dụng"
                                                  :return-object="true"
                                                  item-text="TenVatDung"
                                                  :error-messages="errors.collect('Vật dụng', 'frmAddEdit')"
                                                  v-validate="''"
                                                  data-vv-scope="frmAddEdit"
                                                  data-vv-name="Vật dụng"
                                                  hide-details
                                                  clearable></v-select>
                                    </v-flex>
                                    <v-flex xs2>
                                        <v-text-field v-model="vatDungPhong.SoLuong"
                                                      label="Số lượng"
                                                      :error-messages="errors.collect('Số lượng', 'frmAddEdit')"
                                                      v-validate="''"
                                                      data-vv-scope="frmAddEdit"
                                                      data-vv-name="Số lượng"
                                                      hide-details
                                                      clearable></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field v-model="vatDungPhong.GhiChu"
                                                      label="Ghi chú"
                                                      :error-messages="errors.collect('Ghi chú', 'frmAddEdit')"
                                                      v-validate="''"
                                                      data-vv-scope="frmAddEdit"
                                                      data-vv-name="Ghi chú"
                                                      hide-details
                                                      clearable></v-text-field>
                                    </v-flex>
                                    <v-flex xs1 md1 sm1 class="pa-2">
                                        <v-btn color="primary" @click.native="saveVatDungPhong()" small icon><v-icon>{{isUpdateVatDungPhong ? 'done' : 'add'}}</v-icon></v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs12 md12 sm12>
                                        <v-card-text class="pa-0">
                                            <v-data-table :headers="tableHeaderVatDungPhong"
                                                          :items="dsVatDungPhong"
                                                          :pagination.sync="searchParamsVatDungPhong"
                                                          :total-items="searchParamsVatDungPhong.totalItems"
                                                          :loading="dsVatDungPhongLoading"
                                                          class="table-border table">
                                                <template slot="items" slot-scope="props">
                                                    <td class="text-xs-center">{{ props.index +1 }}</td>
                                                    <td class="text-xs-center">{{ props.item.VatDung.TenVatDung }}</td>
                                                    <td class="text-xs-center">{{ props.item.SoLuong }}</td>
                                                    <td class="text-xs-center">{{ props.item.GhiChu }}</td>
                                                    <td class="text-xs-center" style="width:80px;">
                                                        <v-btn flat icon small v-show="isUpdate" class="ma-0" @click="suaVatDungPhong(props.item)">
                                                            <v-icon small>edit</v-icon>
                                                        </v-btn>
                                                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDeleteVatDungPhong(props.item)">
                                                            <v-icon small>delete</v-icon>
                                                        </v-btn>
                                                    </td>
                                                </template>
                                            </v-data-table>
                                        </v-card-text>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
                <v-dialog v-model="dialogConfirmDeleteVatDungPhong" max-width="290">
                    <v-card>
                        <v-card-title class="headline">Xác nhận xóa</v-card-title>
                        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.native="dialogConfirmDeleteVatDungPhong=false" flat>Hủy</v-btn>
                            <v-btn color="red darken-1" @click.native="deleteVatDungPhong" flat>Xác Nhận</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-card>
        </v-container>
    </v-dialog>

</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';
    import { Phong } from '@/models/Phong';
    import { VatDungPhong } from '@/models/VatDungPhong';
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { VatDung } from '@/models/VatDung';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                searchParamsVatDungPhong: { includeEntities: true } as VatDungPhongApiSearchParams,
                dsVatDung: [] as VatDung[],
                isUpdateVatDungPhong: false,
                searchLoaiPhong: '',
                dsLoaiPhong: [] as LoaiPhong[],
                isUpdate: false,
                phong: { VatDungPhong: [] as VatDungPhong[] } as Phong,
                vatDungPhong: {
                    VatDung: {} as VatDung
                } as VatDungPhong,
                searchParamsLoaiPhong: { includeEntities: true } as LoaiPhongApiSearchParams,
                selectedVatDungPhong: {} as VatDungPhong,
                dialogConfirmDeleteVatDungPhong: false,
                dsVatDungPhong: [] as VatDungPhong[],
                dsVatDungPhongLoading: false,
                searchParamsVatDung: { includeEntities: true } as VatDungApiSearchParams,
                tableHeaderVatDungPhong: [
                    { text: 'STT', value: '', align: 'center', sortable: true },
                    { text: 'Tên vật dụng', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'Số lượng', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'Ghi chú', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                loading: false,
                searchParamsPhong: {} as PhongApiSearchParams,
            }
        },
        watch: {
        },


        created() {
            this.getDataVatDungFromApi();
            this.getDataLoaiPhongFromApi();
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.$validator.errors.clear("frmAddEdit");
                this.isUpdate = isUpdate;
                this.vatDungPhong = {} as VatDungPhong;
                this.dsVatDungPhong = [] as VatDungPhong[];
                if (isUpdate == true)
                    this.getDataFromApi(item.PhongID);
                else
                    this.phong = {} as Phong;
            },

            getDataFromApi(id: number): void {
                PhongApi.detail(id).then(res => {
                    this.phong = res;
                    this.getDataFromApiVatDungPhong(this.searchParamsVatDungPhong);

                });
            },
            confirmDeleteVatDungPhong(vatDungPhong: VatDungPhong): void {
                this.selectedVatDungPhong = vatDungPhong;
                this.dialogConfirmDeleteVatDungPhong = true;
            },
            deleteVatDungPhong(): void {
                if (this.selectedVatDungPhong.VatDungPhongID != null) {
                    VatDungPhongApi.delete(this.selectedVatDungPhong.VatDungPhongID).then(res => {
                        this.$snotify.success('Xóa thành công!');
                        this.getDataFromApiVatDungPhong(this.searchParamsVatDungPhong);
                        this.dialogConfirmDeleteVatDungPhong = false;
                    }).catch(res => {
                        this.$snotify.error('Xóa thất bại!');
                    });
                }
                else {
                    var index = this.dsVatDungPhong.indexOf(this.selectedVatDungPhong);
                    this.dsVatDungPhong.splice(index, 1);
                    this.dialogConfirmDeleteVatDungPhong = false;
                }
            },
            getDataFromApiVatDungPhong(searchParamsVatDungPhong: VatDungPhongApiSearchParams): void {
                this.searchParamsVatDungPhong.phongID = this.phong.PhongID;

                VatDungPhongApi.search(searchParamsVatDungPhong).then(res => {
                    this.dsVatDungPhong = res.Data;
                    this.searchParamsVatDungPhong.totalItems = res.Pagination.totalItems;
                    this.dsVatDungPhongLoading = false;
                });
            },
            suaVatDungPhong(item: any) {
                this.vatDungPhong = item;
                this.isUpdateVatDungPhong = true;

            },
            saveVatDungPhong(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        if (this.isUpdate) {
                            this.vatDungPhong.Phong = undefined;
                            this.loading = true;
                            if (this.isUpdateVatDungPhong) {
                                VatDungPhongApi.update(this.vatDungPhong.VatDungPhongID, this.vatDungPhong).then(res => {
                                    this.vatDungPhong = {} as VatDungPhong;
                                    this.loading = false;
                                    this.getDataFromApiVatDungPhong(this.searchParamsVatDungPhong);
                                    this.isUpdateVatDungPhong = false
                                })
                            }
                            else {
                                this.vatDungPhong.PhongID = this.phong.PhongID;
                                VatDungPhongApi.insert(this.vatDungPhong).then(res => {
                                    this.vatDungPhong = {} as VatDungPhong;
                                    this.loading = false;
                                    this.getDataFromApiVatDungPhong(this.searchParamsVatDungPhong);
                                })
                            }
                        }
                        else {
                            this.vatDungPhong.VatDungID = (this.vatDungPhong.VatDung as any).VatDungID;
                            (this.dsVatDungPhong).push(this.vatDungPhong);
                            this.vatDungPhong = {} as VatDungPhong;
                        }
                    }

                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.phong.LoaiPhong = undefined;
                        this.phong.ThuePhong = undefined;
                        this.phong.VatDungPhong = undefined;
                        if (this.isUpdate) {
                            PhongApi.update(this.phong.PhongID, this.phong).then(res => {
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
                            this.vatDungPhong.VatDung = undefined;
                            this.phong.VatDungPhong = this.dsVatDungPhong;
                            PhongApi.insert(this.phong).then(res => {
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.phong = res;
                                this.isUpdate = true;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            }); 2
                        }
                    }
                });
            },

            getDataVatDungFromApi(): void {
                this.loading = true;
                VatDungApi.search(this.searchParamsVatDung).then(response => {
                    this.dsVatDung = response.Data;
                    this.loading = false;
                })
            },
            getDataLoaiPhongFromApi(): void {
                this.loading = true;
                LoaiPhongApi.search(this.searchParamsLoaiPhong).then(response => {
                    this.dsLoaiPhong = response.Data;
                    this.loading = false;
                })
            },
        }
    });
</script>

