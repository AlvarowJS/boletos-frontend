import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import bdCitas from '../../api/bdCitas'

const FormMedico = ({
    modal, toggle, handleSubmit, register, submit,
    toggleActualizacion, getAuthHeaders

}) => {
    const [options, setOptions] = useState()
    useEffect(() => {
        bdCitas.get(`/v1/consultorio`, getAuthHeaders())
            .then(res => {
                setOptions(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <Modal isOpen={modal} toggle={toggle} size='lg'>
            <ModalHeader>
                Registrar Médico
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Nombres
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese nombres'
                            {...register('nombre')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Apellido Paterno
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese apellido paterno'
                            {...register('apellido_paterno')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Apellido Materno
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese apellido materno'
                            {...register('apellido_materno')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Estado
                        </label>
                        <select className="form-select" id="status" {...register('status')}  >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Ubicación
                        </label>
                        <select
                            className="form-select"
                            id="ubicacion_id"
                            {...register("consultorio_id")}
                        >
                            {options?.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.numero_consultorio} - {option?.ubicacion?.nombre_ubicacion}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className='btn btn-primary mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormMedico