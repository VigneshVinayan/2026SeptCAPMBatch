namespace poapplication;

entity Albums {
    key ID          : Integer;
    title           : String(120);
    description     : String(255);
    view            : Integer;
    photos          : Association to many Photos on photos.album = $self;
}
 
entity Locations {
    key ID          : Integer;
    name            : String(200);
    shortName       : String(50);
    photos          : Association to many Photos on photos.location = $self;
}
 
entity Members {
    key ID          : Integer;
    name            : String(255);
    phoneNum        : String(20);
    email           : String(200);
    address         : String(255);
    photos          : Association to many Photos on photos.member = $self;
}
 
entity Photos {
    key ID          : Integer;
    album           : Association to Albums;
    location        : Association to Locations;
    member          : Association to Members;
    title           : String(120);
    description     : String(255);
    privacy         : String(20);
    uploadDate      : Date;
    view            : Integer;
    imagePath       : String(50);
    comments        : Association to many Comments on comments.photo = $self;
    tagPhotos       : Association to many Tag_Photos on tagPhotos.photo = $self;
}
 
entity Comments {
    key ID          : Integer;
    photo           : Association to Photos;
    postDate        : Date;
    content         : String(255);
}
 
entity Tags {
    key ID          : Integer;
    title           : String(120);
}
 
entity Tag_Photos {
    key ID          : Integer;
    tag             : Association to Tags;
    photo           : Association to Photos;
}