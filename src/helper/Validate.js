var validate = require("validate.js");
const _ = require("lodash");
import I18n from "./locales/index";

class Validate {
    constructor(valueName, value) {
        this.valueName = valueName;
        this.value = value;
    }

    validateBlank = () => {
        if (_.isEmpty(this.value)) {
            return {
                blank: true,
                message: `${this.valueName} ${I18n.t("validate.blank")}`
            };
        } else {
            return {
                blank: false
            };
        }
    };

    validatePhoneNumber = () => {
        const isBlank = this.validateBlank().blank;
        if (isBlank) {
            return [this.validateBlank().message];
        }
        const pattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{3,9})/;
        const constraints = {
            format: {
                pattern,
                message: `${this.valueName} ${I18n.t("validate.phoneNumber")}`
            }
        };
        const validateResults = validate.single(this.value, constraints);
        return validateResults;
    };

    validatePassword = () => {
        const isBlank = this.validateBlank().blank;
        if (isBlank) {
            return [this.validateBlank().message];
        }
        // const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_?]).{8,30}$/;
        const pattern = /.{8,30}$/;
        const constraints = {
            format: {
                pattern,
                message: I18n.t("validate.password")
            }
        };
        const validateResults = validate.single(this.value, constraints);
        return validateResults;
    };

    validateEmail = () => {
        const isBlank = this.validateBlank().blank;
        if (isBlank) {
            return [this.validateBlank().message];
        }
        const constraints = {
            email: {
                message: `${this.valueName} ${I18n.t("validate.email")}`
            }
        };
        const validateResults = validate.single(this.value, constraints);
        return validateResults;
    };
}

export default Validate;
