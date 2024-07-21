import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './styles/style.css'
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";
import { Controller, useForm } from 'react-hook-form'

// ** Illustrations Imports
import logo from "@src/assets/images/logo/logo.png";
import illustrationsLight from "@src/assets/images/pages/register-v2.svg";
import illustrationsDark from "@src/assets/images/pages/register-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { useEffect, useState } from "react";
import bdCitas from "../../api/bdCitas";

const MySwal = withReactContent(Swal)


const Register = () => {
  const navigate = useNavigate()
  const { skin } = useSkin();
  const { handleSubmit, control, register, reset, formState: { errors } } = useForm()
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;
  const [respuesta, setRespuesta] = useState(false)
  const [respuestaMatch, setRespuestaMatch] = useState(false)
  const [passwordRe, setPasswordRe] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState()




  const submit = async (data) => {
    setRespuesta(false)
    if (data.password != data.password_re) {
      setRespuestaMatch(true)
    } else {
      setIsLoading(true)
      setRespuestaMatch(false)

      try {
        const response = await bdCitas.post('v1/register-user', data)
        // const res = response.data
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro Completado',
          showConfirmButton: false,
          timer: 1500
        })
        navigate('/login')
        // console.log(res)
      } catch (err) {
        setIsLoading(false)
        setRespuesta(response.data)
      }

    }



  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">

        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" xs="12" sm="8" md="6" lg="12">
            <img className="img_local" src={logo} alt="Logo" style={{ width: 100 }} />

            <CardTitle tag="h2" className="fw-bold mb-1 mt-2">
              Registrate
            </CardTitle>

            {/* formulario */}
            <Form
              className="auth-register-form mt-2"
              onSubmit={handleSubmit(submit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="nombres" >
                  Nombres
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='nombres'
                  name='nombres'

                  render={({ field }) => (
                    <Input
                      type="text"
                      invalid={errors.nombres && true}
                      {...field}

                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="apellidos" >
                  Apellidos
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='apellidos'
                  name='apellidos'

                  render={({ field }) => (
                    <Input
                      type="text"
                      invalid={errors.apellidos && true}
                      {...field}

                    />
                  )}
                />
              </div>
              
              <div className="mb-1">
                <Label className="form-label" for="celular" >
                  Celular
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='celular'
                  name='celular'

                  render={({ field }) => (
                    <Input
                      type="text"
                      invalid={errors.celular && true}
                      {...field}

                    />
                  )}
                />
              </div>
    
              <div className="mb-1">
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='email'
                  name='email'
                  render={({ field }) => (
                    <Input
                      type="email"
                      placeholder='user@gmail.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="password">
                  Password
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='password'
                  name='password'
                  render={({ field }) => (
                    <Input
                      type="password"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="password_re" >
                  Repita el password
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='password_re'
                  name='password_re'

                  render={({ field }) => (
                    <Input
                      type="password"
                      invalid={errors.password_re && true}
                      {...field}

                    />
                  )}
                />
              </div>
              <div className="cuadrar__spinner">
                {isLoading ? <div className='spinner'></div> : null}
              </div>
              {respuesta ? <p className="local_color">Error de usuario</p> : null}
              {respuestaMatch ? <p className="local_color">Las contraseñas no coinciden</p> : null}


              <Button color="primary" block disabled={isLoading}>
                Registrar Cuenta
              </Button>

              {/* <Button tag={Link} to="/validation" color="primary" block>
                Registrar Cuenta
              </Button> */}
            </Form>

            <p className="text-center mt-2">
              <span className="me-25">Ya te encuentras registrado?</span>
              <Link to="/login">
                <span>Iniciar sesión</span>
              </Link>
            </p>


          </Col>
        </Col>
      </Row>
    </div >
  );
};

export default Register;
