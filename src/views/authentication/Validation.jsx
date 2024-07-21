import { useEffect, useState, useRef } from 'react';

// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import { Controller, useForm } from 'react-hook-form'
// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Input } from 'reactstrap'
import axios from "axios";
// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/two-steps-verification-illustration.svg'
import illustrationsDark from '@src/assets/images/pages/two-steps-verification-illustration-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const URLACTIVE = 'https://notify.grupogenera.pe/api/signup/activate'
const Validation = () => {
  const navigate = useNavigate()
  const { skin } = useSkin()
  const { handleSubmit, control, register, setValue, formState: { errors } } = useForm()
  const source = skin === 'dark' ? illustrationsDark : illustrationsLight
  const [validationCode, setValidationCode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const digit1Ref = useRef();
  const digit2Ref = useRef();
  const digit3Ref = useRef();
  const digit4Ref = useRef();
  const digit5Ref = useRef();
  const digit6Ref = useRef();

  const submit = data => {
    setIsLoading(true)
    axios.post(URLACTIVE, data)

      .then(res => {
        navigate('/home')
        setIsLoading(false)
        navigate('/home')


      })
      .catch(err => null)
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>

          <h2 className="brand-text text-primary ms-1">Genera</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bolder mb-1'>
              Ingrese el codigo de verificación 💬
            </CardTitle>
            <CardText className='mb-75'>
              Enviamos un código de verificación a tu Email.
              <br />
              Introduce el código en el campo de abajo
            </CardText>
            
            <Form
              className='mt-2'
              onSubmit={handleSubmit(submit)}
            >
              <h6>Escribre si código de seguridad de 6 digitos</h6>
              <div className='auth-input-wrapper d-flex align-items-center justify-content-between'>

                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit1"
                  {...register('digit1')}
                  maxLength='1'
                  required
                  onChange={(e) => {
                    setValue('digit1', e.target.value);
                    if (e.target.value.length === 1) {
                      digit2Ref.current.focus();
                    }
                  }}
                  ref={digit1Ref}
                />

                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit2"
                  {...register('digit2')}
                  maxLength='1'
                  required
                  onChange={(e) => {
                    setValue('digit2', e.target.value);
                    if (e.target.value.length === 1) {
                      digit3Ref.current.focus();
                    }
                  }}
                  ref={digit2Ref}
                />

                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit3"
                  {...register('digit3')}
                  maxLength='1'
                  required
                  onChange={(e) => {
                    setValue('digit3', e.target.value);
                    if (e.target.value.length === 1) {
                      digit4Ref.current.focus();
                    }
                  }}
                  ref={digit3Ref}
                />
                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit4"
                  {...register('digit4')}
                  maxLength='1'
                  required
                  onChange={(e) => {
                    setValue('digit4', e.target.value);
                    if (e.target.value.length === 1) {
                      digit5Ref.current.focus();
                    }
                  }}
                  ref={digit4Ref}
                />
                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit5"
                  {...register('digit5')}
                  maxLength='1'
                  required
                  onChange={(e) => {
                    setValue('digit5', e.target.value);
                    if (e.target.value.length === 1) {
                      digit6Ref.current.focus();
                    }
                  }}
                  ref={digit5Ref}
                />
                <input
                  className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                  type="text"
                  id="digit6"
                  {...register('digit6')}
                  maxLength='1'
                  required
                  onChange={(e) => setValue('digit6', e.target.value)}
                  ref={digit6Ref}
                />

              </div>
              <div className="cuadrar__spinner">
                {isLoading ? <div className='spinner'></div> : null}
              </div>
              <Button block color='primary'>
                Verificar mi cuenta
              </Button>
            </Form>

            <p className='text-center mt-2'>
              <span>No recibiste el código?</span>{' '}
              <a href='/' onClick={e => e.preventDefault()}>
                Reenviar
              </a>{' '}

            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Validation
