import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft } from "react-feather";
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
import './styles/style.css'
import illustrationsLight from "@src/assets/images/pages/reset-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/reset-password-v2-dark.svg";

import "@styles/react/pages/page-authentication.scss";
import axios from "axios";
import { Controller, useForm } from 'react-hook-form'


const URL = 'https://notify.grupogenera.pe/api/reset'
// const URL = 'https://notify.grupogenera.pe/api/reset'
const ResetPassword = () => {
    const navigate = useNavigate()

    const { skin } = useSkin();
    const source = skin === "dark" ? illustrationsDark : illustrationsLight;
    const { handleSubmit, control, register, reset, formState: { errors } } = useForm()
    const [respuesta, setRespuesta] = useState(false)
    const [respuestaMatch, setRespuestaMatch] = useState(false)
    const [respuestaError, setRespuestaError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordRepeat, setpasswordRepeat] = useState(false)

    const submit = data => {
        setpasswordRepeat(false)
        setRespuesta(false)
        setRespuestaError(false)
        setIsLoading(true)
        if (data.password != data.password_confirmation) {

            setRespuestaMatch(true)
            setIsLoading(false)
        } else {
            setRespuestaMatch(false)
            axios.post(URL, data)
                .then(res => {
                    navigate('/login')
                    setRespuesta(true)
                    setIsLoading(false)
                })
                .catch(err => {
                    if(err?.response.status == 422){
                        setpasswordRepeat(true)
                    }else { setpasswordRepeat(false) }
                    setRespuestaError(true)
                    setIsLoading(false)
                })
        }
    }
    return (
        <div className="auth-wrapper auth-cover">
            <Row className="auth-inner m-0">
                <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>

                    <h2 className="brand-text text-primary ms-1">Genera</h2>
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
                        <CardTitle tag="h2" className="fw-bold mb-1">
                            Reset password 🔒
                        </CardTitle>
                        <CardText className='mb-75'>
                            Su nueva contraseña debe ser diferente a las contraseñas utilizadas anteriormente
                        </CardText>
                        <Form
                            className="auth-forgot-password-form mt-2"
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
                                            type="email"
                                            invalid={errors.key && true}
                                            placeholder="john@example.com"
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="login-email">
                                    Nuevo password
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='password'
                                    name='password'
                                    render={({ field }) => (
                                        <Input
                                            type="password"
                                            invalid={errors.key && true}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            <div className="mb-1">
                                <Label className="form-label" for="login-email">
                                    Confirm password
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='password_confirmation'
                                    name='password_confirmation'
                                    render={({ field }) => (
                                        <Input
                                            type='password'
                                            invalid={errors.key && true}
                                            {...field}
                                        />
                                    )}
                                />
                            </div>
                            {/* <div className="mb-1">
                                <Label className="form-label" for="login-email">
                                    Codigo de reinicio
                                </Label>
                                <Controller
                                    defaultValue=''
                                    control={control}
                                    id='token'
                                    name='token'
                                    render={({ field }) => (
                                        <Input
                                            type="input"
                                            invalid={errors.token && true}
                                            placeholder="Ak34cD"
                                            {...field}
                                        />
                                    )}
                                />
                            </div> */}
                            {respuestaError ? <p className="local_color">Ha ocurrido un error</p> : null}

                            {respuesta ? <p className='local_mensaje'>Su contraseña a sido reiniciada </p> : null}
                            {respuestaMatch ? <p className="local_color">Contraseñas no coinciden</p> : null}
                            {passwordRepeat ? <p className="local_color">No debe usar contraseñas ya usadas anteriormente</p> : null}
                            {isLoading ? <div className='spinner'></div> : null}

                            <Button color="primary" block disabled={isLoading}>
                                Grabar
                            </Button>
                            <p className="text-center mt-2">
                                <Link to="/login">
                                    <ChevronLeft className="rotate-rtl me-25" size={14} />
                                    <span className="align-middle">Retroceder para iniciar sesión</span>
                                </Link>
                            </p>
                        </Form>
                    </Col>
                </Col>
            </Row>
        </div>
    )
}

export default ResetPassword