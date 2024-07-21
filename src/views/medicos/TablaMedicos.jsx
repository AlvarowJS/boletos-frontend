import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Card } from 'reactstrap'

const TablaMedicos = ({
    data, filter, search,
    actualizarMedicoId, eliminarMedico
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
            name: 'Consultorio',
            minWidth: '50px',
            selector: row => row?.consultorio?.numero_consultorio +' '+ row?.consultorio?.ubicacion?.nombre_ubicacion
            
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
                            onClick={() => actualizarMedicoId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
                            onClick={() => eliminarMedico(row?.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        }

    ]
    return (
        <Card className='mt-2'>
            <DataTable
                noHeader
                pagination
                className='react-datatable'
                columns={columns}
                data={search ? filter : data}

            />
        </Card>
    )
}

export default TablaMedicos