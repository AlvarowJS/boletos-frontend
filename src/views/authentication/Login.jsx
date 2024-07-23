// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Controller, useForm } from 'react-hook-form'


// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Reactstrap Imports
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

// ** Illustrations Imports
import logo from "@src/assets/images/logo/logo_nav.png";
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import './styles/style.css'
import axios from "axios";
import { useState } from "react";
import bdBoletas from "../../api/bdBoletos";
// import bdCitas from "../../api/bdCitas";


const Login = () => {

  const navigate = useNavigate()
  const { skin } = useSkin();
  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  const { handleSubmit, control, register, reset, formState: { errors } } = useForm()

  const [isError, setIsError] = useState(false)

  const submit = async (data) => {
    try {
      const response = await bdBoletas.post('/v1/login', data);
      const res = response.data;    
      localStorage.setItem('token', res?.api_token);
      localStorage.setItem('rol', res?.rol);      
      localStorage.setItem('name', res?.name);      
      setIsError(false)
      navigate('/eventos')

    }
    catch (err) {
      localStorage.setItem('token', '');
      localStorage.setItem('rol', '');      
      localStorage.setItem('name', '');
      setIsError(true)
    }
  }

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>



        </Link>
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
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <img className="img_local" src={logo} alt="Logo" style={{ width: 100 }} />

            <CardTitle tag="h2" className="fw-bold mb-1 mt-2">
              Bienvenido al Sistema de Boletos
            </CardTitle>
            <CardText className="mb-2">
              Porfavor ingrese tu usuario y contraseña
            </CardText>
            <Form
              className="auth-login-form mt-2"

              onSubmit={handleSubmit(submit)}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Controller
                  defaultValue=''
                  control={control}
                  id='email'
                  name='email'
                  render={({ field }) => (
                    <Input
                      placeholder='john@example.com'
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="password">
                    Password
                  </Label>

                </div>
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
              {/* <div className="form-check mb-1">
                <Controller
                  defaultValue={false}
                  control={control}
                  id='remember_me'
                  name='remember_me'
                  render={({ field }) => (
                    <Input
                      type="checkbox"
                      invalid={errors.remember_me && true}

                      {...field}
                    />
                  )}
                />
                <Label className="form-check-label" for="remember-me">
                  Recordarme
                </Label>
              </div> */}
              {/* <Button tag={Link} to="/" color="primary" block>
                Ingresar
              </Button> */}
              {isError ? <p className="local_color">Credenciales invalidas, intentalo otra vez...</p> : null}
              <Button color="primary" block>
                Ingresar
              </Button>
            </Form>
            {/* <p className="text-center mt-2">
              <span className="me-25">Eres nuevo en la plataforma?</span>
              <Link to="/register">
                <span>Crea una cuenta</span>
              </Link>
            </p> */}

          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
