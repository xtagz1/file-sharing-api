import { v4 as uuidv4 } from 'uuid';


export  function fileNameGenerator ( file:any ) {
    return `${uuidv4()}_${file.originalname}`;
}

export  function publicKeyGenerator ( file:any ) {
    return `public_${uuidv4()}`
}

export  function privateKeyGenerator ( file:any ) {
    return `private_${uuidv4()}`
}

