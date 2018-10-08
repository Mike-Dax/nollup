export default {
    register: function (moduleId: string) {
        this._moduleId = moduleId;
    },

    getRegistered: function () {
        return this._moduleId;
    }
}