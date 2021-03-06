import * as errors from "restify-errors";

export class TrackServices {
    async getTracks(database, taskId) {
        let sql = `SELECT * FROM track WHERE id_task = ?`;
        let options = [taskId];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async addTrack(database, data) {
        let start_time = data.start_time + ":00.000";
        let end_time = data.end_time + ":00.000";
        let start_data = data.start_data + "T" + start_time;
        let end_data = data.end_data + "T" + end_time;
        let sql = `INSERT INTO track VALUES (null, ?, ?, ?, ?, ?)`;
        let options = [data.id_user, data.description, start_data, end_data, data.id_task];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async updateTrack(database, data, trackId) {
        let start_data = data.start_data + "T" + data.start_time + ":00.000";
        let end_data = data.end_data + "T" + data.end_time + ":00.000";
        let sql = `UPDATE track SET 
                       description = ?,
                       start_data = ?,
                       finish_data = ?
                   WHERE id_track = ?`;
        let options = [data.description, start_data, end_data, trackId];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }

    async deleteTrack(database, taskId) {
        let sql = `DELETE FROM track WHERE id_track = ?`;
        let options = [taskId];

        return await database.query(sql, options)
            .catch((error) => {
                throw new errors.BadGatewayError(error.message);
            });
    }
}