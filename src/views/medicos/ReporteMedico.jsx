import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import Select from 'react-select'

const ReporteMedico = ({
    toggleReporte, modalReporte, getAuthHeaders
}) => {

    const [medicos, setMedicos] = useState()
    const [reporte, setReporte] = useState({})
    useEffect(() => {
        bdCitas.get(`/v1/medicos`, getAuthHeaders())
            .then(res => {
                setMedicos(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const handleChangeMedico = (selected) => {
        setReporte((prevReporte) => ({
            ...prevReporte,
            medico_id: selected.value,
        }));
    }
    const handleChangeFechaInicio = (event) => {
        setReporte((prevReporte) => ({
            ...prevReporte,
            start_date: event.target.value,
        }));
    }
    const handleChangeFechaFin = (event) => {
        setReporte((prevReporte) => ({
            ...prevReporte,
            end_date: event.target.value,
        }));
    }
    const exportarPdf = () => {
        if (reporte.medico_id && reporte.start_date && reporte.end_date) {
            window.open(`https://backend.tms2.nuvola7.com.mx/api/v1/medico-citas?start_date=${reporte.start_date}&end_date=${reporte.end_date}&medico_id=${reporte.medico_id}`)
        }
    }
    const optionsMedicos = medicos?.map(optionMedico => ({
        value: optionMedico?.id,
        label: optionMedico?.nombre + " " + optionMedico?.apellido_paterno + " " + optionMedico?.apellido_materno
    }));
    return (
        <Modal isOpen={modalReporte} toggle={toggleReporte} size='lg'>
            <ModalHeader>
                Reporte de Médico
            </ModalHeader>
            <ModalBody>
                Ingrese la fecha y el Médico:
                <form>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Fecha Inicio
                        </label>
                        <input
                            className="form-control"
                            type="date"
                            onChange={handleChangeFechaInicio}

                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Fecha Fin
                        </label>
                        <input
                            className="form-control"
                            type="date"
                            placeholder='ingresenombres'
                            onChange={handleChangeFechaFin}

                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Médico
                        </label>
                        <Select
                            id="paciente"
                            onChange={handleChangeMedico}
                            options={optionsMedicos}
                            isSearchable={true}
                            placeholder="No especifica"

                        />
                    </div>
                    <button type='button' className='btn btn-primary mb-2'
                        onClick={exportarPdf}
                    >
                        Descargar
                    </button>

                </form>
            </ModalBody>
        </Modal>
    )
}

export default ReporteMedico