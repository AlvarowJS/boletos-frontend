// ** React Imports
import React, { useEffect, useState } from "react";

import { Fragment, lazy } from "react";
import { Route, Navigate, useNavigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";
// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import Citas from "../../views/citas/Citas";
import bdCitas from "../../api/bdCitas";
import Paciente from "../../views/pacientes/Paciente";
import Consultorio from "../../views/consultorios/Consultorio";
import Usuario from "../../views/usuarios/Usuario";
import Estado from "../../views/estados/Estado";
import Medico from "../../views/medicos/Medico";
import Pago from "../../views/pagos/Pago";

// import OperacionesTrans from "../../views/operaciones/OperacionesTrans";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/login";

const Error = lazy(() => import("../../views/Error"));

const AuthGuard = ({ children }) => {

  const [myRol, setMyRol] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const objToken = { token: token }

    bdCitas.post('/token-auth', objToken, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setMyRol(res?.data?.role_id)
        const rol = res?.data?.role?.id

        if (!token) {
          // navigate("/login");
        } else {
          // Aquí debe validar su token con su servidor para asegurarse de que es válido
          // Si el token no es válido, llame a "navigate" para redirigir al usuario a la página de inicio de sesión
          if (rol == "1") {
          } else if (rol == "2") {
            const restrictedRoutes = ["paciente"];
            if (restrictedRoutes.includes(window.location.pathname)) {
              navigate("/error");
            }
          }
          else {
            navigate("/login")
          }
        }


      })
      .catch(err => console.log(err))

  }, [])


  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const rol = localStorage.getItem("rol");

  //   console.log(myRol, "234234")

  //   if (!token) {

  //     navigate("/login");
  //   } else {
  //     // Aquí debe validar su token con su servidor para asegurarse de que es válido
  //     // Si el token no es válido, llame a "navigate" para redirigir al usuario a la página de inicio de sesión
  //     if (rol === "1") {
  //     } else if (rol === "2") {
  //       const restrictedRoutes = ["/tickets"];
  //       if (restrictedRoutes.includes(window.location.pathname)) {
  //         navigate("/error");
  //       }
  //     }
  //     else {
  //       navigate("/login")
  //     }
  //   }
  // }, [navigate]);

  return <LayoutWrapper>{children}</LayoutWrapper>;
};

// const navigate = useNavigate();
// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,

  },
  {
    path: "/citas-medicas",
    element: <AuthGuard><Citas /></AuthGuard>,
  },
  {
    path: "/paciente",
    element: <AuthGuard><Paciente /></AuthGuard>,
  },
  {
    path: "/consultorios",
    element: <AuthGuard><Consultorio /></AuthGuard>,
  },
  {
    path: "/usuarios",
    element: <AuthGuard><Usuario /></AuthGuard>,
  },
  {
    path: "/estados",
    element: <AuthGuard><Estado /></AuthGuard>,
  },
  {
    path: "/medicos",
    element: <AuthGuard><Medico /></AuthGuard>,
  },
  {
    path: "/pagos",
    element: <AuthGuard><Pago /></AuthGuard>,
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },

  },

];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;
        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
