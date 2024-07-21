import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Delete, Edit, Eye, Trash } from 'react-feather'
import { Card, CardBody, CardHeader } from 'reactstrap'
import CitaPaciente from './CitaPaciente'

const TablaPaciente = ({
    data, setCurrentPage, setPerPage, totalRows, filter, search,
    actualizarPacienteId, eliminarPaciente, getAuthHeaders, bdCitas,
    rol
}) => {
    const [citas, setCitas] = useState()
    const [modalCita, setModalCita] = useState(false)


    const verCita = (id) => {
        toggleCitas.call()
        bdCitas.get(`/v1/paciente-citas/${id}`, getAuthHeaders())
            .then(res => {
                setCitas(res.data)
            })
            .catch(err => null)
    }
    const toggleCitas = () => {
        setModalCita(!modalCita)
    }
    const columns = [
        {
            sortable: true,
            name: 'ID',
            minWidth: '25px',
            maxWidth: '80px',
            selector: row => row?.id
        },
        {
            sortable: true,
            name: 'Nombres',
            minWidth: '25px',
            selector: row => row?.nombre
        },
        {
            sortable: true,
            name: 'Apellido Paterno',
            minWidth: '50px',
            selector: row => row?.apellido_paterno
        },
        {
            sortable: true,
            name: 'Apellido Materno',
            minWidth: '50px',
            selector: row => row?.apellido_materno
        },
        {
            sortable: true,
            name: 'Teléfono',
            minWidth: '25px',
            selector: row => row?.telefono
        },
        {
            name: 'Acciones',
            sortable: true,
            allowOverflow: true,
            minWidth: '200px',
            maxWidth: '400px',
            cell: row => {
                return (
                    <div className='d-flex gap-1 my-1'>
                        <button className='btn btn-success' style={{ fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => verCita(row?.id)}
                        >
                            <Eye />
                        </button>
                        <button className='btn btn-warning' style={{ fontSize: '12px', padding: '5px 10px' }}
                            onClick={() => actualizarPacienteId(row?.id)}
                        >
                            <Edit />
                        </button>
                        {
                            rol != 2 ?
                                <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white', fontSize: '12px', padding: '5px 10px' }}
                                    onClick={() => eliminarPaciente(row?.id)}
                                >
                                    <Trash />
                                </button>
                                : null
                        }

                    </div>
                )
            }
        }

    ]

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setPerPage(newPerPage)
        setCurrentPage(page)
    }
    return (
        <Card className='mt-2'>
            <DataTable
                noHeader
                pagination
                paginationServer
                className='react-datatable'
                columns={columns}
                data={search ? filter : data}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}

            />
            <CitaPaciente
                citas={citas}
                toggleCitas={toggleCitas}
                modalCita={modalCita}
            />
        </Card>
    )
}

export default TablaPaciente