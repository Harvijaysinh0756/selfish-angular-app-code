import { FormControl, FormGroup, ValidatorFn, ValidationErrors } from '@angular/forms';

export class customValidations {
    
    constructor() {}

    public domainValid(control: FormControl) {
        let email = control.value;
        if (email && email.indexOf("@") != -1) {
            let [_, domain] = email.split("@");
            if (domain !== "ncrypted.com" || domain !== "gmail.com") {
                return {
                    emailDomain: {
                        parsedDomain: domain
                    }
                }
            }
        }
        return null;
    }

    public onlyNumeric(control: FormControl) {
        const valid = /^\d+$/.test(control.value);

        if (valid || control.value == null || control.value == undefined || control.value == ''){
            return null;
        }else{
            return {
                onlyNumeric: {
                    numeric : control.value
                }
            }
        }
    }

    public onlyFloat(control: FormControl) {
        const valid = /^-?\d*(\.\d+)?$/.test(control.value);

        if (valid || control.value == null || control.value == undefined || control.value == ''){
            return null;
        }else{
            return {
                onlyFloat: {
                    float : control.value
                }
            }
        }
    }

    public validURL(control: FormControl) {
        const valid = /^(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)?$/.test(control.value);

        if (valid || control.value == null || control.value == undefined || control.value == ''){
            return null;
        }else{
            return {
                validURL: {
                    url : control.value
                }
            }
        }
    }

    public comparisonValidator(form : FormGroup,field1 : string,field2 : string) : ValidatorFn{
        return (group: FormGroup): ValidationErrors => {
            const control1 = group.controls[field1];
            const control2 = group.controls[field2];

            if(control2.value != null && control2.value != undefined && control2.value != ''){
                if (control1.value !== control2.value) {
                    control2.setErrors({notEquivalent: true});
                } else {
                    control2.setErrors(null);
                }
            }
            return;
        };
    }
}
