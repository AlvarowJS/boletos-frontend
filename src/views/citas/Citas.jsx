import React, { useEffect, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import bdCitas from "../../api/bdCitas";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import TablaCitas from "./TablaCitas";
import TablaMultiusos from "./TablaMultiusos";
import { Search } from "react-feather";
import FormCita from "./FormCita";
const MySwal = withReactContent(Swal);
const URL = "/v1/citas";
const URLUSO = "/v1/multiusos";
const URLSELECT = "/v1/citas-selects";
const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const meses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const Citas = () => {
  const token = localStorage.getItem("token");
  const [handleDate, setHandleDate] = useState([]);
  const [dateChange, setDateChange] = useState();
  const [citas, setCitas] = useState();
  const [multiusos, setMultiusos] = useState();
  const [montoTotal, setMontoTotal] = useState();
  const [search, setSearch] = useState();
  const [filterCitas, setFilterCitas] = useState();
  const [dataSelect, setDataSelect] = useState();
  const [paciente, setPaciente] = useState();
  const [refresh, setRefresh] = useState(false);
  const [actualizacion, setActualizacion] = useState(false);
  const [doctor, setDoctor] = useState();

  // Precargar los selects
  // Mostrar los datos de pacientes, medicos, estados, consultorios y tipo de pagos
  useEffect(() => {

    bdCitas
      .get(`${URLSELECT}?paciente_id=${paciente?.value}&medico_id=${doctor}`, getAuthHeaders())
      .then((res) => {
        setDataSelect(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [paciente?.value, doctor]);

  // citas form
  const [modal, setModal] = useState(false);
  const { handleSubmit, register, reset } = useForm();
  const crearCita = (data) => {
    bdCitas
      .post(URL, data, getAuthHeaders())
      .then((res) => {
        reset(defaulValuesForm);
        toggle.call();
        setRefresh(!refresh);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario creado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "El horario seleccionado ya se encuentra ocupado.",
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Contacte con soporte",
            showConfirmButton: false,
          });
        }
      });
  };
  const toggle = (id) => {
    setActualizacion(false);
    reset(defaulValuesForm);
    setModal(!modal);
    setDoctor(id);

  };
  const toggleActualizacion = () => {
    setActualizacion(true);
    setModal(!modal);
    // setDoctor(id);
  };
  const actualizarCitaId = (id) => {
    toggleActualizacion.call();
    setActualizacion(true);
    bdCitas
      .get(`${URL}/${id}`, getAuthHeaders())
      .then((res) => {
        reset(res.data);
        setPaciente({
          value: res.data.paciente.id,
          label:
            res.data.paciente.nombre +
            " " +
            res.data.paciente.apellido_paterno +
            " " +
            res.data.paciente.apellido_materno,
        });
      })
      .catch((err) => null);
  };
  const actualizarCita = (id, data) => {
    bdCitas
      .put(`${URL}/${id}`, data, getAuthHeaders())
      .then((res) => {
        reset(defaulValuesForm);
        toggle.call();
        setRefresh(!refresh);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario Actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "El horario seleccionado ya se encuentra ocupado.",
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Contacte con soporte",
            showConfirmButton: false,
          });
        }
      });
  };
  const submit = (data) => {
    data.silla = data.silla == "" ? false : true;
    data.confirmar = data.confirmar == "" ? false : true;
    data.paciente_id = paciente.value;
    data.medico_id = doctor;

    if (actualizacion) {
      actualizarCita(data.id, data);
    } else {
      crearCita(data);
    }
  };
  const defaulValuesForm = {
    id: "",
    confirmar: "",
    entro: "",
    fecha: "",
    hora: "",
    llego: "",
    observacion: "",
    paciente_id: "",
    pago: "",
    pago_tipo_id: "",
    silla: "",
    status: "",
  };

  const getAuthHeaders = () => ({
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const dateNow = () => {
    let fechaActual = new Date();
    let year = fechaActual.getFullYear();
    let month = meses[fechaActual.getMonth()];
    let monthActual = fechaActual.getMonth();
    let day = fechaActual.getDate();
    let dayWeek = diasSemana[fechaActual.getDay()];
    let fechaFormateada = `${dayWeek} ${day} ${month} ${year}`;
    let fechaIndex = `${year}-${monthActual + 1}-${day}`;
    return [fechaFormateada, fechaIndex];
  };

  const cambiarFecha = (e) => {
    setDateChange(e.target.value);
    let fechaActual = e.target.value;
    fechaActual = new Date(fechaActual);
    let year = fechaActual.getFullYear();
    let month = meses[fechaActual.getMonth()];
    let day = fechaActual.getDate();
    let dayWeek = diasSemana[fechaActual.getDay()];
    let fechaFormateada = `${dayWeek} ${day + 1} ${month} ${year}`;
    setHandleDate(fechaFormateada);
  };

  useEffect(() => {
    let fechaFormateada = dateNow();    
    setHandleDate(fechaFormateada[0]);
  }, []);

  useEffect(() => {
    let fechaFilter;
    if (dateChange) {
      fechaFilter = dateChange;
    } else {
      fechaFilter = dateNow();
      fechaFilter = fechaFilter[1];
    }
    // fechaFilter ? fechaFilter = dateChange : fechaFilter = handleDate[1]
    bdCitas
      .get(`${URL}?date=${fechaFilter}`, getAuthHeaders())
      .then((res) => {
        setCitas(res?.data);
        setFilterCitas(res?.data);
      })
      .catch((err) => {});
  }, [refresh, handleDate, dateChange]);

  useEffect(() => {
    let fechaFilter;
    if (dateChange) {
      fechaFilter = dateChange;
    } else {
      fechaFilter = dateNow();
      fechaFilter = fechaFilter[1];
    }
    // fechaFilter ? fechaFilter = dateChange : fechaFilter = handleDate[1]
    bdCitas
      .get(`${URLUSO}?date=${fechaFilter}`, getAuthHeaders())
      .then((res) => {
        setMultiusos(res?.data);
      })
      .catch((err) => {});
  }, [refresh, handleDate, dateChange]);

  const buscarNombre = (e) => {
    let nombreMedicos = e.target.value;
    let citaBusqueda = citas.filter((cita) =>
      cita.nombre.toLowerCase().includes(nombreMedicos.toLowerCase())
    );
    setFilterCitas(citaBusqueda);
  };

  return (
    <>
      <Row>
        <Col sm="3">
          <h2>{handleDate}</h2>
        </Col>
        <Col sm="3"></Col>
        <Col sm="3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            onChange={buscarNombre}
          />
        </Col>
        <Col sm="3">
          <input type="date" className="form-control" onChange={cambiarFecha} />
        </Col>
      </Row>
      {multiusos?.map((multiuso) => (
        <TablaMultiusos
          key={multiuso.id}
          multiuso={multiuso}
          dateChange={dateChange}
          handleDate={handleDate}
          montoTotal={montoTotal}
          refresh={refresh}
          setRefresh={setRefresh}
          URL={URLUSO}
          getAuthHeaders={getAuthHeaders}
          dataSelect={dataSelect} 
          URLSELECT={URLSELECT}
        />
      ))}
      {filterCitas
        ? filterCitas?.map((filterCita) => (
            <TablaCitas
              key={filterCita.id}
              cita={filterCita}
              dateChange={dateChange}
              handleDate={handleDate}
              montoTotal={montoTotal}
              refresh={refresh}
              setRefresh={setRefresh}
              URL={URL}
              getAuthHeaders={getAuthHeaders}
              actualizarCitaId={actualizarCitaId}
              toggle={toggle}
              setDoctor={setDoctor}
            />
          ))
        : citas?.map((cita) => (
            <TablaCitas
              key={cita.id}
              cita={cita}
              dateChange={dateChange}
              handleDate={handleDate}
              montoTotal={montoTotal}
              refresh={refresh}
              setRefresh={setRefresh}
              URL={URL}
              getAuthHeaders={getAuthHeaders}
              actualizarCitaId={actualizarCitaId}
              toggle={toggle}
              setDoctor={setDoctor}
            />
          ))}
      <FormCita
        toggle={toggle}
        toggleActualizacion={toggleActualizacion}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
        getAuthHeaders={getAuthHeaders}
        paciente={paciente}
        setPaciente={setPaciente}
        dataSelect={dataSelect}
      />
    </>
  );
};

export default Citas;
