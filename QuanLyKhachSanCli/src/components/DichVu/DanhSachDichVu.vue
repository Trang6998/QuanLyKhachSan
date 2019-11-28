<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/dichvu" exact>DichVu</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsDichVu"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsDichVu"
                                :total-items="searchParamsDichVu.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.DichVuID }}</td>
                    <td>{{ props.item.TenDichVu }}</td>
                    <td>{{ props.item.MoTa }}</td>
                    <td>{{ props.item.GiaBan }}</td>
                    <td>{{ props.item.DonViTinh }}</td>
                    <td>{{ props.item.TrangThai ? "Yes" : "No" }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/dichvu/'+props.item.DichVuID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteDichVu" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import DichVuApi, { DichVuApiSearchParams } from '@/apiResources/DichVuApi';
    import { DichVu } from '@/models/DichVu';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsDichVu: [] as DichVu[],
                tableHeader: [
                    { text: 'DichVuID', value: 'DichVuID', align: 'center', sortable: true },
                    { text: 'TenDichVu', value: 'TenDichVu', align: 'center', sortable: true },
                    { text: 'MoTa', value: 'MoTa', align: 'center', sortable: true },
                    { text: 'GiaBan', value: 'GiaBan', align: 'center', sortable: true },
                    { text: 'DonViTinh', value: 'DonViTinh', align: 'center', sortable: true },
                    { text: 'TrangThai', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsDichVu: { includeEntities: true, rowsPerPage: 10 } as DichVuApiSearchParams,
                loadingTable: false,
                selectedDichVu: {} as DichVu,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsDichVu);
        },
        methods: {
            getDataFromApi(searchParamsDichVu: DichVuApiSearchParams): void {
                this.loadingTable = true;
                DichVuApi.search(searchParamsDichVu).then(res => {
                    this.dsDichVu = res.Data;
                    this.searchParamsDichVu.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(dichVu: DichVu): void {
                this.selectedDichVu = dichVu;
                this.dialogConfirmDelete = true;
            },
            deleteDichVu(): void {
                DichVuApi.delete(this.selectedDichVu.DichVuID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsDichVu);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

