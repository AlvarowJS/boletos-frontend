import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import { useForm } from 'react-hook-form'
import bdCitas from '../../api/bdCitas'
// Sweet Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import TablaConsultorio from './TablaConsultorio'
import FormConsultorio from './FormConsultorio'
import Ubicacion from './Ubicacion'
const MySwal = withReactContent(Swal)
const URL = '/v1/consultorio'

const Consultorio = () => {
  const token = localStorage.getItem('token')
  const [data, setData] = useState()
  const [search, setSearch] = useState()
  const [filter, setFilter] = useState()
  const [modal, setModal] = useState(false)
  const [modalUbicacion, setModalUbicacion] = useState(false)
  const [actualizacion, setActualizacion] = useState(false)
  const { handleSubmit, register, reset } = useForm()
  const [refresh, setRefresh] = useState(false)
  const defaulValuesForm = {
    numero_consultorio: '',
    ubicacion_id: '',
  }
  const getAuthHeaders = () => ({
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  const toggle = () => {
    setActualizacion(false)
    reset(defaulValuesForm)
    setModal(!modal)
  }

  const toggleActualizacion = () => {
    setModal(!modal)
  }

  const toggleUbicacion = () => {
    setModalUbicacion(!modalUbicacion)
  }

  useEffect(() => {
    bdCitas.get(`${URL}`, getAuthHeaders())
      .then(res => {
        setData(res.data)
      })
      .catch(err => {

      })
  }, [refresh])
  const handleFilter = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setFilter(data?.filter(e =>
      e.numero_consultorio.toLowerCase().includes(search.toLowerCase())
    ))
  }, [search])

  // Falta agregar el seach

  // Crear Consultorio
  const crearConsultorio = (data) => {
    bdCitas.post(URL, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Consultorio creado',
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

  // Actualiza Consultorio (PUT)
  const actualizarConsultorio = (id, data) => {
    bdCitas.put(`${URL}/${id}`, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Consultorio Actualizado',
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
  const eliminarConsultorio = (id) => {
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
              title: 'Consultorio Eliminado',
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

  // Tomara los datos que tiene un registro
  const actualizarConsultorioId = (id) => {
    toggleActualizacion.call()
    setActualizacion(true)
    bdCitas.get(`${URL}/${id}`, getAuthHeaders())
      .then(res => {
        reset(res.data)
      })
      .catch(err => null)
  }

  // Si es actualizacion llamara a actualizarPaciente pero si es false crear un Consultorio
  const submit = (data) => {
    if (actualizacion) {
      actualizarConsultorio(data.id, data)
    } else {
      crearConsultorio(data)
    }
  }
  return (
    <>
      <Row>
        <Col sm='6'>
          <Label className='me-1' for='search-input'>
            Buscar
          </Label>
          <Input
            className='dataTable-filter'
            type='text'
            bsSize='sm'
            id='search-input'
            placeholder='buscar por número de consultorio'
            onChange={handleFilter}
          />
        </Col>
        <Col sm='2'>

        </Col>
        <Col sm='2' className='mt-2'>
          <Button onClick={toggleUbicacion} color='secondary'>
            + Crear ubicación
          </Button>

        </Col>
        <Col sm='2' className='mt-2'>
          <Button onClick={toggle} color='primary'>
            + Agregar
          </Button>
        </Col>
      </Row>
      <TablaConsultorio
        data={data}
        filter={filter}
        search={search}
        actualizarConsultorioId={actualizarConsultorioId}
        eliminarConsultorio={eliminarConsultorio}
      />
      <FormConsultorio
        toggle={toggle}
        toggleActualizacion={toggleActualizacion}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
        getAuthHeaders={getAuthHeaders}
        refresh={refresh}
      />

      <Ubicacion
        toggleUbicacion={toggleUbicacion}
        modalUbicacion={modalUbicacion}
        getAuthHeaders={getAuthHeaders}
        setRefresh={setRefresh}
        refresh={refresh}
        MySwal={MySwal}
        Swal={Swal}
      />
    </>
  )
}

export default Consultorio