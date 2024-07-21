import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Check, Edit, Trash, X } from "react-feather";
import { Row, Badge, Button, Card, Col } from "reactstrap";
import FormCita from "./FormCita";
import { useForm } from "react-hook-form";
import bdCitas from "../../api/bdCitas";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const TablaCitas = ({
  cita,
  dateChange,
  handleDate,
  getAuthHeaders,
  URL,
  refresh,
  setRefresh,
  dataSelect,
  toggle,
  setDoctor,
  actualizarCitaId,
}) => {
  const [actualizacion, setActualizacion] = useState(false);
  const [montoTotal, setMontoTotal] = useState();
  const [confirmaciones, setConfirmaciones] = useState({});

  const calcularSuma = () => {
    const suma = cita?.citas.reduce((total, objeto) => {
      return total + objeto?.pago;
    }, 0);
    return suma;
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
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Confirmación Actualizada",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
      });
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
              checked={Object.keys(confirmaciones).length == 0 ? row?.confirmar : confirmaciones[row.id]}
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
      minWidth: "30px",
      maxWidth: "150px",
      selector: (row) => {
        return (
          <>
            {row?.paciente?.nombre}
            <br />
            {row?.paciente?.apellido_paterno}
            <br />
            {row?.paciente?.apellido_materno}
            <br />
          </>
        );
      },
    },
    {
      sortable: true,
      name: "Teléfono",
      minWidth: "25px",
      maxWidth: "180px",
      selector: (row) => row?.paciente?.telefono,
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
      name: "Visita",
      minWidth: "25px",
      maxWidth: "200px",
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
            <h4>
              Dr {cita?.nombre} {cita?.apellido_paterno}{" "}
              {cita?.apellido_materno}
            </h4>
          </Col>
          <Col>
            <h4>Pago Total: $ {calcularSuma()}</h4>
          </Col>
          <Col>
            <Button color="info" onClick={() => toggle(cita?.id)}>
              + Asignar Cita
            </Button>
          </Col>
        </Row>
        <DataTable
          noHeader
          pagination
          className="react-datatable"
          columns={columns}
          data={cita.citas}
        />
      </Card>
    </>
  );
};

export default TablaCitas;
