// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";

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
import illustrationsLight from "@src/assets/images/pages/register-v2.svg";
import illustrationsDark from "@src/assets/images/pages/register-v2-dark.svg";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

const Congratulation = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div>

            <CardTitle tag="h2" className="fw-bold mb-1">
              Felicidades🎉 !
            </CardTitle>
            <CardTitle tag="h2" className="fw-bold mb-1">
              Ya puedes usar tu cuenta

              <Button tag={Link} to="/" color="primary" block>
                Volver al login
              </Button>
            </CardTitle>
            
              <div className="mb-1">
              </div>
              
                   
    </div>
  );
};

export default Congratulation;
