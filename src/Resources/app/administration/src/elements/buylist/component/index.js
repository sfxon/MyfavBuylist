import template from './myfav-buylist.html.twig';
import './myfav-buylist.scss';

const { Component, Mixin } = Shopware;

Shopware.Component.register('sw-cms-el-myfav-buylist', {
    template,

    mixins: [
        Mixin.getByName('cms-element')
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('myfav-buylist');
        },
    }
});
