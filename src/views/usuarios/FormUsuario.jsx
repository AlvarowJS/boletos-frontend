import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormUsuario = ({
  modal, toggle, handleSubmit, register, submit, toggleActualizacion
}) => {
  return (
    <Modal isOpen={modal} toggle={toggle || toggleActualizacion} size='lg'>
      <ModalHeader>
        Registrar Usuario
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(submit)}>
          <div className='form-group my-2'>
            <label htmlFor="">
              Nombre completo
            </label>
            <input
              className="form-control"
              type="text"
              placeholder='ingrese nombre completo'
              {...register('name')}
            />
          </div>
 
          <div className='form-group my-2'>
            <label htmlFor="">
              Teléfono
            </label>
            <input
              className="form-control"
              type="text"
              placeholder='Ingrese su número de celular'
              {...register('phone')}
            />
          </div>
          <div className='form-group my-2'>
            <label htmlFor="">
              Email
            </label>
            <input
              className="form-control"
              type="text"
              placeholder='ingrese correo'
              {...register('email')}
            />
          </div>
          <div className='form-group my-2'>
            <label htmlFor="">
              Password
            </label>
            <input
              className="form-control"
              type="password"              
              {...register('password')}
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

export default FormUsuario