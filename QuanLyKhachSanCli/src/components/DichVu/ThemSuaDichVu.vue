<template>
    <v-dialog v-model="dialog" width="500" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="height: 60px">
                        <v-flex xs4></v-flex>
                        <v-flex xs4>
                            <h3>{{isUpdate ? 'CẬP NHẬT DỊCH VỤ' : 'THÊM MỚI DỊCH VỤ'}}</h3>
                        </v-flex>
                        <v-flex xs4>
                            <div class="text-xs-right">
                                <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                            </div>
                        </v-flex>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="dichVu.TenDichVu"
                                              label="Tên Dịch Vụ"
                                              type="text"
                                              :error-messages="errors.collect('TenDichVu', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="TenDichVu"
                                              hide-details
                                              clearable></v-text-field>
                                <v-spacer></v-spacer>
                            </v-flex>



                            <v-flex xs12>
                                <v-text-field v-model="dichVu.GiaBan"
                                              label="Giá Bán"
                                              type="number"
                                              :error-messages="errors.collect('GiaBan', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="GiaBan"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                           

                            <v-flex xs12>
                                <v-text-field v-model="dichVu.DonViTinh"
                                              label="Đơn Vị Tính"
                                              type="text"
                                              :error-messages="errors.collect('DonViTinh', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="DonViTinh"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12>
                                <v-text-field v-model="dichVu.MoTa"
                                              label="Mô Tả"
                                              type="text"
                                              :error-messages="errors.collect('MoTa', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="MoTa"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12>
                                <v-checkbox v-model="dichVu.TrangThai" label="Trạng Thái"
                                            :error-messages="errors.collect('TrangThai', 'frmAddEdit')"
                                            v-validate="''"
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="TrangThai"></v-checkbox>
                            </v-flex>
                            <!--<v-flex xs12>
        <vue-ckeditor class="mt-1" v-model="dichVu.MoTa" />
    </v-flex>-->
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                        <v-btn class="primary " :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>

</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DichVuApi, { DichVuApiSearchParams } from '@/apiResources/DichVuApi';
    import { DichVu } from '@/models/DichVu';
    import { DatDichVu } from '@/models/DatDichVu';
    import DatDichVuApi, { DatDichVuApiSearchParams } from '@/apiResources/DatDichVuApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                dichVu: {} as DichVu,
                dsDatDichVu: [] as DatDichVu[],
                dsDatDichVuLoading: false,
                searchDatDichVu: '',
                searchParamsDatDichVu: { includeEntities: true } as DatDichVuApiSearchParams,
                tableHeaderDatDichVu: [
                    { text: 'DatDichVuID', value: 'DatDichVuID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'DichVuID', value: 'DichVuID', align: 'center', sortable: true },
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsDichVu: {} as DichVuApiSearchParams,
            }
        },
        watch: {
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.dichVu = item;
            },
            getDataFromApi(id: number): void {
                DichVuApi.detail(id).then(res => {
                    this.dichVu = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.dichVu.DatDichVu = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            DichVuApi.update(this.dichVu.DichVuID, this.dichVu).then(res => {
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
                            DichVuApi.insert(this.dichVu).then(res => {
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.dichVu = res;
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
            }
        }
    });
</script>

