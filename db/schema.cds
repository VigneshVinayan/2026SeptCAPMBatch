// namespace poapplication;

// using { poapplication.common as c } from './common';
// using { managed, temporal } from '@sap/cds/common';


// entity Students : c.address, c.fee, managed, temporal{
//     key studentId : Integer;
//     studentName : c.namestr;
//     fatherName : c.namestr;
//     motherName : c.namestr;
//     contactNo : c.PhoneNumber;
//     gender : c.gender;
//     //Managed Association
//     class : Association to one Classes;
//     //Unmanaged Association
//     bookId : Association to many Libraries on bookId.parent = $self;
//     email : c.Email;
    
// }

// entity Classes : managed, temporal{
//     key classId : Integer;
//     classNAme : String(50);
//     teacherName : String(20);

// }
// entity Libraries{
//     key bookId : Integer;
//     parent : Association to Students;
//     bookName : c.namestr;
//     bookPrice : Integer;
//     bookAuthor : c.namestr;
//     dateOfIssue : DateTime;
//     dateOfReturn : DateTime;
//     stock : Integer;
//     status : c.status;
//     // studentId : Association to one Students;
// }
// entity Marks{
//     studentId : Association to one Students;
//     marks: Integer;
//     subject : c.namestr;
//     totalMarks : Integer;

// }


// // entity Employees{
// //     key empId : Integer;
// //     empName : String(50);
// //     empSalary : String(20);
// //     dept : String(50);
// //     currencyCode : String(50);
// //     city : String(50);
// //     country : String(50);
// //     division : Association to one Divisions;
// // }
// // entity Divisions{
// //     key divisionId : Integer;
// //     divisionName : String(50);
// //     divisionCity : String(50);
// //     country : String(20);
// // }