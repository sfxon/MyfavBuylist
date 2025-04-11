import template from './sw-product-detail-specifications.html.twig';

const { Component, Mixin, Context, Application, Service } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;

// Order general info erweitern.
Component.override('sw-product-detail-specifications', {
    template,

    mounted() {
        // Hier kannst du Daten nachladen
        console.log('mounted');

        this.updateMyfavCurrentBuylistView(); 
    },

    data() {
        return {
            myfavBuylistCurrentSelectedProduct: null,
            myfavBuylistProductRepository: null,
            myfavCurrentBuylistProducts: [],
        };
    },

    watch: {
        product: {
            handler(newVal, oldVal) {
                    this.updateMyfavCurrentBuylistView();
            },
            deep: true,
        }
    },

    methods: {
        /**
         * updateMyfavCurrentBuylistView
         */
        updateMyfavCurrentBuylistView() {
            // Check if everything is setup.
            if(typeof this.product === 'undefined' || this.product === null) {
                return;
            }

            if(typeof (this.product.customFields) === 'undefined') {
                return;
            }

            // Get current buylist from custom field.
            let currentBuylist = this.product.customFields['migration_diskuss-keller_product_groupelements'];

            if(null === currentBuylist) {
                return;
            }

            let cb = currentBuylist.split('|');

            // Cleanup the array to remove empty texts.
            let finalCb = [];

            for(let i = 0, j = cb.length; i < j; i++) {
                if(cb[i].length > 0) {
                    finalCb.push(cb[i]);
                }
            }

            // Find new products not in buylist view.
            let productsNotInBuylistView = [];

            for(let i = 0, j = finalCb.length; i < j; i++) {
                let found = false;
                let currentProductNumber = finalCb[i];

                for(let k = 0, l = this.myfavCurrentBuylistProducts.length; k < l; k++) {
                    let bProd = this.myfavCurrentBuylistProducts[k];

                    if(bProd.productNumber === currentProductNumber) {
                        found = true;
                        break;
                    }
                }

                if(!found) {
                    productsNotInBuylistView.push(currentProductNumber);
                }
            }

            // Find products, that are not longer in the buylist.
            let newArray = [];

            for(let k = 0, l = this.myfavCurrentBuylistProducts.length; k < l; k++) {
                let found = false;
                let bProd = this.myfavCurrentBuylistProducts[k];

                for(let i = 0, j = finalCb.length; i < j; i++) {
                    let currentProductNumber = finalCb[i];

                    if(bProd.productNumber === currentProductNumber) {
                        found = true;
                        break;
                    }
                }

                if(found) {
                    newArray.push(bProd);
                }
            }

            this.myfavCurrentBuylistProducts = newArray;

            // Load the products, that do not have additional data yet.
            this.loadBuylistProducts(productsNotInBuylistView);
        },

        /**
         * onAddProductButtonClicked
         */
        onAddProductButtonClicked() {
            let pId = this.myfavBuylistCurrentSelectedProduct;

            if(pId === null) {
                return;
            }

            // Load the product with it's product number.
            if(this.myfavBuylistProductRepository === null) {
                this.myfavBuylistProductRepository = this.repositoryFactory.create('product', null);
            }

            this.myfavBuylistProductRepository
            .get(pId, Shopware.Context.api)
            .then(entity => {
                // Add it to the list, if it is not already in...
                let productNumber = entity.productNumber;
                let currentBuylist = this.product.customFields['migration_diskuss-keller_product_groupelements'];
                let cb = null;

                if(null === currentBuylist) {
                    cb = [];
                } else {
                    cb = currentBuylist.split('|');
                }

                // Check, if productNumber is already in the list.
                for(let i = 0, j = cb.length; i < j; i++) {
                    if(cb[i] === productNumber) {
                        return;
                    }
                }

                // Add new productNumber to list.
                cb.push(productNumber);

                // Now use only such entries, which have a value. This is a fix for manually broken entries...
                let finalCb = [];

                for(let i = 0, j = cb.length; i < j; i++) {
                    if(cb[i].length > 0) {
                        finalCb.push(cb[i]);
                    }
                }

                // this.loadBuylistProducts(finalCb);
                this.product.customFields['migration_diskuss-keller_product_groupelements'] = finalCb.join('|');
            });
        },

        /**
         * Wenn ein Eintrag entfernt werden soll.
         */
        onRemoveGroup(productNumber) {
            let newGroupArray = [];

            let currentBuylist = this.product.customFields['migration_diskuss-keller_product_groupelements'];
            let cb = null;

            if(null === currentBuylist) {
                cb = [];
            } else {
                cb = currentBuylist.split('|');
            }

            // Check, if productNumber is already in the list.
            for(let i = 0, j = cb.length; i < j; i++) {
                if(cb[i] !== productNumber) {
                    newGroupArray.push(cb[i]);
                }
            }

            // this.loadBuylistProducts(newGroupArray);
            this.product.customFields['migration_diskuss-keller_product_groupelements'] = newGroupArray.join('|');
        },

        /**
         * loadBuylistProducts
         */
        loadBuylistProducts(newGroupArray) {
            // Der Liste hinzufügen, auch wenn die Daten noch nicht nachgeladen sind -> damit es zu keinen Dopplungen kommen kann!
            let productsToLoad = [];
            
            for(let i = 0, j = newGroupArray.length; i < j; i++) {
                let found = false;
                let newProductNumber = newGroupArray[i];

                for(let k = 0, l = this.myfavCurrentBuylistProducts.length; k < l; k++) {
                    if(this.myfavCurrentBuylistProducts.productNumber === newProductNumber) {
                        found = true;
                    }
                }

                if(!found) {
                    this.updateBuylistProduct(newProductNumber, '', '');
                    productsToLoad.push(newProductNumber);
                }
            }

            if(productsToLoad.length === 0) {
                return;
            }


            // Try to load the additional names.
            if(this.myfavBuylistProductRepository === null) {
                this.myfavBuylistProductRepository = this.repositoryFactory.create('product', null);
            }
            
            const criteria = new Criteria();
            criteria.setPage(1);
            criteria.setLimit(500);

            const multiFilter = [];

            for(let i = 0, j = productsToLoad.length; i < j; i++) {
                multiFilter.push(Criteria.equals('product.productNumber', productsToLoad[i]));
            }

            criteria.addFilter(Criteria.multi('or', multiFilter));

            criteria.addAssociation('options');

            this.myfavBuylistProductRepository
            .search(criteria, Shopware.Context.api)
            .then(result => {
                let notFoundNames = [];

                for(let i = 0, j = result.length; i < j; i++) {
                    let product = result[i];
                    let productNumber = product.productNumber;

                    // Update parentId
                    this.updateMyfavCurrentBuylistParentId(productNumber, product.parentId);
                    
                    // Set options
                    let optionsString = '';

                    for(let m = 0, k = product.options.length; m < k; m++) {
                        if(optionsString.length > 0) {
                            optionsString += '; ';
                        }

                        optionsString += product.options[m].name;
                    }

                    this.updateMyfavCurrentBuylistOptionText(productNumber, optionsString);

                    // Set name
                    if(product.name === null && product.parentId !== null) {
                        notFoundNames.push({
                            parentId: product.parentId,
                            productNumber: productNumber
                        });
                    } else if(product.name === null) {
                        this.updateMyfavCurrentBuylistNameText(productNumber, 'Name nicht gefunden');
                    } else {
                        this.updateMyfavCurrentBuylistNameText(productNumber, product.name);
                    }
                }

                // Name für Artikel laden, bei denen Vererbung eingestellt ist.
                const criteria = new Criteria();
                criteria.setPage(1);
                criteria.setLimit(500);

                const multiFilter = [];

                console.log('notFoundNames: ', notFoundNames);
                console.log('myfavCurrentBuylistProducts', this.myfavCurrentBuylistProducts);

                for(let i = 0, j = notFoundNames.length; i < j; i++) {
                    multiFilter.push(Criteria.equals('product.id', notFoundNames[i].parentId));
                }

                criteria.addFilter(Criteria.multi('or', multiFilter));

                this.myfavBuylistProductRepository
                .search(criteria, Shopware.Context.api)
                .then(entities => {
                    console.log('entity: ', entities);

                    for(let i = 0, j = entities.length; i < j; i++) {
                        this.updateMyfavCurrentBuylistNameTextByParentId(entities[i].id, entities[i].name);
                    }
                });
            });
        },

        /**
         * update name by parentId
         */
        updateMyfavCurrentBuylistNameTextByParentId(parentId, name) {
            for(let i = 0, j = this.myfavCurrentBuylistProducts.length; i < j; i++) {
                if(this.myfavCurrentBuylistProducts[i].parentId === parentId) {
                    this.myfavCurrentBuylistProducts[i].name = name;
                    break;
                }
            }
            this.myfavCurrentBuylistProducts.sort( this.compare );
        },

        /**
         * ParentId in buylist setzen.
         */
        updateMyfavCurrentBuylistParentId(productNumber, parentId) {
            for(let i = 0, j = this.myfavCurrentBuylistProducts.length; i < j; i++) {
                if(this.myfavCurrentBuylistProducts[i].productNumber === productNumber) {
                    this.myfavCurrentBuylistProducts[i].parentId = parentId;
                    break;
                }
            }
        },

        /**
         * Options-Text
         */
        updateMyfavCurrentBuylistOptionText(productNumber, optionsString) {
            for(let i = 0, j = this.myfavCurrentBuylistProducts.length; i < j; i++) {
                if(this.myfavCurrentBuylistProducts[i].productNumber === productNumber) {
                    this.myfavCurrentBuylistProducts[i].options = optionsString;
                    break;
                }
            }
        },

        /**
         * updateMyfavCurrentBuylistNameText
         */
        updateMyfavCurrentBuylistNameText(productNumber, nameString) {
            for(let i = 0, j = this.myfavCurrentBuylistProducts.length; i < j; i++) {
                if(this.myfavCurrentBuylistProducts[i].productNumber === productNumber) {
                    this.myfavCurrentBuylistProducts[i].name = nameString;
                    break;
                }
            }
            this.myfavCurrentBuylistProducts.sort( this.compare );
        },

        /**
         * updateBuylistProduct
         */
        updateBuylistProduct(productNumber, nameString, optionsString) {
            this.myfavCurrentBuylistProducts.push({
                parentId: null,
                productNumber: productNumber,
                name: nameString,
                option: optionsString
            });
        },

        /**
         * compare
         * 
         * Used for sorting.
         */
        compare(a, b) {
            if ( a.name < b.name ){
              return -1;
            }
            if ( a.name > b.name ){
              return 1;
            }

            return 0;
        }
    }
});