import { Calendar, Check, DollarSign, Edit3, Hash, UserCheck, UserPlus, Users } from "react-feather";

export default [
  {
    id: "Citas",
    title: "Citas",
    icon: <Calendar size={20} />,
    navLink: "/citas-medicas",
  },
  {
    id: "Pacientes",
    title: "Pacientes",
    icon: <UserPlus size={20} />,
    navLink: "/paciente",
  },
  {
    id: "Consultorios",
    title: "Consultorios",
    icon: <Hash size={20} />,
    navLink: "/consultorios",
  },
  {
    id: "Usuarios",
    title: "Usuarios",
    icon: <UserCheck size={20} />,
    navLink: "/usuarios",
  },
  {
    id: "Estados",
    title: "Estados",
    icon: <Check size={20} />,
    navLink: "/estados",
  },
  {
    id: "Medicos",
    title: "Medicos",
    icon: <Users size={20} />,
    navLink: "/medicos",
  },
  {
    id: "Pagos",
    title: "Pagos",
    icon: <DollarSign size={20} />,
    navLink: "/pagos",
  }
];
