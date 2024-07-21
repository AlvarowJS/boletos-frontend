import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import bdCitas from "../../api/bdCitas";
import Select from "react-select";

const FormMultiuso = ({
  modal,
  toggle,
  handleSubmit,
  register,
  submit,
  toggleActualizacion,
  getAuthHeaders,
  paciente,
  setPaciente,
  dataSelect,
  setDoctor,
  visitas
}) => {

  const [medicos, setMedicos] = useState();
  const [estados, setEstados] = useState();
  const [pacientes, setPacientes] = useState();
  const [tipoPagos, setTipoPagos] = useState();
  const [celularPaciente, setCelularPaciente] = useState();

  const handleDoctorChange = (event) => {
    const selectedId = event.target.value;
    setDoctor(selectedId);
  };

  useEffect(() => {
    setPacientes(dataSelect?.pacientes)
    setMedicos(dataSelect?.medicos)
    setTipoPagos(dataSelect?.pagos)
    setEstados(dataSelect?.estados)
  }, [])

  useEffect(() => {
    if (pacientes && paciente) {
      let idPaciente = paciente?.value;
      let pacienteEncontrado = pacientes.find((e) => e.id == idPaciente);
      setCelularPaciente(pacienteEncontrado?.telefono);
    } else {
      setCelularPaciente("");
    }
  }, [paciente]);

  const handleChangePaciente = (selected) => {
    setPaciente(selected);
  };

  const optionsPacientes = pacientes?.map((optionPaciente) => ({
    value: optionPaciente?.id,
    label:
      optionPaciente?.nombre +
      " " +
      optionPaciente?.apellido_paterno +
      " " +
      optionPaciente?.apellido_materno,
  }));
  return (
    <>
      <Modal isOpen={modal} toggle={toggle || toggleActualizacion} size="lg">
        <ModalHeader>Registrar Cita</ModalHeader>
        <ModalBody style={{ paddingInline: 100 }}>
          <form onSubmit={handleSubmit(submit)}>
            <Row>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="paciente">Paciente</label>
                  <Select
                    id="paciente"
                    value={paciente}
                    onChange={handleChangePaciente}
                    options={optionsPacientes}
                    isSearchable={true}
                    placeholder="No especifica"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                Número de telefono: <b>{celularPaciente}</b>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="pago_tipo_id">Médico</label>
                  <select
                    className="form-select"
                    id="medico_id"
                    {...register("medico_id")}
                    onChange={handleDoctorChange}

                  >
                    {medicos?.map((medico) => (
                      <option key={medico.id} value={medico.id}>
                        {medico.nombre} {medico?.apellido_materno}{" "}
                        {medico?.apellido_paterno}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="fecha">Prox. cita</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha"
                    {...register("fecha")}
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="hora">Hora</label>
                  <input
                    type="time"
                    className="form-control"
                    id="hora"
                    {...register("hora")}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="pago">Pago</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pago"
                    {...register("pago")}
                  />
                </div>
              </Col>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="pago_tipo_id">Tipo de Pago</label>
                  <select
                    className="form-select"
                    id="pago_tipo_id"
                    {...register("pago_tipo_id")}
                  >
                    {tipoPagos?.map((tipoPago) => (
                      <option key={tipoPago.id} value={tipoPago.id}>
                        {tipoPago.tipoPago}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="llego">Visita</label>
                  <select
                    className="form-select"
                    id="llego"
                    {...register("llego")}
                  >
                    {visitas?.map((visita) => (
                      <option
                        key={visita.id}
                        value={visita.nombre}
                      >
                        {visita.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col>
                <div className="form-group my-2">
                  <label htmlFor="entro">Entró</label>
                  <select
                    className="form-select"
                    id="entro"
                    {...register("entro")}
                  >
                    {estados?.map((estado) => (
                      <option
                        key={estado.signo_estado + " - " + estado.nombre_estado}
                        value={
                          estado.signo_estado + " - " + estado.nombre_estado
                        }
                      >
                        {estado.signo_estado} - {estado.nombre_estado}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
            </Row>
            <div style={{ display: "flex", justifyContent: "center", gap: 50 }}>
              <div>
                <label htmlFor="confirmar">Confirmar</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="confirmar"
                    {...register("confirmar")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="silla">Silla</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="silla"
                    {...register("silla")}
                  />
                </div>
              </div>
            </div>

            <div className="form-group my-2">
              <label htmlFor="observacion">Observación</label>
              <textarea
                className="form-control"
                id="observacion"
                {...register("observacion")}
              />
            </div>
            <button className="btn btn-primary mb-2">Enviar</button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FormMultiuso;
