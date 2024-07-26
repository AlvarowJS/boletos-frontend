import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Badge, Card } from 'reactstrap'
const TablaUsuario = ({
    data, filter, search,
    actualizarUsuarioId, eliminarUsuario
}) => {
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
            name: 'Nombre completo',
            minWidth: '25px',
            selector: row => row?.name
        },
        {
            sortable: true,
            name: 'Número',
            minWidth: '50px',
            selector: row => row?.phone
        },
        {
            sortable: true,
            name: 'Rol',
            minWidth: '50px',
            selector: row => row?.role_id == 1 ? 'Adminitrador' : 'Usuario'
        },
        {
            sortable: true,
            name: 'Email',
            minWidth: '50px',
            selector: row => row?.email
        },
        {
            sortable: true,
            name: 'Estado',
            minWidth: '50px',
            selector: row => {
                return (
                    <>
                        {
                            row?.status == true ?

                                <Badge color='light-success'>
                                    Activo
                                </Badge>
                                :
                                <Badge color='light-warning'>
                                    Inactivo
                                </Badge>

                        }
                    </>
                )
            }
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

                        <button className='btn btn-warning'
                            onClick={() => actualizarUsuarioId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
                            onClick={() => eliminarUsuario(row?.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        }

    ]
    return (
        <>
            <Card className='mt-2'>
                <DataTable
                    noHeader
                    pagination
                    className='react-datatable'
                    columns={columns}
                    data={search ? filter : data}

                />
            </Card>
        </>
    )
}

export default TablaUsuario