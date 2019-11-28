<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/kiemke" exact>KiemKe</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsKiemKe"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsKiemKe"
                                :total-items="searchParamsKiemKe.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.KiemKeID }}</td>
                            <td>{{ props.item.NgayKiemKe === null ? "" : props.item.NgayKiemKe|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                            <td>{{ props.item.NhanVien.NhanVienID }}</td>
                    <td>{{ props.item.GhiChu }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/kiemke/'+props.item.KiemKeID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deleteKiemKe" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KiemKeApi, { KiemKeApiSearchParams } from '@/apiResources/KiemKeApi';
    import { KiemKe } from '@/models/KiemKe';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsKiemKe: [] as KiemKe[],
                tableHeader: [
                    { text: 'KiemKeID', value: 'KiemKeID', align: 'center', sortable: true },
                    { text: 'NgayKiemKe', value: 'NgayKiemKe', align: 'center', sortable: true },
                    { text: 'NhanVienID', value: 'NhanVien.NhanVienID', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsKiemKe: { includeEntities: true, rowsPerPage: 10 } as KiemKeApiSearchParams,
                loadingTable: false,
                selectedKiemKe: {} as KiemKe,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsKiemKe);
        },
        methods: {
            getDataFromApi(searchParamsKiemKe: KiemKeApiSearchParams): void {
                this.loadingTable = true;
                KiemKeApi.search(searchParamsKiemKe).then(res => {
                    this.dsKiemKe = res.Data;
                    this.searchParamsKiemKe.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(kiemKe: KiemKe): void {
                this.selectedKiemKe = kiemKe;
                this.dialogConfirmDelete = true;
            },
            deleteKiemKe(): void {
                KiemKeApi.delete(this.selectedKiemKe.KiemKeID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsKiemKe);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

