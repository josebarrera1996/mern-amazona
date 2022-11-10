import { Spinner } from "react-bootstrap";

// Componente de tipo funcional
// Servirá para mostrar un contenido cuando los productos no se han cargado completamente
export default function LoadingBox() {

    return (

        <Spinner animation="border" role='status'>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}