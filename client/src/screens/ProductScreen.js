import { useParams } from 'react-router-dom';

// Componente de tipo funcional
// En este se renderizará el componente a nivel individual

function ProductScreen() {

    // Utilizando 'useParams' para capturar el parámetro de la URL
    const params = useParams();
    const { slug } = params; // Obteniendo el valor del parámetro 'slug'

    return (
        <div>
            { slug }
        </div>
    )
}

export default ProductScreen;