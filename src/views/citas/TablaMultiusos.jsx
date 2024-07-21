import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Check, Edit, Trash, X } from "react-feather";
import { Row, Badge, Button, Card, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import bdCitas from "../../api/bdCitas";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FormMultiuso from "./FormMultiuso";
const MySwal = withReactContent(Swal);
const URLVISITA = "/v1/citas-visitas";
const TablaMultiusos = ({
  multiuso,
  dateChange,
  handleDate,
  getAuthHeaders,
  URL,
  refresh,
  setRefresh,
  dataSelect,
}) => {
  const [modal, setModal] = useState(false);
  const [montoTotal, setMontoTotal] = useState();
  const { handleSubmit, register, reset } = useForm();
  const [actualizacion, setActualizacion] = useState(false);
  const [paciente, setPaciente] = useState();
  const [doctor, setDoctor] = useState();
  const [visitas, setVisitas] = useState();
  const [confirmaciones, setConfirmaciones] = useState({});

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
    medico_id: "",
    multiuso_id: "",
  };

  useEffect(() => {
    bdCitas
      .get(
        `${URLVISITA}?paciente_id=${paciente?.value}&medico_id=${doctor}`,
        getAuthHeaders()
      )
      .then((res) => {
        setVisitas(res?.data?.visita);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [paciente, doctor]);

  const calcularSuma = () => {
    const suma = multiuso?.citas.reduce((total, objeto) => {
      return total + objeto?.pago;
    }, 0);
    return suma;
  };

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
          title: "Cita creada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        if (err.response.status == 409) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Horario ya registrado",
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
  const toggle = () => {
    setActualizacion(false);
    reset(defaulValuesForm);
    setModal(!modal);
  };

  const toggleActualizacion = () => {
    setModal(!modal);
  };
  // Actualiza Consultorio (PUT)
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
          // Error 409: Conflicto, manejar de manera diferente
          Swal.fire({
            position: "center",
            icon: "error",
            title: "El horario seleccionado ya se encuentra ocupado.",
            showConfirmButton: false,
          });
        } else {
          // Otros errores, mensaje genérico
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Contacte con soporte",
            showConfirmButton: false,
          });
        }
      });
  };
  const eliminarCita = (id) => {
    return MySwal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        bdCitas
          .delete(`${URL}/${id}`, getAuthHeaders())
          .then((res) => {
            setRefresh(!refresh);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Cita Eliminada",
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
    });
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

  const submit = (data) => {
    data.silla = data.silla == "" ? false : true;
    data.confirmar = data.confirmar == "" ? false : true;
    data.paciente_id = paciente.value;
    data.multiuso_id = multiuso.id;
    if (actualizacion) {
      actualizarCita(data.id, data);
    } else {
      crearCita(data);
    }
  };

  const manejarCambioCheckbox = (id, estaMarcado) => {
    setConfirmaciones((prev) => ({
      ...prev,
      [id]: estaMarcado,
    }));

    const objConfir = {
      id: id,
      confirmar: estaMarcado,
    };


    bdCitas
      .put(`${URL}/${id}`, objConfir, getAuthHeaders())
      .then((res) => {
        reset(defaulValuesForm);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Confirmación Actualizada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {});
  };

  const columns = [
    {
      sortable: true,
      name: "Conf",
      minWidth: "25px",
      maxWidth: "80px",
      selector: (row) => {
        return (
          <>
            <input
              className="form-check-input"
              type="checkbox"
              id="checkboxNoLabel"
              value=""
              aria-label="..."
              // checked={row?.confirmar}
              checked={
                Object.keys(confirmaciones).length == 0
                  ? row?.confirmar
                  : confirmaciones[row.id]
              }
              onChange={(e) => manejarCambioCheckbox(row.id, e.target.checked)}
            />
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Hora",
      minWidth: "25px",
      maxWidth: "100px",
      selector: (row) => row?.hora,
    },
    {
      sortable: true,
      name: "Paciente",
      minWidth: "25px",
      maxWidth: "180px",
      selector: (row) => {
        return (
          <>
            <p style={{ marginBottom: 0 }}>{row?.paciente?.nombre}</p>
            <p>
              {row?.paciente?.apellido_paterno +
                " " +
                row?.paciente?.apellido_materno}
            </p>
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Médico",
      minWidth: "25px",
      maxWidth: "180px",
      selector: (row) => {
        return (
          <>
            <p style={{ marginBottom: 0 }}>{row?.medico?.nombre}</p>
            <p>
              {row?.medico?.apellido_paterno +
                " " +
                row?.medico?.apellido_materno}
            </p>
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Silla",
      minWidth: "25px",
      maxWidth: "100px",
      selector: (row) => {
        return (
          <>
            <input
              className="form-check-input"
              type="checkbox"
              id="checkboxNoLabel"
              value=""
              aria-label="..."
              checked={row?.silla}
            />
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Visitas",
      // minWidth: '50px',
      // maxWidth: '240px',
      selector: (row) => {
        return (
          <>
            <Badge color="light-success">{row?.llego}</Badge>
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Entró",
      minWidth: "25px",
      maxWidth: "200px",
      selector: (row) => {
        return (
          <>
            <Badge color="light-warning">{row?.entro}</Badge>
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Pagó",
      minWidth: "25px",
      maxWidth: "100px",
      selector: (row) => row?.pago,
    },
    {
      sortable: true,
      name: "Tipo de pago",
      minWidth: "25px",
      maxWidth: "150px",
      selector: (row) => row?.pagotipo?.tipoPago,
    },

    {
      name: "Acciones",
      sortable: true,
      allowOverflow: true,
      minWidth: "200px",
      maxWidth: "400px",
      cell: (row) => {
        return (
          <div className="d-flex gap-1 my-1">
            <button
              className="btn btn-warning"
              style={{ fontSize: "12px", padding: "5px 10px" }}
              onClick={() => actualizarCitaId(row?.id)}
            >
              <Edit />
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "#DC3545",
                color: "white",
                fontSize: "12px",
                padding: "5px 10px",
              }}
              onClick={() => eliminarCita(row?.id)}
            >
              <Trash />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Card className="mt-2">
        <Row className="p-2">
          <Col>
            <h4> {multiuso?.nombre_multiuso} </h4>
          </Col>
          <Col>
            <h4>Pago Total: $ {calcularSuma()}</h4>
          </Col>
          <Col>
            <Button color="info" onClick={toggle}>
              + Asignar Cita
            </Button>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          className="react-datatable"
          columns={columns}
          data={multiuso.citas}
        />
      </Card>

      <FormMultiuso
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
        setDoctor={setDoctor}
        visitas={visitas}
      />
    </>
  );
};

export default TablaMultiusos;
