import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validaCpf(strCPF: string): boolean {
    let soma: number;
    let resto: number;
    soma = 0;
    const arrayOne = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const arrayTwo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (strCPF?.length === 11) {
        if (
            strCPF === '11111111111' ||
            strCPF === '22222222222' ||
            strCPF === '33333333333' ||
            strCPF === '44444444444' ||
            strCPF === '55555555555' ||
            strCPF === '66666666666' ||
            strCPF === '77777777777' ||
            strCPF === '88888888888' ||
            strCPF === '99999999999' ||
            strCPF === '00000000000'
        ) { return false; }

        arrayOne.forEach((i) => {
            soma = soma + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
        });

        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) { resto = 0; }
        if (resto !== parseInt(strCPF.substring(9, 10), 10)) { return false; }

        soma = 0;
        arrayTwo.forEach((j) => {
            soma = soma + parseInt(strCPF.substring(j - 1, j), 10) * (12 - j);
        });

        resto = (soma * 10) % 11;

        if (resto === 10 || resto === 11) { resto = 0; }
        if (resto !== parseInt(strCPF.substring(10, 11), 10)) { return false; }
        else { return true; }
    } else { return true; }

}

export const cpfValida: ValidatorFn = (control: AbstractControl): ValidationErrors | null => validaCpf(removemask(control.value)) === true ? null : { valido: true };


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function removemask(value: string): any {
    if(value !== null){
        return value
        .toString().replace(/[.]/g, '')
        .toString().replace(/([-])/, '')
        .toString().replace(/([(])/, '')
        .toString().replace(/([)])/, '')
        .toString().replace(/([ ])/, '')
        .toString().replace(/([/])/, '')
        .toString().replace(/([-])/g, '');
    }
}

