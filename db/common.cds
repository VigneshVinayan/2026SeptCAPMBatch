namespace poapplication.common;

// using { Country, Currency } from '@sap/cds/common';


// type namestr : String(50);

// aspect address {
//     drno : String(20);
//     street : String(50);
//     landmark : String(50);
//     city : String(100);
//     postal : Integer;
//     state : String(100);
//     country : Country;
//     region : String(20);
// }
// type gender : String(50) enum{
//     x = 'male';
//     y = 'female';
//     u = 'undefined'
// }
// type PhoneNumber : String(20) @assert.format : '^(?:(?:\+|00)?91[\-\s]?)?[6-9]\d{9}$';

// type Email : String(50) @assert.format : '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

// type status : String(20) enum{
//     s = 'submitted';
//     a = 'approved';
//     i = 'issued';
//     r = 'rejected'
// }

// type amount : Decimal(10, 2)@(
//     Semantic.amount.currencyCode : 'CURRENCY_CODE',
//     sap.unit : 'CURRENCY_CODE'
// );

// aspect fee{
//     fee : amount;
//     grossfee : amount;
//     taxfee : amount;
//     totalfee : amount;
//     currency : Currency;
// }

using { Currency } from '@sap/cds/common';

type Guid : UUID;
type PhoneNumber : String(50);
type Email : String(255);
type Role : String(2);
type String32 : String(32);
type String64 : String(64);
type String255 : String(255);

type Gender : String(1) enum {
    male = 'M';
    female = 'F';
    undisclosed = 'D';
}

type AmountT : Decimal(10, 2) @(
    Semantic.amount.CurrencyCode : 'CURRENCY_CODE',
    sap.unit : 'CURRENCY_CODE'
);

aspect Amount{
    GROSS_AMOUNT : AmountT;
    NET_AMOUNT : AmountT;
    TAX_AMOUNT : AmountT;
    CURRENCY : Currency;
}

aspect Address { 
    STREET : String255;
    POSTAL_CODE : String(12);
    CITY : String255;
    COUNTRY : String255;
    BUILDING : String255;
}


