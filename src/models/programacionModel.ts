export class ProgramacionModel {
    constructor(
        public id: Number = null,
        public idRadio: Number = null,
        public imagen: String = null,
        public nombrePrograma: String = null,
        public descripcion: String = null,
        public horaInicio: String = null,
        public horaFin: String = null,
        public nombreDirector: String = null,
        public apellidoPaternoDirector: String = null,
        public apellidoMaternoDirector: String = null,
        public diaInicio: String = null,
        public diaFin: String = null,
    ) { }
}