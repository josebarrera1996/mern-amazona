import { Alert } from "react-bootstrap";

// Componente de tipo funcional
// Servirá para mostrar un contenido que simbolizará un mensaje de error
export default function MessageBox(props) {

    return (

        <Alert variant={props.variant || 'info'}>{props.children}</Alert>
    )
}