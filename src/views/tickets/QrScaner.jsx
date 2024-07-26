import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import beepSound from '../../assets/sound/beep-02.mp3';
import CryptoJS from 'crypto-js';
const QrScaner = ({
    setCodeQr, codeQr, registrarTicket
}) => {
    const [result, setResult] = useState('');
    console.log(typeof registrarTicket)
    return (
        <div>
            <h1>Escanear Código QR</h1>
            <div style={{ width: '400px' }}>
                <QrReader
                    onResult={(result, error) => {
                        if (!!result) {
                            const decryptedCode = CryptoJS.AES.decrypt(result.text, 'secret-key').toString(CryptoJS.enc.Utf8);                            
                            setCodeQr(decryptedCode);
                            const audio = new Audio(beepSound);                            
                            // registrarTicket();
                            audio.play();
                            
                        }
                        if (!!error) {
                            console.info(error);
                        }
                    }}
                    style={{ width: '400px' }}
                />
            </div>
            <div className='d-flex gap-2'>
                <p>Código: {codeQr}</p>
                <button 
                onClick={registrarTicket}
                className='btn btn-success'>Registrar</button>
            </div>

        </div>
    );
}

export default QrScaner