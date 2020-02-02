import * as CryptoJS from 'crypto-js';

function run() {
    const inputBox = document.getElementById("text-input") as HTMLTextAreaElement;
    const outputBox = document.getElementById("text-output") as HTMLTextAreaElement;
    const passBox = document.getElementById("pass-input") as HTMLInputElement;

    if (!inputBox || !passBox || !outputBox) {
        return;
    }

    const input = JSON.parse(inputBox.value);
    let key: undefined | string;

    
    if (input.key) {
        key = CryptoJS.AES.decrypt(input.key.enc, passBox.value).toString();
        delete input.key;
    }

    for (const hash in input) {
        if (input[hash].encrypted) {
            let passDecrypt = "";
            try {
                passDecrypt = CryptoJS.AES.decrypt(input[hash].secret, passBox.value).toString(CryptoJS.enc.Utf8);
            } catch {}
            if (
                (/^[a-z2-7]+=*$/i.test(passDecrypt) ||
                /^[0-9a-f]+$/i.test(passDecrypt)) &&
                passDecrypt
            ) {
                input[hash].encrypted = false;
                input[hash].secret = passDecrypt;
            } 
            if (key) {
                let keyDecrypt = "";
                try {
                    keyDecrypt = CryptoJS.AES.decrypt(input[hash].secret, key).toString(CryptoJS.enc.Utf8);
                } catch {}
                if (
                    (/^[a-z2-7]+=*$/i.test(keyDecrypt) ||
                    /^[0-9a-f]+$/i.test(keyDecrypt)) &&
                    keyDecrypt
                ) {
                    input[hash].encrypted = false;
                    input[hash].secret = keyDecrypt;
                }
            }
        }
    }
    for (const hash in input) { 
        if (input[hash].encrypted) {
            delete input[hash];
        }
    }
    outputBox.value = JSON.stringify(input);
}

//@ts-ignore
window.run = run;
