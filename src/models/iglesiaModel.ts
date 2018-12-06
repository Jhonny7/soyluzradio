export class IglesiaModel {
    constructor(
        public id: Number = null,
        public nombreIglesia: string = "",
        public denominacion: string = "",
        public calle: string = "",
        public numeroExterior: string = "",
        public numeroInterior: string = "",
        public colonia: string = "",
        public codigoPostal: string = "",
        public idMunicipio: Number = null,
        public telefono: string = "",
        public email: string = "",
        public invitacionHorarios: string = "",
        public nombrePastor: string = "",
        public apellidoPaternoPastor: string = "",
        public apellidoMaternoPastor: string = "",
        public suscripcionMinuto: Number = null,
        public suscripcionBoletin: Number = null,
        public notificar: Number = null
    ) { }

}