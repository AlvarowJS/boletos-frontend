import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import encabezado from "../../assets/images/portada/encabezado.png";
import CryptoJS from 'crypto-js';

// Calcula cuántas tarjetas caben en una página A4, considerando márgenes y espaciado.
const CARDS_PER_PAGE = 4;

const TicketPdf = ({ data }) => {

    const [qrCodes, setQrCodes] = useState([]);

    useEffect(() => {
        // Generar los códigos QR para cada dato
        const generateQRCodes = async () => {
            const qrCodePromises = data.map(async (item) => {
                // Encriptar el código
                const encryptedCode = CryptoJS.AES.encrypt(item.code, 'secret-key').toString();
                const qrCodeUrl = await QRCode.toDataURL(encryptedCode);
                return qrCodeUrl;
            });
            const qrCodes = await Promise.all(qrCodePromises);
            setQrCodes(qrCodes);
        };

        generateQRCodes();
    }, [data]);

    // Divide los datos en bloques para cada página.
    const pages = [];
    for (let i = 0; i < data?.length; i += CARDS_PER_PAGE) {
        pages.push(data.slice(i, i + CARDS_PER_PAGE));
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        const dayNum = date.getDate();
        const monthNum = date.getMonth();
        const yearNum = date.getFullYear();
        const monthNames = [
            'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
            'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
        ];
        return `${dayNum} DE ${monthNames[monthNum]} ${yearNum}`;

    };

    const splitDescription = (description) => {
        const lines = description?.split('\r\n');
        const half = Math.ceil(lines?.length / 2);
        const firstHalf = lines.slice(0, half).join('\r\n');
        const secondHalf = lines.slice(half).join('\r\n');
        return [firstHalf, secondHalf];
    };

    return (
        <Document>
            {pages.map((pageData, pageIndex) => (
                <Page key={pageIndex} style={styles.body}>
                    <View style={styles.container}>

                        {pageData.map((item, index) => (
                            <View key={index} style={styles.card}>
                                <Image
                                    style={styles.encabezado}
                                    src={encabezado}
                                />
                                <Text style={styles.title}>
                                    QUE INCLUYE TU ENTRADA A {item?.event_day?.event?.eventName}
                                </Text>
                                <View style={styles.descriptionContainer}>
                                    <View style={styles.descriptionColumn}>
                                        <Text style={styles.text}>
                                            {splitDescription(item?.event_day?.event?.description)[0]}
                                        </Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.descriptionColumn}>
                                        <Text style={styles.text}>
                                            {splitDescription(item?.event_day?.event?.description)[1]}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.title}>{formatDate(item?.event_day?.refDate)}</Text>
                                <Text style={styles.subtitle}>{item?.event_day?.event?.place}</Text>
                                {qrCodes[index] && <Image style={styles.qrCodeBig} src={qrCodes[index]} />}
                                <View style={styles.separacion}>

                                </View>
                                <View style={styles.qrclient}>
                                    <View>
                                        <Text style={styles.title}>{formatDate(item?.event_day?.refDate)}</Text>
                                        <Text style={styles.subtitle}>{item?.event_day?.event?.place}</Text>
                                    </View>
                                    <View>
                                        {qrCodes[index] && <Image style={styles.qrCode} src={qrCodes[index]} />}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
};

const styles = StyleSheet.create({
    body: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
    },
    encabezado: {
        width: 200,
        height: 50
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        display: 'flex',
        width: 215.46,
        height: 289.17,
        marginBottom: 10,
        backgroundColor: 'white',
        border: '1px solid black',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 10,
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 10,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 5,
    },
    separacion: {
        borderTop: '2px dotted #000',
        width: '100%'
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center'
    },
    descriptionColumn: {
        width: '45%',
    },
    divider: {
        width: '2%',
        height: '100%',
        backgroundColor: 'black',
    },
    qrCodeBig: {
        width: 80,
        height: 80,
    },
    qrCode: {
        width: 50,
        height: 50,
    },
    qrclient: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TicketPdf;
