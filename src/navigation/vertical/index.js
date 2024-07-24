import { Calendar, Check, DollarSign, Edit3, Hash, Tag, UserCheck, UserPlus, Users } from "react-feather";

export default [
  {
    id: "Eventos",
    title: "Eventos",
    icon: <Calendar size={20} />,
    navLink: "/eventos",
  },
  {
    id: "Tickets",
    title: "Tickets",
    icon: <Tag size={20} />,
    navLink: "/tickets",
  },
  {
    id: "Usuarios",
    title: "Usuarios",
    icon: <UserCheck size={20} />,
    navLink: "/usuarios",
  },  
];

