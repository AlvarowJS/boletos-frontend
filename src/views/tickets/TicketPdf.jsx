import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import encabezado from "../../assets/images/portada/encabezado.png";
import CryptoJS from 'crypto-js';

// Define the exact size of the page in points (7.6 x 10.2 cm)
const PAGE_WIDTH = 215.46;  // 7.6 cm * 28.35 points/cm
const PAGE_HEIGHT = 288.57; // 10.2 cm * 28.35 points/cm

const CARDS_PER_PAGE = 1;

const TicketPdf = ({ data }) => {
    const [qrCodes, setQrCodes] = useState([]);

    useEffect(() => {
        // Generate QR codes for each item
        const generateQRCodes = async () => {
            const qrCodePromises = data.map(async (item) => {
                // Encrypt the code
                const encryptedCode = CryptoJS.AES.encrypt(item.code, 'secret-key').toString();
                const qrCodeUrl = await QRCode.toDataURL(encryptedCode);
                return qrCodeUrl;
            });
            const qrCodes = await Promise.all(qrCodePromises);            
            setQrCodes(qrCodes);
        };

        generateQRCodes();
    }, [data]);

    // Divide the data into chunks for each page
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
                <Page key={pageIndex} size={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }} style={styles.body}>
                    <View style={styles.container}>
                        {pageData.map((item, index) => (
                            <View key={index} style={styles.card}>
                                <Image style={styles.encabezado} src={encabezado} />
                                <Text style={styles.title}>
                                    QUE INCLUYE TU ENTRADA A {item?.event_day?.event?.eventName}
                                </Text>

                                <Text style={styles.title}>$ {item?.event_day?.price} PESOS</Text>                     
                                <Text style={styles.title}>{formatDate(item?.event_day?.refDate)}</Text>                                
                                <Text style={styles.subtitle}>{item?.event_day?.artist}</Text>
                                {qrCodes[pageIndex] && <Image style={styles.qrCodeBig} src={qrCodes[pageIndex]} />}
                                <View style={styles.separacion} />
                                <View style={styles.qrclient}>
                                    <View>
                                        <Text style={styles.title}>{formatDate(item?.event_day?.refDate)}</Text>
                                        <Text style={styles.subtitle}>{item?.event_day?.artist}</Text>
                                    </View>
                                    <View>
                                        {qrCodes[pageIndex] && <Image style={styles.qrCode} src={qrCodes[pageIndex]} />}
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
        padding: 10, // Reduce padding to fit within the smaller page size
        backgroundColor: '#f5f5f5',
        flexDirection: 'column',
    },
    encabezado: {
        width: 120,
        height: 40,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        display: 'flex',
        width: 200,  // Adjusted width for the smaller page
        height: 260, // Adjusted height for the smaller page
        // marginBottom: 4,
        backgroundColor: 'white',
        border: '1px solid black',
        paddingX: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 10, // Adjusted font size
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 10, // Adjusted font size
        color: '#333',
        fontWeight: 'bold',
        // marginBottom: 5,
    },
    text: {
        fontSize: 8, // Adjusted font size
    },
    separacion: {
        borderTop: '2px dotted #000',
        marginBottom: 2,
        width: '100%',
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
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
        width: 75, // Adjusted QR code size
        height: 75,
    },
    qrCode: {
        width: 40, // Adjusted QR code size
        height: 40,
    },
    qrclient: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TicketPdf;
