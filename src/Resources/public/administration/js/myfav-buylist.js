(function(){var t={559:function(){},808:function(){},627:function(){},359:function(t,e,r){var n=r(559);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),r(346).Z("54e925d4",n,!0,{})},2:function(t,e,r){var n=r(808);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),r(346).Z("11a13f5b",n,!0,{})},121:function(t,e,r){var n=r(627);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),r(346).Z("0fb99fa9",n,!0,{})},346:function(t,e,r){"use strict";function n(t,e){for(var r=[],n={},s=0;s<e.length;s++){var i=e[s],o=i[0],l={id:t+":"+s,css:i[1],media:i[2],sourceMap:i[3]};n[o]?n[o].parts.push(l):r.push(n[o]={id:o,parts:[l]})}return r}r.d(e,{Z:function(){return y}});var s="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!s)throw Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},o=s&&(document.head||document.getElementsByTagName("head")[0]),l=null,a=0,u=!1,d=function(){},c=null,p="data-vue-ssr-id",m="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function y(t,e,r,s){u=r,c=s||{};var o=n(t,e);return f(o),function(e){for(var r=[],s=0;s<o.length;s++){var l=i[o[s].id];l.refs--,r.push(l)}e?f(o=n(t,e)):o=[];for(var s=0;s<r.length;s++){var l=r[s];if(0===l.refs){for(var a=0;a<l.parts.length;a++)l.parts[a]();delete i[l.id]}}}}function f(t){for(var e=0;e<t.length;e++){var r=t[e],n=i[r.id];if(n){n.refs++;for(var s=0;s<n.parts.length;s++)n.parts[s](r.parts[s]);for(;s<r.parts.length;s++)n.parts.push(h(r.parts[s]));n.parts.length>r.parts.length&&(n.parts.length=r.parts.length)}else{for(var o=[],s=0;s<r.parts.length;s++)o.push(h(r.parts[s]));i[r.id]={id:r.id,refs:1,parts:o}}}}function v(){var t=document.createElement("style");return t.type="text/css",o.appendChild(t),t}function h(t){var e,r,n=document.querySelector("style["+p+'~="'+t.id+'"]');if(n){if(u)return d;n.parentNode.removeChild(n)}if(m){var s=a++;e=b.bind(null,n=l||(l=v()),s,!1),r=b.bind(null,n,s,!0)}else e=w.bind(null,n=v()),r=function(){n.parentNode.removeChild(n)};return e(t),function(n){n?(n.css!==t.css||n.media!==t.media||n.sourceMap!==t.sourceMap)&&e(t=n):r()}}var g=function(){var t=[];return function(e,r){return t[e]=r,t.filter(Boolean).join("\n")}}();function b(t,e,r,n){var s=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=g(e,s);else{var i=document.createTextNode(s),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(i,o[e]):t.appendChild(i)}}function w(t,e){var r=e.css,n=e.media,s=e.sourceMap;if(n&&t.setAttribute("media",n),c.ssrId&&t.setAttribute(p,e.id),s&&(r+="\n/*# sourceURL="+s.sources[0]+" */\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}}},e={};function r(n){var s=e[n];if(void 0!==s)return s.exports;var i=e[n]={id:n,exports:{}};return t[n](i,i.exports,r),i.exports}r.d=function(t,e){for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="bundles/myfavbuylist/",window?.__sw__?.assetPath&&(r.p=window.__sw__.assetPath+"/bundles/myfavbuylist/"),function(){"use strict";r(359);let{Component:t,Mixin:e}=Shopware;Shopware.Component.register("sw-cms-el-myfav-buylist",{template:"{% block myfav_buylist_cms_element %}\r\n    <div class=\"myfav-buylist-cms-el\">\r\n        <h2>{{ $tc('myfav-buylist.elements.component.elementHeadline') }}</h2>\r\n        <sw-alert variant=\"info\">\r\n            {{ $tc('myfav-buylist.elements.component.infoText') }}\r\n        </sw-alert>\r\n    </div>\r\n{% endblock %}\r\n",mixins:[e.getByName("cms-element")],created(){this.createdComponent()},methods:{createdComponent(){this.initElementConfig("myfav-buylist")}}}),r(2);let{Component:n,Mixin:s}=Shopware,{EntityCollection:i,Criteria:o}=Shopware.Data;n.register("sw-cms-el-config-myfav-buylist",{template:"{% block sw_cms_element_myfav_buylist_config %}\r\n    <div>Keine konfigurierbaren Felder</div>\r\n{% endblock %}\r\n",inject:["repositoryFactory","feature"],mixins:[s.getByName("cms-element")],data(){return{}},created(){this.createdComponent()},methods:{createdComponent(){this.initElementConfig("myfav-buylist")}}}),r(121),Shopware.Component.register("sw-cms-el-preview-myfav-buylist",{template:'{% block sw_cms_element_myfav_blog_preview %}\r\n    <div class="sw-cms-el-preview-myfav-buylist">\r\n        <p>Blog Listing</p>\r\n        <hr>\r\n        <div class="sw-cms-el-category-placeholder-listing">\r\n            <div class="sw-cms-el-category-navigation__placeholder"></div>\r\n            <hr>\r\n            <div class="sw-cms-el-category-navigation__placeholder"></div>\r\n            <div class="sw-cms-el-category-navigation__placeholder--subcategory"></div>\r\n            <div class="sw-cms-el-category-navigation__placeholder--subcategory"></div>\r\n        </div>\r\n    </div>\r\n{% endblock %}\r\n'}),new Shopware.Data.Criteria(1,25).addAssociation("cover"),Shopware.Service("cmsService").registerCmsElement({name:"myfav-buylist",label:"Myfav Buylist",component:"sw-cms-el-myfav-buylist",configComponent:"sw-cms-el-config-myfav-buylist",previewComponent:"sw-cms-el-preview-myfav-buylist",defaultConfig:{}}),Shopware.Component.override("sw-order-line-items-grid",{template:'\r\n{% block sw_order_line_items_grid_column_payload_options_link %}\r\n<router-link\r\n    v-if="item.payload && item.payload.options"\r\n    class="sw-order-line-items-grid__item-payload-options"\r\n    :title="$tc(\'sw-order.detailBase.contextMenuShowProduct\')"\r\n    :to="{ name: \'sw.product.detail\', params: { id: item.productId } }"\r\n>\r\n    <sw-product-variant-info :variations="item.payload.options">\r\n        <div class="sw-order-line-items-grid__item-label">\r\n            {{ item.label }}\r\n        </div>\r\n    </sw-product-variant-info>\r\n    <span class="info" v-if="item.payload.childNames"><b>Gew\xe4hlte Optionen:</b> {{ item.payload.childNames }}</span>\r\n</router-link>\r\n{% endblock %}\r\n\r\n\r\n{% block sw_order_line_items_grid_column_payload_options_linkless %}\r\n<div\r\n    v-else\r\n    class="sw-order-line-items-grid__item-payload-options"\r\n>\r\n    <span class="sw-order-line-items-grid__item-label">\r\n        {{ item.label }} \r\n    </span>\r\n    <span class="info" v-if="item.payload.childNames"><b>Gew\xe4hlte Optionen:</b> {{ item.payload.childNames }}</span>\r\n</div>\r\n{% endblock %}'});let{Component:l,Mixin:a,Context:u,Application:d,Service:c}=Shopware,{Criteria:p,EntityCollection:m}=Shopware.Data;l.override("sw-product-detail-specifications",{template:'{% block sw_product_detail_specifications_custom_products %}\r\n    {{ parent }}\r\n\r\n    <sw-card\r\n        class="sw-product-detail-specification__myfav-buylist"\r\n        position-identifier="sw-product-detail-specifications-myfav-buylist"\r\n        :title="$tc(\'myfav-buylist.product-detail.title\')"\r\n    >\r\n        <div class="sw-container" style="grid-template-columns: 2fr 1fr; gap: 0px 30px; place-items: stretch;">\r\n            <div class="sw-inherit-wrapper">\r\n                <sw-entity-single-select\r\n                    v-model:value="myfavBuylistCurrentSelectedProduct"\r\n                    entity="product"\r\n                    :label="$tc(\'myfav-buylist.product-detail.addProductLabel\')"\r\n                ></sw-entity-single-select>\r\n            </div>\r\n            <div class="sw-inherit-wrapper" style="align-content: center;">\r\n                <sw-button @click="onAddProductButtonClicked">{{ $tc(\'myfav-buylist.product-detail.buttonAdd\') }}</sw-button>\r\n            </div>\r\n        </div>\r\n\r\n        <b>Aktuell ausgew\xe4hlte Artikel:</b><br />\r\n        <div v-for="(tmpProd, tmpIndex) in myfavCurrentBuylistProducts" style="margin-top: 12px;">\r\n            <div>\r\n                <span>{{ tmpProd.productNumber }}</span>\r\n                <span v-if="tmpProd.name != \'\'"> | {{ tmpProd.name }}</span>\r\n                <span v-if="tmpProd.options != \'\'">({{ tmpProd.options }})</span>\r\n                <span class="removeGroup"><sw-icon style="color: red; cursor: pointer;" name="regular-times-xxs" size="12" @click="onRemoveGroup(tmpProd.productNumber)" /></span>\r\n            </div>\r\n        </div>\r\n    </sw-card>\r\n{% endblock %}',mounted(){console.log("mounted"),this.updateMyfavCurrentBuylistView()},data(){return{myfavBuylistCurrentSelectedProduct:null,myfavBuylistProductRepository:null,myfavCurrentBuylistProducts:[]}},watch:{product:{handler(t,e){this.updateMyfavCurrentBuylistView()},deep:!0}},methods:{updateMyfavCurrentBuylistView(){if(void 0===this.product||null===this.product||void 0===this.product.customFields)return;let t=this.product.customFields["migration_diskuss-keller_product_groupelements"];if(null===t)return;let e=t.split("|"),r=[];for(let t=0,n=e.length;t<n;t++)e[t].length>0&&r.push(e[t]);let n=[];for(let t=0,e=r.length;t<e;t++){let e=!1,s=r[t];for(let t=0,r=this.myfavCurrentBuylistProducts.length;t<r;t++)if(this.myfavCurrentBuylistProducts[t].productNumber===s){e=!0;break}e||n.push(s)}let s=[];for(let t=0,e=this.myfavCurrentBuylistProducts.length;t<e;t++){let e=!1,n=this.myfavCurrentBuylistProducts[t];for(let t=0,s=r.length;t<s;t++){let s=r[t];if(n.productNumber===s){e=!0;break}}e&&s.push(n)}this.myfavCurrentBuylistProducts=s,this.loadBuylistProducts(n)},onAddProductButtonClicked(){let t=this.myfavBuylistCurrentSelectedProduct;null!==t&&(null===this.myfavBuylistProductRepository&&(this.myfavBuylistProductRepository=this.repositoryFactory.create("product",null)),this.myfavBuylistProductRepository.get(t,Shopware.Context.api).then(t=>{let e=t.productNumber,r=this.product.customFields["migration_diskuss-keller_product_groupelements"],n=null;n=null===r?[]:r.split("|");for(let t=0,r=n.length;t<r;t++)if(n[t]===e)return;n.push(e);let s=[];for(let t=0,e=n.length;t<e;t++)n[t].length>0&&s.push(n[t]);this.product.customFields["migration_diskuss-keller_product_groupelements"]=s.join("|")}))},onRemoveGroup(t){let e=[],r=this.product.customFields["migration_diskuss-keller_product_groupelements"],n=null;n=null===r?[]:r.split("|");for(let r=0,s=n.length;r<s;r++)n[r]!==t&&e.push(n[r]);this.product.customFields["migration_diskuss-keller_product_groupelements"]=e.join("|")},loadBuylistProducts(t){let e=[];for(let r=0,n=t.length;r<n;r++){let n=!1,s=t[r];for(let t=0,e=this.myfavCurrentBuylistProducts.length;t<e;t++)this.myfavCurrentBuylistProducts.productNumber===s&&(n=!0);n||(this.updateBuylistProduct(s,"",""),e.push(s))}if(0===e.length)return;null===this.myfavBuylistProductRepository&&(this.myfavBuylistProductRepository=this.repositoryFactory.create("product",null));let r=new p;r.setPage(1),r.setLimit(500);let n=[];for(let t=0,r=e.length;t<r;t++)n.push(p.equals("product.productNumber",e[t]));r.addFilter(p.multi("or",n)),r.addAssociation("options"),this.myfavBuylistProductRepository.search(r,Shopware.Context.api).then(t=>{let e=[];for(let r=0,n=t.length;r<n;r++){let n=t[r],s=n.productNumber;this.updateMyfavCurrentBuylistParentId(s,n.parentId);let i="";for(let t=0,e=n.options.length;t<e;t++)i.length>0&&(i+="; "),i+=n.options[t].name;this.updateMyfavCurrentBuylistOptionText(s,i),null===n.name&&null!==n.parentId?e.push({parentId:n.parentId,productNumber:s}):null===n.name?this.updateMyfavCurrentBuylistNameText(s,"Name nicht gefunden"):this.updateMyfavCurrentBuylistNameText(s,n.name)}let r=new p;r.setPage(1),r.setLimit(500);let n=[];console.log("notFoundNames: ",e),console.log("myfavCurrentBuylistProducts",this.myfavCurrentBuylistProducts);for(let t=0,r=e.length;t<r;t++)n.push(p.equals("product.id",e[t].parentId));r.addFilter(p.multi("or",n)),this.myfavBuylistProductRepository.search(r,Shopware.Context.api).then(t=>{console.log("entity: ",t);for(let e=0,r=t.length;e<r;e++)this.updateMyfavCurrentBuylistNameTextByParentId(t[e].id,t[e].name)})})},updateMyfavCurrentBuylistNameTextByParentId(t,e){for(let r=0,n=this.myfavCurrentBuylistProducts.length;r<n;r++)if(this.myfavCurrentBuylistProducts[r].parentId===t){this.myfavCurrentBuylistProducts[r].name=e;break}this.myfavCurrentBuylistProducts.sort(this.compare)},updateMyfavCurrentBuylistParentId(t,e){for(let r=0,n=this.myfavCurrentBuylistProducts.length;r<n;r++)if(this.myfavCurrentBuylistProducts[r].productNumber===t){this.myfavCurrentBuylistProducts[r].parentId=e;break}},updateMyfavCurrentBuylistOptionText(t,e){for(let r=0,n=this.myfavCurrentBuylistProducts.length;r<n;r++)if(this.myfavCurrentBuylistProducts[r].productNumber===t){this.myfavCurrentBuylistProducts[r].options=e;break}},updateMyfavCurrentBuylistNameText(t,e){for(let r=0,n=this.myfavCurrentBuylistProducts.length;r<n;r++)if(this.myfavCurrentBuylistProducts[r].productNumber===t){this.myfavCurrentBuylistProducts[r].name=e;break}this.myfavCurrentBuylistProducts.sort(this.compare)},updateBuylistProduct(t,e,r){this.myfavCurrentBuylistProducts.push({parentId:null,productNumber:t,name:e,option:r})},compare(t,e){return t.name<e.name?-1:t.name>e.name?1:0}}})}()})();