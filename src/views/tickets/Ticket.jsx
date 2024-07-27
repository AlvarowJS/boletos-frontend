import React, { useEffect, useState } from "react";
import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import bdBoletas from "../../api/bdBoletos";
import TablaTicket from "./TablaTicket";
import TicketPdf from "./TicketPdf";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import QrScaner from "./QrScaner";
const URL = "/v1/ticket";
const URLEVENTOSDAY = "/v1/eventday";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const Ticket = () => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const [search, setSearch] = useState();
    const [filter, setFilter] = useState();
    const [evento, setEvento] = useState();
    const [eventosData, setEventosData] = useState();
    const [data, setData] = useState();
    const [total, setTotal] = useState();
    const [invalid, setInvalid] = useState();
    const [valid, setValid] = useState();
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1)
    const [escanear, setEscanear] = useState(false)
    const [totalPages, setTotalPages] = useState()
    const [codeQr, setCodeQr] = useState()
    const handleFilter = (e) => {
        setSearch(e.target.value);
    };

    const getAuthHeaders = () => ({
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    useEffect(() => {
        bdBoletas
            .get(`${URLEVENTOSDAY}`, getAuthHeaders())
            .then((res) => {
                setEventosData(res.data.data);
            })
            .catch((err) => { });
    }, []);

    useEffect(() => {
        bdBoletas
            .get(`${URL}?eventDay=${evento?.value}`, getAuthHeaders())
            .then((res) => {
                setData(res?.data?.data);
                setTotal(res.data?.total);
                setValid(res.data?.valid);
                setInvalid(res.data?.invalid);
            })
            .catch((err) => { });
    }, [refresh, evento]);

    useEffect(() => {
        setFilter(
            data?.filter(
                (e) =>
                    e.code.toLowerCase()
                        .indexOf(search?.toLowerCase()) !== -1
            )
        );
    }, [search]);

    const handleChange = (selected) => {
        setEvento(selected);
        setSearch('')
    };

    const abrirScaner = () => {
        setEscanear(!escanear)
    }
    const actualizarData = () => {
        setRefresh(!refresh)
    }
    const registrarTicket = () => {
        console.log("sea ctivo", codeQr)
        if (codeQr) {
            bdBoletas.put(`${URL}/${codeQr}`, null, getAuthHeaders())
                .then(res => {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Ticket Registrado",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                })
                .catch(err => {
                    if (err.response.status == 404) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Ticket no encontrado",
                            showConfirmButton: false,
                        });
                    } else if (err.response.status == 412) {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Ticket fuera de fecha",
                            showConfirmButton: false,
                        });
                    }
                    else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Ticket ya registrado",
                            showConfirmButton: false,
                        });
                    }
                })
        }
    }
    useEffect(() => {
        if (codeQr) {
            registrarTicket();
        }
    }, [codeQr]);

    const options = eventosData?.map((option) => ({
        value: option?.id,
        label:
            option?.event?.eventName +
            " | " +
            option?.refDate +
            " | " +
            option?.group,
    }));

    const downloadAllPDFs = () => {
        for (let p = 1; p <= totalPages; p++) {
            const pageData = data.slice((page - 1) * page, p * page);
            const link = document.createElement('a');
            const blob = new Blob([<TicketPdf data={pageData} />], { type: 'application/pdf' });
            link.href = URL.createObjectURL(blob);
            link.download = `tickets_page_${p}.pdf`;
            link.click();
        }
    };
    return (
        <div>
            <Row>
                <Col sm="6">
                    <Label className="me-1" for="search-input">
                        Buscar
                    </Label>
                    <Input
                        className="dataTable-filter"
                        type="text"
                        bsSize="sm"
                        id="search-input"
                        placeholder="Buscar Ticket"
                        onChange={handleFilter}
                    />
                </Col>

                <Col sm="6" className="mt-2">
                    <Select
                        id="oficina"
                        value={evento}
                        onChange={handleChange}
                        options={options}
                        isSearchable={true}
                        placeholder="No especifica"
                    />
                </Col>
            </Row>
            <Row className="mt-2">
                <Col sm="3">
                    <h4>Total de Tickets: {total}</h4>
                </Col>
                <Col sm="3">
                    <h4>Tickets registrados: {valid}</h4>
                </Col>
                <Col sm="3">
                    <h4>Tickets sin registrar: {invalid}</h4>
                </Col>
            </Row>
            {/* <button className="btn btn-success" onClick={downloadAllPDFs}>
                Descargar Todos los Tickets
            </button> */}

            <Row className="g-1">
                <Col sm="3">
                    {
                        rol == 1 ? (
                            <PDFDownloadLink document={<TicketPdf
                                data={data}
                            />} fileName="tickets.pdf">
                                {({ blob, url, loading, error }) =>
                                    loading ? (
                                        'Loading document...'
                                    ) : (
                                        <button className="btn btn-success">Descargar Tickets</button>
                                    )
                                }
                            </PDFDownloadLink>
                        ) : null
                    }

                </Col>
                <Col sm="3">
                    <button className="btn btn-success"
                        onClick={abrirScaner}
                    >
                        {
                            escanear ? 'Ocultar escaner' : 'Escanear QR'
                        }

                    </button>
                </Col>
                <Col sm="3">
                    <button className="btn btn-success"
                        onClick={actualizarData}
                    >                        
                            Actualizar data                        
                    </button>
                </Col>

            </Row>
            <div className="d-flex justify-content-center">
                {
                    escanear ? (
                        <QrScaner
                            setCodeQr={setCodeQr}
                            codeQr={codeQr}
                            registrarTicket={registrarTicket}
                        />
                    ) :
                        null
                }

            </div>


            {/* <PDFViewer style={{ width: '100%', height: '600px' }}>
                <TicketPdf data={data} />
            </PDFViewer> */}
            <TablaTicket
                data={data}
                filter={filter}
                search={search}
                total={total}

            />


        </div>
    );
};

export default Ticket;
