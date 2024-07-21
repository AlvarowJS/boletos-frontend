import React from 'react'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
import { Badge, Card } from 'reactstrap'
const TablaPago = ({
  data, filter, search,
  actualizarPagoId, eliminarPago
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
      name: 'Tipo de Pago',
      minWidth: '50px',
      selector: row => row?.tipoPago
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
              onClick={() => actualizarPagoId(row?.id)}
            >
              <Edit />
            </button>
            <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
              onClick={() => eliminarPago(row?.id)}
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

export default TablaPago