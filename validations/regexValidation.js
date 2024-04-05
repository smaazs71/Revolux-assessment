import getRegex from '../utils/regexStore.js'

export const emailValidation = ( email ) => {
    if( getRegex( 'email' ).test( email ) )
        return true
    return false
}


