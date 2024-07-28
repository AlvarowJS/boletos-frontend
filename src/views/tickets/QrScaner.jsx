import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import beepSound from '../../assets/sound/beep-02.mp3';
import CryptoJS from 'crypto-js';
const QrScaner = ({
    setCodeQr, codeQr, registrarTicket
}) => {
    const [result, setResult] = useState('');
    const [facingMode, setFacingMode] = useState('environment');
    const [isDesktop, setIsDesktop] = useState(false)
    return (
        <div>
            <h1>Escanear Código QR</h1>
            {/* <div className='d-flex gap-2 mt-3'>
                <button onClick={() => setIsDesktop(true)} className='btn btn-primary'>
                    Cámara Delantera
                </button>
                <button onClick={() => setIsDesktop(false)} className='btn btn-primary'>
                    Cámara Trasera
                </button>
            </div> */}
            <div style={{ width: '400px' }}>
                <QrReader
               
                    constraints={{
                        facingMode: { exact: 'environment' }
                    }}
                    // constraints={{
                    //     facingMode: { exact: facingMode }
                    // }}
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