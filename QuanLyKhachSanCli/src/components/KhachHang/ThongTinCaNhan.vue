<template>
    <v-card width="100%" heigh="100%" style="padding: 20px 40px 20px 40px">
        <v-layout row wrap>
            <v-flex xs6>
                <v-text-field v-model="khachHang.HoTen"
                              label="Họ tên"
                              type="text"
                              :error-messages="errors.collect('Họ tên', 'frmAddEdit')"
                              v-validate="'required | max: 50 | alpha'"
                              data-vv-scope="frmAddEdit"
                              data-vv-name="Họ tên"
                              hide-details
                              clearable></v-text-field>
            </v-flex>
            <v-flex xs6>
                <v-radio-group v-model="khachHang.GioiTinh" row>
                    <v-radio label="Nam" value="true"></v-radio>
                    <v-radio label="Nữ" value="false"></v-radio>
                </v-radio-group>
            </v-flex>
            <v-flex xs4>
                <v-text-field v-model="khachHang.NgaySinh"
                              label="Ngày sinh"
                              type="date"
                              :error-messages="errors.collect('Ngày sinh', 'frmAddEdit')"
                              v-validate="''"
                              data-vv-scope="frmAddEdit"
                              data-vv-name="Ngày sinh"
                              hide-details
                              clearable></v-text-field>
            </v-flex>
            <v-flex xs4>
                <v-text-field v-model="khachHang.SoDienThoai"
                              label="Số điện thoại"
                              type="text"
                              :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                              v-validate="''"
                              data-vv-scope="frmAddEdit"
                              data-vv-name="Số điện thoại"
                              hide-details
                              clearable></v-text-field>
            </v-flex>
            <v-flex xs4>
                <v-text-field v-model="khachHang.CMND"
                              label="CMND"
                              type="text"
                              :error-messages="errors.collect('CMND', 'frmAddEdit')"
                              v-validate="'required'"
                              data-vv-scope="frmAddEdit"
                              data-vv-name="CMND"
                              hide-details
                              clearable></v-text-field>
            </v-flex>

            <v-flex xs12>
                <v-text-field v-model="khachHang.DiaChi"
                              label="Địa chỉ"
                              type="text"
                              :error-messages="errors.collect('Địa chỉ', 'frmAddEdit')"
                              v-validate="''"
                              data-vv-scope="frmAddEdit"
                              data-vv-name="Địa chỉ"
                              hide-details
                              clearable></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout style="padding-bottom: 10px">
            <v-flex xs6>
                <v-btn color="primary" style="float:right" flat :loading="loggingIn" :disabled="loggingIn">Change Password</v-btn>
            </v-flex>
            <v-flex xs6>
                <v-btn color="primary" style="float:left" flat :loading="loggingIn" :disabled="loggingIn">Edit</v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import { KhachHang } from '@/models/KhachHang';
    export default Vue.extend({
        components: {

        },
        data() {
            return {
                loggingIn: false,
                khachHang: {} as KhachHang,
                gioiTinh: null as any,
            }
        },
    })
</script>
<style>
    .v-input--radio-group .v-radio:not(:last-child):not(:only-child) {
        margin-bottom: 0px!important;
    }
    .container {
        max-width: 100vw;
        padding: 10px;
    }
</style>
