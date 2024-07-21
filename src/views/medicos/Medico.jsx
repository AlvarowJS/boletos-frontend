import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import { useForm } from 'react-hook-form'
import TablaMedicos from './TablaMedicos'
import FormMedico from './FormMedico'
// Sweet Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReporteMedico from './ReporteMedico'
const MySwal = withReactContent(Swal)


const URL = '/v1/medicos'
const Medico = () => {
  const token = localStorage.getItem('token')
  const [data, setData] = useState()
  const [search, setSearch] = useState()
  const [filter, setFilter] = useState()
  const [modal, setModal] = useState(false)
  const [modalReporte, setModalReporte] = useState(false)
  const [actualizacion, setActualizacion] = useState(false)
  const { handleSubmit, register, reset } = useForm()
  const [refresh, setRefresh] = useState(false)
  // Reporte PDF

  const defaulValuesForm = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    status: '',
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

  const toggleReporte = () => {
    setModalReporte(!modalReporte)
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
      (e.nombre && e.apellido_paterno &&
        (e.nombre.toLowerCase() + ' ' + e.apellido_paterno.toLowerCase()).indexOf(search?.toLowerCase()) !== -1) ||
      (e.nombre && e.nombre.toLowerCase().indexOf(search?.toLowerCase()) !== -1) ||
      (e.apellido_paterno && e.apellido_paterno.toLowerCase().indexOf(search?.toLowerCase()) !== -1)
    ))
  }, [search])

  // Crear Medico
  const crearMedico = (data) => {
    bdCitas.post(URL, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Medico creado',
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

  // Actualiza medico (PUT)
  const actualizarMedico = (id, data) => {
    bdCitas.put(`${URL}/${id}`, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Medico Actulizado',
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
  const eliminarMedico = (id) => {
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
              title: 'Medico Eliminado',
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
  const actualizarMedicoId = (id) => {
    toggleActualizacion.call()
    setActualizacion(true)
    bdCitas.get(`${URL}/${id}`, getAuthHeaders())
      .then(res => {
        reset(res.data)
      })
      .catch(err => null)
  }

  // Si es actualizacion llamara a actualizarPaciente pero si es false crear un medico
  const submit = (data) => {
    if (actualizacion) {
      actualizarMedico(data.id, data)
    } else {
      crearMedico(data)
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
            placeholder='buscar por nombre y apellidos'
            onChange={handleFilter}
          />
        </Col>
        <Col sm='2'></Col>
        <Col sm='2' className='mt-2'>
        <Button onClick={toggleReporte} color='secondary'>
            Reporte PDF
          </Button>
        </Col>
        <Col sm='2' className='mt-2'>

          <Button onClick={toggle} color='primary'>
            + Agregar
          </Button>
        </Col>
      </Row>
      <TablaMedicos
        data={data}
        filter={filter}
        search={search}
        actualizarMedicoId={actualizarMedicoId}
        eliminarMedico={eliminarMedico}
      />
      <FormMedico
        toggle={toggle}
        toggleActualizacion={toggleActualizacion}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
        getAuthHeaders={getAuthHeaders}
      />

      <ReporteMedico
        toggleReporte={toggleReporte}
        modalReporte={modalReporte}
        getAuthHeaders={getAuthHeaders}
      />
    </>
  )
}

export default Medico