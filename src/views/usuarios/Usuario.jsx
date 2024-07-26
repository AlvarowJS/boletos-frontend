import React, { useEffect, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import TablaUsuario from "./TablaUsuario";
import FormUsuario from "./FormUsuario";
import bdBoletas from "../../api/bdBoletos";
const MySwal = withReactContent(Swal);
const URL = "/v1/users";

const Usuario = () => {
  const token = localStorage.getItem("token");
  const [data, setData] = useState();
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState();
  const [modal, setModal] = useState(false);
  const [modalUbicacion, setModalUbicacion] = useState(false);
  const [actualizacion, setActualizacion] = useState(false);
  const { handleSubmit, register, reset, formState: { errors } } = useForm();
  const [refresh, setRefresh] = useState(false);
  const defaulValuesForm = {
    name: "",
    email: "",
    password: "",
    status: "",
  };
  const getAuthHeaders = () => ({
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const toggle = () => {
    setActualizacion(false);
    reset(defaulValuesForm);
    setModal(!modal);
  };

  const toggleActualizacion = () => {
    setModal(!modal);
  };

  useEffect(() => {
    bdBoletas
      .get(`${URL}`, getAuthHeaders())
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => { });
  }, [refresh]);

  useEffect(() => {
    setFilter(
      data?.filter(
        (e) =>
          e.name.toLowerCase()
            .indexOf(search?.toLowerCase()) !== -1
      )
    );
  }, [search]);

  const handleFilter = (e) => {
    setSearch(e.target.value);
  };

  // Falta agregar el seach

  // Crear Usuario
  const crearUsuario = (data) => {
    bdBoletas
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
        if (err.response.status == 422) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Email registrado, por favor ingrese uno diferente",
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

  // Actualiza Consultorio (PUT)
  const actualizarUsuario = (id, data) => {
    bdBoletas
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
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Contacte con soporte",
          showConfirmButton: false,
        });
      });
  };
  const eliminarUsuario = (id) => {
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
        bdBoletas
          .delete(`${URL}/${id}`, getAuthHeaders())
          .then((res) => {
            setRefresh(!refresh);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Consultorio Eliminado",
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

  // Tomara los datos que tiene un registro
  const actualizarUsuarioId = (id) => {
    toggleActualizacion.call();
    setActualizacion(true);
    bdBoletas
      .get(`${URL}/${id}`, getAuthHeaders())
      .then((res) => {
        reset(res.data);
      })
      .catch((err) => null);
  };

  // Si es actualizacion llamara a actualizarPaciente pero si es false crear un Consultorio
  const submit = (data) => {
    if (actualizacion) {
      actualizarUsuario(data.id, data);
    } else {
      crearUsuario(data);
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
            placeholder="buscar por nombre y apellidos"
            onChange={handleFilter}
          />
        </Col>
        <Col sm="4"></Col>

        <Col sm="2" className="mt-2">
          <Button onClick={toggle} color="primary">
            + Agregar
          </Button>
        </Col>
      </Row>
      <TablaUsuario
        data={data}
        filter={filter}
        search={search}
        actualizarUsuarioId={actualizarUsuarioId}
        eliminarUsuario={eliminarUsuario}
      />
      <FormUsuario
        toggle={toggle}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
        getAuthHeaders={getAuthHeaders}
        errors={errors}
      />
    </>
  );
};

export default Usuario;
