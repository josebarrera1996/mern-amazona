/* En este archivo estará un objeto, que será utilizado para retornar productos */

const data = {

    products: [
        {
            name: 'Nike Slim shirt',
            slug: 'nike-slim-shirt', // Es lo que se verá en la URL para que sea amigable
            category: 'Shirts',
            image: '/images/p1.jpg', // Dimensiones: 679px x 829px
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'High quality shirt'
        },
        {
            name: 'Adidas Fit Shirt',
            slug: 'adidas-fit-shirt', // Es lo que se verá en la URL para que sea amigable
            category: 'Shirts',
            image: '/images/p2.jpg', // Dimensiones: 679px x 829px
            price: 250,
            countInStock: 20,
            brand: 'Adidas',
            rating: 4.0,
            numReviews: 10,
            description: 'high quality product',
        },
        {
            name: 'Nike Slim Pant',
            slug: 'nike-slim-pant', // Es lo que se verá en la URL para que sea amigable
            category: 'Pants',
            image: '/images/p3.jpg', // Dimensiones: 679px x 829px
            price: 25,
            countInStock: 15,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 14,
            description: 'high quality product',
        },
        {
            name: 'Adidas Fit Pant',
            slug: 'adidas-fit-pant', // Es lo que se verá en la URL para que sea amigable
            category: 'Pants',
            image: '/images/p4.jpg', // Dimensiones: 679px x 829px
            price: 65,
            countInStock: 5,
            brand: 'Puma',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
        }
    ]
}

export default data;