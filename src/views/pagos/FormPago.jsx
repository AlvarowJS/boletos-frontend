import { Modal, ModalBody, ModalHeader } from 'reactstrap'
const FormPago = ({
  modal, toggle, handleSubmit, register, submit,  
}) => {
  return (
    <Modal isOpen={modal} toggle={toggle} size='lg'>
      <ModalHeader>
        Registrar Tipo de Pago
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(submit)}>
          <div className='form-group my-2'>
            <label htmlFor="">
              Tipo de Pago
            </label>
            <input
              className="form-control"
              type="text"
              placeholder='ingrese nombres'
              {...register('tipoPago')}
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

export default FormPago