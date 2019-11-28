<!--<template>
    <v-app>
        <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped"
                             v-model="drawer" enable-resize-watcher fixed app>
            <v-list>
                <v-list-tile value="true" v-for="(item, i) in items" :key="i" :to="item.link">
                    <v-list-tile-action>
                        <v-icon v-html="item.icon"></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar app
                   :clipped-left="clipped">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
            <v-btn icon @click.stop="clipped = !clipped">
                <v-icon>web</v-icon>
            </v-btn>
            <v-btn icon @click.stop="fixed = !fixed">
                <v-icon>remove</v-icon>
            </v-btn>
            <v-toolbar-title v-text="title"></v-toolbar-title>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height grid-list-xs style="padding:10px;">
                <v-layout justify-center>
                    <router-view></router-view>
                </v-layout>
                <vue-snotify></vue-snotify>
            </v-container>
        </v-content>
        <v-footer :fixed="fixed" app>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>-->
<template>
    <v-app>
        <left-side-bar></left-side-bar>
        <v-toolbar style="background: #e46c0a;" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed>
            <v-toolbar-title style="width: 100%" class="ml-0 pl-3">
                <v-toolbar-side-icon></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">Quản lý khách sạn</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <v-btn icon large slot="activator" dark>
                    <v-avatar size="42px">
                        <img src="https://community.smartsheet.com/sites/default/files/default_user.jpg" />
                    </v-avatar>
                </v-btn>
                <v-list>
                    <v-list-tile to="">
                        <v-list-tile-title>
                            Thông tin tài kho?n
                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>
                            ??i m?t kh?u
                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile>
                        <v-list-tile-title>
                            ??ng xu?t
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height grid-list-md>
                <v-layout justify-center>
                    <router-view></router-view>
                </v-layout>
                <vue-snotify></vue-snotify>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import "vue-snotify/styles/material.css";
    import "vue-snotify/styles/material.css";
    import { Vue } from 'vue-property-decorator';
    import LeftSideBar from '@/components/Layout/LeftSideBar.vue';
    export default Vue.extend({
        name: 'App',
        components: { LeftSideBar },
        data() {
            return {
                clipped: false,
                drawer: true,
                fixed: true,
                items: [
                    {
                        icon: 'list',
                        title: 'BangGia',
                        link: '/banggia',
                    },
                    {
                        icon: 'list',
                        title: 'BoPhan',
                        link: '/bophan',
                    },
                    {
                        icon: 'list',
                        title: 'ChiTietKiemKe',
                        link: '/chitietkiemke',
                    },
                    {
                        icon: 'list',
                        title: 'ChiTietPhieuNhap',
                        link: '/chitietphieunhap',
                    },
                    {
                        icon: 'list',
                        title: 'DatDichVu',
                        link: '/datdichvu',
                    },
                    {
                        icon: 'list',
                        title: 'DatPhong',
                        link: '/datphong',
                    },
                    {
                        icon: 'list',
                        title: 'DichVu',
                        link: '/dichvu',
                    },
                    {
                        icon: 'list',
                        title: 'HoaDon',
                        link: '/hoadon',
                    },
                    {
                        icon: 'list',
                        title: 'KiemKe',
                        link: '/kiemke',
                    },
                    {
                        icon: 'list',
                        title: 'KhachHang',
                        link: '/khachhang',
                    },
                    {
                        icon: 'list',
                        title: 'LoaiPhong',
                        link: '/loaiphong',
                    },
                    {
                        icon: 'list',
                        title: 'NhanVien',
                        link: '/nhanvien',
                    },
                    {
                        icon: 'list',
                        title: 'PhieuNhapKho',
                        link: '/phieunhapkho',
                    },
                    {
                        icon: 'list',
                        title: 'Phong',
                        link: '/phong',
                    },
                    {
                        icon: 'list',
                        title: 'sysdiagrams',
                        link: '/sysdiagrams',
                    },
                    {
                        icon: 'list',
                        title: 'ThuePhong',
                        link: '/thuephong',
                    },
                    {
                        icon: 'list',
                        title: 'VatDung',
                        link: '/vatdung',
                    },
                    {
                        icon: 'list',
                        title: 'VatDungPhong',
                        link: '/vatdungphong',
                    },
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Title'
            };
        },
        methods: {
            show() {
                this.$store.state.app.showLeftSideBar = !this.$store.state.app.showLeftSideBar
            },
        }
    });
</script>
<style>

    #ex5 .p1[data-count]:after {
        position: absolute;
        right: 61%;
        top: -15%;
        content: attr(data-count);
        font-size: 14px;
        padding: .2em;
        border-radius: 50%;
        line-height: 1em;
        color: white;
        background: rgba(255,0,0,.85);
        text-align: center;
        min-width: 1.5em;
    }

    .v-toolbar__content {
        padding-left: 0px
    }

    #appDrawer {
        overflow: hidden;
    }

        #appDrawer .v-list__tile__action, #appDrawer .v-list__group__header .v-list__group__header__prepend-icon {
            min-width: 35px;
        }

        #appDrawer .v-list__group__header .v-list__group__header__prepend-icon {
            padding-right: 0;
        }

        #appDrawer .v-list__group__items--no-action .v-list__tile {
            padding-left: 35px;
        }

    .drawer-menu--scroll {
        height: calc(100vh - 100px);
        overflow: auto;
    }

    #headermenu .v-text-field.v-text-field--solo .v-input__control {
        min-height: 35px;
    }
    /* #headermenu .v-toolbar__content {
        background-image: url('/static/img/banner1.png'); background-size: 100% 100%;
    } */
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>