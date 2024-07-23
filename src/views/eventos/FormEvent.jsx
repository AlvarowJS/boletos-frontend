import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormEvent = ({
    modal, toggle, handleSubmit, register, submit, toggleActualizacion
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle || toggleActualizacion} size='lg'>
            <ModalHeader>
                Registrar Evento
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group my-2'>
                        <label htmlFor="eventName">
                            Nombre del evento
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese nombres'
                            {...register('eventName')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="startDate">
                            Fecha de inicio
                        </label>
                        <input
                            className="form-control"
                            type="date"
                            placeholder='ingrese el apellido completo'
                            {...register('startDate')}
                        />
                    </div>

                    <div className='form-group my-2'>
                        <label htmlFor="">
                            fecha de fin
                        </label>
                        <input
                            className="form-control"
                            type="date"
                            placeholder='ingrese correo'
                            {...register('endingDate')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Lugar
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            {...register('place')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Descripción
                        </label>
                        <textarea
                            className="form-control"
                            id="description"
                            {...register("description")}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Foto de referencia
                        </label>
                        <input
                            type='file'
                            className="form-control"
                            id="eventImage"
                            {...register("eventImage")}
                        />
                    </div>
                    <button className='btn btn-primary mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormEvent