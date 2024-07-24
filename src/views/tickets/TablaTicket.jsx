import React from "react";
import { Badge, Card } from 'reactstrap'
import DataTable from 'react-data-table-component'
const TablaTicket = ({
    data, filter, search, page, setPage, total
}) => {
    console.log(page, "?")
    const columns = [

        {
            sortable: true,
            name: "Codigo",
            minWidth: "25px",
            selector: (row) => row?.code,
        },
        {
            sortable: true,
            name: "estado",
            minWidth: "50px",
            selector: (row) => row?.dateRegister == null ? "Sin registrar" : "Registrado",
        },
        {
            sortable: true,
            name: "fecha de registro",
            minWidth: "50px",
            selector: (row) => row?.dateRegister,
        },
        {
            sortable: true,
            name: "Usuario que registro",
            minWidth: "50px",
            selector: (row) => row?.user?.name,
        },

    ];
    return (
        <Card className="mt-2">
            <DataTable
                noHeader
                pagination
                className="react-datatable"
                columns={columns}
                paginationServer
                paginationTotalRows={total} 
                onChangeRowsPerPage={page} 
                // onChangePage={handlePageChange} 
                data={search ? filter : data}
            />
        </Card>
    );
};

export default TablaTicket;




