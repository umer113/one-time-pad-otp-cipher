import React, { useState } from 'react';

const Cipher = () => {
    const [texts, setTexts] = useState("");
    const [encode, setEncode] = useState("");
    const [decode, setDecode] = useState("");
    const [random, setRandom] = useState("");

    const alphabets = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ';', ':', '"', "'", '<', '>', ',', '.', '/', '?', '\\', '|', '`', '~'
    ];

    let smallAscii = 97;
    let capitalAscii = 65;
    let numberAscii = 48;

    const toAscii = (smallAscii, capitalAscii, numberAscii, texts) => {
        let ascii_array = [];
        for (const text of texts) {
            if (text === ' ') {
                ascii_array.push(32);
            } else if (!isNaN(text)) {
                let index = alphabets.indexOf(text);
                let ascii = index + numberAscii - 26;
                ascii_array.push(ascii);
            } else if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
                let index = alphabets.indexOf(text);
                let ascii = index + capitalAscii;
                ascii_array.push(ascii);
            } else if (text === text.toLowerCase() && /[a-z]/.test(text)) {
                let index = alphabets.indexOf(text.toUpperCase());
                let ascii = index + smallAscii;
                ascii_array.push(ascii);
            } else if (alphabets.includes(text)) {
                let ascii = text.charCodeAt(0); 
                ascii_array.push(ascii);
            } else {
                console.log(`Character ${text} not found in the alphabets array`);
            }
        }
        return ascii_array;
    };


    const asciis = toAscii(smallAscii, capitalAscii, numberAscii, texts);
    console.log("actual ascii: ", asciis);

    const toBinary = (asciis) => {
        let binaryString = "";
        for (let ascii of asciis) {
            let binary = "";
            while (ascii !== 0) {
                binary = (ascii % 2) + binary;
                ascii = Math.floor(ascii / 2);
            }
            while (binary.length < 8) {
                binary = "0" + binary;
            }
            binaryString += binary;
        }
        return binaryString;
    };

    const randomKey = (length) => {
        let key = "";
        for (let i = 0; i < length; i++) {
            const random = Math.round(Math.random());
            key += random;
        }
        return key;
    };

    const generateCipherText = (binary, random) => {
        let xorOperation = "";
        for (let i = 0; i < binary.length; i++) {
            xorOperation += binary[i] === random[i] ? "0" : "1";
        }
        return xorOperation;
    };

    const handleEncode = () => {
        setDecode("")
        const binary = toBinary(asciis);
        const random = randomKey(binary.length);
        const cipher = generateCipherText(binary, random);
        setRandom(random);
        setEncode(cipher);
    };

    const handleDelete = () => {
        setEncode("");
        setDecode("");
    };

    const cipherToBinary = (encode, random) => {
        let xorOperation = "";
        for (let i = 0; i < encode.length; i++) {
            xorOperation += encode[i] === random[i] ? "0" : "1";
        }
        let segments = [];
        for (let i = 0; i < xorOperation.length; i += 8) {
            segments.push(xorOperation.substring(i, i + 8));
        }
        return segments;
    };

    const binaryToAscii = (cipherBinary) => {
        let ascii = [];
        for (let segment of cipherBinary) {
            let power = 7;
            let sum = 0;
            for (let i = 0; i < segment.length; i++) {
                sum += segment[i] * (2 ** power);
                power -= 1;
            }
            ascii.push(sum);
        }
        return ascii;
    };

    const asciiToWord = (binaryascii) => {
        let word = '';
        for (let sum of binaryascii) {
            word += String.fromCharCode(sum);
        }
        return word;
    };

    const handleDecode = () => {
        setEncode("")
        const cipherBinary = cipherToBinary(encode, random);
        const binaryascii = binaryToAscii(cipherBinary);
        const word = asciiToWord(binaryascii);
        setDecode(word);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-green-400 mb-6">One Time Pad (OTP) Cipher</h1>

                <div className="mb-4">
                    <label className="block text-green-400 font-semibold mb-2" htmlFor="plaintext">
                        Plain text
                    </label>
                    <input
                        type="text"
                        id="plaintext"
                        placeholder="Enter your plaintext"
                        className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={texts}
                        onChange={(e) => setTexts(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-green-400 font-semibold mb-2" htmlFor="ciphertext">
                        Cipher text
                    </label>
                    <textarea
                        type="text"
                        id="ciphertext"
                        placeholder=""
                        value={encode}
                        className="w-full h-48 p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-green-400 font-semibold mb-2" htmlFor="ciphertext">
                        Decode text
                    </label>
                    <textarea
                        type="text"
                        id="decodetext"
                        placeholder=""
                        value={decode}
                        className="w-full h-48 p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        readOnly
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button className="bg-green-500 text-black py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none" onClick={handleEncode}>
                        Encrypt
                    </button>
                    <button className="bg-green-500 text-black py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none" onClick={handleDecode}>
                        Decrypt
                    </button>
                    <button className="bg-red-500 text-black py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none" onClick={handleDelete}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cipher;
