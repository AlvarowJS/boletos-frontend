// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  const rol = localStorage?.getItem("rol");
  let filteredNavigation = [];

  if (rol == 2) {
    // filteredNavigation = navigation.slice(0, 2); // Obtener los primeros dos elementos del array
    filteredNavigation = [navigation[0],navigation[1]]
  } else if (rol == 1) {
    filteredNavigation = navigation; // Obtener el array completo
  }
  return (
    <Layout menuData={filteredNavigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
