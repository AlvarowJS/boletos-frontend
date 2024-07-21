import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormPaciente = ({
    modal, toggle, handleSubmit, register, submit,toggleActualizacion
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle || toggleActualizacion} size='lg'>
            <ModalHeader>
                Registrar Paciente
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
                            Teléfono
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese telefono'
                            {...register('telefono')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Estado
                        </label>
                        <select className="form-select" id="status" {...register('status')}  >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                    <button className='btn btn-primary mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormPaciente