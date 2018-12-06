export class MinisterioModel {
    constructor(
        public id:Number = null,
        public idCategoria: Number = null,
        public idMunicipio: Number = null,
        public nombreMinisterio: string = "",
        public telefono: string = "",
        public facebook:string = "",
        public email:string = "",
        public descripcion:string = "",
        public nombreDirector:string = "",
        public apellidoPaternoDirector:string = "",
        public apellidoMaternoDirector:string = "",
        public suscripcionMinuto: Number = null,
        public suscripcionBoletin: Number = null,
        public rutaImagen:string = "",
        public fechaAlta:string = ""
    ) { }

}