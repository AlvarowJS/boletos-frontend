import React, { useEffect, useState } from 'react'
import TablaPaciente from './TablaPaciente'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import bdCitas from '../../api/bdCitas'
import { useForm } from 'react-hook-form'
import FormPaciente from './FormPaciente'
// Sweet Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const URL = '/v1/pacientes'
const Paciente = () => {
  const rol = localStorage.getItem('rol')
  const token = localStorage.getItem('token')
  const [data, setData] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0)
  const [search, setSearch] = useState()
  const [filter, setFilter] = useState()
  const [modal, setModal] = useState(false)
  const [actualizacion, setActualizacion] = useState(false)
  const { handleSubmit, register, reset } = useForm()
  const [refresh, setRefresh] = useState(false)
  const defaulValuesForm = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
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
  
  useEffect(() => {
    bdCitas.get(`${URL}?page=${currentPage}&per_page=${perPage}`, getAuthHeaders())
      .then(res => {
        setData(res.data.data)
        setTotalRows(res.data.total)
      })
      .catch(err => {

      })
  }, [currentPage, perPage, refresh])

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

  // Crear Paciente
  const crearPaciente = (data) => {
    bdCitas.post(URL, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Paciente creado',
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

  // Actualiza paciente (PUT)
  const actualizarPaciente = (id, data) => {
    bdCitas.put(`${URL}/${id}`, data, getAuthHeaders())
      .then(res => {
        reset(defaulValuesForm)
        toggle.call()
        setRefresh(!refresh)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Paciente Actualizado',
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
  const eliminarPaciente = (id) => {
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
              title: 'Paciente Eliminado',
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
  const actualizarPacienteId = (id) => {
    toggleActualizacion.call()
    setActualizacion(true)
    bdCitas.get(`${URL}/${id}`, getAuthHeaders())
      .then(res => {
        reset(res.data)

      })
      .catch(err => null)
  }

  // Si es actualizacion llamara a actualizarPaciente pero si es false crear un paciente
  const submit = (data) => {

    if (actualizacion) {
      actualizarPaciente(data.id, data)
    } else {
      crearPaciente(data)
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
        <Col sm='4'></Col>
        <Col sm='2' className='mt-2'>

          <Button onClick={toggle} color='primary'>
            + Agregar
          </Button>
        </Col>
      </Row>
      <TablaPaciente
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        data={data}
        setPerPage={setPerPage}
        perPage={perPage}
        totalRows={totalRows}
        filter={filter}
        search={search}
        actualizarPacienteId={actualizarPacienteId}
        eliminarPaciente={eliminarPaciente}
        getAuthHeaders={getAuthHeaders}
        bdCitas={bdCitas}
        rol={rol}
      />
      <FormPaciente
        toggle={toggle}
        toggleActualizacion={toggleActualizacion}
        modal={modal}
        handleSubmit={handleSubmit}
        submit={submit}
        register={register}
        reset={reset}
      />
    </>
  )
}

export default Paciente