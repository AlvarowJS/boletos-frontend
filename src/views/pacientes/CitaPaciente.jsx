import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import DataTable from 'react-data-table-component'
import bdCitas from '../../api/bdCitas'
const CitaPaciente = ({
    modalCita, toggleCitas, citas
}) => {

    
    const columns = [
        {
            sortable: true,
            name: 'Fecha',
            minWidth: '25px',
            maxWidth: '120px',
            selector: row => row?.fecha
        },
        {
            sortable: true,
            name: 'Hora',
            minWidth: '25px',
            maxWidth: '100px',
            selector: row => row?.hora
        },
        {
            sortable: true,
            name: 'Médico',
         
            selector: row => row?.medico?.nombre + ' ' +row?.medico?.apellido_paterno + ' '+row?.medico?.apellido_materno
        },
       
        {
            sortable: true,
            name: 'Pagó',
            minWidth: '25px',
            maxWidth: '150px',
            selector: row => '$ '+ row?.pago
        },
        {
            sortable: true,
            name: 'Tipo de Pago',
            selector: row => row?.pagotipo?.tipoPago
        }
    ]
    return (
        <Modal isOpen={modalCita} toggle={toggleCitas} size='lg'>
            <ModalHeader>
                Citas
            </ModalHeader>
            <ModalBody>
                <DataTable
                    noHeader
                    pagination
                    className='react-datatable'
                    columns={columns}
                    data={citas}

                />
            </ModalBody>
        </Modal>
    )
}

export default CitaPaciente