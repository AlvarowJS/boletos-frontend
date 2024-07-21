import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Card } from 'reactstrap'
const TablaConsultorio = ({
  data, filter, search,
  actualizarConsultorioId, eliminarConsultorio
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
      name: 'Número de consultorio',
      minWidth: '50px',
      selector: row => row?.numero_consultorio
    },
    {
      sortable: true,
      name: 'Ubicación',
      minWidth: '50px',
      selector: row => row?.ubicacion?.nombre_ubicacion
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
              onClick={() => actualizarConsultorioId(row?.id)}
            >
              <Edit />
            </button>
            <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
              onClick={() => eliminarConsultorio(row?.id)}
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

export default TablaConsultorio