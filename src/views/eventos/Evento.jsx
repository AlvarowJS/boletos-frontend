import React, { useEffect, useState } from "react";
import TablaEvent from './TablaEvent'
import FormEvent from './FormEvent'
import { Button, Col, Input, Label, Row } from "reactstrap";
import bdBoletas from "../../api/bdBoletos";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
const URL = "/v1/event";
const URLDAYS = "/v1/days";
const URLUPDATE = "/v1/event-update";
const MySwal = withReactContent(Swal);
const Evento = () => {
    const token = localStorage.getItem("token");
    const [data, setData] = useState();
    const [days, setDays] = useState();
    const [search, setSearch] = useState();
    const [filter, setFilter] = useState();
    const [modal, setModal] = useState(false);
    const [actualizacion, setActualizacion] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { handleSubmit, register, reset } = useForm();
    const defaultValueFrom = {
        eventName: "",
        eventImage: "",
        startDate: "",
        endingDate: "",
        place: "",
        description: ""
    }

    const getAuthHeaders = () => ({
        headers: {
            Authorization: "Bearer " + token,
        },
    })

    const toggle = () => {
        setActualizacion(false);
        reset(defaultValueFrom);
        setModal(!modal);
    };

    const toggleActualizacion = () => {
        setModal(!modal);
    };
    useEffect(() => {
        bdBoletas
            .get(URLDAYS, getAuthHeaders())
            .then((res) => {
                setDays(res.data);
            })
            .catch((err) => { });
    }, [])

    useEffect(() => {
        bdBoletas
            .get(`${URL}`, getAuthHeaders())
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => { });
    }, [refresh]);

    useEffect(() => {
        setFilter(
            data?.filter(
                (e) =>
                    e.eventName.toLowerCase()
                        .indexOf(search?.toLowerCase()) !== -1
            )
        );
    }, [search]);

    const handleFilter = (e) => {
        setSearch(e.target.value);
    };

    const crearEvento = (data) => {
        console.log(data.eventImage[0], "?")
        const formdata = new FormData()
        formdata.append('eventName', data.eventName)
        formdata.append('startDate', data.startDate)
        formdata.append('endingDate', data.endingDate)
        formdata.append('place', data.place)
        formdata.append('description', data.description)
        formdata.append('eventImage', data.eventImage[0])
        bdBoletas
            .post(URL, formdata, getAuthHeaders())
            .then((res) => {
                reset(defaultValueFrom)
                toggle.call()
                setRefresh(!refresh)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Evento creado",
                    showConfirmButton: false,
                    timer: 1500,
                })
            })
            .catch((err) => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Contacte con soporte",
                    showConfirmButton: false,
                });
            })
    }
    const actualizarEventoId = (id) => {
        toggleActualizacion.call()
        setActualizacion(true);
        bdBoletas
            .get(`${URL}/${id}`, getAuthHeaders())
            .then((res) => {

                reset(res.data.data);
            })
            .catch((err) => null);

    }
    const actualizarEvento = (id, data) => {
        const formdata = new FormData()
        formdata.append('id', data.id)
        formdata.append('eventName', data.eventName)
        formdata.append('startDate', data.startDate)
        formdata.append('endingDate', data.endingDate)
        formdata.append('place', data.place)
        formdata.append('description', data.description)
        formdata.append('eventImage', data.eventImage[0])
        bdBoletas
            .post(URLUPDATE, formdata, getAuthHeaders())
            .then((res) => {
                reset(defaultValueFrom);
                toggle.call();
                setRefresh(!refresh);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Evento Actualizado",
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((err) => {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Contacte con soporte",
                    showConfirmButton: false,
                });
            });
    }

    const submit = (data) => {
        if (actualizacion) {
            actualizarEvento(data.id, data);
        } else {
            crearEvento(data);
        }
    };

    return (
        <>
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
                        placeholder="Buscar evento"
                        onChange={handleFilter}
                    />
                </Col>
                <Col sm="4"></Col>

                <Col sm="2" className="mt-2">
                    <Button onClick={toggle} color="primary">
                        + registrar
                    </Button>
                </Col>
            </Row>
            <TablaEvent
                data={data}
                days={days}
                filter={filter}
                search={search}
                actualizarEventoId={actualizarEventoId}
                token={token}
                refresh={refresh}
                setRefresh={setRefresh}
            />
            <FormEvent
                toggle={toggle}
                modal={modal}
                handleSubmit={handleSubmit}
                submit={submit}
                register={register}
                reset={reset}
            />
        </>
    )
}

export default Evento