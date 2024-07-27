import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Edit, Trash } from "react-feather";
import { Badge, Card } from "reactstrap";
import { useForm } from "react-hook-form";
import FormEventDay from "./FormEventDay";
import bdBoletas from "../../api/bdBoletos";
const URL = "/v1/eventday";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TablaEvent = ({
  data,
  filter,
  search,
  actualizarEventoId,
  days,
  token,
  setRefresh,
  refresh
}) => {
  const [idEvento, setIdEvento] = useState();
  const { handleSubmit, register, reset } = useForm();
  const [modal, setModal] = useState(false);
  const [actualizacion, setActualizacion] = useState(false);  
  const defaultValueFrom = {
    ticketAmount: "",
    refDate: "",
    event_id: "",
    day_id: "",
  };
  const getAuthHeaders = () => ({
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const toggle = (id) => {
    setIdEvento(id);
    setActualizacion(false);
    reset(defaultValueFrom);
    setModal(!modal);
  };
  const toggleActualizacion = () => {
    setModal(!modal);
  };
  const actualizarDiaEvento = (id, data) => {    
    bdBoletas
        .put(`${URL}/${id}`, data, getAuthHeaders())
        .then((res) => {
            reset(defaultValueFrom);
            toggle.call();
            setRefresh(!refresh);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Día Actualizado",
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
  };
  const actualizarDiaEventoId = (id) => {
    toggleActualizacion.call()
    setActualizacion(true);
    bdBoletas
        .get(`${URL}/${id}`, getAuthHeaders())
        .then((res) => {
            reset(res.data.data);
        })
        .catch((err) => null);
  };
  const crearDiaEvento = (data) => {
    bdBoletas
      .post(`${URL}`, data, getAuthHeaders())
      .then((res) => {
        reset(defaultValueFrom);
        toggle.call();
        setRefresh(!refresh)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Evento creado",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {});
  };

  const submit = (newData) => {
    newData.event_id = idEvento;
    if (actualizacion) {
      actualizarDiaEvento(newData.id, newData);
    } else {
      crearDiaEvento(newData);
    }
  };


  const ExpandedComponent = ({ data }) => {
    return (
      <div className="mx-5">
        <h5>Días del evento</h5>
        <button className="btn btn-success" onClick={() => toggle(data?.id)}>
          Crear Día
        </button>
        {data?.event_days?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cantidad de Tickets</th>
                <th>Fecha de referencia</th>
                <th>Bloque</th>
                <th>Multifecha?</th>
                <th>Precio</th>
                <th>Artista</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {data.event_days.map((day, index) => (
                <tr key={index}>
                  <td>{day.id}</td>
                  <td>{day.ticketAmount}</td>
                  <td>{day.refDate}</td>
                  <td>{day.group}</td>
                  <td>{day.multiday ? 'si': 'no'}</td>
                  <td>{day.price} $</td>
                  <td>{day.artist}</td>
                  <td>
                    <button className="btn btn-success" onClick={() =>  actualizarDiaEventoId(day?.id)}>Editar</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay días del evento.</p>
        )}
        {/* <hr /> */}
      </div>
    );
  };

  const columns = [
    {
      sortable: true,
      name: "ID",
      minWidth: "25px",
      maxWidth: "80px",
      selector: (row) => row?.id,
    },
    {
      sortable: true,
      name: "Nombres",
      minWidth: "25px",
      selector: (row) => row?.eventName,
      cell: (row) => {
        return <>{row?.eventName}</>;
      },
    },
    {
      sortable: true,
      name: "Fecha de inicio ",
      minWidth: "25px",
      selector: (row) => row?.startDate,
    },
    {
      sortable: true,
      name: "Fecha de fin",
      minWidth: "25px",
      selector: (row) => row?.endingDate,
    },
    {
      sortable: true,
      name: "Lugar",
      minWidth: "25px",
      selector: (row) => row?.place,
    },
    {
      sortable: true,
      name: "Descripción",
      minWidth: "25px",
      selector: (row) => row?.description,
      cell: (row) => {
        return (
          <div className="flex">
            {row?.description?.split("\n").map((linea, index) => (
              <p key={index}>{linea}</p>
            ))}
          </div>
        );
      },
    },
    {
      sortable: true,
      name: "Imagen referencial",
      minWidth: "170px",
      selector: (row) => row?.description,
      cell: (row) => {
        return (
          <>
            <img
              src={`https://boletos.tms2.nuvola7.com.mx/storage/eventosFotos/${row?.eventImage}`}
              alt=""
              style={{
                width: 150,
                height: 150,
              }}
            />
          </>
        );
      },
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
              onClick={() => actualizarEventoId(row?.id)}
            >
              <Edit />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <Card className="mt-2">
      <DataTable
        noHeader
        pagination
        className="react-datatable"
        columns={columns}
        enableExpanding={true}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        data={search ? filter : data}
      />
      <FormEventDay
        toggle={toggle}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
        days={days}
        actualizacion={actualizacion}
      />
    </Card>
  );
};

export default TablaEvent;
