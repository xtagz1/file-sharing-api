import { v4 as uuidv4 } from 'uuid';


export  function fileNameGenerator ( file:any ) {
    return `${file.originalname}_${uuidv4()}`;
}

export  function publicKeyGenerator ( file:any ) {
    return `public_${uuidv4()}`
}

export  function privateKeyGenerator ( file:any ) {
    return `private_${uuidv4()}`
}

