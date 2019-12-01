<template>
    <v-layout style="width:fit-content">
        <v-img style="width:fit-content" src="https://images.pexels.com/photos/1395966/pexels-photo-1395966.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260">
            <v-layout row>
                <v-flex xs8></v-flex>
                <v-flex xs4 style="padding: 40px">
                    <v-card height="500" style="border: 1px;border-radius: 15px">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <h1 style="text-align: center"> Đặt Dịch Vụ</h1>
                            </v-flex>
                            <v-flex xs12 pl-5 pr-5>
                                <v-text-field v-model="datPhong.HoTen"
                                              label="Họ tên"
                                              :error-messages="errors.collect('Họ tên', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Họ tên"
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs12 pl-5 pr-5>
                                <v-text-field v-model="datPhong.SoDienThoai"
                                              label="Số điện thoại"
                                              :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số điện thoại"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12 pl-5 pr-5>
                                <v-datepicker
                                            v-model="datPhong.ThoiGianDat"
                                            label="Thời gian đặt"
                                            :error-messages="errors.collect('Thời Gian Đặt', 'frmAddEdit')"
                                            v-validate="'required'"
                                            data-vv-scope="frmAddEdit"
                                            data-vv-name="Thời Gian Đặt"
                                            clearable>
                                </v-datepicker>
                            </v-flex>

                            <v-flex xs12 pl-5 pr-5>
                                <v-text-field v-model="datPhong.SoLuongNguoi"
                                              label="Số lượng người"
                                              :error-messages="errors.collect('Số Lượng Người', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số Lượng Người"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12 pl-5 pr-5>
                                <v-autocomplete :items="dsDichVu"
                                                v-model="datPhong.DichVuID"
                                                item-text="TenDichVu"
                                                item-value="DichVuID"
                                                label="Dịch vụ"
                                                :error-messages="errors.collect('Dịch Vụ', 'frmAddEdit')"
                                                v-validate="'required'"
                                                data-vv-scope="frmAddEdit"
                                                data-vv-name="Dịch Vụ"
                                                clearable></v-autocomplete>
                            </v-flex>

                            <v-flex xs12 style="text-align: center">
                                <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">Đặt Dịch Vụ</v-btn>
                            </v-flex>

                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-img>
    </v-layout>


</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';

    import { DatDichVuApiSearchParams } from '@/apiResources/DatDichVuApi';
    import { DichVu } from '@/models/DichVu';
import DichVuApi from '@/apiResources/DichVuApi';

    export default Vue.extend({
        components: {
        },
        data() {
            return {

                tableHeader: [
                    { text: 'Họ Tên', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'Số Điện Thoại', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'Thời Gian Đặt', value: 'ThoiGianDat', align: 'center', sortable: true },
                    { text: 'Số Lượng Người', value: 'SoLuongNguoi', align: 'center', sortable: true },
                    { text: 'Số Ngày Đặt', value: 'SoNgayDat', align: 'center', sortable: true },

                ],
                searchParamsDichVu: { includeEntities: true, rowsPerPage: 10 } as DatDichVuApiSearchParams,
                loadingTable: false,
                DatPhong: [] as DatPhong[],
                datPhong: {} as DatPhong,
                dsDichVu: [] as DichVu[],
                loading: false
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi()
        },
        methods: {
            getDataFromApi(): void {
                DichVuApi.search(this.searchParamsDichVu).then(z => {
                    this.dsDichVu = z.Data;
                })
            },
            save(): void {

                this.$validator.validateAll('frmAddEdit').then((res) => {
                    if (res) {
                        this.datPhong.HoaDon = undefined;
                        this.datPhong.LoaiPhong = undefined;
                        this.datPhong.NhanVien = undefined;
                        this.datPhong.TrangThai = 1;
                        this.loading = true;
                        DatPhongApi.insert(this.datPhong).then(res => {
                            this.datPhong = {} as DatPhong;
                            this.loading = false;
                            this.$snotify.success('Đặt dịch vụ thành công!');
                        }).catch(res => {
                            this.loading = false;
                            this.$snotify.error('Đặt dịch vụ thất bại!');
                        });

                    }
                });

            },
        }
    });
</script>

