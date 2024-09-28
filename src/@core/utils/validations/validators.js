export const validatorPositive = value => {
    if (value >= 0) {
        return true
    }
    return false
}

export const validatorPassword = password => {
    /* eslint-disable no-useless-escape */
    const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
    /* eslint-enable no-useless-escape */
    const validPassword = regExp.test(password)
    return validPassword
}

export const validatorCreditCard = creditnum => {
    /* eslint-disable no-useless-escape */
    const cRegExp = /^(?:3[47][0-9]{13})$/
    /* eslint-enable no-useless-escape */
    const validCreditCard = cRegExp.test(creditnum)
    return validCreditCard
}

export const validatorUrlValidator = val => {
    if (val === undefined || val === null || val.length === 0) {
        return true
    }
    /* eslint-disable no-useless-escape */
    const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
    /* eslint-enable no-useless-escape */
    return re.test(val)
}
export const validateSsn = val => {
    const re = /^.{14}$/
    return re.test(val)
}
// /^[A-Za-z ]*$/
export const englishOnly = val => {
    const re = /^[A-za-z][A-Za-z0-9_(@./#&+\-'",.?،:;؛) ]*$/
    return re.test(val)
}
export const arabicOnly = val => {
    const re = /^[ا-يأ-ي][أ-ي0-9ءؤئ_(@./#&+'",.;'؛) IVXivx]*$/
    // const re = /^[\u0621-\u064A ]+$/
    let result = re.test(val)
    return result
}

export const passportValidation = val => {
    const re = /^[a-zA-Z][1-9][0-9][0-9][0-9][0-9][0-9][0-9]$/
    let result = re.test(val)
    return result
}

export const codeValidation = val => {
    const re = /[^a-zA-Z0-9 -_(@./#&+)]/
    return !re.test(val)
}

export const numberValidation = val => {
    const re = /[^0-9]/
    return !re.test(val)
}

export const addressValidation = val => {
    const re = /(?!^\d+$)^.+$/
    return re.test(val)
}

export const postCode = val => {
    const re = /^[0-9]{5}(-[0-9]{4})?$/
    let result = re.test(val)
    return result
}

export const mobileValidation = val => {
    const re = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/
    let result = re.test(val)
    return result
}

export const  ssnRequired = val =>{
    const re = /[a-zA-Z0-9-,]+/
    let result = re.test(val)
    return result
}

export const fileValidation = val => {
    const re = /([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.gif|.pdf)$/
    let result = re.test(val.name)
    return result
}
