const regex = {
    'emailId': /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'password': /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/,
    'phoneNo': /^\d{10}$/,
    'aadhaarNo': /^\d{12}$/,
    'date': /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/,      // /^\d{4}-\d{2}-\d{2}$/,
    'id': /^[a-f\d]{24}$/,
    'productId': /^\d{8}$/,
    'timeInMIlli': /^\d{13}$/,
    'positiveInt': /^\d+$/,
    'allInt': /^-?\d+$/,
    'positiveFloat': /^\d+\.\d+$/,
    'allFloat': /^-?\d+\.\d+$/,

}

export const regexKeyValueValidation = ( data ) => {
    const key = Object.keys( data )[ 0 ]
    const string = Object.values( data )[ 0 ]
    if( regex[ key ].test( string ) )
        return true
    return false 
}


export const getRegex = ( key ) => {
    return regex[key]
}