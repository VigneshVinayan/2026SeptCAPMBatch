const { uuid, exists,isdir,read} = cds.utils;
// const cds = require("@sap/cds-dk/lib/cds");
// const { DELETE } = require("@sap/cds/lib/ql/cqn");



module.exports = cds.service.impl(async function(){
    const { PurchaseOrderSrv,EmployeeSrv , BusinessPartnerSrv, AddressSrv, ProductionSrv, PurchaseItemSrv} = this.entities;

    // this.before('UPDATE', EmployeeSrv, async(request, response) => {
    //     const salaryAmount = request.data.salaryAmount;
    //     if(salaryAmount > 100000){
    //         request.error(500,'please get the approval from your manager');
    //     }
    // })

    // this.before('UPDATE',ProductionSrv,async(request, response) => {
    //     const productAmount = request.data.PRICE
    //     if(productAmount > 100000){
    //         request.error(500,"You are broke,bye!!!")
    //     }
    // })

    this.before(['CREATE', 'UPDATE'], PurchaseItemSrv, async (req) => {
        const { GROSS_AMOUNT, CURRENCY_code, PO_ITEM_POS } = req.data;
 
        if (
            (CURRENCY_code === 'USD' && GROSS_AMOUNT > 50000) ||
            (CURRENCY_code === 'EUR' && GROSS_AMOUNT > 10000)
        ) {
            req.reject(
                400,
                'Gross amount exceeds the allowed limit. Please contact your line manager and region head.'
            );
        }
 
        if (
            PO_ITEM_POS !== undefined &&
            PO_ITEM_POS !== null &&
            PO_ITEM_POS % 10 !== 0
        ) {
            req.reject(
                400,
                'Purchase item position must be a multiple of 10.'
            );
        }
    });
 
    this.before('UPDATE', AddressSrv, async (req) => {
        const { COUNTRY } = req.data;
 
        if (
            COUNTRY &&
            !['GB', 'US'].includes(COUNTRY.toUpperCase())
        ) {
            req.reject(
                400,
                'Country must be GB or US. Please contact your administrator.'
            );
        }
    });
 
    this.before('UPDATE', EmployeeSrv, async (req) => {
        const { phoneNumber } = req.data;
 
        if (
            phoneNumber &&
            !phoneNumber.startsWith('+1') &&
            !phoneNumber.startsWith('+44')
        ) {
            req.reject(
                400,
                'Mobile number must contain US (+1) or GB (+44) country code.'
            );
        }
    });
 
    this.before('UPDATE', BusinessPartnerSrv, async (req) => {
        const { COMPANY_NAME } = req.data;
 
        if (
            COMPANY_NAME &&
            !/^[a-zA-Z0-9 ]+$/.test(COMPANY_NAME)
        ) {
            req.reject(
                400,
                'Company name must not contain special characters.'
            );
        }
    });
 
 
    this.on('UPDATE',PurchaseItemSrv,async(req,res) => {
        const{PO_ITEM_POS} = req.data;
        if(PO_ITEM_POS % 10 !== 0){
            return req.error(400,"It should be in mutiple of 10")
        }
        return "updated"
    });
    this.on('createEmployee', async(request, response)=>{
        const empData = request.data;

        const objTransaction = cds.tx(request);

        let returnData = await objTransaction.run([
            INSERT.into(EmployeeSrv).entries(empData)
        ]).then((resolve, reject) => {
            if(typeof(resolve) !== undefined){
                return request.data
            }
            else{
                request.error(500, "Error in inserting data into the database")
            }
        }).catch(err => {
            request.error("There is an error : ", err.toString())
        })
        return returnData;
    })
    
    this.on('createBusinessPartner', async(request, response)=>{
        const businessPartnerData = request.data;

        const objTransaction = cds.tx(request);

        let returnData = await objTransaction.run([
            INSERT.into(BusinessPartnerSrv).entries(businessPartnerData)
        ]).then((resolve, reject) => {
            if(typeof(resolve) !== undefined){
                return request.data
            }
            else{
                request.error(500, "Error in inserting data into the database")
            }
        }).catch(err => {
            request.error("There is an error : ", err.toString())
        })
        return returnData;
    })
    this.on('createAddress' , async (req,res)=>{
        const AddressData = req.data;
        const objTransaction = cds.tx(req);
       
        let returnData = await objTransaction.run([
            INSERT.into(AddressSrv).entries(AddressData)
        ]).then( (resl) =>{
            if(typeof(resl) !== 'undefined') return req.data;
            else req.error( 500 , 'Error while inserting data' );
        } ).catch( err =>{
            req.error( 'There is an error' , err.toString());
        } )
       
        return returnData;
    })

    this.on('updateEmployee', async (request, response) => {
        const {
            ID,
            salaryAmount,
            Currency_code
        } = request.data;

        try{
            const objectTransaction = cds.tx(request);

            await objectTransaction.update(EmployeeSrv).with({
                salaryAmount: salaryAmount,
                Currency_code: Currency_code
            }).where({
                ID: ID
            })
            return "Successfully updated.";
        }
        catch(error){
            request.error("Error : ", error)
        }
    })
    this.on('deleteEmployee',async (request,response) => {
        const{
            ID
        } = request.data
        try{
            const result = await DELETE(EmployeeSrv).where({
                ID: ID
        })
        return "Succesfully deleted";
            
        }
        catch(error){
            request.error("Error : ", error);
        }
    })
    this.on('createProduct', async(request, response) => {
        const productData = request.data;
        try{
            await INSERT.into(ProductionSrv).entries(productData);
            return productData;
        }
        catch(err){
            return request.error(500,err.message);
        }
    })
    this.on('deleteProduct', async (req) => {

    const { NODE_KEY } = req.data;

    try {

        await DELETE.from(ProductionSrv).where({ NODE_KEY });

        return "Successfully deleted";

    } catch (err) {
        req.error(500, err.message);
    }

});
this.on('getHeighestPricedProduct', async (request, response) => {

    try {

        // Step - 1 : Create an object for the transaction

        const transaction = cds.tx(request);


        // Step - 2 : Get highest priced product

        const response = await transaction.read(ProductSrv).orderBy({

            PRICE: 'desc'

        }).limit(1);


        // Step - 3 : Display the highest priced product

        return response;


    } catch (error) {

        request.error("Error : ", error);

    }

})
this.on('discountPrice', async(request, response) => {
    try {
        // Step-1 : Get the parameter form the entity
        const ID = request.params[0];

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-3 : Update the purchase order service
        await transaction.update(PurchaseOrderSrv).with({
            GROSS_AMOUNT : {
                '-=' : 1000
            },
            NET_AMOUNT : {
                '-=' : 800
            },
            TAX_AMOUNT : {
                '-=' : 200
            }
        }).where(ID)


        const updatePOInfo = await transaction.read(PurchaseOrderSrv);

        return updatePOInfo;
    } catch (error) {
        return "Error : " + error.toString();
    }
})
this.on('largestOrder', async(request, response) => {
    try {

        // Step-2 : Creating object for transaction service using request
        const transaction = cds.tx(request);

        const reply = await transaction.read(PurchaseOrderSrv).orderBy({
            GROSS_AMOUNT : 'desc'
        }).limit(5);

        return reply;
    } catch (error) {
        return "Error : " + error.toString();
    }
})

this.on('increasePrice', async (req) => {
    try {

        const product = req.params[0];

        const tx = cds.tx(req);

        const currentProduct = await tx.read(ProductionSrv)
            .where({ NODE_KEY: product.NODE_KEY });

        if (!currentProduct.length) {
            return req.error(404, "Product not found");
        }

        const currentPrice = currentProduct[0].PRICE;

        const increasedPrice = currentPrice * 1.10;

        await tx.update(ProductionSrv)
            .set({
                PRICE: increasedPrice
            })
            .where({
                NODE_KEY: product.NODE_KEY
            });

        return await tx.read(ProductionSrv)
            .where({
                NODE_KEY: product.NODE_KEY
            });

    } catch (error) {
        req.error(500, error.message);
    }
});

this.on('top20Products', async (req) => {
    try {

        const tx = cds.tx(req);

        const products = await tx.read(ProductionSrv)
            .orderBy({
                PRICE: 'desc'
            })
            .limit(20);

        return products;

    } catch (error) {
        req.error(500, error.message);
    }
});

this.on('increaseSalary', EmployeeSrv, async (req) => {
    try {

        const employee = req.params[0];

        const tx = cds.tx(req);

        const empData = await tx.read(EmployeeSrv)
            .where({ ID: employee.ID });

        if (!empData.length) {
            return req.reject(404, 'Employee not found');
        }

        const newSalary = empData[0].salaryAmount * 1.15;

        await tx.update(EmployeeSrv)
            .set({
                salaryAmount: newSalary
            })
            .where({
                ID: employee.ID
            });

        return await tx.read(EmployeeSrv)
            .where({
                ID: employee.ID
            });

    } catch (error) {
        req.reject(500, error.message);
    }
});

this.on('top20HighestPaidEmployees', async (req) => {
    try {

        const tx = cds.tx(req);

        const employees = await tx.read(EmployeeSrv)
            .orderBy({
                salaryAmount: 'desc'
            })
            .limit(20);

        return employees;

    } catch (error) {
        req.reject(500, error.message);
    }
});

this.on('getUtilities' , async(request,response) => {

    let vUUID = uuid(), vPackageContent = null, vInput = "%E%A4%A", uri, dirExists = false, isFileExists = false;
    
    if (exists('srv/request.http')){
        isFileExists = true;
    }

    if(isdir('app')){
        dirExists = true;
    }

    try {
        uri = decodeURI(input);

        await mkdirp('srv/lib');
    } catch {
        uri = vInput;
    }
    vPackageContent = await read('package.json');

    var finalValue = {
        uuid : vUUID,
        uri : uri,
        isFileExists : isFileExists,
        dirExists : dirExists,
        packageInfo : vPackageContent
    }

    return finalValue;
})

        
})





