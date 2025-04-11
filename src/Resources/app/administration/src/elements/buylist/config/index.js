import template from './myfav-buylist.html.twig';
import './myfav-buylist.scss';

const { Component, Mixin } = Shopware;
const { EntityCollection, Criteria } = Shopware.Data;

Component.register('sw-cms-el-config-myfav-buylist', {
    template,

    inject: ['repositoryFactory', 'feature'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    data() {
        return {
        };
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('myfav-buylist');
        },
    },
});
