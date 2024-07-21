import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Card } from 'reactstrap'
const TablaEstado = ({
  data, filter, search,
  actualizarEstadoId, eliminarEstado
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
      name: 'Nombre del estado',
      minWidth: '50px',
      selector: row => row?.nombre_estado
    },
    {
      sortable: true,
      name: 'Signo del estado',
      minWidth: '50px',
      selector: row => row?.signo_estado
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
              onClick={() => actualizarEstadoId(row?.id)}
            >
              <Edit />
            </button>
            <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
              onClick={() => eliminarEstado(row?.id)}
            >
              <Trash />
            </button>
          </div>
        )
      }
    }

  ]
  return (
    <div>
      <Card className='mt-2'>
        <DataTable
          noHeader
          pagination
          className='react-datatable'
          columns={columns}
          data={search ? filter : data}

        />
      </Card>
    </div>
  )
}

export default TablaEstado