import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import bdCitas from '../../api/bdCitas'

const FormConsultorio = ({
    modal, toggle, handleSubmit, register, submit,
    toggleActualizacion, getAuthHeaders,refresh
}) => {
    
    const [options, setOptions] = useState()
    useEffect(() => {
        bdCitas.get(`/v1/ubicacion`, getAuthHeaders())
            .then(res => {
                setOptions(res.data)
            })
            .catch(err => console.log(err))
    }, [refresh])

    return (
        <Modal isOpen={modal} toggle={toggle} size='lg'>
            <ModalHeader>
                Registrar Consultorio
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Número de consultorio
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese nombres'
                            {...register('numero_consultorio')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Ubicación
                        </label>
                        <select
                            className="form-select"
                            id="ubicacion_id"
                            {...register("ubicacion_id")}
                        >
                            {options?.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre_ubicacion}
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

export default FormConsultorio