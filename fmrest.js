const AuthAPI = require('./lib/authapi.js');
const RecordAPI = require('./lib/recordapi.js');
const FindAPI = require('./lib/findapi.js');
const GlobalAPI = require('./lib/globalapi.js');
const Request = require('./lib/request.js');
const Sort = require('./lib/sort.js');
const Global = require('./lib/global.js');
const Portal = require('./lib/portal.js');

/**
 * An API that wraps all common classes together
 * {@link AuthAPI}
 * {@link RecordAPI}
 * {@link FindAPI}
 * {@link GlobalAPI}
 */
class Fmrest {
    /**
     * Create an Fmrest object
     * @param {Object} obj - An object
     * @param {string} obj.user - username
     * @param {string} obj.password - password
     * @param {string} obj.host - host
     * @param {string} obj.database - database
     * @param {string} obj.auth - authentication type
     * @param {string} obj.layout - layout (optional)
     */
    constructor({ user, password, host, database, auth, layout = null } = {}) {
        this.Auth = new AuthAPI({ user, password, host, database, auth, layout });
        this.Record = new RecordAPI(this.Auth);
        this.Find = new FindAPI(this.Auth);
        this.Global = new GlobalAPI(this.Auth);
    }

    /**
     * Login wrapper
     * @return {Promise} - A promise that resolves with a token
     */
    login() {
        return this.Auth.login();
    }

    /**
     * Logout wrapper
     * @return {Promise} - A promise that resolves with a boolean
     */
    logout() {
        return this.Auth.logout();
    }

    /**
     * Set/Change Layout
     * @param {string} - The layout you want to query
     */
    setLayout(layout) {
        this.Auth.setLayout(layout);
        this.Record = new RecordAPI(this.Auth);
        this.Find = new FindAPI(this.Auth);
        this.Global = new GlobalAPI(this.Auth);
    }

    /**
     * Create Record wrapper
     * @param {Object} json - a json object with field-value pairs
     * @return {Promise} - A promise that resolves with a record id
     */
    createRecord(json) {
        return this.Record.create(json);
    }

    /**
     * Delete Record wrapper
     * @param {number} id - filemakers internal record id
     * @return {Promise} - A promise that resolves with a boolean
     */
    deleteRecord(id) {
        return this.Record.delete(id);
    }

    /**
     * Edit Record wrapper
     * @param {number} id - filemakers internal record id
     * @param {Object} json - a json object with field-value pairs
     * @param {number} modId - the last modification id
     * @return {Promise} - A promise that resolves with a record id
     */
    editRecord(id, json, modId) {
        return this.Record.edit(id, json, modId);
    }

    /**
     * Get Record wrapper
     * @param {number} id - filemakers internal record id
     * @param {Array} portals - An Array of {@link Portal} Objects
     * @return {Promise} - A promise that resolves with a record
     */
    getRecord(id, portals) {
        return this.Record.get(id, portals);
    }

    /**
     * Get All Records wrapper
     * @param {Object} obj - An object
     * @param {number} obj.offset - starting point of records to return
     * @param {number} obj.limit - how many records should be returned
     * @param {Array} obj.sorts - An array of {@link Sort} Objects
     * @param {Array} obj.portals - An array of {@link Portal} Objects
     * @return {Promise} - A promise that resolves with multiple records
     *
     */
    getAllRecords({ offset, limit, sorts, portals } = {}) {
        return this.Record.getAll({ offset, limit, sorts, portals });
    }

    /**
     * Find wrapper
     * @param {Object} obj - An object
     * @param {Array} obj.requests - An array of {@link Request} Objects
     * @param {Array} obj.sorts - An array of {@link Sort} Objects
     * @param {number} obj.offset - starting point of records to return
     * @param {number} obj.limit - how many records should be returned
     * @param {Array} obj.portals - An array of {@link Portal} Objects
     * @return {Promise} - A promise that resolves with multiple records
     *
     */
    find({ requests, sorts, offset, limit, portals } = {}) {
        return this.Find.exec({ requests, sorts, offset, limit, portals });
    }

    /**
     * Set Globals wrapper
     * @param {Array} globals - An Array of {@link Global} Objects
     * @return {Promise} - A promise that resolves with a boolean
     */
    setGlobals(globals) {
        return this.Global.exec(globals);
    }

    /**
     * Upload a File To a Container Field
     * @param {string} file - a binary/plain text file
     * @param {string} recordId - which record to upload file to
     * @param {string} containerFieldName - the container fields name
     * @param {string} containerFieldRep - the container fields repitition
     * @return {Promise} - A promise that resolves with a res
     */
    uploadFile({ file, recordId, containerFieldName, containerFieldRep } = {}) {
        return this.Record.uploadFile({ file, recordId, containerFieldName, containerFieldRep });
    }

    /**
     * Create Request wrapper
     * @return {Request} - A new {@link Request} Object
     */
    createRequest() {
        return new Request();
    }

    /**
     * Create Sort wrapper
     * @param {string} field - a field name from filemaker
     * @param {string} sort - a sort order (ascend, descend or value list name)
     * @return {Sort} - A new {@link Sort} Object
     */
    createSort(field, order) {
        return new Sort(field, order);
    }

    /**
     * Create Global wrapper
     * @param {string} field - a field name from filemaker
     * @param {string} value - the fields value
     * @return {Global} - A new {@link Global} Object
     */
    createGlobal(field, value) {
        return new Global(field, value);
    }

    /**
     * Create Portal wrapper
     * @param {string} name - a portal's name from filemaker
     * @param {number} offset - starting point of records to return
     * @param {number} limit - how many records should be returned
     * @return {Portal} - A new {@link Portal} Object
     */
    createPortal(name, offset, limit) {
        return new Portal(name, offset, limit);
    }
}

module.exports = Fmrest;
