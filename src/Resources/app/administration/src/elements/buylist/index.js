import './component';
import './config';
import './preview';

const Criteria = Shopware.Data.Criteria;
const criteria = new Criteria(1, 25);
criteria.addAssociation('cover');

Shopware.Service('cmsService').registerCmsElement({
    name: 'myfav-buylist',
    label: 'Myfav Buylist',
    component: 'sw-cms-el-myfav-buylist',
    configComponent: 'sw-cms-el-config-myfav-buylist',
    previewComponent: 'sw-cms-el-preview-myfav-buylist',
    defaultConfig: {
    }
});