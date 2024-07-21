import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const FormEstado = ({
    modal, toggle, handleSubmit, register, submit,
}) => {
    return (
        <Modal isOpen={modal} toggle={toggle} size='lg'>
            <ModalHeader>
                Registrar Estado
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>
                    <div className='form-group my-2'>
                        <label htmlFor="nombre_estado">
                            Nombre del estado
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese nombre del estado'
                            {...register('nombre_estado')}
                        />
                    </div>
                    <div className='form-group my-2'>
                        <label htmlFor="signo_estado">
                            Signo del estado
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder='ingrese signo del estado'
                            {...register('signo_estado')}
                        />
                    </div>

                    <button className='btn btn-primary mb-2'>Enviar</button>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FormEstado