import React, { useEffect, useState } from 'react'
import { Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import { useForm } from 'react-hook-form'
const URL = '/v1/ubicacion'
import DataTable from 'react-data-table-component'
import { Edit, Trash } from 'react-feather'
const Ubicacion = ({
    toggleUbicacion, modalUbicacion, getAuthHeaders,
    setRefresh, MySwal, Swal, refresh
}) => {
    const [actualizacion, setActualizacion] = useState(false)
    const [data, setData] = useState()
    const { handleSubmit, register, reset } = useForm()
    const defaulValuesForm = {
        id: '',
        nombre_ubicacion: ''
    }

    useEffect(() => {
        bdCitas.get(`${URL}`, getAuthHeaders())
            .then(res => {
                setData(res.data)
            })
            .catch(err => {

            })
    }, [refresh])

    const crearUbicacion = (data) => {
        bdCitas.post(URL, data, getAuthHeaders())
            .then(res => {
                reset(defaulValuesForm)                
                setRefresh(!refresh)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Ubicación creada',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(err => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Contacte con soporte',
                    showConfirmButton: false,
                })
            })
    }

    // Actualiza ubicacion (PUT)
    const actualizarUbicacion = (id, data) => {
        bdCitas.put(`${URL}/${id}`, data, getAuthHeaders())
            .then(res => {
                reset(defaulValuesForm)
                setRefresh(!refresh)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Ubicación Actualizada',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch(err => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Contacte con soporte',
                    showConfirmButton: false,
                })
            })
    }
    const actualizarUbicacionId = (id) => {
        setActualizacion(true)
        bdCitas.get(`${URL}/${id}`, getAuthHeaders())
            .then(res => {
                reset(res.data)
            })
            .catch(err => null)
    }

    const submit = (data) => {
        
        if (actualizacion) {
            actualizarUbicacion(data.id, data)
        } else {
            crearUbicacion(data)
        }
    }
    const limpiar = () => {
        reset(defaulValuesForm)
        setActualizacion(false)
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
            name: 'Ubicación referencial',
            minWidth: '50px',
            selector: row => row?.nombre_ubicacion
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

                        <button className='btn btn-warning' type='button'
                            onClick={() => actualizarUbicacionId(row?.id)}
                        >
                            <Edit />
                        </button>
                        <button className='btn' style={{ backgroundColor: '#DC3545', color: 'white' }}
                            type='button'
                            onClick={() => eliminarUbicacionId(row?.id)}
                        >
                            <Trash />
                        </button>
                    </div>
                )
            }
        }

    ]

    const eliminarUbicacionId = (id) => {
        return MySwal.fire({
            title: '¿Estás seguro de eliminar?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                bdCitas.delete(`${URL}/${id}`, getAuthHeaders())
                    .then(res => {
                        setRefresh(!refresh)
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Ubicación Eliminada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(err => {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Contacte con soporte',
                            showConfirmButton: false,
                        })
                    })
            }
        })


    }
    return (
        <Modal isOpen={modalUbicacion} toggle={toggleUbicacion} size='lg'>
            <ModalHeader>
                Registrar Ubicación
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(submit)}>

                    <label htmlFor="">
                        Ubicación referencial
                    </label>
                    <Row className='form-group my-2' >
                        <Col sm='2'>
                            <input
                                className="form-control"
                                type="text"
                                placeholder='id'
                                {...register('id')}
                                disabled
                            />
                        </Col>
                        <Col sm='8'>
                            <input
                                className="form-control"
                                type="text"
                                placeholder='ingrese ubicación'
                                {...register('nombre_ubicacion')}
                            />
                        </Col>
                        <Col sm='2'>
                            <button className='btn btn-success' type='button'
                                onClick={limpiar}
                            >Limpiar</button>
                        </Col>
                    </Row>

                    <DataTable
                        noHeader
                        pagination
                        className='react-datatable'
                        columns={columns}
                        data={data}

                    />

                    <button className='btn btn-primary mb-2'>
                        {
                            actualizacion ? 'Actualizar' : 'Crear'
                        }

                    </button>
                </form>


            </ModalBody>
        </Modal>
    )
}

export default Ubicacion