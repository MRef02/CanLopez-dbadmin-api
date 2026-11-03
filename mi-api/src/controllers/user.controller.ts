import { Request, Response } from 'express';
// json es un string con formaro , se hace un javascript o tambien con  

export const getUser = (req: Request, res: Response) => {
    const user ={
        name: 'Juan',
        email:'duheiuhuehfi',
        age: 30,
        active: true,
        subjects: ['Math', 'Science', 'History'],
        "address": {
            "street": "123 Main St",
            "city": "Anytown",

    },
    arregloObjeto: [
        { id: 1, name: 'Objeto 1' },
        { id: 2, name: 'Objeto 2' },
        { id: 3, name: 'Objeto 3' },
    ]
    };
    res.json({ 
        "status": 'OK',
        "data": {"user": user
        }
    });     
}

export const getUserById = (req: Request, res: Response) => {
res.json({
    "status": 'OK',
    "data": {
        id: req.params.id ,
        name: 'Juan',
    }


}
);
}