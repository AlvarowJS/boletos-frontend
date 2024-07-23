import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormEventDay = ({
    modal, toggle, handleSubmit, register, submit, toggleActualizacion, days
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle || toggleActualizacion} size='lg'>
            <ModalHeader>
                Registrar día de Evento
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group my-2'>
                        <label htmlFor="eventName">
                            Número de Tickets o Boletos
                        </label>
                        <input
                            className="form-control"
                            type="number"
                            placeholder='ingrese número de tickets a imprimir'
                            {...register('ticketAmount')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="startDate">
                            Fecha de referencia
                        </label>
                        <input
                            className="form-control"
                            type="date"
                            {...register('refDate')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="">
                            Día
                        </label>
                        <select className="form-select" id="day_id" {...register("day_id")}>                            
                            {
                                days?.map(option => (
                                    <option key={option.id} value={option.id}>{option?.nameDay} </option>
                                ))
                            }
                        </select>
                  
                    </div>
                    <button className='btn btn-primary mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormEventDay