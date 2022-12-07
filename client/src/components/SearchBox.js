import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

// Componente funcional
// Representará la sección para realizar búsquedas
export default function SearchBox() {

    // Utilizando 'useNavigate' para manejar la navegación
    const navigate = useNavigate();


    // Utilizando 'useState' para manejar el campo de la búsqueda
    const [query, setQuery] = useState('');


    // Método para realizar la búsqueda
    const submitHandler = (e) => {

        e.preventDefault(); // Para evitar que la página se recargue

        // Si henos ingresado algo, realizar la búsqueda
        navigate(query ? `/search/?query=${query}` : '/search');
    };



    return (

        <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
                <FormControl
                    type="text"
                    name="q"
                    id="q"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="search products..."
                    aria-label="Search Products"
                    aria-describedby="button-search"
                ></FormControl>
                <Button variant="outline-primary" type="submit" id="button-search">
                    <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    )
}
